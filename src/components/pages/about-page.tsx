'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bot,
  Eye,
  Scale,
  Lightbulb,
  Users,
  Award,
  Target,
  Sparkles,
  Rocket,
  CheckCircle2,
  Building2,
  GraduationCap,
  Calendar,
  Layers,
  Cpu,
  Wrench,
  Gauge,
  Compass,
  Trophy,
  Flame,
  Plane,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/use-app-store';
import { sanitizeUrl } from '@/lib/utils';

/* ──────────── Animation helpers ──────────── */

const fadeUp = {
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.35 },
};

/* ──────────── Particles Background ──────────── */

function ParticlesGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const dots: { x: number; y: number; vx: number; vy: number; r: number; alpha: number }[] = [];
    const DOT_COUNT = 80;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < DOT_COUNT; i++) {
      dots.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.15,
      });
    }

    function draw() {
      if (!canvas || !ctx) return;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(37, 99, 235, ${d.alpha})`;
        ctx.fill();
      }

      // Draw connections
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}

/* ──────────── Data ──────────── */

const coreValues = [
  {
    icon: Bot,
    title: 'Hardware & Engineering Rigor',
    desc: 'We emphasize solid mechanical design, dependable circuit fabrication, and robust firmware architecture over quick hacks.',
    bgClass: 'bg-blue-500/10',
    borderClass: 'border-blue-500/20',
    iconClass: 'text-blue-400',
  },
  {
    icon: Scale,
    title: 'Open Maker Governance',
    desc: 'Transparent elections, clear financial accounting in the club treasury, and student-first leadership accountability.',
    bgClass: 'bg-cyan-500/10',
    borderClass: 'border-cyan-500/20',
    iconClass: 'text-cyan-400',
  },
  {
    icon: Users,
    title: 'Inclusive Maker Community',
    desc: 'We mentor first-year novices alongside championship veterans. Everyone learns, solders, codes, and innovates together.',
    bgClass: 'bg-amber-500/10',
    borderClass: 'border-amber-500/20',
    iconClass: 'text-amber-400',
  },
  {
    icon: Lightbulb,
    title: 'Applied Robotics Innovation',
    desc: 'Moving beyond textbooks into hands-on LFR tracks, Robo Soccer matches, heavy combat bots, and autonomous drone navigation.',
    bgClass: 'bg-sky-500/10',
    borderClass: 'border-sky-500/20',
    iconClass: 'text-sky-400',
  },
];

const safetyRules = [
  {
    id: 'SAFE-01',
    title: 'Laboratory Safety & Power Protocols',
    desc: 'Always wear eye protection and exercise extreme caution when handling high-discharge LiPo batteries, high-voltage solenoids, and CNC tooling.',
  },
  {
    id: 'SAFE-02',
    title: 'Component Care & Inventory Discipline',
    desc: 'Treat precision microcontrollers, optical sensor bars, and test instruments with care. Return borrowed lab items to the central tool repository.',
  },
  {
    id: 'SAFE-03',
    title: 'Competition Integrity & Fair Play',
    desc: 'Adhere strictly to arena weight limits, dimension envelopes, and electrical fail-safes during all intra-university and national matches.',
  },
  {
    id: 'SAFE-04',
    title: 'Open-Source Sharing & Documentation',
    desc: 'Document bot schematics, share CAD files, and publish firmware repositories to uplift the robotics knowledge of future generations.',
  },
  {
    id: 'SAFE-05',
    title: 'Dhaka International University Honor',
    desc: 'Uphold the highest engineering ethics, sportsmanship, and collaborative spirit while representing DIU on national and global stages.',
  },
];

const operationalWings = [
  {
    name: 'Line Follower Robot (LFR) Division',
    badge: 'AUTONOMOUS',
    badgeClass: 'border-blue-500/30 text-blue-300 bg-blue-500/10',
    desc: 'High-speed optical sensor arrays, discrete PID loop tuning, dynamic curvature braking, and obstacle avoidance over complex vinyl track configurations.',
    stack: '8-IR Array • STM32 / ESP32 • Discrete PID • Coreless Motors',
  },
  {
    name: 'Robo Soccer Division',
    badge: 'COMPETITIVE',
    badgeClass: 'border-cyan-500/30 text-cyan-300 bg-cyan-500/10',
    desc: '3-wheel and 4-wheel omni-directional drive kinematics, low-latency 2.4GHz RF control, active roller dribbler mechanisms, and high-velocity solenoid kickers.',
    stack: 'Omni Wheels • Solenoid Kickers • NRF24L01+ • LiPo 3S',
  },
  {
    name: 'Combat Robotics & Heavy Hardware',
    badge: 'COMBAT',
    badgeClass: 'border-red-500/30 text-red-300 bg-red-500/10',
    desc: 'Reinforced steel and aluminum chassis fabrication, brushless spinner weapons, high-amp MOSFET speed controllers, and destructive arena combat.',
    stack: 'CNC Machining • Hardened Armor • High-Amp ESCs • SolidWorks',
  },
  {
    name: 'Embedded Systems & IoT Division',
    badge: 'EMBEDDED',
    badgeClass: 'border-indigo-500/30 text-indigo-300 bg-indigo-500/10',
    desc: 'Microcontroller mastery (ESP32, STM32, Arduino), multi-sensor fusion (IMU, ToF lidar, ultrasonic), telemetry dashboards, and industrial automation.',
    stack: 'FreeRTOS • MQTT / LoRaWAN • Altium PCB • Sensor Fusion',
  },
  {
    name: 'Drones & Autonomous UAVs',
    badge: 'AERIAL',
    badgeClass: 'border-sky-500/30 text-sky-300 bg-sky-500/10',
    desc: 'Custom carbon-fiber quadcopters, flight controllers (Betaflight, ArduPilot), optical flow positioning, and autonomous GPS waypoint navigation.',
    stack: 'Carbon Fiber • BLDC Motors • Betaflight • GPS Telemetry',
  },
  {
    name: 'Operations & Technical Governance',
    badge: 'GOVERNANCE',
    badgeClass: 'border-amber-500/30 text-amber-300 bg-amber-500/10',
    desc: 'Event planning, workshop logistics, lab component inventory, corporate sponsorships, certificate verification, and university administration.',
    stack: 'Lab Inventory • Event Ops • Financial Auditing • Media',
  },
];

const hardwareLabs = [
  {
    role: '3D Printing & Prototyping Farm',
    focus: 'Rapid additive manufacturing for custom robot chassis, sensor brackets, and omni-wheel hubs.',
    skills: 'Creality Ender / Bambu Lab, SolidWorks, Cura, PETG/PLA filament tuning',
  },
  {
    role: 'Soldering & Assembly Benches',
    focus: 'Precision through-hole and SMD soldering, custom wiring harnesses, and connector crimping.',
    skills: 'Soldering Stations, Hot-Air Rework, Flux Chemistry, Cable Looming',
  },
  {
    role: 'Electronics & Test Arena',
    focus: 'Real-time PWM signal verification, logic timing, and battery health telemetry.',
    skills: 'Digital Oscilloscopes, Benchtop Power Supplies, Logic Analyzers, Multimeters',
  },
  {
    role: 'Regulation Competition Arenas',
    focus: 'In-house high-speed LFR vinyl tracks and synthetic turf Robo Soccer test field.',
    skills: 'Track Calibration, Surface Friction Testing, Goalpost IR Tuning',
  },
];

const semesterRhythm = [
  {
    title: 'Weekly Maker & Soldering Labs',
    timing: 'Every Saturday',
    desc: 'Guided practical workshops covering microcontroller programming, sensor calibration, and PCB assembly in the club lab.',
  },
  {
    title: 'Monthly Arena Scrimmages',
    timing: 'Last Friday of Each Month',
    desc: 'Internal competition trials where LFR bots clock official lap times and Robo Soccer squads play head-to-head friendlies.',
  },
  {
    title: 'Quarterly Hardware Hackathons',
    timing: 'Every 3 Months',
    desc: 'Fast-paced 24-hour design sprints to conceptualize, fabricate, and demonstrate functioning autonomous mechanisms.',
  },
  {
    title: 'Annual DIU National Robotics Fest',
    timing: 'Annual Flagship',
    desc: 'Our flagship university championship drawing top robotics squads nationwide for LFR, Robo Soccer, and project showcases.',
  },
];

export function AboutPage() {
  const { setCurrentView } = useAppStore();
  const [sponsors, setSponsors] = useState<any[]>([]);

  useEffect(() => {
    async function fetchSponsors() {
      try {
        const res = await fetch('/api/sponsors');
        const data = await res.json();
        if (data.success && Array.isArray(data.data?.sponsors)) {
          setSponsors(data.data.sponsors);
        }
      } catch (err) {
        console.error('Failed to fetch sponsors', err);
      }
    }
    fetchSponsors();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#040810] text-gray-100 selection:bg-blue-600 selection:text-white">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden border-b border-blue-500/20 bg-slate-950/60 px-4 pt-16 pb-20">
        <ParticlesGrid />
        <div className="relative mx-auto max-w-5xl text-center space-y-4">
          <motion.div {...fadeUp} className="space-y-4">
            <Badge variant="outline" className="border-blue-500/40 bg-blue-500/10 px-3.5 py-1 font-mono text-xs text-blue-300">
              <Building2 className="mr-1.5 h-3.5 w-3.5 text-cyan-400" />
              DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING • DHAKA INTERNATIONAL UNIVERSITY
            </Badge>

            <h1 className="text-4xl font-black text-white sm:text-5xl lg:text-6xl font-mono">
              ABOUT{' '}
              <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-sky-300 bg-clip-text text-transparent">
                DIU ROBOTICS CLUB
              </span>
            </h1>

            <p className="mx-auto max-w-3xl text-sm sm:text-base text-gray-300 leading-relaxed font-sans">
              The official robotics and embedded systems society at Dhaka International University (DIU).
              Motto: <strong className="text-cyan-400 font-mono">"Learn, Build & Innovate"</strong>.
              We empower university students with hands-on mechanical fabrication, autonomous sensor fusion, and championship-tier engineering.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 1. MISSION & VISION CHARTER ── */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Mission */}
          <Card className="border-blue-500/20 bg-slate-950/80 backdrop-blur p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <span className="font-mono text-xs text-blue-400 font-bold">OUR MISSION</span>
                <h3 className="font-mono font-bold text-xl text-white">Hands-on Engineering Mastery</h3>
              </div>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed font-sans">
              To transform classroom theoretical computer science and electrical concepts into tangible autonomous machines through hands-on maker labs, closed-loop PID control, mechanical fabrication, and high-stakes robotics competitions.
            </p>
          </Card>

          {/* Vision */}
          <Card className="border-cyan-500/20 bg-slate-950/80 backdrop-blur p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
                <Eye className="h-6 w-6" />
              </div>
              <div>
                <span className="font-mono text-xs text-cyan-400 font-bold">OUR VISION</span>
                <h3 className="font-mono font-bold text-xl text-white">National & Global Robotics Impact</h3>
              </div>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed font-sans">
              To establish Dhaka International University as a premier robotics and autonomous systems powerhouse in Bangladesh, producing principled engineers, firmware developers, and automation pioneers who advance real-world technology.
            </p>
          </Card>
        </div>
      </section>

      {/* ── 2. CORE VALUES ── */}
      <section className="relative z-10 border-t border-blue-500/10 bg-[#060c16]/80 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <Badge variant="outline" className="border-blue-500/40 bg-blue-500/10 text-blue-300 font-mono text-xs">
              <Sparkles className="mr-1.5 h-3.5 w-3.5 text-cyan-400" />
              OUR PILLARS
            </Badge>
            <h2 className="text-2xl font-bold font-mono text-white sm:text-3xl">CORE ENGINEERING PRINCIPLES</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((val, idx) => (
              <div key={idx} className="rounded-xl border border-white/5 bg-slate-950/70 p-5 space-y-3 hover:border-blue-500/30 transition-colors">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${val.borderClass} ${val.bgClass} ${val.iconClass}`}>
                  <val.icon className="h-5 w-5" />
                </div>
                <h3 className="font-mono font-bold text-sm text-white">{val.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. SAFETY & LAB CODE OF CONDUCT ── */}
      <section className="relative z-10 border-t border-blue-500/10 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <Badge variant="outline" className="border-blue-500/40 bg-blue-500/10 text-blue-300 font-mono text-xs">
              <Wrench className="mr-1.5 h-3.5 w-3.5 text-cyan-400" />
              MAKER CODE OF CONDUCT
            </Badge>
            <h2 className="text-3xl font-black tracking-tight text-white font-mono sm:text-4xl">
              LABORATORY SAFETY & ETHICS
            </h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">
              Every innovator in the DIU Robotics Club commits to these 5 essential safety and community standards.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {safetyRules.map((rule) => (
              <div key={rule.id} className="rounded-xl border border-white/5 bg-slate-950/70 p-5 space-y-2 hover:border-blue-500/30 transition-colors">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-blue-400 font-bold">{rule.id}</span>
                  <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                </div>
                <h3 className="font-mono font-bold text-sm text-white">{rule.title}</h3>
                <p className="text-xs text-gray-400 font-sans leading-relaxed">{rule.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. SPECIALIZED DIVISIONS & WINGS ── */}
      <section className="relative z-10 py-20 border-t border-blue-500/10 bg-[#060c16]/80">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <Badge variant="outline" className="border-cyan-500/40 bg-cyan-500/10 text-cyan-300 font-mono text-xs">
              <Layers className="mr-1.5 h-3.5 w-3.5 text-cyan-400" />
              SPECIALIZED DIVISIONS
            </Badge>
            <h2 className="text-3xl font-black tracking-tight text-white font-mono sm:text-4xl">
              SPECIALIZED ROBOTICS WINGS
            </h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">
              Members specialize in distinct engineering tracks reflecting real-world autonomous and industrial disciplines.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {operationalWings.map((wing, idx) => (
              <Card key={idx} className="border-white/5 bg-slate-950/80 backdrop-blur p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={`font-mono text-[10px] ${wing.badgeClass}`}>
                    {wing.badge}
                  </Badge>
                </div>
                <h3 className="font-mono font-bold text-base text-white">{wing.name}</h3>
                <p className="text-xs text-gray-400 font-sans leading-relaxed">{wing.desc}</p>
                <div className="pt-2 border-t border-white/5 font-mono text-[10px] text-gray-500">
                  STACK: <span className="text-gray-300">{wing.stack}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. HARDWARE PROTOTYPING FACILITIES ── */}
      <section className="relative z-10 border-t border-blue-500/10 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <Badge variant="outline" className="border-blue-500/40 bg-blue-500/10 text-blue-300 font-mono text-xs">
              <Cpu className="mr-1.5 h-3.5 w-3.5 text-cyan-400" />
              PROTOTYPING LABS
            </Badge>
            <h2 className="text-3xl font-black tracking-tight text-white font-mono sm:text-4xl">
              HARDWARE LABS & TESTING ARENAS
            </h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">
              Our facilities equip students with industry-grade tools for precision manufacturing and autonomous testing.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {hardwareLabs.map((lab, idx) => (
              <div key={idx} className="rounded-xl border border-white/5 bg-slate-950/80 p-5 space-y-2">
                <h3 className="font-mono font-bold text-sm text-blue-400">{lab.role}</h3>
                <p className="text-xs text-gray-300 font-sans leading-relaxed">{lab.focus}</p>
                <div className="border-t border-white/5 pt-2 font-mono text-[10px] text-gray-500">
                  CAPABILITIES: <span className="text-gray-400">{lab.skills}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. SEMESTER RHYTHM & MEMBER LIFECYCLE ── */}
      <section className="relative z-10 py-20 border-t border-blue-500/10 bg-[#060c16]/80">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <Badge variant="outline" className="border-blue-500/40 bg-blue-500/10 text-blue-300 font-mono text-xs">
              <Calendar className="mr-1.5 h-3.5 w-3.5 text-cyan-400" />
              OPERATIONAL RHYTHM
            </Badge>
            <h2 className="text-3xl font-black tracking-tight text-white font-mono sm:text-4xl">
              A SEMESTER IN THE CLUB
            </h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">
              What active participation looks like from initial solder workshops through national tournaments.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {semesterRhythm.map((rhythm, idx) => (
              <div key={idx} className="rounded-xl border border-white/5 bg-slate-950/80 p-5 space-y-2">
                <span className="rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 font-mono text-[10px] font-bold inline-block">
                  {rhythm.timing}
                </span>
                <h3 className="font-mono font-bold text-sm text-white">{rhythm.title}</h3>
                <p className="text-xs text-gray-400 font-sans leading-relaxed">{rhythm.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. EXECUTIVE COMMITTEE TEASER ── */}
      <section className="relative z-10 border-t border-blue-500/10 py-16 text-center">
        <div className="mx-auto max-w-4xl px-4 space-y-6">
          <Badge variant="outline" className="border-cyan-500/40 bg-cyan-500/10 text-cyan-300 font-mono text-xs">
            <Users className="mr-1.5 h-3.5 w-3.5 text-cyan-400" />
            LEADERSHIP & ADVISORS
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black font-mono text-white">
            MEET THE VANGUARDS & FACULTY ADVISORS
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto">
            Discover the faculty patrons, advisors, and executive student board steering the DIU Robotics Club.
          </p>
          <Button
            onClick={() => setCurrentView('committee')}
            className="bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs px-6 h-10 shadow-lg shadow-blue-500/20"
          >
            View Vanguards Directory
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* ── 8. OFFICIAL SPONSORS ── */}
      {sponsors.length > 0 && (
        <section className="relative z-10 border-t border-blue-500/10 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold font-mono text-white">OFFICIAL SPONSORS & PARTNERS</h2>
              <p className="text-xs text-gray-400">Organizations accelerating our robotics education and prototyping mission.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {sponsors.map((sponsor) => (
                <a
                  key={sponsor.id}
                  href={sanitizeUrl(sponsor.websiteUrl)}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded-xl border border-white/5 bg-slate-950/70 p-6 text-center hover:border-blue-500/30 transition-all flex flex-col items-center justify-center space-y-3 group"
                >
                  <div className="h-16 flex items-center justify-center">
                    {sponsor.logoUrl ? (
                      <img src={sponsor.logoUrl} alt={sponsor.name} className="max-h-12 object-contain filter grayscale group-hover:grayscale-0 transition-all" />
                    ) : (
                      <span className="font-mono font-bold text-gray-400">{sponsor.name}</span>
                    )}
                  </div>
                  <h3 className="font-mono text-xs font-bold text-white">{sponsor.name}</h3>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 9. HEADQUARTERS & CAMPUS NODE ── */}
      <section className="relative z-10 border-t border-blue-500/20 bg-slate-950 px-4 py-16 text-center">
        <div className="mx-auto max-w-4xl space-y-4">
          <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-400 font-mono text-xs">
            CAMPUS NODE
          </Badge>
          <h2 className="text-2xl font-bold font-mono text-white">DHAKA INTERNATIONAL UNIVERSITY</h2>
          <p className="text-xs text-gray-400 font-sans max-w-lg mx-auto leading-relaxed">
            Department of Computer Science & Engineering • Satarkul Campus, Badda, Dhaka-1212, Bangladesh.
          </p>
          <div className="pt-3 flex flex-wrap items-center justify-center gap-6 font-mono text-xs text-blue-400">
            <div>
              <span className="text-gray-500">EMAIL: </span>
              <a href="mailto:robotics@diu.ac.bd" className="underline hover:text-blue-300 transition-colors">
                robotics@diu.ac.bd
              </a>
            </div>
            <span className="text-gray-700 hidden sm:inline">•</span>
            <div>
              <span className="text-gray-500">FACEBOOK: </span>
              <a
                href="https://www.facebook.com/diuroboticsclub"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-blue-300 transition-colors"
              >
                fb.com/diuroboticsclub
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
