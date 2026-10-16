import type { Metadata } from 'next';
import prisma from '@/lib/db';
import { HomeClient } from '@/components/home-client';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const view = typeof params.view === 'string' ? params.view : undefined;
  const eventId = (typeof params.id === 'string' ? params.id : undefined)
    || (typeof params.event === 'string' ? params.event : undefined)
    || (typeof params.eventId === 'string' ? params.eventId : undefined);

  if ((view === 'event-detail' || !view) && eventId) {
    try {
      const event = await prisma.event.findUnique({
        where: { id: eventId },
        select: {
          title: true,
          description: true,
          poster: true,
          venue: true,
          category: true,
        },
      });

      if (event) {
        const cleanDesc = (event.description || '')
          .replace(/[#*`_~]/g, '')
          .slice(0, 180)
          .trim() || 'Join this event hosted by DIU Robotics Club at Dhaka International University.';

        const imageUrl = event.poster || '/logo.png';
        const absoluteImageUrl = imageUrl.startsWith('http')
          ? imageUrl
          : `${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;

        const pageUrl = `/?view=event-detail&id=${eventId}`;

        return {
          title: `${event.title} | DIU Robotics Club`,
          description: cleanDesc,
          openGraph: {
            title: `${event.title} | DIU Robotics Club`,
            description: cleanDesc,
            url: pageUrl,
            siteName: 'DIU Robotics Club',
            images: [
              {
                url: absoluteImageUrl,
                alt: event.title,
              },
            ],
            type: 'website',
          },
          twitter: {
            card: 'summary_large_image',
            title: `${event.title} | DIU Robotics Club`,
            description: cleanDesc,
            images: [absoluteImageUrl],
          },
        };
      }
    } catch (e) {
      console.error('Error generating event metadata:', e);
    }
  }

  // Certificate deep link metadata
  const certCode = typeof params.cert === 'string' ? params.cert : undefined;
  if (certCode) {
    return {
      title: 'Verified Certificate | DIU Robotics Club',
      description: 'View and verify a certificate issued by DIU Robotics Club at Dhaka International University.',
      openGraph: {
        title: 'Verified Certificate | DIU Robotics Club',
        description: 'View and verify a certificate issued by DIU Robotics Club at Dhaka International University.',
        url: `/?cert=${certCode}`,
        siteName: 'DIU Robotics Club',
        images: [{ url: '/logo.png', alt: 'DIU Robotics Club' }],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Verified Certificate | DIU Robotics Club',
        description: 'View and verify a certificate issued by DIU Robotics Club at Dhaka International University.',
        images: ['/logo.png'],
      },
    };
  }

  return {
    title: 'DIU Robotics Club | Dhaka International University',
    description: 'Official portal of DIU Robotics Club (DIURC) - Learn, Build & Innovate. Join competitive LFR, Robo Soccer, and embedded systems innovation.',
    openGraph: {
      title: 'DIU Robotics Club | Dhaka International University',
      description: 'Official portal of DIU Robotics Club (DIURC) - Learn, Build & Innovate. Join competitive LFR, Robo Soccer, and embedded systems innovation.',
      url: '/',
      siteName: 'DIU Robotics Club',
      images: [
        {
          url: '/logo.png',
          width: 800,
          height: 800,
          alt: 'DIU Robotics Club Logo',
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'DIU Robotics Club | Dhaka International University',
      description: 'Official portal of DIU Robotics Club (DIURC) - Learn, Build & Innovate. Join competitive LFR, Robo Soccer, and embedded systems innovation.',
      images: ['/logo.png'],
    },
  };
}

export default function Page() {
  return <HomeClient />;
}
