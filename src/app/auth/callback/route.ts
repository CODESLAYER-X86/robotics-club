import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { isPlatformAdminEmail } from '@/lib/auth';

/**
 * Supabase Google OAuth callback.
 * Flow: Google → Supabase → here → upsert Prisma user → redirect to /?google_auth=1
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const errorParam = searchParams.get('error');
  const errorDesc = searchParams.get('error_description');

  // Robust origin resolution behind Vercel load balancers and proxies
  const forwardedHost = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
  const origin = forwardedHost
    ? `${forwardedProto}://${forwardedHost}`
    : (process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin);

  // If Supabase or Google returned an error directly in URL
  if (errorParam) {
    console.error('[Google OAuth] Callback received error from provider:', errorParam, errorDesc);
    const reason = encodeURIComponent(errorDesc || errorParam);
    return NextResponse.redirect(`${origin}/?error=google_auth_failed&reason=${reason}`);
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/?error=google_no_code&reason=No%20authorization%20code%20provided`);
  }

  const cookieStore = await cookies();

  // Create the redirect response FIRST so we can write cookies onto it.
  const successResponse = NextResponse.redirect(`${origin}/?google_auth=1`);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!;

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              cookieStore.set(name, value, options);
            } catch {
              // Server component write fallback
            }
            successResponse.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);

  let user = session?.user;

  if (error || !session) {
    // Fallback: check if we already have an active session (e.g., from a duplicate request)
    const { data: { session: existingSession } } = await supabase.auth.getSession();
    if (existingSession?.user) {
      user = existingSession.user;
    } else {
      console.error('[Google OAuth] exchangeCodeForSession error:', error?.message);
      const reason = encodeURIComponent(error?.message || 'Exchange code for session failed');
      return NextResponse.redirect(`${origin}/?error=google_auth_failed&reason=${reason}`);
    }
  }

  if (!user) {
    return NextResponse.redirect(`${origin}/?error=google_auth_failed&reason=User%20session%20is%20empty`);
  }

  const email = user.email;
  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    email?.split('@')[0] ||
    'User';
  const rawAvatar =
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture ||
    null;
  const avatar =
    rawAvatar && rawAvatar.includes('googleusercontent.com')
      ? rawAvatar.replace(/=s\d+(-c)?$/, '=s384-c')
      : rawAvatar;

  if (!email) {
    return NextResponse.redirect(`${origin}/?error=google_no_email`);
  }

  try {
    // Determine role: platform admin is env-controlled, never from DB alone
    const adminRole = isPlatformAdminEmail(email) ? 'PLATFORM_ADMIN' : null;

    // Find or create the user in our Prisma DB
    const existing = await prisma.user.findUnique({ where: { email } });
    if (!existing) {
      const initialRole = adminRole ?? 'GUEST';
      await prisma.user.create({
        data: {
          email,
          name,
          password: '', // Google users have no password
          avatar,
          role: initialRole,
          membershipStatus: initialRole === 'GUEST' ? 'NON_MEMBER' : 'ACTIVE',
        },
      });
    } else {
      // Enforce platform admin role on every sign-in (handles env var changes)
      const expectedRole = adminRole ?? (existing.role === 'PLATFORM_ADMIN' ? 'MEMBER' : existing.role);
      const expectedStatus = expectedRole === 'GUEST' ? existing.membershipStatus : 'ACTIVE';
      const updateData: Record<string, string> = {};

      if (existing.role !== expectedRole) updateData.role = expectedRole;
      if (existing.membershipStatus !== expectedStatus) updateData.membershipStatus = expectedStatus;
      if (avatar && existing.avatar !== avatar) updateData.avatar = avatar;

      if (Object.keys(updateData).length > 0) {
        await prisma.user.update({ where: { email }, data: updateData });
      }
    }
  } catch (e) {
    console.error('[Google OAuth] DB upsert error:', e);
    // Non-fatal: user may already exist — continue to redirect
  }

  // Return the pre-built response — session cookies are already attached to it
  return successResponse;
}
