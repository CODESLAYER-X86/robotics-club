'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Cpu,
  Radio,
  ArrowRight,
  Sparkles,
  Award,
  Users,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
  Zap,
  Search,
  CheckCircle2,
  Target,
  Trophy,
  HelpCircle,
  FileCheck,
  Building2,
  Wrench,
  Gauge,
  Compass,
  BatteryCharging,
  Flame,
  Plane,
  Activity,
  Wifi,
  Scan,
  RotateCw,
  ShieldCheck,
  Sliders,
} from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type RobotProfileKey = 'lfr' | 'soccer' | 'combat' | 'drone';

interface RobotProfile {
  id: RobotProfileKey;
  name: string;
  badge: string;
  icon: string;
  mcu: string;
  battery: string;
  batteryPercent: number;
  rfLink: string;
  rssi: string;
  loopRate: string;
  primarySensorName: string;
  primarySensorStatus: string;
  primarySensorDetail: string;
  secondarySensorName: string;
  secondarySensorStatus: string;
  motorMode: string;
  leftPwm: number;
  rightPwm: number;
  rpm: number;
  heading: string;
  description: string;
}

const ROBOT_PROFILES: Record<RobotProfileKey, RobotProfile> = {
  lfr: {
    id: 'lfr',
    name: 'LFR Speeder v2.4',
    badge: 'Line Follower',
    icon: '🏎️',
    mcu: 'STM32F405 @ 168MHz',
    battery: '12.4V (3S LiPo)',
    batteryPercent: 88,
    rfLink: '2.4GHz NRF24L01+',
    rssi: '-54 dBm',
    loopRate: '1000 Hz PID',
    primarySensorName: '8-Channel IR Phototransistor Array',
    primarySensorStatus: 'ACTIVE [LINE CENTERED]',
    primarySensorDetail: 'PID Error: +0.02mm • Kp: 1.85, Ki: 0.05, Kd: 0.92',
    secondarySensorName: 'LiDAR Distance Radar',
    secondarySensorStatus: 'CLEAR (142 cm ahead)',
    motorMode: 'Differential Dual 12V 1000RPM',
    leftPwm: 82,
    rightPwm: 82,
    rpm: 420,
    heading: 'Track 04 // Velocity: 2.85 m/s',
    description: 'High-speed autonomous line tracking with discrete differential PID steering & 90° hairpin braking.',
  },
  soccer: {
    id: 'soccer',
    name: 'Striker Omni-X',
    badge: 'Robo Soccer',
    icon: '⚽',
    mcu: 'ESP32-S3 Dual-Core @ 240MHz',
    battery: '14.8V (4S LiPo)',
    batteryPercent: 92,
    rfLink: 'ELRS 2.4GHz Low-Latency',
    rssi: '-48 dBm',
    loopRate: '500 Hz Kinematics',
    primarySensorName: '360° Ball Camera / IR Seeker',
    primarySensorStatus: 'BALL LOCKED (18° Right, 65cm)',
    primarySensorDetail: 'Dribbler: ENGAGED @ 6,200 RPM • Solenoid: ARMED',
    secondarySensorName: 'Arena Compass & Goal Vector',
    secondarySensorStatus: 'GOAL VECTOR: 014° N (1.8m to target)',
    motorMode: '3-Wheel Holonomic Omni-Drive',
    leftPwm: 75,
    rightPwm: 78,
    rpm: 510,
    heading: 'Pitch A // Striker Attack Mode',
    description: 'Holonomic omni-drive kinematics with high-voltage capacitor kicker solenoid.',
  },
  combat: {
    id: 'combat',
    name: 'IronClaw 3.0',
    badge: 'Combat Bot',
    icon: '⚔️',
    mcu: 'ATmega2560 / Custom Driver Shield',
    battery: '22.2V (6S Heavy LiPo)',
    batteryPercent: 84,
    rfLink: 'FlySky 2.4GHz AFHDS',
    rssi: '-58 dBm',
    loopRate: '250 Hz Fail-Safe',
    primarySensorName: 'Kinetic Weapon Tachometer',
    primarySensorStatus: 'SPINNER ARMED @ 8,400 RPM',
    primarySensorDetail: 'Kinetic Energy: 420 Joules • ESC Temp: 44°C (Safe)',
    secondarySensorName: 'Chassis Impact Strain Gauge',
    secondarySensorStatus: 'IMPACT TOLERANCE: 100% NOMINAL',
    motorMode: 'Dual Planetary 12V 775 High-Torque',
    leftPwm: 90,
    rightPwm: 90,
    rpm: 650,
    heading: 'Combat Pit 1 // Armed & Ready',
    description: 'Titanium chassis with high-speed kinetic spinning disc and inverted roll recovery.',
  },
  drone: {
    id: 'drone',
    name: 'SkyScout Quad',
    badge: 'Autonomous UAV',
    icon: '🛰️',
    mcu: 'STM32F722 Flight Controller',
    battery: '15.2V (4S LiHV)',
    batteryPercent: 79,
    rfLink: 'Crossfire 915MHz Long-Range',
    rssi: '-42 dBm',
    loopRate: '8000 Hz Gyro / 4000 Hz PID',
    primarySensorName: '6-DOF ICM-42688P Gyro & Accel',
    primarySensorStatus: 'HORIZON LOCKED (Pitch: +0.4°, Roll: -0.2°)',
    primarySensorDetail: 'Barometer: 14.2m AGL • GPS 3D Fix: 16 Satellites',
    secondarySensorName: 'Downward Optical Flow LiDAR',
    secondarySensorStatus: 'HOVER LOCK: DRIFT < 2cm',
    motorMode: 'Quad Brushless 2207 1950KV',
    leftPwm: 64,
    rightPwm: 64,
    rpm: 12400,
    heading: 'Waypoint #03 // Cruise 24 km/h',
    description: 'Autonomous GPS waypoint navigation, optical flow hover hold, and FPV telemetry.',
  },
};

