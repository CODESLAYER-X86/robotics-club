'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Compass,
  ExternalLink,
  Bot,
  Layers,
  Terminal,
  Cpu,
  Globe2,
  Binary,
  Flame,
  Award,
  Sparkles,
  Search,
  CheckCircle2,
  Trophy,
  Radio,
  FileText,
  Code2,
  Wrench,
  GraduationCap,
  Gauge,
  Sliders,
  Plane,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type ResourceCategory = 'ALL' | 'ROADMAPS' | 'FREE_PLATFORMS' | 'PRO_PLATFORMS' | 'BOOKS' | 'TOOLS';

export function ResourcesPage() {
  const [activeTab, setActiveTab] = useState<ResourceCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Robotics Roadmaps Data
  const roadmaps = [
    {
      id: 'roadmap-embedded',
      title: 'Track 1: Embedded Systems & Microcontroller Fundamentals',
      level: 'Beginner',
      badgeColor: 'border-blue-500/30 text-blue-400 bg-blue-500/10',
      description:
        'The foundational hardware and firmware journey for new robotics recruits. Covers basic electronics, microcontroller architectures, sensor interfacing, and actuator controls.',
      steps: [
        {
          stage: 'Phase 1',
          name: 'Circuit Theory & Hardware Fundamentals',
          topics: ['Ohm\'s Law & Power Dissipation', 'Multimeter diagnostics & continuity testing', 'Resistors, Capacitors, Diodes & Transistors', 'Breadboard prototyping & soldering safety'],
        },
        {
          stage: 'Phase 2',
          name: 'Microcontroller Programming (C / C++)',
          topics: ['Arduino & AVR Architecture', 'Digital I/O & Analog ADC Readings', 'PWM Speed Control & Hardware Timers', 'Communication Protocols: UART, I2C, SPI'],
        },
        {
          stage: 'Phase 3',
          name: 'Actuators, Drivers & Motor Dynamics',
          topics: ['Brushed DC Motors & Gearboxes', 'H-Bridge Drivers (L298N, TB6612FNG, VNH5019)', 'Servo Motor PWM Angle Control', 'Stepper Motors & A4988 Drivers'],
        },
        {
          stage: 'Phase 4',
          name: 'Power Architecture & Battery Management',
          topics: ['LiPo Battery C-Ratings & Care (2S/3S/4S)', 'Buck/Boost DC-DC Voltage Regulators', 'Current Draw Calculation & Heat Dissipation', 'Optocoupler Isolation & Flyback Diodes'],
        },
      ],
    },
    {
      id: 'roadmap-lfr',
      title: 'Track 2: Competitive Line Follower Robot (LFR) Engineering',
      level: 'Intermediate',
      badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
      description:
        'A battle-tested curriculum for engineering championship Line Follower Robots. Master analog/digital optical sensor arrays, high-speed PID control, and dynamic braking.',
      steps: [
        {
          stage: 'Phase 1',
          name: 'Optical Sensor Array Calibration',
          topics: ['QTR-8A / QTR-8RC Sensor Calibration', 'Ambient light noise filtration', 'Analog weighted-average line position math', 'Digital multiplexing & ADC sampling speed'],
        },
        {
          stage: 'Phase 2',
          name: 'Discrete PID Steering Control',
          topics: ['Proportional (Kp) Response Tuning', 'Derivative (Kd) Oscillation Damping', 'Integral (Ki) Steady-State Correction', 'Microcontroller Loop Rate Optimization (1000Hz+)'],
        },
        {
          stage: 'Phase 3',
          name: 'Chassis Kinematics & High-RPM Motors',
          topics: ['Low Center-of-Gravity Chassis Balance', 'Silicon Tire Friction & Traction Dynamics', 'High-RPM Micro Metal Coreless Motors', 'Magnetic Downforce on Steel Tracks'],
        },
        {
          stage: 'Phase 4',
          name: 'Track Arena Tactics & Obstacle Handling',
          topics: ['90-Degree Acute Hairpin Turns', 'Loop, Cross & Grid Intersection Detection', 'Breakline Jump Acceleration', 'Dynamic Motor Reverse Counter-Braking'],
        },
      ],
    },
    {
      id: 'roadmap-soccer-combat',
      title: 'Track 3: Robo Soccer & Combat Robotics',
      level: 'Intermediate to Advanced',
      badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
      description:
        'Tactical engineering for competitive multi-robot sports and heavy combat arenas. Focuses on omni-directional kinematics, high-torque mechanisms, and wireless RF control.',
      steps: [
        {
          stage: 'Phase 1',
          name: 'Omni-Directional Drive Kinematics',
          topics: ['3-Wheel & 4-Wheel Kiwi Drive Vector Math', 'Mecanum Wheel Trigonometric Translation', 'Independent Motor Velocity Decoupling', 'High-Torque Planetary Planetary Gearmotors'],
        },
        {
          stage: 'Phase 2',
          name: 'Low-Latency Wireless RF Telemetry',
          topics: ['ESP32 ESP-NOW Peer-to-Peer Protocol', '2.4GHz NRF24L01+ with PA/LNA Amplification', 'Failsafe Watchdog & Packet Loss Handling', 'Custom Dual-Joystick Ergonomic Transmitters'],
        },
        {
          stage: 'Phase 3',
          name: 'Kicker & Dribbler Ball Manipulation',
          topics: ['High-RPM Dribbler Rollers (Silicon Coated)', 'Spring-Loaded & Solenoid Pulse Kickers', 'Pneumatic Actuator Valves & CO2 Tanks', 'Flywheel Ball Launching Velocity Control'],
        },
        {
          stage: 'Phase 4',
          name: 'Mechanical Armor & Weapon Systems',
          topics: ['CNC 6061 Aluminum & Polycarbonate Armor', 'Brushless Outrunner Weapon Motors & ESCs', 'Bearing Load Ratings & Shaft Couplers', 'Arena Impact Shock Absorption'],
        },
      ],
    },
    {
      id: 'roadmap-ros-vision',
      title: 'Track 4: Autonomous Systems, ROS 2 & Computer Vision',
      level: 'Advanced',
      badgeColor: 'border-blue-500/30 text-blue-300 bg-blue-500/10',
      description:
        'Designed for engineers building intelligent autonomous rovers, SLAM navigation systems, computer vision tracking, and autonomous aerial drones.',
      steps: [
        {
          stage: 'Phase 1',
          name: 'Linux Environment & ROS 2 Architecture',
          topics: ['Ubuntu Linux for Robotics (Noble / Jammy)', 'ROS 2 Nodes, Topics, Services & Actions', 'URDF & Xacro Robot Kinematic Modeling', 'RViz 2 Visualization & Gazebo Simulation'],
        },
        {
          stage: 'Phase 2',
          name: 'Computer Vision with OpenCV',
          topics: ['HSV Color Space Segmentation & Filtering', 'Contour Detection & Real-Time Ball Tracking', 'AprilTag & ArUco Marker Pose Estimation', 'Stereo Depth Cameras (Intel RealSense / OAK-D)'],
        },
        {
          stage: 'Phase 3',
          name: '2D/3D LiDAR Mapping & SLAM',
          topics: ['LiDAR Point Cloud Processing', 'Cartographer & Slam-Toolbox 2D Mapping', 'Nav2 Path Planning & Costmaps', 'AMCL Probabilistic Localization'],
        },
        {
          stage: 'Phase 4',
          name: 'Autonomous Aerial Drones & UAVs',
          topics: ['Quadcopter Flight Controller Kinematics', 'Betaflight & ArduPilot Configuration', 'Optical Flow & Barometric Altitude Hold', 'Autonomous GPS Waypoint Mission Planning'],
        },
      ],
    },
  ];

  // 2. Free Learning Platforms Data
  const freePlatforms = [
    {
      name: 'Arduino Project Hub & Reference Docs',
      category: 'Microcontroller Tutorials',
      type: 'FREE',
      url: 'https://projecthub.arduino.cc/',
      description: 'The premier open-source database of wiring diagrams, code libraries, and real-world embedded sensor interfacing walkthroughs.',
      tags: ['Schematics', 'Arduino C++', 'Sensors', 'Beginner Friendly'],
    },
    {
      name: 'ROS 2 Official Documentation',
      category: 'Robotics Framework',
      type: 'FREE',
      url: 'https://docs.ros.org/',
      description: 'Comprehensive documentation and guided tutorials for ROS 2 (Humble / Iron / Jazzy), covering publishers, subscribers, and navigation stacks.',
      tags: ['ROS 2', 'C++ / Python', 'Nav2', 'Simulation'],
    },
    {
      name: 'Webots Open-Source Robot Simulator',
      category: '3D Simulation',
      type: 'FREE',
      url: 'https://cyberbotics.com/',
      description: 'Industry-standard free 3D robot simulation environment. Test line followers, soccer bots, and differential rovers virtually before physical fabrication.',
      tags: ['3D Simulator', 'Physics Engine', 'C++ / Python', 'Free & Open'],
    },
    {
      name: 'Autodesk Tinkercad Circuits',
      category: 'Interactive Circuit Simulator',
      type: 'FREE',
      url: 'https://www.tinkercad.com/circuits',
      description: 'Browser-based virtual electronics workbench. Simulate Arduino sketches, motor drivers, and complex sensor circuits without damaging hardware.',
      tags: ['Browser Simulator', 'Virtual Arduino', 'Oscilloscope', 'Interactive'],
    },
    {
      name: 'All About Circuits Education Hub',
      category: 'Electronics Theory',
      type: 'FREE',
      url: 'https://www.allaboutcircuits.com/education/',
      description: 'Peer-reviewed, in-depth textbooks on analog circuits, digital logic gates, operational amplifiers, and microcontroller hardware engineering.',
      tags: ['Circuit Theory', 'Semiconductors', 'Textbooks', 'Calculators'],
    },
    {
      name: 'ArduPilot & Betaflight Documentation',
      category: 'UAV & Autonomous Drones',
      type: 'FREE',
      url: 'https://ardupilot.org/',
      description: 'The world\'s most capable open-source autopilot software documentation for autonomous multirotors, fixed-wing drones, and ground rovers.',
      tags: ['Drone Firmware', 'GPS Waypoints', 'Telemetry', 'PID Flight Control'],
    },
  ];

  // 3. Premium / Pro Platforms Data
  const proPlatforms = [
    {
      name: 'Coursera: Modern Robotics Specialization',
      category: 'University Certification',
      type: 'PRO / AUDITABLE',
      url: 'https://www.coursera.org/specializations/modernrobotics',
      description: 'Northwestern University\'s rigorous curriculum on robot kinematics, trajectory generation, dynamic modeling, and motion planning algorithms.',
      tags: ['Kinematics', 'Trajectory Planning', 'Northwestern University', 'Certified'],
    },
    {
      name: 'edX / MITx: Autonomous Mobile Robots',
      category: 'Autonomous Systems',
      type: 'PROFESSIONAL',
      url: 'https://www.edx.org/',
      description: 'Advanced graduate-level curriculum covering state estimation, Kalman filters, particle filters, visual odometry, and graph SLAM.',
      tags: ['State Estimation', 'Kalman Filters', 'SLAM', 'Academic Rigor'],
    },
    {
      name: 'Udacity: Robotics Software Engineer Nanodegree',
      category: 'Industry Nanodegree',
      type: 'INDUSTRY CERT',
      url: 'https://www.udacity.com/course/robotics-software-engineer--nd209',
      description: 'Hands-on project-based degree building production-ready localization, mapping, path planning, and manipulator pick-and-place systems.',
      tags: ['ROS 2 Projects', 'Gazebo', 'Path Planning', 'Career Ready'],
    },
    {
      name: 'Autodesk Certified Associate in CAD (Fusion 360)',
      category: 'Mechanical CAD Certification',
      type: 'INDUSTRY CERT',
      url: 'https://www.autodesk.com/certification',
      description: 'Global benchmark credential verifying mechanical design, parametric 3D assembly, and generative design for robotics chassis engineering.',
      tags: ['3D CAD', 'Parametric Modeling', 'CNC & 3D Printing', 'Global Credential'],
    },
    {
      name: 'Altium Academy Professional PCB Design',
      category: 'Hardware & PCB Masterclasses',
      type: 'PRO HARDWARE',
      url: 'https://www.altium.com/altium-academy',
      description: 'In-depth engineering courses on multi-layer PCB design, high-frequency signal integrity, power routing for high-current motor drivers, and EMI mitigation.',
      tags: ['PCB Layout', 'Signal Integrity', 'Motor Driver Design', 'High Current'],
    },
    {
      name: 'IEEE Robotics and Automation Society (RAS)',
      category: 'Professional Engineering Society',
      type: 'PROFESSIONAL',
      url: 'https://www.ieee-ras.org/',
      description: 'Access premier international robotics research journals, conferences (ICRA, IROS), competition benchmarks, and global engineering networks.',
      tags: ['IEEE RAS', 'Research Papers', 'International Standards', 'Conferences'],
    },
  ];

  // 4. Recommended Books Data
  const books = [
    {
      title: 'Introduction to Autonomous Mobile Robots',
      author: 'Roland Siegwart, Illah Nourbakhsh & Davide Scaramuzza',
      category: 'Mobile Kinematics',
      edition: '2nd Edition (MIT Press)',
      description:
        'The definitive university textbook for mobile robot geometry, differential drive kinematics, wheel slip dynamics, optical sensor models, and autonomous navigation.',
      targetAudience: 'LFR Engineers, Mobile Rover Developers, Mechatronics Students',
    },
    {
      title: 'Probabilistic Robotics',
      author: 'Sebastian Thrun, Wolfram Burgard & Dieter Fox',
      category: 'SLAM & Sensor Fusion',
      edition: 'MIT Press Edition',
      description:
        'The foundational bible for uncertain sensor environments. Covers recursive state estimation, Extended Kalman Filters (EKF), Particle Filters, and FastSLAM.',
      targetAudience: 'Autonomous System Developers, Vision Engineers, Advanced Researchers',
    },
    {
      title: 'Making Things Move: DIY Mechanisms for Inventors',
      author: 'Dustyn Roberts',
      category: 'Mechanical Engineering',
      edition: '1st Edition (McGraw-Hill)',
      description:
        'Practical mechanics for bot builders: torque and RPM calculations, center of gravity, friction coefficients, bearings, gear ratios, and material selection.',
      targetAudience: 'Combat Bot Builders, Robo Soccer Mechanics, Hardware Fabricators',
    },
    {
      title: 'Practical Electronics for Inventors',
      author: 'Paul Scherz & Simon Monk',
      category: 'Hardware Design',
      edition: '4th Edition',
      description:
        'The most hands-on, practical field guide to analog and digital electronics, MOSFET switches, sensor datasheets, battery chemistries, and power regulators.',
      targetAudience: 'Hardware Enthusiasts, Circuit Designers, Embedded Engineers',
    },
    {
      title: 'Feedback Control of Dynamic Systems',
      author: 'Gene Franklin, J. David Powell & Abbas Emami-Naeini',
      category: 'PID Control Theory',
      edition: '8th Edition',
      description:
        'Deep mathematical and intuitive guide to feedback control, root locus, Bode frequency analysis, and discrete PID controller tuning for real-time robotic systems.',
      targetAudience: 'Control Systems Engineers, LFR Algorithm Tuners',
    },
    {
      title: 'Robot Operating System (ROS) for Absolute Beginners',
      author: 'Lentin Joseph',
      category: 'Software Framework',
      edition: '2nd Edition (Apress)',
      description:
        'A gentle, practical step-by-step walkthrough of writing custom ROS nodes, subscribing to sensor feeds, and controlling simulated robots in Gazebo.',
      targetAudience: 'Software Developers Transitioning to Robotics, ROS Beginners',
    },
  ];

  // 5. Tool Arsenal Data
  const tools = [
    { name: 'PlatformIO / VS Code', type: 'Firmware IDE', use: 'Professional C/C++ embedded development environment for STM32, ESP32, and Arduino.' },
    { name: 'KiCad EDA', type: 'PCB Design', use: 'Open-source schematic capture and multi-layer PCB layout design suite with 3D raytracing.' },
    { name: 'Autodesk Fusion 360', type: 'Mechanical CAD', use: 'Cloud-based 3D parametric CAD and CAM for designing robot chassis, brackets, and armor.' },
    { name: 'UltiMaker Cura', type: '3D Print Slicer', use: 'Industry-standard slicer converting 3D robot models into G-code for rapid FDM prototyping.' },
    { name: 'Betaflight Configurator', type: 'Drone Flight Tool', use: 'Real-time telemetry, motor mapping, and PID rate tuning for quadcopter flight controllers.' },
    { name: 'Saleae Logic Software', type: 'Signal Analyzer', use: 'Logic analyzer tool for decoding and inspecting high-speed UART, I2C, SPI, and PWM waveforms.' },
    { name: 'Webots Robot Simulator', type: 'Kinematic Simulator', use: 'Physics-accurate multi-platform simulation engine for testing autonomous differential drive code.' },
    { name: 'OpenCV Vision Suite', type: 'Computer Vision', use: 'Open-source computer vision library for color tracking, line detection, and AprilTag pose estimation.' },
  ];

  // Filter helper
  const matchesSearch = (text: string) => {
    if (!searchQuery.trim()) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#040810] text-gray-100 selection:bg-blue-600 selection:text-white">
      {/* Background Matrix Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#1d4ed810_1px,transparent_1px),linear-gradient(to_bottom,#1d4ed810_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* HEADER HERO */}
      <section className="relative z-10 border-b border-blue-500/20 bg-slate-950/60 pt-12 pb-16 px-4 sm:px-6 lg:px-8 backdrop-blur-md">
        <div className="mx-auto max-w-7xl space-y-4 text-center">
          <Badge variant="outline" className="border-blue-500/40 bg-blue-500/10 text-blue-300 font-mono text-xs px-3.5 py-1">
            <Compass className="mr-1.5 h-3.5 w-3.5 text-blue-400" />
            DIURC KNOWLEDGE VAULT
          </Badge>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl font-mono">
            ROBOTICS & EMBEDDED SYSTEMS RESOURCE HUB
          </h1>
          <p className="text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Curated engineering roadmaps, circuit simulators, kinematics literature, and CAD tools curated for Dhaka International University Robotics Club members.
          </p>

          {/* Search Bar */}
          <div className="mx-auto max-w-md pt-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search LFR, Robo Soccer, Arduino, ROS, CAD tools..."
                className="border-white/10 bg-slate-900/80 pl-10 text-xs font-mono text-white placeholder:text-gray-500 focus:border-blue-500/50 h-11"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY SELECTOR TABS */}
      <section className="relative z-10 border-b border-white/5 bg-[#060c16]/80 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-center gap-2 font-mono text-xs">
          {[
            { id: 'ALL', label: 'All Resources' },
            { id: 'ROADMAPS', label: 'Structured Roadmaps' },
            { id: 'FREE_PLATFORMS', label: 'Simulators & Free Platforms' },
            { id: 'PRO_PLATFORMS', label: 'Pro & Certification Platforms' },
            { id: 'BOOKS', label: 'Essential Literature' },
            { id: 'TOOLS', label: 'Engineering Tool Arsenal' },
          ].map((tab) => (
            <Button
              key={tab.id}
              size="sm"
              variant={activeTab === tab.id ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab.id as ResourceCategory)}
              className={
                activeTab === tab.id
                  ? 'bg-blue-600 text-white font-bold hover:bg-blue-500'
                  : 'border-white/10 bg-slate-950/60 text-gray-300 hover:bg-white/5'
              }
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-20">
        {/* 1. STRUCTURED ROADMAPS */}
        {(activeTab === 'ALL' || activeTab === 'ROADMAPS') && (
          <section className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-blue-400" />
                <h2 className="text-2xl font-bold font-mono text-white">STRUCTURED ENGINEERING ROADMAPS</h2>
              </div>
              <p className="text-xs text-gray-400">Step-by-step milestones to advance from circuit basics to national robotics champions.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {roadmaps
                .filter((r) => matchesSearch(r.title + r.description + r.steps.map((s) => s.name + s.topics.join(' ')).join(' ')))
                .map((roadmap) => (
                  <Card key={roadmap.id} className="border-blue-500/20 bg-slate-950/80 backdrop-blur shadow-xl hover:border-blue-500/40 transition-colors">
                    <CardHeader className="border-b border-white/5 pb-4">
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="outline" className={`font-mono text-[10px] ${roadmap.badgeColor}`}>
                          {roadmap.level}
                        </Badge>
                        <span className="font-mono text-[11px] text-cyan-400">DIURC TRACK</span>
                      </div>
                      <CardTitle className="font-mono text-lg text-white mt-2">{roadmap.title}</CardTitle>
                      <p className="text-xs text-gray-400 font-sans mt-1 leading-relaxed">{roadmap.description}</p>
                    </CardHeader>

                    <CardContent className="p-6 space-y-4">
                      {roadmap.steps.map((step, idx) => (
                        <div key={idx} className="rounded-lg border border-white/5 bg-slate-900/50 p-3.5 space-y-2">
                          <div className="flex items-center justify-between font-mono text-xs">
                            <span className="text-blue-400 font-bold">{step.stage}: {step.name}</span>
                            <CheckCircle2 className="h-3.5 w-3.5 text-blue-500/60" />
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {step.topics.map((topic, tIdx) => (
                              <span key={tIdx} className="rounded bg-white/5 px-2 py-0.5 font-mono text-[10px] text-gray-300 border border-white/5">
                                • {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
            </div>
          </section>
        )}

        {/* 2. FREE LEARNING & SIMULATOR PLATFORMS */}
        {(activeTab === 'ALL' || activeTab === 'FREE_PLATFORMS') && (
          <section className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Globe2 className="h-5 w-5 text-cyan-400" />
                <h2 className="text-2xl font-bold font-mono text-white">FREE SIMULATORS & INTERACTIVE PLATFORMS</h2>
              </div>
              <p className="text-xs text-gray-400">100% free virtual labs, physics simulators, and open-source robotics documentation.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {freePlatforms
                .filter((p) => matchesSearch(p.name + p.description + p.tags.join(' ')))
                .map((platform, idx) => (
                  <Card key={idx} className="border-cyan-500/20 bg-slate-950/80 backdrop-blur hover:border-cyan-500/50 transition-all flex flex-col justify-between">
                    <CardHeader className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10 font-mono text-[10px]">
                          {platform.type}
                        </Badge>
                        <span className="font-mono text-[10px] text-gray-500">{platform.category}</span>
                      </div>
                      <CardTitle className="font-mono text-base text-white">{platform.name}</CardTitle>
                      <p className="text-xs text-gray-400 font-sans leading-relaxed">{platform.description}</p>
                    </CardHeader>

                    <CardContent className="space-y-4 pt-0">
                      <div className="flex flex-wrap gap-1">
                        {platform.tags.map((tag, tIdx) => (
                          <span key={tIdx} className="rounded bg-cyan-950/40 text-cyan-300 border border-cyan-500/20 px-2 py-0.5 font-mono text-[10px]">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <a
                        href={platform.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex w-full items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 font-mono text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition-colors gap-1.5"
                      >
                        Launch Resource <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </section>
        )}

        {/* 3. PRO & CERTIFICATION PLATFORMS */}
        {(activeTab === 'ALL' || activeTab === 'PRO_PLATFORMS') && (
          <section className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-400" />
                <h2 className="text-2xl font-bold font-mono text-white">PRO CERTIFICATIONS & ACADEMIC PLATFORMS</h2>
              </div>
              <p className="text-xs text-gray-400">Industry-recognized professional engineering courses, university specializations, and societies.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {proPlatforms
                .filter((p) => matchesSearch(p.name + p.description + p.tags.join(' ')))
                .map((platform, idx) => (
                  <Card key={idx} className="border-amber-500/20 bg-slate-950/80 backdrop-blur hover:border-amber-500/50 transition-all flex flex-col justify-between">
                    <CardHeader className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="border-amber-500/30 text-amber-400 bg-amber-500/10 font-mono text-[10px]">
                          {platform.type}
                        </Badge>
                        <span className="font-mono text-[10px] text-gray-500">{platform.category}</span>
                      </div>
                      <CardTitle className="font-mono text-base text-white">{platform.name}</CardTitle>
                      <p className="text-xs text-gray-400 font-sans leading-relaxed">{platform.description}</p>
                    </CardHeader>

                    <CardContent className="space-y-4 pt-0">
                      <div className="flex flex-wrap gap-1">
                        {platform.tags.map((tag, tIdx) => (
                          <span key={tIdx} className="rounded bg-amber-950/40 text-amber-300 border border-amber-500/20 px-2 py-0.5 font-mono text-[10px]">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <a
                        href={platform.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex w-full items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 font-mono text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-colors gap-1.5"
                      >
                        Explore Platform <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </section>
        )}

        {/* 4. ESSENTIAL LITERATURE & TEXTBOOKS */}
        {(activeTab === 'ALL' || activeTab === 'BOOKS') && (
          <section className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-400" />
                <h2 className="text-2xl font-bold font-mono text-white">ESSENTIAL ROBOTICS TEXTBOOKS & LITERATURE</h2>
              </div>
              <p className="text-xs text-gray-400">Authoritative textbooks and engineering handbooks recommended by club advisors.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {books
                .filter((b) => matchesSearch(b.title + b.author + b.description + b.category))
                .map((book, idx) => (
                  <Card key={idx} className="border-blue-500/20 bg-slate-950/80 backdrop-blur p-6 space-y-3 hover:border-blue-500/40 transition-colors">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <Badge variant="outline" className="border-blue-500/30 text-blue-300 bg-blue-500/10">
                        {book.category}
                      </Badge>
                      <span className="text-gray-500">{book.edition}</span>
                    </div>

                    <h3 className="font-mono font-bold text-base text-white">{book.title}</h3>
                    <p className="font-mono text-xs text-cyan-400">By {book.author}</p>
                    <p className="text-xs text-gray-400 font-sans leading-relaxed">{book.description}</p>

                    <div className="border-t border-white/5 pt-3 font-mono text-[10px] text-gray-500">
                      BEST FOR: <span className="text-gray-300">{book.targetAudience}</span>
                    </div>
                  </Card>
                ))}
            </div>
          </section>
        )}

        {/* 5. TOOL ARSENAL */}
        {(activeTab === 'ALL' || activeTab === 'TOOLS') && (
          <section className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-cyan-400" />
                <h2 className="text-2xl font-bold font-mono text-white">ROBOTICS HARDWARE & SOFTWARE ARSENAL</h2>
              </div>
              <p className="text-xs text-gray-400">Essential CAD packages, firmware compilers, and signal analysis software used at DIURC.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {tools
                .filter((t) => matchesSearch(t.name + t.type + t.use))
                .map((tool, idx) => (
                  <div key={idx} className="rounded-xl border border-white/5 bg-slate-950/70 p-4 space-y-2 hover:border-blue-500/30 transition-colors">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="font-bold text-white">{tool.name}</span>
                      <Badge variant="outline" className="border-white/10 text-[9px] text-cyan-400">{tool.type}</Badge>
                    </div>
                    <p className="text-xs text-gray-400 font-sans leading-relaxed">{tool.use}</p>
                  </div>
                ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