export function LandingPage() {
  const { setCurrentView, isAuthenticated } = useAppStore();

  // Active Robot Telemetry State
  const [selectedBot, setSelectedBot] = useState<RobotProfileKey>('lfr');
  const [isMotorsSpinning, setIsMotorsSpinning] = useState(false);
  const [isPingingLidar, setIsPingingLidar] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [telemetryMessage, setTelemetryMessage] = useState<string>(
    'All sensor telemetry channels nominal • Select a robot profile or trigger a hardware test'
  );

  // Quick Certificate Verification Search
  const [certSearchCode, setCertSearchCode] = useState('');

  // Live upcoming events state
  const [events, setEvents] = useState<any[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  // FAQ open/close accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  useEffect(() => {
    async function fetchUpcomingEvents() {
      try {
        const res = await fetch('/api/events?status=UPCOMING');
        if (!res.ok) return;
        const text = await res.text();
        if (!text) return;
        const data = JSON.parse(text);
        if (data.success && Array.isArray(data.data?.events)) {
          setEvents(data.data.events.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load upcoming events', err);
      } finally {
        setEventsLoading(false);
      }
    }
    fetchUpcomingEvents();
  }, []);

  const handleSpinMotors = () => {
    if (isMotorsSpinning) return;
    setIsMotorsSpinning(true);
    setTelemetryMessage('⚡ Throttling dual ESCs to 95% PWM... High-torque motors benchmarked at peak RPM!');
    setTimeout(() => {
      setIsMotorsSpinning(false);
      setTelemetryMessage('✓ Motor benchmark complete • 0% motor stall, thermal & current envelopes nominal');
    }, 2200);
  };

  const handlePingLidar = () => {
    if (isPingingLidar) return;
    setIsPingingLidar(true);
    setTelemetryMessage('📡 360° LiDAR radar pulse sweep initiated... Scanning obstacle vectors...');
    setTimeout(() => {
      setIsPingingLidar(false);
      setTelemetryMessage('✓ LiDAR radar sweep complete: 142 cm clearance in forward cone • 0 hazards detected');
    }, 1800);
  };

  const handleCalibrate = () => {
    if (isCalibrating) return;
    setIsCalibrating(true);
    setTelemetryMessage('🧭 6-DOF IMU gyroscope zeroing in progress... Hold platform steady...');
    setTimeout(() => {
      setIsCalibrating(false);
      setTelemetryMessage('✓ Gyroscope zeroed: Pitch 0.00°, Roll 0.00° • Calibration matrix saved to EEPROM');
    }, 1600);
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certSearchCode.trim()) return;
    setCurrentView('certificate-verify');
  };

  const faqs = [
    {
      q: 'Who is eligible to join the Dhaka International University Robotics Club (DIURC)?',
      a: 'Any enrolled student of Dhaka International University from any department (CSE, EEE, Civil, BBA, English, etc.) who has a passion for robotics, hardware prototyping, microcontrollers, and autonomous systems is welcome to join. Both absolute novices and seasoned makers are warmly supported.',
    },
    {
      q: 'Do I need prior hardware or programming experience to get started?',
      a: 'Not at all! Our club provides structured, beginner-friendly "Robotics 101" workshops. Senior mentors guide you from basic breadboard prototyping, circuit soldering, and Arduino C++ fundamentals all the way to advanced PID tuning for high-speed Line Follower robots.',
    },
    {
      q: 'How does membership registration and lab component access work?',
      a: 'Complete the online registration form with your student ID, roll, and batch, then submit the configured membership fee (typically ৳200) via bKash, Nagad, Rocket, or in person. Once verified by executives, you receive your official 3D Digital Member Identifier and access to lab components, 3D printers, and testing tracks.',
    },
    {
      q: 'What specialized divisions and robotics tracks can I participate in?',
      a: 'Members can specialize in 5 core divisions: Line Follower Robots (LFR), Robo Soccer with holonomic omni-drive kinematics, Combat Robotics & Heavy Hardware, Embedded Systems & IoT (ESP32/STM32/LoRa), and Autonomous Aerial Drones & UAVs.',
    },
    {
      q: 'How can recruiters or academic institutions verify certificates issued by DIURC?',
      a: 'Every certificate issued for a workshop, bootcamp, or leadership role contains a unique verification identifier (e.g. DIURC-2026-WORKSHOP-XXXX). Anyone can use our public verification portal to instantly validate the authenticity, recipient name, and issuance date directly against the central record system.',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#040810] text-gray-100 selection:bg-blue-600 selection:text-white">
      {/* 1. TOP HARDWARE TELEMETRY STATUS BAR */}
      <div className="border-b border-blue-500/20 bg-blue-950/20 px-4 py-2 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between font-mono text-[11px] text-blue-400">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
            <span className="font-bold tracking-wider">[HARDWARE ACTIVE]</span>
            <span className="hidden sm:inline text-gray-500">•</span>
            <span className="hidden sm:inline text-gray-300">DHAKA INTERNATIONAL UNIVERSITY</span>
            <span className="hidden md:inline text-gray-500">•</span>
            <span className="hidden md:inline text-cyan-300">OFFICIAL ROBOTICS INNOVATION PORTAL</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-gray-400">LINK PROTOCOL:</span>
            <span className="font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">
              RF-2.4GHz / CAN-BUS
            </span>
          </div>
        </div>
      </div>

      {/* Cyber Hardware Grid Background */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#0284c710_1px,transparent_1px),linear-gradient(to_bottom,#0284c710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* 2. HERO SECTION WITH VALUE PROP & HARDWARE TELEMETRY CONSOLE */}
      <section className="relative z-10 mx-auto max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1536px] px-4 pt-6 sm:pt-8 lg:pt-10 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:gap-10 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Clear Mission & Call-to-Actions */}
          <div className="space-y-4 sm:space-y-5 lg:col-span-6 min-w-0 max-w-full">
            {/* Club Brand Emblem & University Affiliation */}
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 max-w-full">
              {/* Scaled Emblem Container */}
              <div className="relative group shrink-0">
                {/* Ambient Royal Blue Glow */}
                <div className="absolute -inset-1.5 sm:-inset-2 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-600/35 via-cyan-500/25 to-sky-500/35 blur-lg sm:blur-xl opacity-80 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />

                <div className="relative flex h-36 w-36 xs:h-44 xs:w-44 sm:h-56 sm:w-56 lg:h-72 lg:w-72 shrink-0 items-center justify-center rounded-2xl sm:rounded-3xl border-2 border-blue-500/50 bg-slate-950/95 p-3 sm:p-5 shadow-2xl shadow-blue-500/25 ring-1 ring-blue-500/30 backdrop-blur-xl transition-all duration-300 group-hover:border-blue-400 group-hover:shadow-blue-500/40">
                  <img
                    src="/logo.png"
                    alt="DIU Robotics Club Logo"
                    className="h-full w-full object-contain rounded-xl sm:rounded-2xl filter drop-shadow-[0_0_24px_rgba(37,99,235,0.45)] transition-transform duration-300 group-hover:scale-[1.03]"
                    width={288}
                    height={288}
                  />
                  {/* Precision Corner Accents */}
                  <div className="absolute top-2 left-2 h-3 sm:h-3.5 w-3 sm:w-3.5 border-t-2 border-l-2 border-cyan-400/80 rounded-tl pointer-events-none" />
                  <div className="absolute top-2 right-2 h-3 sm:h-3.5 w-3 sm:w-3.5 border-t-2 border-r-2 border-cyan-400/80 rounded-tr pointer-events-none" />
                  <div className="absolute bottom-2 left-2 h-3 sm:h-3.5 w-3 sm:w-3.5 border-b-2 border-l-2 border-cyan-400/80 rounded-bl pointer-events-none" />
                  <div className="absolute bottom-2 right-2 h-3 sm:h-3.5 w-3 sm:w-3.5 border-b-2 border-r-2 border-cyan-400/80 rounded-br pointer-events-none" />
                </div>
              </div>

              {/* Affiliation Badges */}
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-1.5 sm:space-y-2 min-w-0 max-w-full">
                <Badge
                  variant="outline"
                  className="border-blue-500/40 bg-blue-500/10 px-3 sm:px-3.5 py-1 font-mono text-[11px] xs:text-xs sm:text-sm tracking-wider text-blue-300 max-w-full whitespace-normal text-center sm:text-left inline-flex items-center gap-1.5 shadow-sm shadow-blue-500/10"
                >
                  <Radio className="mr-1 sm:mr-1.5 h-3 sm:h-3.5 w-3 sm:w-3.5 shrink-0 animate-pulse text-cyan-400" />
                  <span>DHAKA INTERNATIONAL UNIVERSITY</span>
                </Badge>
                <div className="font-mono text-xs sm:text-sm text-gray-300 font-medium tracking-wide">
                  Department of CSE • DIU Robotics Club
                </div>
                <div className="font-mono text-[11px] text-cyan-400 font-semibold tracking-wider">
                  "Learn, Build & Innovate"
                </div>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[40px] font-black tracking-tight text-white font-mono leading-tight break-words max-w-full">
              EMPOWERING THE NEXT GENERATION OF{' '}
              <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-sky-300 bg-clip-text text-transparent inline-block">
                AUTONOMOUS INNOVATORS.
              </span>
            </h1>

            <p className="text-xs sm:text-sm lg:text-base text-gray-300 leading-relaxed max-w-2xl font-sans">
              Welcome to DIU Robotics Club — Learn, Build & Innovate. The premier student hub for autonomous robotics,
              high-speed Line Follower (LFR) engineering, Robo Soccer omni-drive kinematics, combat hardware, and embedded IoT systems at Dhaka International University.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button
                size="lg"
                onClick={() => setCurrentView(isAuthenticated ? 'apply-membership' : 'login')}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold font-mono tracking-wide shadow-lg shadow-blue-500/25 text-xs sm:text-sm px-5 h-10 sm:h-11"
              >
                Apply for Membership
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setCurrentView('events')}
                className="w-full sm:w-auto border-blue-500/30 bg-slate-950/60 font-mono text-blue-300 hover:bg-blue-500/10 hover:border-blue-500/60 text-xs sm:text-sm px-5 h-10 sm:h-11"
              >
                <Calendar className="mr-2 h-4 w-4 text-cyan-400" />
                Workshops & Arenas
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onClick={() => setCurrentView('certificate-verify')}
                className="w-full sm:w-auto text-gray-300 hover:text-blue-400 font-mono text-xs h-9 sm:h-10"
              >
                <FileCheck className="mr-1.5 h-3.5 w-3.5 text-blue-400" />
                Verify a Certificate
              </Button>
            </div>
          </div>

          {/* Right Column: DIURC Onboard Hardware & Sensor Telemetry HUD */}
          <div className="w-full min-w-0 max-w-full lg:col-span-6">
            {(() => {
              const currentBot = ROBOT_PROFILES[selectedBot];
              const effectiveLeftPwm = isMotorsSpinning ? 95 : currentBot.leftPwm;
              const effectiveRightPwm = isMotorsSpinning ? 95 : currentBot.rightPwm;
              const effectiveRpm = isMotorsSpinning ? currentBot.rpm + 240 : currentBot.rpm;

              return (
                <div className="relative group rounded-2xl border border-blue-500/40 bg-[#050b14]/95 shadow-2xl shadow-blue-500/15 backdrop-blur-xl overflow-hidden font-mono min-h-[420px] max-w-full flex flex-col justify-between transition-all duration-300 hover:border-blue-500/60 hover:shadow-blue-500/30">
                  {/* Top Casing & Hardware Status Header */}
                  <div className="flex flex-wrap items-center justify-between border-b border-blue-500/20 bg-slate-950/90 px-3.5 sm:px-4 py-2.5 gap-2 shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 mr-1">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" title="System Status: OK" />
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" title="PID Lock: Active" />
                        <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" title="Telemetry Radio: Linked" />
                      </div>
                      <span className="text-xs sm:text-[13px] font-bold text-white tracking-wide">
                        DIURC SENSOR HUD
                      </span>
                      <span className="text-[10px] text-blue-400/80 hidden xs:inline">{'// v3.4 TELEMETRY'}</span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px]">
                      <div className="flex items-center gap-1 text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded">
                        <BatteryCharging className="h-3 w-3 text-cyan-400" />
                        <span>{currentBot.batteryPercent}%</span>
                      </div>
                      <div className="flex items-center gap-1 text-blue-300 bg-blue-950/40 border border-blue-500/30 px-2 py-0.5 rounded">
                        <Wifi className="h-3 w-3 text-blue-400" />
                        <span>{currentBot.rssi}</span>
                      </div>
                      <Badge variant="outline" className="border-emerald-500/40 text-[9px] text-emerald-400 px-1.5 py-0.5 bg-emerald-950/30 font-bold">
                        LIVE
                      </Badge>
                    </div>
                  </div>

                  {/* Robot Profile Selector Tabs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-2 bg-slate-950/60 border-b border-white/5">
                    {(Object.keys(ROBOT_PROFILES) as RobotProfileKey[]).map((key) => {
                      const bot = ROBOT_PROFILES[key];
                      const isActive = selectedBot === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            setSelectedBot(key);
                            setTelemetryMessage(`Switched active telemetry feed to ${bot.name} (${bot.badge})`);
                          }}
                          className={`flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            isActive
                              ? 'bg-blue-600/30 text-cyan-300 border border-blue-400/50 shadow-sm shadow-blue-500/30 font-bold'
                              : 'bg-white/[0.02] text-gray-400 hover:text-white hover:bg-white/[0.06] border border-transparent'
                          }`}
                        >
                          <span>{bot.icon}</span>
                          <span className="truncate">{bot.badge}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* OLED / TFT Sensor Monitor Screen */}
                  <div className="p-3 sm:p-4 flex-1 space-y-3 bg-[#030712] relative overflow-hidden">
                    {/* Background Matrix Scanning Lines */}
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.03)_1px,transparent_1px)] bg-[size:100%_4px] opacity-70" />

                    {/* Active Robot Info Header */}
                    <div className="relative z-10 flex flex-wrap items-center justify-between text-xs pb-1 border-b border-white/10 gap-1">
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                        <span className="font-bold text-white text-sm">{currentBot.name}</span>
                        <span className="text-[10px] text-gray-400">({currentBot.mcu})</span>
                      </div>
                      <div className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                        LOOP: {currentBot.loopRate}
                      </div>
                    </div>

                    {/* 2x2 Telemetry Gauge Matrix */}
                    <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {/* Gauge 1: Primary Sensor Array */}
                      <div className="rounded-xl border border-blue-500/20 bg-slate-900/60 p-2.5 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1.5 text-blue-300 font-semibold">
                            <Scan className="h-3.5 w-3.5 text-cyan-400" />
                            <span className="truncate">{currentBot.primarySensorName}</span>
                          </div>
                          <span className="text-[9px] text-emerald-400 font-bold">ONLINE</span>
                        </div>

                        {/* Interactive Sensor Visual */}
                        {selectedBot === 'lfr' ? (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between gap-1 py-1">
                              {[0, 1, 2, 3, 4, 5, 6, 7].map((pin) => {
                                const isCenter = pin === 3 || pin === 4;
                                return (
                                  <div
                                    key={pin}
                                    className={`flex-1 h-5 rounded flex items-center justify-center text-[9px] font-bold transition-all ${
                                      isCenter
                                        ? 'bg-cyan-400 text-slate-950 shadow-[0_0_10px_#38bdf8]'
                                        : 'bg-slate-800 text-gray-500 border border-white/5'
                                    }`}
                                  >
                                    P{pin}
                                  </div>
                                );
                              })}
                            </div>
                            <div className="text-[10px] text-cyan-300/90 font-mono truncate">
                              Status: {currentBot.primarySensorStatus}
                            </div>
                          </div>
                        ) : selectedBot === 'soccer' ? (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between bg-slate-950/80 px-2.5 py-1.5 rounded border border-white/5 text-[11px]">
                              <span className="text-gray-400">Target Vector:</span>
                              <span className="text-cyan-400 font-bold">18° R • 65 cm</span>
                            </div>
                            <div className="text-[10px] text-cyan-300/90 truncate">
                              Dribbler: 6,200 RPM • Solenoid: ARMED
                            </div>
                          </div>
                        ) : selectedBot === 'combat' ? (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between bg-slate-950/80 px-2.5 py-1.5 rounded border border-white/5 text-[11px]">
                              <span className="text-gray-400">Weapon Speed:</span>
                              <span className="text-rose-400 font-bold">8,400 RPM (420J)</span>
                            </div>
                            <div className="text-[10px] text-amber-300/90 truncate">
                              ESC Temp: 44°C • Kinetic Energy Nominal
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between bg-slate-950/80 px-2.5 py-1.5 rounded border border-white/5 text-[11px]">
                              <span className="text-gray-400">Artificial Horizon:</span>
                              <span className="text-cyan-400 font-bold">P: +0.4° | R: -0.2°</span>
                            </div>
                            <div className="text-[10px] text-cyan-300/90 truncate">
                              Altitude: 14.2m AGL • GPS: 16 Satellites
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Gauge 2: LiDAR / Radar Proximity */}
                      <div className={`rounded-xl border bg-slate-900/60 p-2.5 space-y-1.5 transition-colors ${
                        isPingingLidar ? 'border-cyan-400/80 shadow-[0_0_12px_rgba(56,189,248,0.25)]' : 'border-blue-500/20'
                      }`}>
                        <div className="flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1.5 text-blue-300 font-semibold">
                            <Radio className={`h-3.5 w-3.5 text-cyan-400 ${isPingingLidar ? 'animate-spin' : ''}`} />
                            <span className="truncate">{currentBot.secondarySensorName}</span>
                          </div>
                          <span className={`text-[9px] font-bold ${isPingingLidar ? 'text-cyan-300 animate-pulse' : 'text-emerald-400'}`}>
                            {isPingingLidar ? 'SCANNING' : 'CLEAR'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between bg-slate-950/80 px-2.5 py-1.5 rounded border border-white/5 text-[11px]">
                          <span className="text-gray-400">Obstacle Distance:</span>
                          <span className="text-cyan-400 font-bold">
                            {isPingingLidar ? 'Scanning 360°...' : '142 cm (Safe)'}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-400 truncate">
                          Forward 45° Cone • Zero Collision Hazard
                        </div>
                      </div>

                      {/* Gauge 3: Motor Drivers & PWM */}
                      <div className={`rounded-xl border bg-slate-900/60 p-2.5 space-y-1.5 transition-colors ${
                        isMotorsSpinning ? 'border-amber-400/80 shadow-[0_0_12px_rgba(251,191,36,0.25)]' : 'border-blue-500/20'
                      }`}>
                        <div className="flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1.5 text-blue-300 font-semibold">
                            <RotateCw className={`h-3.5 w-3.5 text-cyan-400 ${isMotorsSpinning ? 'animate-spin' : ''}`} />
                            <span className="truncate">Motor PWM & ESC Output</span>
                          </div>
                          <span className="text-[9px] text-cyan-300 font-bold">{effectiveRpm} RPM</span>
                        </div>

                        {/* Motor PWM Bars */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-[10px]">
                            <span className="text-gray-400 w-10">M_L:</span>
                            <div className="flex-1 bg-slate-950 rounded-full h-2 overflow-hidden border border-white/5">
                              <div
                                className={`h-full transition-all duration-300 ${
                                  isMotorsSpinning ? 'bg-amber-400' : 'bg-gradient-to-r from-blue-500 to-cyan-400'
                                }`}
                                style={{ width: `${effectiveLeftPwm}%` }}
                              />
                            </div>
                            <span className="text-cyan-300 w-8 text-right font-mono">{effectiveLeftPwm}%</span>
                          </div>

                          <div className="flex items-center gap-2 text-[10px]">
                            <span className="text-gray-400 w-10">M_R:</span>
                            <div className="flex-1 bg-slate-950 rounded-full h-2 overflow-hidden border border-white/5">
                              <div
                                className={`h-full transition-all duration-300 ${
                                  isMotorsSpinning ? 'bg-amber-400' : 'bg-gradient-to-r from-blue-500 to-cyan-400'
                                }`}
                                style={{ width: `${effectiveRightPwm}%` }}
                              />
                            </div>
                            <span className="text-cyan-300 w-8 text-right font-mono">{effectiveRightPwm}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Gauge 4: IMU Stability & Navigation */}
                      <div className={`rounded-xl border bg-slate-900/60 p-2.5 space-y-1.5 transition-colors ${
                        isCalibrating ? 'border-emerald-400/80 shadow-[0_0_12px_rgba(52,211,153,0.25)]' : 'border-blue-500/20'
                      }`}>
                        <div className="flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1.5 text-blue-300 font-semibold">
                            <Compass className="h-3.5 w-3.5 text-cyan-400" />
                            <span className="truncate">Navigation & Heading</span>
                          </div>
                          <span className="text-[9px] text-cyan-300 font-bold">LOCKED</span>
                        </div>

                        <div className="flex items-center justify-between bg-slate-950/80 px-2.5 py-1.5 rounded border border-white/5 text-[11px]">
                          <span className="text-gray-400">Position / Track:</span>
                          <span className="text-cyan-400 font-bold truncate max-w-[130px]">
                            {isCalibrating ? 'Zeroing IMU...' : currentBot.heading}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-400 truncate">
                          RF Protocol: {currentBot.rfLink}
                        </div>
                      </div>
                    </div>

                    {/* Live Telemetry Message Ticker */}
                    <div className="relative z-10 flex items-center gap-2 rounded-lg bg-black/60 border border-white/10 px-3 py-1.5 text-[11px] text-gray-300">
                      <span className="text-cyan-400 font-bold shrink-0">&gt;</span>
                      <span className="truncate font-mono text-cyan-200">{telemetryMessage}</span>
                      <span className="h-3 w-1.5 bg-cyan-400 animate-pulse shrink-0" />
                    </div>
                  </div>

                  {/* Tactile Hardware Interactive Action Buttons */}
                  <div className="border-t border-blue-500/20 bg-slate-950/95 p-2.5 sm:p-3 shrink-0">
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-2 font-mono flex items-center justify-between">
                      <span>Interactive Hardware Controls:</span>
                      <span className="text-cyan-400/80">Click to test live diagnostics</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <Button
                        size="sm"
                        type="button"
                        onClick={handleSpinMotors}
                        disabled={isMotorsSpinning}
                        variant="outline"
                        className="border-blue-500/40 bg-blue-500/10 text-cyan-300 hover:bg-blue-500/20 text-[11px] h-8 font-mono"
                      >
                        <RotateCw className={`mr-1 h-3 w-3 ${isMotorsSpinning ? 'animate-spin text-amber-400' : ''}`} />
                        {isMotorsSpinning ? 'Revving...' : 'Test Motors'}
                      </Button>

                      <Button
                        size="sm"
                        type="button"
                        onClick={handlePingLidar}
                        disabled={isPingingLidar}
                        variant="outline"
                        className="border-blue-500/40 bg-blue-500/10 text-cyan-300 hover:bg-blue-500/20 text-[11px] h-8 font-mono"
                      >
                        <Scan className={`mr-1 h-3 w-3 ${isPingingLidar ? 'animate-pulse text-cyan-400' : ''}`} />
                        {isPingingLidar ? 'Pinging...' : 'Ping LiDAR'}
                      </Button>

                      <Button
                        size="sm"
                        type="button"
                        onClick={handleCalibrate}
                        disabled={isCalibrating}
                        variant="outline"
                        className="border-blue-500/40 bg-blue-500/10 text-cyan-300 hover:bg-blue-500/20 text-[11px] h-8 font-mono"
                      >
                        <Compass className={`mr-1 h-3 w-3 ${isCalibrating ? 'animate-spin text-emerald-400' : ''}`} />
                        {isCalibrating ? 'Zeroing...' : 'Calibrate'}
                      </Button>

                      <Button
                        size="sm"
                        type="button"
                        onClick={() => setCurrentView(isAuthenticated ? 'apply-membership' : 'login')}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] h-8 font-mono shadow-md shadow-blue-500/20"
                      >
                        Join Team
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* 3. MEMBER PRIVILEGES & CLUB FACILITIES */}
      <section className="relative z-10 border-t border-blue-500/10 bg-[#060c16]/70 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <Badge variant="outline" className="border-blue-500/40 bg-blue-500/10 text-blue-400 font-mono text-xs">
              <Sparkles className="mr-1 h-3.5 w-3.5 text-cyan-400" />
              WHY JOIN US
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white font-mono break-words">
              OFFICIAL MEMBER PRIVILEGES
            </h2>
            <p className="text-sm text-gray-400 max-w-2xl mx-auto">
              Everything you need to advance from basic circuits to championship robotics engineering and embedded innovation.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* 1. Digital ID Card */}
            <Card className="border-blue-500/20 bg-slate-950/70 backdrop-blur hover:border-blue-500/50 transition-all duration-300 group">
              <CardContent className="p-6 space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                  <Bot className="h-6 w-6" />
                </div>
                <h3 className="font-mono font-bold text-lg text-white group-hover:text-blue-300 transition-colors">
                  Interactive 3D Digital Member Identifier
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Verified members receive an interactive 3D digital robotics badge stamped with Student ID, Roll, Batch, and cryptographic telemetry hash, exportable as high-res PNG.
                </p>
              </CardContent>
            </Card>

            {/* 2. Hardware Prototyping Labs */}
            <Card className="border-cyan-500/20 bg-slate-950/70 backdrop-blur hover:border-cyan-500/50 transition-all duration-300 group">
              <CardContent className="p-6 space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                  <Cpu className="h-6 w-6" />
                </div>
                <h3 className="font-mono font-bold text-lg text-white group-hover:text-cyan-300 transition-colors">
                  Hardware Prototyping Lab Access
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Direct access to the DIURC maker lab featuring high-precision 3D printers, laser cutting, temperature-controlled soldering stations, logic analyzers, and test arenas.
                </p>
              </CardContent>
            </Card>

            {/* 3. Verifiable Certificates */}
            <Card className="border-amber-500/20 bg-slate-950/70 backdrop-blur hover:border-amber-500/50 transition-all duration-300 group">
              <CardContent className="p-6 space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                  <Award className="h-6 w-6" />
                </div>
                <h3 className="font-mono font-bold text-lg text-white group-hover:text-amber-300 transition-colors">
                  Verifiable Event Certificates
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Earn official certificates for workshops, hackathons, and bootcamps that recruiters and academic institutions can authenticate instantly via our public portal.
                </p>
              </CardContent>
            </Card>

            {/* 4. Competition Arena Track */}
            <Card className="border-red-500/20 bg-slate-950/70 backdrop-blur hover:border-red-500/50 transition-all duration-300 group">
              <CardContent className="p-6 space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 group-hover:scale-110 transition-transform">
                  <Trophy className="h-6 w-6" />
                </div>
                <h3 className="font-mono font-bold text-lg text-white group-hover:text-red-300 transition-colors">
                  Competitive Tournament Squads
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Join organized engineering squads for National Line Follower Robot (LFR) tournaments, Robo Soccer derbies, and heavyweight combat bot competitions representing DIU.
                </p>
              </CardContent>
            </Card>

            {/* 5. Industry Mentorship */}
            <Card className="border-blue-500/20 bg-slate-950/70 backdrop-blur hover:border-blue-500/50 transition-all duration-300 group">
              <CardContent className="p-6 space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="font-mono font-bold text-lg text-white group-hover:text-blue-300 transition-colors">
                  Faculty & Industry Mentorship
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Receive direct guidance from robotics researchers, automation specialists, and alumni working in autonomous systems, embedded firmware, and industrial IoT.
                </p>
              </CardContent>
            </Card>

            {/* 6. Executive Leadership & Wings */}
            <Card className="border-cyan-500/20 bg-slate-950/70 backdrop-blur hover:border-cyan-500/50 transition-all duration-300 group">
              <CardContent className="p-6 space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                  <Layers className="h-6 w-6" />
                </div>
                <h3 className="font-mono font-bold text-lg text-white group-hover:text-cyan-300 transition-colors">
                  Executive Governance & Project Wings
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Develop leadership and project management capabilities by heading competition tracks, managing laboratory component inventories, and orchestrating national tech fests.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. DEDICATED SECTION: AUTONOMOUS ROBOTICS & SENSOR FUSION */}
      <section className="relative z-10 border-t border-blue-500/10 bg-[#050b14] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <Badge variant="outline" className="border-cyan-500/40 bg-cyan-500/10 text-cyan-400 font-mono text-xs">
              <Gauge className="mr-1 h-3.5 w-3.5 text-cyan-400" />
              AUTONOMOUS NAVIGATION & ARENA SYSTEMS
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white font-mono break-words">
              ENGINEERING AUTONOMOUS ROBOTS
            </h2>
            <p className="text-sm text-gray-400 max-w-3xl mx-auto leading-relaxed">
              From micro-second optical sensor arrays to closed-loop PID algorithms and holonomic omni-drive kinematics, explore how DIURC members build high-performance robotics platforms.
            </p>
          </div>

          {/* Interactive Telemetry Concept Box */}
          <div className="mx-auto max-w-2xl mb-12 rounded-xl border border-blue-500/30 bg-slate-950/90 p-3 sm:p-4 font-mono text-xs text-center shadow-lg">
            <span className="text-gray-500 text-[11px] sm:text-xs">SAMPLE CLOSED-LOOP TELEMETRY STRING:</span>
            <div className="mt-1.5 inline-block max-w-full rounded-md border border-blue-500/40 bg-blue-950/30 px-3 sm:px-4 py-1.5 text-cyan-300 font-bold text-xs sm:text-sm tracking-wider break-all">
              PID_CORRECTION: e(t)=0.042 | PWM_L=195 | PWM_R=205 | STATE=LFR_TRACK_LOCKED
            </div>
            <p className="mt-2 text-[11px] text-gray-400">
              High-frequency sensor fusion continuously computes error offsets to drive dual motor PWM outputs with sub-millisecond precision.
            </p>
          </div>

          {/* 2 Main Competition Arenas */}
          <div className="grid gap-6 md:grid-cols-2 mb-12">
            <Card className="border-blue-500/20 bg-slate-950/80 backdrop-blur p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-300 font-mono text-xs">
                  ARENA 01
                </Badge>
                <h3 className="font-mono font-bold text-lg text-white">High-Speed Line Follower Robot (LFR)</h3>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                Bots autonomously navigate complex black tracks on white arenas containing 90-degree acute angles, crossover grids, loop bridges, and inverted white-line zones using high-density optical reflection arrays and dynamic PID braking.
              </p>
              <div className="text-[11px] font-mono text-cyan-400/90 border-t border-white/5 pt-2">
                KEY DISCIPLINES: Optical Array Calibration • PID Tuning • Curve Deceleration
              </div>
            </Card>

            <Card className="border-cyan-500/20 bg-slate-950/80 backdrop-blur p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-cyan-500/30 bg-cyan-500/10 text-cyan-300 font-mono text-xs">
                  ARENA 02
                </Badge>
                <h3 className="font-mono font-bold text-lg text-white">Competitive Robo Soccer Arena</h3>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                Teams pilot 3-wheel or 4-wheel omni-directional robots on high-grip synthetic turf. Utilizing low-latency 2.4GHz RF communication, active roller dribblers, and high-voltage solenoid kickers, teams score goals in fast-paced 5-minute matches.
              </p>
              <div className="text-[11px] font-mono text-blue-400/90 border-t border-white/5 pt-2">
                KEY DISCIPLINES: Omni-drive Kinematics • Solenoid Kickers • Active Dribblers
              </div>
            </Card>
          </div>

          {/* 5 Core Hardware Engineering Subsystems */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold font-mono text-white text-center">
              THE 5 CORE ROBOTICS SUBSYSTEMS
            </h3>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {/* Subsystem 1 */}
              <div className="rounded-xl border border-white/5 bg-slate-950/60 p-4 space-y-2">
                <div className="flex items-center gap-2 text-blue-400 font-mono font-bold text-sm">
                  <Target className="h-4 w-4" /> Optical Sensor Arrays
                </div>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  8-to-16 channel IR phototransistor arrays with analog multiplexers for ground contrast reading.
                </p>
              </div>

              {/* Subsystem 2 */}
              <div className="rounded-xl border border-white/5 bg-slate-950/60 p-4 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold text-sm">
                  <Zap className="h-4 w-4" /> Motor PWM & Drivers
                </div>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  Dual H-bridge MOSFET drivers (TB6612FNG, BTS7960) paired with high-RPM metal gear micro-motors.
                </p>
              </div>

              {/* Subsystem 3 */}
              <div className="rounded-xl border border-white/5 bg-slate-950/60 p-4 space-y-2">
                <div className="flex items-center gap-2 text-sky-400 font-mono font-bold text-sm">
                  <Cpu className="h-4 w-4" /> Microcontrollers & SoC
                </div>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  STM32 ARM Cortex-M4, ESP32 dual-core Xtensa, and Arduino platforms running real-time control loops.
                </p>
              </div>

              {/* Subsystem 4 */}
              <div className="rounded-xl border border-white/5 bg-slate-950/60 p-4 space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-mono font-bold text-sm">
                  <Radio className="h-4 w-4" /> Telemetry & RF Links
                </div>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  NRF24L01+ 2.4GHz modules, ESP-NOW protocols, and Bluetooth SPP for real-time sensor feedback.
                </p>
              </div>

              {/* Subsystem 5 */}
              <div className="rounded-xl border border-white/5 bg-slate-950/60 p-4 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-sm">
                  <BatteryCharging className="h-4 w-4" /> Power & LiPo Systems
                </div>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  High-discharge 3S/4S LiPo batteries, buck-boost regulators, and battery telemetry safety circuits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURED WINGS & TRACKS (5 CORE DIVISIONS) */}
      <section className="relative z-10 py-20 border-t border-blue-500/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <Badge variant="outline" className="border-blue-500/40 bg-blue-500/10 text-blue-400 font-mono text-xs">
              <Layers className="mr-1 h-3.5 w-3.5 text-cyan-400" />
              SPECIALIZED DIVISIONS
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white font-mono break-words">
              CORE ROBOTICS DIVISIONS & WINGS
            </h2>
            <p className="text-sm text-gray-400 max-w-2xl mx-auto">
              Choose your focus area, learn practical mechanical and embedded fundamentals, and compete on national platforms.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Wing 1: Line Follower Robot (LFR) */}
            <div className="rounded-2xl border border-blue-500/20 bg-slate-950/60 p-6 space-y-4 hover:border-blue-500/50 transition-all duration-300">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-blue-400 font-bold">DIVISION 01</span>
                <Badge variant="outline" className="border-blue-500/30 text-[10px] text-blue-300 bg-blue-500/10">AUTONOMOUS</Badge>
              </div>
              <h4 className="font-mono font-bold text-base text-white">Line Follower Robot (LFR)</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                High-speed optical sensor arrays, PID loop tuning, sharp cornering algorithms, and autonomous navigation over complex obstacle tracks.
              </p>
              <div className="pt-2 font-mono text-[10px] text-gray-500 border-t border-white/5">
                STACK: 8-IR Sensor Bar • STM32/ESP32 • Discrete PID • Coreless Motors
              </div>
            </div>

            {/* Wing 2: Robo Soccer */}
            <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/60 p-6 space-y-4 hover:border-cyan-500/50 transition-all duration-300">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-cyan-400 font-bold">DIVISION 02</span>
                <Badge variant="outline" className="border-cyan-500/30 text-[10px] text-cyan-300 bg-cyan-500/10">COMPETITIVE</Badge>
              </div>
              <h4 className="font-mono font-bold text-base text-white">Robo Soccer</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                RF and Bluetooth controlled omni-drive robots, high-torque solenoid kicker & active roller dribbler mechanisms, and team-based arena tactics.
              </p>
              <div className="pt-2 font-mono text-[10px] text-gray-500 border-t border-white/5">
                STACK: Omni Wheels • Solenoid Kickers • NRF24L01+ • LiPo 3S
              </div>
            </div>

            {/* Wing 3: Combat Robotics & Hardware */}
            <div className="rounded-2xl border border-red-500/20 bg-slate-950/60 p-6 space-y-4 hover:border-red-500/50 transition-all duration-300">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-red-400 font-bold">DIVISION 03</span>
                <Badge variant="outline" className="border-red-500/30 text-[10px] text-red-300 bg-red-500/10">COMBAT</Badge>
              </div>
              <h4 className="font-mono font-bold text-base text-white">Combat Robotics & Heavy Hardware</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Reinforced aluminum and steel chassis fabrication, high-amp brushless motor controllers, pneumatic lifters, and destructive arena combat bots.
              </p>
              <div className="pt-2 font-mono text-[10px] text-gray-500 border-t border-white/5">
                STACK: CNC Machining • High-Amp ESCs • Brushless Spinners • Hardened Armor
              </div>
            </div>

            {/* Wing 4: Embedded Systems & IoT */}
            <div className="rounded-2xl border border-indigo-500/20 bg-slate-950/60 p-6 space-y-4 hover:border-indigo-500/50 transition-all duration-300">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-indigo-400 font-bold">DIVISION 04</span>
                <Badge variant="outline" className="border-indigo-500/30 text-[10px] text-indigo-300 bg-indigo-500/10">EMBEDDED</Badge>
              </div>
              <h4 className="font-mono font-bold text-base text-white">Embedded Systems & IoT</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Microcontroller architectures (ESP32, STM32, Arduino), multi-sensor fusion, wireless telemetry dashboards, and industrial automation prototypes.
              </p>
              <div className="pt-2 font-mono text-[10px] text-gray-500 border-t border-white/5">
                STACK: C/C++ • FreeRTOS • MQTT / LoRa • Custom PCB Design
              </div>
            </div>

            {/* Wing 5: Drones & Autonomous UAVs */}
            <div className="rounded-2xl border border-sky-500/20 bg-slate-950/60 p-6 space-y-4 hover:border-sky-500/50 transition-all duration-300 md:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-sky-400 font-bold">DIVISION 05</span>
                <Badge variant="outline" className="border-sky-500/30 text-[10px] text-sky-300 bg-sky-500/10">AERIAL</Badge>
              </div>
              <h4 className="font-mono font-bold text-base text-white">Drones & Autonomous UAVs</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Custom quadcopter assembly, flight controllers (Betaflight, ArduPilot), optical flow positioning, GPS waypoints, and autonomous aerial navigation.
              </p>
              <div className="pt-2 font-mono text-[10px] text-gray-500 border-t border-white/5">
                STACK: Carbon Fiber Frames • BLDC Motors • Betaflight • GPS Telemetry
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INSTANT CERTIFICATE VERIFICATION SPOTLIGHT */}
      <section className="relative z-10 border-t border-blue-500/10 bg-[#060c16]/80 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-r from-slate-950 via-[#071630] to-slate-950 p-8 shadow-2xl backdrop-blur-xl">
            <div className="grid gap-8 md:grid-cols-12 md:items-center">
              <div className="space-y-3 md:col-span-7">
                <Badge variant="outline" className="border-blue-500/40 bg-blue-500/10 text-blue-300 font-mono text-xs">
                  <FileCheck className="mr-1.5 h-3.5 w-3.5 text-cyan-400" />
                  AUTHENTICITY VERIFICATION
                </Badge>
                <h3 className="text-2xl font-bold font-mono text-white">
                  Instant Certificate Verification
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Employers, university officials, and workshop attendees can authenticate any official certificate issued by the DIU Robotics Club directly against our central record system.
                </p>
              </div>

              <div className="md:col-span-5">
                <form onSubmit={handleVerifySubmit} className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                      value={certSearchCode}
                      onChange={(e) => setCertSearchCode(e.target.value)}
                      placeholder="e.g. DIURC-2026-WORKSHOP-XXXX"
                      className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-gray-600 focus:border-blue-500/50 font-mono text-xs h-11"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold font-mono text-xs h-10 shadow-lg shadow-blue-500/20"
                  >
                    Verify Certificate Authenticity
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LIVE UPCOMING EVENTS & WORKSHOPS */}
      {(eventsLoading || events.length > 0) && (
        <section className="relative z-10 py-20 border-t border-blue-500/10 min-h-[380px]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
              <div>
                <Badge variant="outline" className="border-blue-500/40 bg-blue-500/5 text-blue-400 font-mono text-xs">
                  <Calendar className="mr-1 h-3.5 w-3.5 text-cyan-400" />
                  UPCOMING SCHEDULE
                </Badge>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white font-mono mt-1 break-words">
                  ROBOTICS WORKSHOPS & DERBIES
                </h2>
              </div>
              <Button
                variant="outline"
                onClick={() => setCurrentView('events')}
                className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10 font-mono text-xs"
              >
                View Full Event Calendar ➔
              </Button>
            </div>

            {eventsLoading ? (
              <div className="grid gap-6 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="rounded-xl border border-white/5 bg-slate-950/60 p-6 space-y-4">
                    <div className="flex justify-between">
                      <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
                      <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
                    </div>
                    <div className="h-6 w-3/4 bg-white/10 rounded animate-pulse" />
                    <div className="h-12 w-full bg-white/5 rounded animate-pulse" />
                    <div className="h-4 w-1/2 bg-white/10 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-3">
                {events.map((event) => (
                  <Card
                    key={event.id}
                    onClick={() => setCurrentView('events')}
                    className="cursor-pointer border-blue-500/20 bg-slate-950/80 backdrop-blur hover:border-blue-500/50 transition-all duration-200 group"
                  >
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                        <span className="text-blue-400 font-bold">{event.category || 'WORKSHOP'}</span>
                        <span>{new Date(event.startDate).toLocaleDateString()}</span>
                      </div>

                      <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                        {event.title}
                      </h3>

                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                        {event.description || 'Hands-on practical robotics session.'}
                      </p>

                      <div className="flex items-center justify-between border-t border-white/5 pt-3 text-xs font-mono text-gray-400">
                        <span>Venue: {event.venue}</span>
                        <span className="text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Register ➔
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 8. FREQUENTLY ASKED QUESTIONS (FAQ) */}
      <section className="relative z-10 border-t border-blue-500/10 bg-[#060c16]/70 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-14">
            <Badge variant="outline" className="border-blue-500/40 bg-blue-500/5 text-blue-400 font-mono text-xs">
              <HelpCircle className="mr-1 h-3.5 w-3.5 text-cyan-400" />
              COMMON INQUIRIES
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white font-mono break-words">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <p className="text-sm text-gray-400 max-w-xl mx-auto">
              Clear answers to common questions about lab access, component kits, competition teams, and workshop schedules.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-white/5 bg-slate-950/80 backdrop-blur overflow-hidden transition-colors hover:border-blue-500/30"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 select-none"
                  >
                    <span className="font-mono text-sm font-bold text-white flex items-center gap-2">
                      <span className="text-blue-400 text-xs">0{index + 1}.</span>
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-blue-400 shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
                    )}
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 pt-0 text-xs text-gray-300 leading-relaxed font-sans border-t border-white/5 mt-1">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. CALL TO ACTION: ENLIST TODAY */}
      <section className="relative z-10 border-t border-blue-500/20 bg-gradient-to-b from-[#060c16] to-[#040810] py-20 text-center">
        <div className="mx-auto max-w-4xl px-4 space-y-6">
          <Badge variant="outline" className="border-blue-500/50 bg-blue-500/10 text-blue-300 font-mono text-xs px-3.5 py-1">
            <Sparkles className="mr-1.5 h-3.5 w-3.5 text-cyan-400" />
            JOIN THE CLUB TODAY
          </Badge>

          <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-mono break-words">
            READY TO BUILD AUTONOMOUS SYSTEMS?
          </h2>

          <p className="text-sm text-gray-400 max-w-xl mx-auto leading-relaxed font-sans">
            Enlist now to unlock official hands-on maker labs, component kits, certified training sessions, and your personal 3D Digital Member Identifier.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => setCurrentView('apply-membership')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold font-mono text-sm px-8 h-12 shadow-xl shadow-blue-500/25"
            >
              Apply for Club Membership
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setCurrentView('about')}
              className="border-white/10 text-gray-300 hover:bg-white/5 font-mono text-sm px-6 h-12"
            >
              Read About the Club
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
