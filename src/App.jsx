import { useState, useEffect, useCallback, createContext, useContext, useRef, useMemo } from "react";
import {
  Home, Calendar, TrendingUp, Users, CreditCard, CalendarDays,
  Menu, X, Bell, Settings, Shield, ChevronRight, ChevronDown, Clock,
  PartyPopper, ArrowUpRight, ArrowDownRight, Award, DollarSign, LayoutDashboard,
  UserCheck, Megaphone, LogOut, Send, Check, Search,
  CircleCheck, UserPlus, Heart, Flame, Star, Sun, Moon, Wind, Sparkles,
  Mountain, Music, Gift, Share2, MapPin, ExternalLink
} from "lucide-react";
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

// ═══════════════════════════════════════════════════════════════
//  STUDIO_CONFIG — Firelight Yoga PDX
// ═══════════════════════════════════════════════════════════════
const STUDIO_CONFIG = {
  name: "FIRELIGHT",
  subtitle: "YOGA",
  tagline: "Come for the yoga, stay for the community.",
  logoMark: "FLY",
  logoImage: null,
  description: "Heated and unheated classes all day, every day. Your Fire Room and Earth Room sanctuary in North Portland.",
  heroLine1: "IGNITE",
  heroLine2: "WITHIN",

  address: { street: "1475 N Killingsworth St", city: "Portland", state: "OR", zip: "97217" },
  phone: "(503) 972-1987",
  email: "info@firelightyoga.com",
  neighborhood: "North Portland",
  website: "https://firelightyoga.com",
  social: { instagram: "@firelightyoga" },

  theme: {
    accent:     { h: 24,  s: 85, l: 52 },   // Warm amber/fire orange
    accentAlt:  { h: 45,  s: 72, l: 50 },   // Golden yellow
    warning:    { h: 0,   s: 72, l: 55 },    // Ember red
    primary:    { h: 20,  s: 20, l: 10 },    // Warm dark charcoal
    surface:    { h: 30,  s: 18, l: 97 },    // Warm cream white
    surfaceDim: { h: 25,  s: 14, l: 93 },    // Warm off-white
  },

  features: {
    workshops: true,
    retreats: true,
    soundBaths: true,
    teacherTrainings: true,
    practiceTracking: true,
    communityFeed: true,
    guestPasses: true,
    milestones: true,
  },

  classCapacity: 35,
  specialtyCapacity: 22,
};

// ═══════════════════════════════════════════════════════════════
//  THEME SYSTEM
// ═══════════════════════════════════════════════════════════════
const hsl = (c, a) => a !== undefined ? `hsla(${c.h},${c.s}%,${c.l}%,${a})` : `hsl(${c.h},${c.s}%,${c.l}%)`;
const hslShift = (c, lShift) => `hsl(${c.h},${c.s}%,${Math.max(0, Math.min(100, c.l + lShift))}%)`;

const T = {
  accent: hsl(STUDIO_CONFIG.theme.accent),
  accentDark: hslShift(STUDIO_CONFIG.theme.accent, -14),
  accentLight: hslShift(STUDIO_CONFIG.theme.accent, 28),
  accentGhost: hsl(STUDIO_CONFIG.theme.accent, 0.08),
  accentBorder: hsl(STUDIO_CONFIG.theme.accent, 0.2),
  success: hsl(STUDIO_CONFIG.theme.accentAlt),
  successGhost: hsl(STUDIO_CONFIG.theme.accentAlt, 0.08),
  successBorder: hsl(STUDIO_CONFIG.theme.accentAlt, 0.18),
  warning: hsl(STUDIO_CONFIG.theme.warning),
  warningGhost: hsl(STUDIO_CONFIG.theme.warning, 0.08),
  warningBorder: hsl(STUDIO_CONFIG.theme.warning, 0.2),
  bg: hsl(STUDIO_CONFIG.theme.primary),
  bgCard: hsl(STUDIO_CONFIG.theme.surface),
  bgDim: hsl(STUDIO_CONFIG.theme.surfaceDim),
  text: "#2a1f14",
  textMuted: "#7a6b58",
  textFaint: "#a89880",
  border: "#e8dfd2",
  borderLight: "#f2ebe0",
};

// ═══════════════════════════════════════════════════════════════
//  DATE HELPERS
// ═══════════════════════════════════════════════════════════════
const today = new Date().toISOString().split("T")[0];
const offsetDate = (d) => { const dt = new Date(); dt.setDate(dt.getDate() + d); return dt.toISOString().split("T")[0]; };
const formatDateShort = (s) => { const d = new Date(s + "T00:00:00"); return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }); };
const formatDateLong = (s) => { const d = new Date(s + "T00:00:00"); return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }); };
const fmtTime = (t) => { const [h, m] = t.split(":"); const hr = +h; return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`; };

// ═══════════════════════════════════════════════════════════════
//  MOCK DATA — Firelight Yoga content
// ═══════════════════════════════════════════════════════════════
const TEACHERS = [
  { id: "t1", firstName: "Holly", lastName: "B", role: "Co-Owner & Teacher", certs: ["E-RYT-200", "RYT-500", "Hot Yoga Certified"], specialties: ["Hot FLY", "Power Vinyasa", "Sculpt"], yearsTeaching: 11, bio: "Holly co-founded Firelight Yoga with a vision to create a studio that isn't tied to any single guru or franchise. Her classes blend athleticism with heart — expect to be challenged, uplifted, and met exactly where you are.", photo: "/images/teachers/holly-b.jpg" },
  { id: "t2", firstName: "Jessica", lastName: "B", role: "Co-Owner & Teacher", certs: ["E-RYT-200", "RYT-500", "Trauma-Informed"], specialties: ["Hot Vinyasa", "Flow & Restore", "Yin"], yearsTeaching: 11, bio: "Jessica brings a grounding, intuitive energy to every class. After years of meditation and deep study, she and Holly created Firelight as a place representative of their community — not one individual. Her teaching is soulful and empowering.", photo: "/images/teachers/jessica-b.jpg" },
  { id: "t3", firstName: "Cassie", lastName: "G", role: "Operations Coordinator & Teacher", certs: ["RYT-200", "Sculpt Certified"], specialties: ["Sculpt", "Hot FLY", "Vinyasa Flow"], yearsTeaching: 5, bio: "Cassie keeps the studio running behind the scenes and brings infectious energy to the mat. Her Sculpt classes are legendary — high energy, great music, and a workout that will leave you feeling accomplished.", photo: "/images/teachers/cassie-g.jpg" },
  { id: "t4", firstName: "Ace", lastName: "C", role: "Teacher & Studio Associate", certs: ["RYT-200", "Yin Certified"], specialties: ["Deep Stretch", "Yin", "Gentle Flow"], yearsTeaching: 4, bio: "Ace creates a safe and inclusive space for all bodies. Their classes focus on mindful movement, deep release, and finding ease in stillness. A favorite for those seeking restoration.", photo: "/images/teachers/ace-c.jpg" },
  { id: "t5", firstName: "Amy", lastName: "H", role: "Teacher & Studio Associate", certs: ["RYT-200", "Sound Healing"], specialties: ["Flow & Restore", "Sound Bath", "Deep Stretch"], yearsTeaching: 7, bio: "Amy weaves sound healing and breathwork into her teaching. Her Flow & Restore classes are a perfect blend of gentle movement and deep rest, leaving students feeling balanced and renewed.", photo: "/images/teachers/amy-h.jpg" },
  { id: "t6", firstName: "Alessandra", lastName: "R", role: "Teacher & Studio Associate", certs: ["RYT-200", "Power Yoga"], specialties: ["Power Vinyasa", "Hot FLY", "Vinyasa Flow"], yearsTeaching: 3, bio: "Alessandra's classes are dynamic, creative, and full of heart. She encourages students to explore their edge while staying connected to their breath. Her playlists are always fire.", photo: "/images/teachers/alessandra-r.jpg" },
];

const TODAYS_FOCUS = {
  id: "focus-today", date: today, name: "Hot FLY Power Flow", type: "HOT FLY",
  style: "Fire Room", temp: "95–100°F", duration: 60,
  description: "Firelight's signature heated vinyasa — a dynamic, full-body flow designed to build strength, flexibility, and focused awareness. Radiant heat deepens your practice and leaves you feeling cleansed.",
  intention: "Let your fire burn steady — not frantic. Power is patience in motion.",
  teacherTip: "Hydrate well before class. Child's pose is always available. The heat is your ally, not your opponent.",
  playlist: "Firelight Flow — Holly's Spotify",
};

const PAST_PRACTICES = [
  { id: "p-y1", date: offsetDate(-1), name: "Power Yoga Sculpt", type: "SCULPT", style: "Fire Room", temp: "85–90°F", duration: 60, description: "High-energy, strength-based yoga with light hand weights. Where muscle meets mindfulness — cardio intervals, yoga flows, and core work set to motivating beats.", intention: "Strong body. Clear mind. Fierce spirit.", teacherTip: "Weights are always optional. The bodyweight alone is powerful." },
  { id: "p-y2", date: offsetDate(-2), name: "Deep Stretch + Myofascial Release", type: "STRETCH", style: "Earth Room", temp: "Unheated", duration: 60, description: "Full body stretch with self-guided myofascial release using tennis balls. Targets hips, glutes, shoulders, and areas of chronic tension.", intention: "Release is not weakness — it's wisdom.", teacherTip: "Let gravity and the tennis balls do the work. Breathe into the tight spots." },
  { id: "p-y3", date: offsetDate(-3), name: "Hot Vinyasa Flow", type: "HOT VINYASA", style: "Fire Room", temp: "95–100°F", duration: 60, description: "A fluid, breath-linked heated practice building heat from the inside out. Creative sequencing with options for all levels.", intention: "Flow like water. Burn like flame." },
];

const UPCOMING_PRACTICE = { id: "p-tmrw", date: offsetDate(1), name: "Flow & Restore", type: "SPECIAL", style: "Earth Room", temp: "Unheated", duration: 75, description: "The first half is a nurturing gentle vinyasa flow, building subtle heat. The second half brings you to the floor for restorative and yin shapes supported by bolsters, blankets, and blocks.", intention: "Balance is not stillness — it's the dance between effort and ease.", teacherTip: "Grab a bolster and two blankets before class starts. Nest into the floor for the second half." };

const CLASSES_TODAY = [
  { id: "cl1", time: "06:00", type: "Hot FLY (Fire Room)", coach: "Holly B", capacity: 35, registered: 31, waitlist: 2 },
  { id: "cl2", time: "07:30", type: "Power Vinyasa (Fire Room)", coach: "Alessandra R", capacity: 35, registered: 35, waitlist: 5 },
  { id: "cl3", time: "09:30", type: "Vinyasa Flow (Earth Room)", coach: "Amy H", capacity: 28, registered: 22, waitlist: 0 },
  { id: "cl4", time: "12:00", type: "Deep Stretch (Earth Room)", coach: "Ace C", capacity: 28, registered: 16, waitlist: 0 },
  { id: "cl5", time: "16:30", type: "Hot FLY (Fire Room)", coach: "Jessica B", capacity: 35, registered: 33, waitlist: 0 },
  { id: "cl6", time: "17:45", type: "Sculpt (Fire Room)", coach: "Cassie G", capacity: 35, registered: 35, waitlist: 6 },
  { id: "cl7", time: "19:30", type: "Flow & Restore (Earth Room)", coach: "Amy H", capacity: 28, registered: 20, waitlist: 0 },
];

const WEEKLY_SCHEDULE = [
  { day: "Monday", classes: [{ time: "06:00", type: "Hot FLY (Fire Room)", coach: "Holly" }, { time: "07:30", type: "Power Vinyasa (Fire Room)", coach: "Alessandra" }, { time: "09:30", type: "Vinyasa Flow (Earth Room)", coach: "Amy" }, { time: "12:00", type: "Deep Stretch (Earth Room)", coach: "Ace" }, { time: "16:30", type: "Hot FLY (Fire Room)", coach: "Jessica" }, { time: "17:45", type: "Sculpt (Fire Room)", coach: "Cassie" }, { time: "19:30", type: "Flow & Restore (Earth Room)", coach: "Amy" }] },
  { day: "Tuesday", classes: [{ time: "06:00", type: "Hot Vinyasa (Fire Room)", coach: "Jessica" }, { time: "07:30", type: "Hot FLY (Fire Room)", coach: "Holly" }, { time: "09:30", type: "Deep Stretch (Earth Room)", coach: "Ace" }, { time: "12:00", type: "Power Vinyasa (Fire Room)", coach: "Alessandra" }, { time: "16:30", type: "Hot FLY (Fire Room)", coach: "Cassie" }, { time: "17:45", type: "Yin (Earth Room)", coach: "Amy" }] },
  { day: "Wednesday", classes: [{ time: "06:00", type: "Hot FLY (Fire Room)", coach: "Holly" }, { time: "07:30", type: "Hot Vinyasa (Fire Room)", coach: "Jessica" }, { time: "09:30", type: "Vinyasa Flow (Earth Room)", coach: "Alessandra" }, { time: "12:00", type: "Deep Stretch + MFR (Earth Room)", coach: "Ace" }, { time: "16:30", type: "Hot FLY (Fire Room)", coach: "Cassie" }, { time: "17:45", type: "Flow & Restore (Earth Room)", coach: "Amy" }] },
  { day: "Thursday", classes: [{ time: "06:30", type: "Hot Vinyasa (Fire Room)", coach: "Jessica" }, { time: "07:30", type: "Hot FLY (Fire Room)", coach: "Holly" }, { time: "09:30", type: "Sculpt (Fire Room)", coach: "Cassie" }, { time: "12:00", type: "Deep Stretch (Earth Room)", coach: "Ace" }, { time: "16:30", type: "Hot FLY (Fire Room)", coach: "Alessandra" }, { time: "17:45", type: "Power Vinyasa (Fire Room)", coach: "Holly" }, { time: "19:30", type: "Yin (Earth Room)", coach: "Amy" }] },
  { day: "Friday", classes: [{ time: "07:00", type: "Hot FLY (Fire Room)", coach: "Holly" }, { time: "09:30", type: "Hot Vinyasa (Fire Room)", coach: "Jessica" }, { time: "12:00", type: "Deep Stretch (Earth Room)", coach: "Ace" }, { time: "16:30", type: "Sculpt (Fire Room)", coach: "Cassie" }] },
  { day: "Saturday", classes: [{ time: "08:30", type: "Hot FLY (Fire Room)", coach: "Holly" }, { time: "10:00", type: "Hot Vinyasa (Fire Room)", coach: "Jessica" }, { time: "11:30", type: "Vinyasa Flow (Earth Room)", coach: "Alessandra" }, { time: "12:30", type: "Deep Stretch (Earth Room)", coach: "Ace" }] },
  { day: "Sunday", classes: [{ time: "08:30", type: "Hot FLY (Fire Room)", coach: "Jessica" }, { time: "10:00", type: "Vinyasa Flow (Earth Room)", coach: "Amy" }, { time: "11:15", type: "Flow & Restore (Earth Room)", coach: "Ace" }, { time: "18:00", type: "Yin + Sound Bath (Earth Room)", coach: "Amy" }] },
];

const COMMUNITY_FEED = [
  { id: "cf1", user: "Riley M.", milestone: "200 Classes", message: "Two hundred classes at FLY. This studio is more than yoga — it's my second family. Thank you Holly & Jessica for building this.", date: today, celebrations: 38 },
  { id: "cf2", user: "Dana K.", milestone: "30-Day Streak", message: "30 days straight. Fire Room and Earth Room became my daily ritual. Feeling unstoppable.", date: today, celebrations: 22 },
  { id: "cf3", user: "Marco T.", milestone: "First Handstand!", message: "Finally kicked up into handstand during Alessandra's power flow! The whole room cheered. This community!", date: offsetDate(-1), celebrations: 45 },
  { id: "cf4", user: "Keiko S.", milestone: "1 Year Member", message: "One year at Firelight. I walked in nervous and now I can't imagine life without this practice and these people.", date: offsetDate(-1), celebrations: 52 },
];

const MILESTONE_BADGES = {
  "First Class": { icon: Flame, color: T.accent },
  "10 Classes": { icon: Wind, color: T.accent },
  "50 Classes": { icon: Mountain, color: T.accent },
  "100 Classes": { icon: Sun, color: T.success },
  "200 Classes": { icon: Star, color: T.success },
  "7-Day Streak": { icon: Flame, color: T.warning },
  "30-Day Streak": { icon: Sparkles, color: T.warning },
  "First Handstand": { icon: ArrowUpRight, color: "#e85d04" },
  "First Crow Pose": { icon: Star, color: "#f48c06" },
  "1 Year Member": { icon: Award, color: T.success },
};

const EVENTS = [
  { id: "ev1", name: "Full Moon Sound Bath", date: "2026-04-05", startTime: "19:00", type: "Sound Bath", description: "Bathe in the vibrations of crystal bowls, chimes, and gong under the April full moon. Deep relaxation, guided breathwork, and sonic healing to release tension and restore balance.", fee: 35, maxParticipants: 28, registered: 24, status: "Almost Full", image: "/images/events/sun-gong.jpg" },
  { id: "ev2", name: "Handstand Series: Building from the Ground Up", date: "2026-04-12", startTime: "13:00", type: "Workshop", description: "A progressive workshop series breaking down the handstand from wrist prep to full inversion. Learn drills, spotter techniques, and wall work to safely build your upside-down practice.", fee: 55, maxParticipants: 20, registered: 14, status: "Registration Open", image: "/images/events/handstand-series.jpg" },
  { id: "ev3", name: "Cabo Pulmo Spring Retreat", date: "2026-05-15", startTime: "00:00", type: "Retreat", description: "Join Holly & Jessica for a transformative week in Cabo Pulmo, Baja California. Daily yoga, snorkeling in the marine reserve, farm-to-table meals, and deep connection under the desert sky.", fee: 2800, maxParticipants: 16, registered: 11, status: "Registration Open", image: "/images/events/retreat-hero.jpg" },
  { id: "ev4", name: "Restorative Yoga + Handcrafted Chocolate + Chakras", date: offsetDate(5), startTime: "18:30", type: "Special Event", description: "Awaken your senses with a restorative yoga practice paired with handcrafted chocolate and an exploration of the chakra system. A uniquely indulgent Friday evening at the studio.", fee: 45, maxParticipants: 22, registered: 18, status: "Open", image: "/images/events/one-on-one.jpg" },
];

const MEMBERSHIP_TIERS = [
  { id: "m1", name: "Single Drop-In", type: "drop-in", price: 29, period: "per class", features: ["1 class credit", "Valid for 12 months", "Book for friends & family"], popular: false },
  { id: "m2", name: "5 Class Pack", type: "pack", price: 99, period: "5 classes", features: ["5 class credits", "Valid for 1 year", "Book for friends & family", "Great for flexible schedules"], popular: false },
  { id: "m3", name: "10 Class Pack", type: "pack", price: 249, period: "10 classes", features: ["10 class credits", "Valid for 1 year", "Book for friends & family", "Best value per class"], popular: false },
  { id: "m4", name: "FLY Unlimited", type: "unlimited", price: 149, period: "/month", features: ["Unlimited in-studio classes", "2-week booking window", "FLY Rewards points", "Sliding-scale community classes", "Mat & towel rentals available", "3-month minimum commitment"], popular: true },
  { id: "m5", name: "FLY All-Access", type: "addon", price: 129, period: "/month", features: ["Unlimited in-studio classes", "FLY On Demand library (600+ videos)", "Guest passes", "Priority event registration", "FLY Rewards points 2x", "Mat & towel service included"], popular: false },
];

const ANNOUNCEMENTS = [
  { id: "a1", title: "Cabo Pulmo Retreat — May 2026!", message: "Join Holly & Jessica in Baja California for yoga, snorkeling, and sunsets. Limited to 16 spots — reserve yours today.", type: "celebration", pinned: true },
  { id: "a2", title: "FLY Equity Scholarship Fund", message: "$5 of every membership goes directly to support community members in need. Thank you for making yoga accessible for all.", type: "info", pinned: false },
];

const MEMBERS_DATA = [
  { id: "mem1", name: "Riley Moreno", email: "riley@email.com", membership: "FLY Unlimited", status: "active", joined: "2022-08-15", checkIns: 412, lastVisit: today },
  { id: "mem2", name: "Dana Kim", email: "dana@email.com", membership: "FLY All-Access", status: "active", joined: "2023-01-01", checkIns: 298, lastVisit: offsetDate(-1) },
  { id: "mem3", name: "Marco Torres", email: "marco@email.com", membership: "FLY Unlimited", status: "active", joined: "2024-06-01", checkIns: 156, lastVisit: today },
  { id: "mem4", name: "Keiko Sato", email: "keiko@email.com", membership: "FLY Unlimited", status: "active", joined: "2025-03-24", checkIns: 87, lastVisit: today },
  { id: "mem5", name: "Jordan Wells", email: "jordan@email.com", membership: "10 Class Pack", status: "active", joined: "2025-11-01", checkIns: 6, lastVisit: offsetDate(-4) },
  { id: "mem6", name: "Priya Nair", email: "priya@email.com", membership: "FLY Unlimited", status: "frozen", joined: "2024-03-01", checkIns: 134, lastVisit: offsetDate(-28) },
  { id: "mem7", name: "Alex Chen", email: "alex@email.com", membership: "FLY All-Access", status: "active", joined: "2023-05-01", checkIns: 367, lastVisit: today },
  { id: "mem8", name: "Nora Bell", email: "nora@email.com", membership: "5 Class Pack", status: "active", joined: "2026-02-10", checkIns: 3, lastVisit: offsetDate(-6) },
];

const ADMIN_METRICS = {
  activeMembers: 248, memberChange: 18,
  todayCheckIns: 94, weekCheckIns: 562,
  monthlyRevenue: 36200, revenueChange: 11.2,
  workshopRevenue: 5100,
};

const ADMIN_CHARTS = {
  attendance: [
    { day: "Mon", total: 96, avg: 14 }, { day: "Tue", total: 82, avg: 14 },
    { day: "Wed", total: 78, avg: 13 }, { day: "Thu", total: 98, avg: 14 },
    { day: "Fri", total: 64, avg: 16 }, { day: "Sat", total: 88, avg: 22 },
    { day: "Sun", total: 72, avg: 18 },
  ],
  revenue: [
    { month: "Oct", revenue: 28400 }, { month: "Nov", revenue: 30100 },
    { month: "Dec", revenue: 29200 }, { month: "Jan", revenue: 32800 },
    { month: "Feb", revenue: 34500 }, { month: "Mar", revenue: 36200 },
  ],
  membershipBreakdown: [
    { name: "FLY Unlimited", value: 142, color: T.accent },
    { name: "FLY All-Access", value: 48, color: T.success },
    { name: "10 Class Pack", value: 32, color: T.warning },
    { name: "5 Class Pack", value: 18, color: "#c2a04e" },
    { name: "Drop-In", value: 8, color: T.textMuted },
  ],
  classPopularity: [
    { name: "Hot FLY", pct: 94, fills: 28 }, { name: "Sculpt", pct: 91, fills: 24 },
    { name: "Hot Vinyasa", pct: 86, fills: 18 }, { name: "Power Vinyasa", pct: 78, fills: 12 },
    { name: "Deep Stretch", pct: 72, fills: 8 }, { name: "Flow & Restore", pct: 68, fills: 6 },
  ],
};

// ═══════════════════════════════════════════════════════════════
//  APP CONTEXT
// ═══════════════════════════════════════════════════════════════
const AppContext = createContext();

// ═══════════════════════════════════════════════════════════════
//  SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════
function PageTitle({ title, subtitle }) {
  return (
    <div style={{ padding: "20px 0 16px" }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, color: T.text, margin: 0, lineHeight: 1.1 }}>{title}</h1>
      {subtitle && <p style={{ fontSize: 15, color: T.textMuted, margin: "6px 0 0", lineHeight: 1.4 }}>{subtitle}</p>}
    </div>
  );
}

function PageHero({ title, subtitle, image }) {
  return (
    <div style={{ background: `linear-gradient(to bottom, rgba(42,31,20,0.42), rgba(42,31,20,0.57)), url('${image}') center/cover no-repeat`, padding: "54px 20px 47px", color: "#fff", marginBottom: 16 }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, color: "#fff", margin: 0, lineHeight: 1.1 }}>{title}</h1>
      {subtitle && <p style={{ fontSize: 15, color: "#c8b8a0", margin: "8px 0 0", lineHeight: 1.4 }}>{subtitle}</p>}
    </div>
  );
}

function SectionHeader({ title, linkText, linkPage }) {
  const { setPage } = useContext(AppContext);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: T.text, margin: 0 }}>{title}</h2>
      {linkText && (
        <button onClick={() => setPage(linkPage)} style={{ fontSize: 13, fontWeight: 600, color: T.accent, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
          {linkText} <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div style={{ background: T.bgDim, borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: T.text, fontWeight: 700 }}>{value}</div>
      <div style={{ fontSize: 13, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 2 }}>{label}</div>
    </div>
  );
}

function EmptyState({ icon: Icon, message, sub }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "30px 20px", color: T.textFaint }}>
      <Icon size={28} style={{ marginBottom: 8 }} />
      <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{message}</p>
      {sub && <p style={{ fontSize: 14, margin: "4px 0 0" }}>{sub}</p>}
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, multiline }) {
  const style = { width: "100%", padding: "10px 14px", background: T.bgDim, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 13, fontFamily: "'DM Sans', system-ui, sans-serif", outline: "none", boxSizing: "border-box", resize: "none" };
  return (
    <div>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
      {multiline ? (
        <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={style} />
      ) : (
        <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={style} />
      )}
    </div>
  );
}

function PracticeCardFull({ practice: p, expanded, onToggle }) {
  const isToday = p.date === today;
  const isFuture = p.date > today;
  return (
    <div style={{ background: T.bgCard, border: `1px solid ${isToday ? T.accentBorder : T.border}`, borderRadius: 14, overflow: "hidden", cursor: "pointer" }} onClick={onToggle}>
      <div style={{ padding: "16px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              {isToday && <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", padding: "3px 8px", borderRadius: 4, background: T.accentGhost, color: T.accent }}>Today</span>}
              {isFuture && <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", padding: "3px 8px", borderRadius: 4, background: T.successGhost, color: T.success }}>Upcoming</span>}
              <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", padding: "3px 8px", borderRadius: 4, background: T.bgDim, color: T.textMuted }}>{p.type}</span>
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, margin: 0, color: T.text }}>{p.name}</h3>
          </div>
          <ChevronDown size={18} color={T.textFaint} style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0, marginTop: 4 }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14, color: T.textMuted }}>
          <span>{formatDateShort(p.date)}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Clock size={14} /> {p.duration} min</span>
          <span>{p.style} · {p.temp}</span>
        </div>
      </div>
      {expanded && (
        <div style={{ padding: "0 18px 18px", borderTop: `1px solid ${T.borderLight}`, paddingTop: 14 }}>
          <p style={{ fontSize: 15, color: "#5a4e3a", lineHeight: 1.6, margin: "0 0 12px" }}>{p.description}</p>
          {p.intention && (
            <div style={{ padding: "10px 14px", borderRadius: 10, background: `linear-gradient(135deg, ${T.accentGhost}, transparent)`, border: `1px solid ${T.accentBorder}`, marginBottom: 10 }}>
              <p style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", color: T.accent, margin: "0 0 4px", letterSpacing: "0.05em" }}>Intention</p>
              <p style={{ fontSize: 15, color: T.text, fontStyle: "italic", margin: 0, lineHeight: 1.5 }}>{p.intention}</p>
            </div>
          )}
          {p.teacherTip && (
            <div style={{ padding: "10px 14px", borderRadius: 10, background: T.bgDim, marginBottom: 10 }}>
              <p style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", color: T.textMuted, margin: "0 0 4px", letterSpacing: "0.05em" }}>Teacher Tip</p>
              <p style={{ fontSize: 15, color: "#5a4e3a", margin: 0, lineHeight: 1.5 }}>{p.teacherTip}</p>
            </div>
          )}
          {p.playlist && <p style={{ fontSize: 14, color: T.textMuted, display: "flex", alignItems: "center", gap: 6, margin: 0 }}><Music size={16} color={T.accent} /> {p.playlist}</p>}
        </div>
      )}
    </div>
  );
}

function CTACard() {
  return (
    <div style={{ background: `linear-gradient(to right, rgba(42,31,20,0.62), rgba(42,31,20,0.49)), url('/images/studio/class-header.jpg') center/cover`, borderRadius: 16, padding: "24px 20px", color: "#fff", position: "relative", overflow: "hidden" }}>
      <Flame size={28} color={T.accent} style={{ marginBottom: 12 }} />
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, margin: "0 0 6px" }}>30 Days for $59</h3>
      <p style={{ fontSize: 15, color: "#b8a898", margin: "0 0 16px", lineHeight: 1.5 }}>New to FLY? Unlimited classes for 30 days. Heated and unheated, all styles, all levels.</p>
      <button style={{ padding: "12px 24px", borderRadius: 8, border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Playfair Display', serif", letterSpacing: "0.03em", background: T.accent, color: "#fff" }}>
        Start Your Intro
      </button>
    </div>
  );
}

function AdminCard({ title, children }) {
  return (
    <div style={{ background: "#1f1f18", border: "1px solid #3a3528", borderRadius: 12, padding: 18 }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: "#e8dfd2", margin: "0 0 14px" }}>{title}</h3>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MODALS
// ═══════════════════════════════════════════════════════════════
function SettingsModal({ onClose }) {
  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 390, background: T.bgCard, borderRadius: "20px 20px 0 0", padding: "20px 20px 32px", maxHeight: "80vh", overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, margin: 0 }}>Settings</h2>
          <button onClick={onClose} aria-label="Close settings" style={{ padding: 4, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer" }}><X size={20} color={T.textMuted} /></button>
        </div>
        <img src="/images/studio/founders.jpg" alt="Holly & Jessica — Firelight Yoga founders" loading="lazy" style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 12, marginBottom: 14 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[{ icon: MapPin, label: STUDIO_CONFIG.address.street, sub: `${STUDIO_CONFIG.address.city}, ${STUDIO_CONFIG.address.state} ${STUDIO_CONFIG.address.zip}` },
            { icon: Clock, label: "Mon–Fri: 5:45 AM – 9:00 PM", sub: "Sat–Sun: 7:45 AM – 7:00 PM" },
            { icon: Share2, label: STUDIO_CONFIG.social.instagram, sub: "Follow us on Instagram" },
            { icon: Gift, label: "FLY Rewards", sub: "Earn points with every class" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: T.bgDim, borderRadius: 12 }}>
              <item.icon size={20} color={T.accent} />
              <div>
                <p style={{ fontWeight: 600, fontSize: 14, margin: 0, color: T.text }}>{item.label}</p>
                <p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotificationsModal({ onClose }) {
  const notifications = [
    { id: "n1", title: "Class Confirmed", message: "You're booked for Hot FLY at 6:00 AM tomorrow with Holly.", time: "2h ago", read: false },
    { id: "n2", title: "FLY Rewards Update", message: "You earned 15 points! You're 35 points from a free guest pass.", time: "1d ago", read: false },
    { id: "n3", title: "Waitlist Update", message: "A spot opened up! You're now registered for Sculpt at 5:45 PM.", time: "2d ago", read: true },
    { id: "n4", title: "New Workshop", message: "Handstand Series starts April 12 — registration is open now.", time: "3d ago", read: true },
  ];
  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 390, background: T.bgCard, borderRadius: "20px 20px 0 0", padding: "20px 20px 32px", maxHeight: "80vh", overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, margin: 0 }}>Notifications</h2>
          <button onClick={onClose} aria-label="Close notifications" style={{ padding: 4, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer" }}><X size={20} color={T.textMuted} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {notifications.map(n => (
            <div key={n.id} style={{ padding: "14px 16px", borderRadius: 12, background: n.read ? T.bgDim : T.accentGhost, border: `1px solid ${n.read ? T.border : T.accentBorder}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 4px", color: T.text }}>{n.title}</h4>
                {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.accent, flexShrink: 0, marginTop: 4 }} />}
              </div>
              <p style={{ fontSize: 13, color: "#5a4e3a", margin: "0 0 4px", lineHeight: 1.4 }}>{n.message}</p>
              <p style={{ fontSize: 13, color: T.textFaint, margin: 0 }}>{n.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReservationModal({ classData, onConfirm, onClose }) {
  const [confirmed, setConfirmed] = useState(false);
  const isFull = classData.registered >= classData.capacity;
  const handleConfirm = () => {
    onConfirm(classData.id);
    setConfirmed(true);
    setTimeout(onClose, 1500);
  };
  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "90%", maxWidth: 340, background: T.bgCard, borderRadius: 18, padding: "24px 22px", boxShadow: "0 12px 40px rgba(0,0,0,.2)" }}>
        {confirmed ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: T.accentGhost, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <Check size={28} color={T.accent} />
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, margin: "0 0 6px" }}>{isFull ? "Added to Waitlist" : "You're In!"}</h3>
            <p style={{ fontSize: 13, color: T.textMuted, margin: 0 }}>See you on the mat.</p>
          </div>
        ) : (
          <>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, margin: "0 0 4px", color: T.text }}>Reserve Your Spot</h3>
            <p style={{ fontSize: 13, color: T.textMuted, margin: "0 0 16px" }}>{classData.dayLabel || formatDateShort(today)}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${T.borderLight}` }}>
                <span style={{ fontSize: 13, color: T.textMuted }}>Class</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{classData.type}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${T.borderLight}` }}>
                <span style={{ fontSize: 13, color: T.textMuted }}>Time</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{fmtTime(classData.time)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${T.borderLight}` }}>
                <span style={{ fontSize: 13, color: T.textMuted }}>Teacher</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{classData.coach}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
                <span style={{ fontSize: 13, color: T.textMuted }}>Spots</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: isFull ? T.warning : T.accent }}>{isFull ? `Full — ${classData.waitlist} waitlisted` : `${classData.capacity - classData.registered} open`}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={onClose} style={{ flex: 1, padding: "12px 0", borderRadius: 8, border: `1px solid ${T.border}`, background: "transparent", fontSize: 14, fontWeight: 600, cursor: "pointer", color: T.textMuted }}>Cancel</button>
              <button onClick={handleConfirm} style={{ flex: 1, padding: "12px 0", borderRadius: 8, border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Playfair Display', serif", background: T.accent, color: "#fff" }}>{isFull ? "Join Waitlist" : "Confirm"}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  HOME PAGE
// ═══════════════════════════════════════════════════════════════
function HomePage() {
  const { openReservation, feedCelebrations, celebrateFeed } = useContext(AppContext);
  const now = new Date();
  const currentHour = now.getHours() * 60 + now.getMinutes();
  const upcoming = CLASSES_TODAY.filter(c => {
    const [h, m] = c.time.split(":").map(Number);
    return h * 60 + m > currentHour;
  });

  return (
    <div>
      {/* Hero */}
      <div style={{ background: `linear-gradient(to bottom, rgba(42,31,20,0.53), rgba(42,31,20,0.60)), url('/images/studio/hero.jpg') center/cover`, padding: "28px 20px 32px", color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: `${T.accent}10` }} />
        <div style={{ position: "absolute", bottom: -20, left: -20, width: 80, height: 80, borderRadius: "50%", background: `${T.accent}08` }} />
        <p style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: T.accent, marginBottom: 8 }}>{formatDateLong(today)}</p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, margin: "0 0 4px", lineHeight: 1, letterSpacing: "-0.01em" }}>{STUDIO_CONFIG.heroLine1}</h1>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, margin: "0 0 12px", lineHeight: 1, letterSpacing: "-0.01em", color: T.accent }}>{STUDIO_CONFIG.heroLine2}</h1>
        <p style={{ fontSize: 15, color: "#b8a898", lineHeight: 1.5, maxWidth: 360 }}>{STUDIO_CONFIG.description}</p>
      </div>

      {/* Today's Focus */}
      <section style={{ padding: "20px 16px 0" }}>
        <SectionHeader title="Today's Practice" linkText="All Classes" linkPage="classes" />
        <PracticeCardFull practice={TODAYS_FOCUS} expanded={true} onToggle={() => {}} />
      </section>

      {/* Upcoming Classes */}
      <section style={{ padding: "0 16px", marginTop: 24 }}>
        <SectionHeader title="Up Next" linkText="Full Schedule" linkPage="schedule" />
        {upcoming.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {upcoming.slice(0, 4).map(c => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ textAlign: "center", minWidth: 54 }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: T.text, fontWeight: 600 }}>{fmtTime(c.time)}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: 14, color: T.text, margin: 0 }}>{c.type}</p>
                  <p style={{ fontSize: 13, color: T.textMuted, margin: "2px 0 0" }}>{c.coach} · {c.registered}/{c.capacity}</p>
                </div>
                <button onClick={() => openReservation(c)} style={{ padding: "8px 16px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", background: c.registered >= c.capacity ? T.warningGhost : T.accent, color: c.registered >= c.capacity ? T.warning : "#fff" }}>
                  {c.registered >= c.capacity ? "Waitlist" : "Reserve"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon={Moon} message="No more classes today" sub="See tomorrow's schedule" />
        )}
      </section>

      {/* Community Feed */}
      {STUDIO_CONFIG.features.communityFeed && (
        <section style={{ padding: "0 16px", marginTop: 28 }}>
          <SectionHeader title="Community" linkText="View All" linkPage="community" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {COMMUNITY_FEED.slice(0, 3).map(item => {
              const myC = feedCelebrations[item.id] || 0;
              return (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: `linear-gradient(135deg, ${T.successGhost}, transparent)`, border: `1px solid ${T.successBorder}`, borderRadius: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Sparkles size={18} color="#fff" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: 14, color: T.text, margin: 0 }}>
                      {item.user} <span style={{ color: T.accent }}>{item.milestone}</span>
                    </p>
                    <p style={{ fontSize: 14, color: "#6b5e48", margin: "2px 0 0", lineHeight: 1.4 }}>
                      {item.message.length > 60 ? item.message.slice(0, 60) + "…" : item.message}
                    </p>
                  </div>
                  <button onClick={() => celebrateFeed(item.id)} style={{ padding: 8, borderRadius: 8, border: "none", background: myC > 0 ? T.successGhost : "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, transition: "all 0.15s" }}>
                    <Heart size={18} color={T.accent} fill={myC > 0 ? T.accent : "none"} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: T.accent }}>{item.celebrations + myC}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Announcements */}
      {ANNOUNCEMENTS.length > 0 && (
        <section style={{ padding: "0 16px", marginTop: 28 }}>
          <SectionHeader title="Announcements" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {ANNOUNCEMENTS.map(a => (
              <div key={a.id} style={{ padding: "14px 16px", borderRadius: 12, borderLeft: `4px solid ${a.type === "celebration" ? T.accent : a.type === "alert" ? T.warning : T.textMuted}`, background: a.type === "celebration" ? T.accentGhost : a.type === "alert" ? T.warningGhost : T.bgDim }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: T.text, margin: 0 }}>{a.title}</h3>
                    <p style={{ fontSize: 13, color: "#6b5e48", margin: "4px 0 0" }}>{a.message}</p>
                  </div>
                  {a.pinned && <span style={{ fontSize: 13, fontWeight: 600, color: T.accent, background: T.accentGhost, padding: "3px 10px", borderRadius: 99 }}>Pinned</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ padding: "0 16px", marginTop: 28 }}>
        <CTACard />
      </section>
    </div>
  );
}

// ——— CLASSES PAGE ———
function ClassesPage() {
  const [expandedPractice, setExpandedPractice] = useState(null);
  const allPractices = [TODAYS_FOCUS, ...PAST_PRACTICES, UPCOMING_PRACTICE].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <PageHero title="Classes" subtitle="Past, present, and upcoming practice" image="/images/studio/class-header.jpg" />
      <div style={{ padding: "0 16px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {allPractices.map(p => (
          <PracticeCardFull key={p.id} practice={p} expanded={expandedPractice === p.id} onToggle={() => setExpandedPractice(expandedPractice === p.id ? null : p.id)} />
        ))}
      </div>
      </div>
    </div>
  );
}

// ——— SCHEDULE PAGE ———
function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
  const { classRegistrations, registerForClass, openReservation } = useContext(AppContext);
  const stableRegistered = useMemo(() => {
    const map = {};
    WEEKLY_SCHEDULE.forEach((day, di) => {
      day.classes.forEach((_, ci) => {
        map[`${di}-${ci}`] = Math.floor(Math.random() * 10) + 15;
      });
    });
    return map;
  }, []);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div>
      <PageHero title="Schedule" subtitle="Reserve your spot — classes fill up fast" image="/images/studio/studio-cover.jpg" />
      <div style={{ padding: "0 16px" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
          {days.map((d, i) => (
            <button key={d} onClick={() => setSelectedDay(i)} style={{ padding: "8px 14px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", background: selectedDay === i ? T.accent : T.bgDim, color: selectedDay === i ? "#fff" : T.textMuted, transition: "all 0.15s" }}>
              {d}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {WEEKLY_SCHEDULE[selectedDay]?.classes.map((cls, i) => {
            const isSpecial = cls.type.includes("Yin") || cls.type.includes("Sound") || cls.type.includes("Restore");
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ textAlign: "center", minWidth: 56 }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: T.text, fontWeight: 600 }}>{fmtTime(cls.time)}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <p style={{ fontWeight: 600, fontSize: 14, color: T.text, margin: 0 }}>{cls.type}</p>
                    {isSpecial && <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", padding: "2px 8px", borderRadius: 4, background: T.warningGhost, color: T.warning }}>Restorative</span>}
                  </div>
                  {cls.coach && <p style={{ fontSize: 12, color: T.textMuted, margin: "3px 0 0" }}>{cls.coach}</p>}
                </div>
                <button onClick={() => openReservation({ id: `sched-${selectedDay}-${i}`, time: cls.time, type: cls.type, coach: cls.coach || "TBD", capacity: isSpecial ? STUDIO_CONFIG.specialtyCapacity : STUDIO_CONFIG.classCapacity, registered: stableRegistered[`${selectedDay}-${i}`] || 20, waitlist: 0, dayLabel: dayNames[selectedDay] })} style={{ padding: "8px 16px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: T.accent, color: "#fff" }}>
                  Reserve
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ——— PRACTICE TRACKING PAGE ———
function PracticePage() {
  const [activeTab, setActiveTab] = useState("log");
  const [reflection, setReflection] = useState({ energy: 4, focus: 4, notes: "" });
  const [saved, setSaved] = useState(null);

  const handleSave = () => { setSaved("log"); setTimeout(() => setSaved(null), 2000); setReflection({ energy: 4, focus: 4, notes: "" }); };
  const streakDays = 14;
  const totalClasses = 112;

  return (
    <div>
      <PageHero title="My Practice" subtitle="Track your journey and celebrate growth" image="/images/events/retreat-yoga.jpg" />
      <div style={{ padding: "0 16px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
        <div style={{ background: T.accentGhost, border: `1px solid ${T.accentBorder}`, borderRadius: 12, padding: "14px 12px", textAlign: "center" }}>
          <Flame size={20} color={T.accent} style={{ margin: "0 auto 4px" }} />
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: T.text }}>{streakDays}</div>
          <div style={{ fontSize: 13, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Day Streak</div>
        </div>
        <div style={{ background: T.successGhost, border: `1px solid ${T.successBorder}`, borderRadius: 12, padding: "14px 12px", textAlign: "center" }}>
          <Star size={20} color={T.success} style={{ margin: "0 auto 4px" }} />
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: T.text }}>{totalClasses}</div>
          <div style={{ fontSize: 13, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Classes</div>
        </div>
        <div style={{ background: T.warningGhost, border: `1px solid ${T.warningBorder}`, borderRadius: 12, padding: "14px 12px", textAlign: "center" }}>
          <Mountain size={20} color={T.warning} style={{ margin: "0 auto 4px" }} />
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: T.text }}>8</div>
          <div style={{ fontSize: 13, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Milestones</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: T.bgDim, borderRadius: 10, padding: 4 }}>
        {[{ id: "log", label: "Reflection" }, { id: "milestones", label: "Milestones" }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: activeTab === tab.id ? T.bgCard : "transparent", color: activeTab === tab.id ? T.text : T.textMuted, boxShadow: activeTab === tab.id ? "0 1px 3px rgba(0,0,0,.06)" : "none", transition: "all 0.15s" }}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "log" && (
        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Flame size={18} color={T.accent} />
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Post-Practice Reflection</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Energy Level</label>
              <div style={{ display: "flex", gap: 6 }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setReflection({...reflection, energy: n})} style={{ width: 44, height: 44, borderRadius: 10, border: `1px solid ${reflection.energy >= n ? T.accent : T.border}`, background: reflection.energy >= n ? T.accentGhost : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {n <= 2 ? <Moon size={18} color={reflection.energy >= n ? T.accent : T.textFaint} /> : n <= 4 ? <Sun size={18} color={reflection.energy >= n ? T.accent : T.textFaint} /> : <Sparkles size={18} color={reflection.energy >= n ? T.accent : T.textFaint} />}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Focus & Presence</label>
              <div style={{ display: "flex", gap: 6 }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setReflection({...reflection, focus: n})} style={{ width: 44, height: 44, borderRadius: 10, border: `1px solid ${reflection.focus >= n ? T.success : T.border}`, background: reflection.focus >= n ? T.successGhost : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {n <= 2 ? <Wind size={18} color={reflection.focus >= n ? T.success : T.textFaint} /> : n <= 4 ? <Heart size={18} color={reflection.focus >= n ? T.success : T.textFaint} /> : <Sparkles size={18} color={reflection.focus >= n ? T.success : T.textFaint} />}
                  </button>
                ))}
              </div>
            </div>
            <InputField label="Notes / Gratitude" value={reflection.notes} onChange={v => setReflection({...reflection, notes: v})} placeholder="What came up for you on the mat today?" multiline />
            <button onClick={handleSave} style={{ padding: "12px 0", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer", background: T.accent, color: "#fff", fontFamily: "'Playfair Display', serif", letterSpacing: "0.03em", fontSize: 17 }}>
              {saved === "log" ? <><Check size={16} style={{ display: "inline", verticalAlign: "middle" }} /> Saved</> : "Save Reflection"}
            </button>
          </div>
        </div>
      )}

      {activeTab === "milestones" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {Object.entries(MILESTONE_BADGES).map(([name, badge]) => {
            const earned = ["First Class", "10 Classes", "50 Classes", "100 Classes", "7-Day Streak", "30-Day Streak", "First Crow Pose", "1 Year Member"].includes(name);
            const BadgeIcon = badge.icon;
            return (
              <div key={name} style={{ background: earned ? T.bgCard : T.bgDim, border: `1px solid ${earned ? T.border : "transparent"}`, borderRadius: 12, padding: "16px 14px", textAlign: "center", opacity: earned ? 1 : 0.45 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: earned ? `${badge.color}18` : T.bgDim, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                  <BadgeIcon size={22} color={earned ? badge.color : T.textFaint} />
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: earned ? T.text : T.textFaint, margin: 0 }}>{name}</p>
                <p style={{ fontSize: 13, color: T.textFaint, margin: "2px 0 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>{earned ? <><Check size={12} /> Earned</> : "Keep going"}</p>
              </div>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
}

// ——— COMMUNITY PAGE ———
function CommunityPage() {
  const { feedCelebrations, celebrateFeed } = useContext(AppContext);
  return (
    <div>
      <PageHero title="Community" subtitle="Celebrate each other's practice" image="/images/events/retreat-group.jpg" />
      <div style={{ padding: "0 16px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {COMMUNITY_FEED.map(item => {
          const myC = feedCelebrations[item.id] || 0;
          return (
            <div key={item.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: 16, color: "#fff", fontWeight: 700, flexShrink: 0 }}>
                  {item.user[0]}
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, margin: 0, color: T.text }}>{item.user}</p>
                  <p style={{ fontSize: 12, color: T.textMuted, margin: "1px 0 0" }}>{formatDateShort(item.date)}</p>
                </div>
                <span style={{ marginLeft: "auto", fontSize: 13, fontWeight: 700, padding: "4px 10px", borderRadius: 6, background: T.accentGhost, color: T.accent }}>{item.milestone}</span>
              </div>
              <p style={{ fontSize: 14, color: "#4a3e2e", lineHeight: 1.5, margin: "0 0 12px" }}>{item.message}</p>
              <button onClick={() => celebrateFeed(item.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, border: `1px solid ${myC > 0 ? T.accentBorder : T.border}`, background: myC > 0 ? T.accentGhost : "transparent", cursor: "pointer" }}>
                <Heart size={16} color={T.accent} fill={myC > 0 ? T.accent : "none"} />
                <span style={{ fontSize: 13, fontWeight: 600, color: T.accent }}>{item.celebrations + myC}</span>
              </button>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}

// ——— TEACHERS PAGE ———
function TeachersPage() {
  const [expandedTeacher, setExpandedTeacher] = useState(null);
  return (
    <div>
      <PageHero title="The FLY Team" subtitle="Meet the Firelight Yoga teaching team" image="/images/studio/founders.jpg" />
      <div style={{ padding: "0 16px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {TEACHERS.map(teacher => {
          const expanded = expandedTeacher === teacher.id;
          return (
            <div key={teacher.id} onClick={() => setExpandedTeacher(expanded ? null : teacher.id)} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden", cursor: "pointer", transition: "all 0.2s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px" }}>
                {teacher.photo ? (
                  <img src={teacher.photo} alt={`${teacher.firstName} ${teacher.lastName}`} loading="lazy" style={{ width: 56, height: 56, borderRadius: 14, objectFit: "cover", flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#fff", flexShrink: 0, fontWeight: 600 }}>
                    {teacher.firstName[0]}{teacher.lastName[0]}
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: T.text }}>{teacher.firstName} {teacher.lastName}</h3>
                  <p style={{ fontSize: 13, color: T.accent, fontWeight: 600, margin: "2px 0 0" }}>{teacher.role}</p>
                  <p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>{teacher.yearsTeaching} years teaching</p>
                </div>
                <ChevronDown size={18} color={T.textFaint} style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </div>
              {expanded && (
                <div style={{ padding: "0 18px 18px", borderTop: `1px solid ${T.borderLight}`, paddingTop: 14 }}>
                  <p style={{ fontSize: 13, color: "#5a4e3a", lineHeight: 1.6, margin: "0 0 12px" }}>{teacher.bio}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                    {teacher.specialties.map(s => (
                      <span key={s} style={{ fontSize: 13, fontWeight: 600, padding: "4px 10px", borderRadius: 6, background: T.accentGhost, color: T.accent }}>{s}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {teacher.certs.map(c => (
                      <span key={c} style={{ fontSize: 13, fontWeight: 600, padding: "4px 10px", borderRadius: 6, background: T.bgDim, color: T.textMuted }}>{c}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}

// ——— MEMBERSHIP PAGE ———
function MembershipPage() {
  return (
    <div>
      <PageHero title="Pricing" subtitle="Find the plan that fits your practice" image="/images/studio/hero.jpg" />
      <div style={{ padding: "0 16px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {MEMBERSHIP_TIERS.map(tier => (
          <div key={tier.id} style={{ background: T.bgCard, border: `1px solid ${tier.popular ? T.accent : T.border}`, borderRadius: 14, padding: "20px 18px", position: "relative", overflow: "hidden" }}>
            {tier.popular && (
              <div style={{ position: "absolute", top: 12, right: -28, background: T.accent, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 32px", transform: "rotate(45deg)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Popular
              </div>
            )}
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, margin: "0 0 4px", color: T.text }}>{tier.name}</h3>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 12 }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 38, color: T.accent, fontWeight: 700 }}>${tier.price}</span>
              <span style={{ fontSize: 13, color: T.textMuted }}>{tier.period}</span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px" }}>
              {tier.features.map((f, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", fontSize: 13, color: "#5a4e3a" }}>
                  <CircleCheck size={14} color={T.accent} style={{ flexShrink: 0 }} />
                  {f}
                </li>
              ))}
            </ul>
            <button style={{ width: "100%", padding: "12px 0", borderRadius: 8, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Playfair Display', serif", letterSpacing: "0.03em", background: tier.popular ? T.accent : T.bg, color: "#fff" }}>
              Get Started
            </button>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}

// ——— EVENTS PAGE ———
function EventsPage() {
  return (
    <div>
      <PageHero title="Events" subtitle="Workshops, retreats, and special offerings" image="/images/events/retreat-beach.jpg" />
      <div style={{ padding: "0 16px" }}>
      {EVENTS.map(ev => (
        <div key={ev.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
          {ev.image && (
            <img src={ev.image} alt={ev.name} loading="lazy" style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />
          )}
          <div style={{ background: `linear-gradient(135deg, ${T.bg}, hsl(20,25%,16%))`, padding: "20px 18px", color: "#fff" }}>
            <span style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.accent }}>{ev.type}</span>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, margin: "6px 0 4px", fontWeight: 600 }}>{ev.name}</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: "#b8a898" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={14} /> {formatDateShort(ev.date)}</span>
              {ev.startTime !== "00:00" && <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={14} /> {fmtTime(ev.startTime)}</span>}
            </div>
          </div>
          <div style={{ padding: "16px 18px" }}>
            <p style={{ fontSize: 13, color: "#5a4e3a", lineHeight: 1.6, margin: "0 0 14px" }}>{ev.description}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              <StatBox label="Price" value={`$${ev.fee}`} />
              <StatBox label="Spots" value={`${ev.registered}/${ev.maxParticipants}`} />
            </div>
            <button style={{ width: "100%", padding: "12px 0", borderRadius: 8, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Playfair Display', serif", letterSpacing: "0.03em", background: T.accent, color: "#fff" }}>
              Register Now
            </button>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  ADMIN PAGES
// ═══════════════════════════════════════════════════════════════
function AdminDashboard() {
  const metrics = [
    { label: "Active Members", value: ADMIN_METRICS.activeMembers, change: `+${ADMIN_METRICS.memberChange}`, positive: true, icon: Users, color: T.accent },
    { label: "Today's Check-ins", value: ADMIN_METRICS.todayCheckIns, change: `${ADMIN_METRICS.weekCheckIns} this week`, positive: true, icon: Calendar, color: T.success },
    { label: "Monthly Revenue", value: `$${ADMIN_METRICS.monthlyRevenue.toLocaleString()}`, change: `+${ADMIN_METRICS.revenueChange}%`, positive: true, icon: DollarSign, color: T.warning },
    { label: "Workshop Revenue", value: `$${ADMIN_METRICS.workshopRevenue.toLocaleString()}`, change: "+18 registrations", positive: true, icon: Award, color: "#e85d04" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#fff", margin: 0 }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: "#9ca3af", margin: "4px 0 0" }}>Welcome back. Here's what's happening at {STUDIO_CONFIG.name}.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ background: "#1f1f18", border: "1px solid #3a3528", borderRadius: 12, padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: `${m.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <m.icon size={18} color={m.color} />
              </div>
            </div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, color: "#fff", fontWeight: 700 }}>{m.value}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
              <span style={{ display: "flex", alignItems: "center", fontSize: 12, fontWeight: 600, color: m.positive ? "#4ade80" : "#f87171" }}>
                {m.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {m.change}
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: "6px 0 0" }}>{m.label}</p>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 }}>
        <AdminCard title="Weekly Attendance">
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ADMIN_CHARTS.attendance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3a3528" />
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "#1f1f18", border: "1px solid #3a3528", borderRadius: 8, color: "#fff" }} />
                <Bar dataKey="total" fill={T.accent} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>
        <AdminCard title="Revenue Trend">
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ADMIN_CHARTS.revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3a3528" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={v => `$${v / 1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: "#1f1f18", border: "1px solid #3a3528", borderRadius: 8, color: "#fff" }} formatter={(v) => [`$${v.toLocaleString()}`, "Revenue"]} />
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={T.accent} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={T.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="revenue" stroke={T.accent} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
        <AdminCard title="Membership Breakdown">
          <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={ADMIN_CHARTS.membershipBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4}>
                  {ADMIN_CHARTS.membershipBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1f1f18", border: "1px solid #3a3528", borderRadius: 8, color: "#fff" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {ADMIN_CHARTS.membershipBreakdown.map((entry, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: entry.color }} />
                <span style={{ fontSize: 13, color: "#9ca3af" }}>{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </AdminCard>
        <AdminCard title="Class Fill Rate (This Month)">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {ADMIN_CHARTS.classPopularity.map((c, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: "#d1d5db", fontWeight: 600 }}>{c.name}</span>
                  <span style={{ fontSize: 11, color: "#9ca3af" }}>{c.pct}% · {c.fills} full</span>
                </div>
                <div style={{ height: 6, background: "#3a3528", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${c.pct}%`, background: T.accent, borderRadius: 3, transition: "width 0.5s" }} />
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>
    </div>
  );
}

function AdminMembersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const filtered = MEMBERS_DATA.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || m.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#fff", margin: 0 }}>Members</h1>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          <UserPlus size={16} /> Add Member
        </button>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#6b7280" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members..." style={{ width: "100%", padding: "10px 12px 10px 36px", background: "#1f1f18", border: "1px solid #3a3528", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {["all", "active", "frozen"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 14px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize", background: filter === f ? T.accent : "#1f1f18", color: filter === f ? "#fff" : "#9ca3af" }}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <div style={{ background: "#1f1f18", border: "1px solid #3a3528", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #3a3528" }}>
              {["Member", "Membership", "Status", "Classes", "Last Visit"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#9ca3af", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.id} style={{ borderBottom: "1px solid #3a3528" }}>
                <td style={{ padding: "12px 16px" }}>
                  <p style={{ color: "#fff", fontWeight: 600, margin: 0 }}>{m.name}</p>
                  <p style={{ color: "#6b7280", fontSize: 12, margin: "2px 0 0" }}>{m.email}</p>
                </td>
                <td style={{ padding: "12px 16px", color: "#d1d5db" }}>{m.membership}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, textTransform: "capitalize", background: m.status === "active" ? `${T.accent}20` : `${T.warning}20`, color: m.status === "active" ? T.accent : T.warning }}>
                    {m.status}
                  </span>
                </td>
                <td style={{ padding: "12px 16px", color: "#d1d5db", fontFamily: "monospace" }}>{m.checkIns}</td>
                <td style={{ padding: "12px 16px", color: "#9ca3af", fontSize: 12 }}>{formatDateShort(m.lastVisit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminSchedulePage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#fff", margin: 0 }}>Schedule Management</h1>
      <div style={{ background: "#1f1f18", border: "1px solid #3a3528", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #3a3528" }}>
              {["Time", "Class", "Teacher", "Capacity", "Registered", "Status"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#9ca3af", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CLASSES_TODAY.map(c => (
              <tr key={c.id} style={{ borderBottom: "1px solid #3a3528" }}>
                <td style={{ padding: "12px 16px", color: "#fff", fontFamily: "monospace" }}>{fmtTime(c.time)}</td>
                <td style={{ padding: "12px 16px", color: "#d1d5db", fontWeight: 600 }}>{c.type}</td>
                <td style={{ padding: "12px 16px", color: "#d1d5db" }}>{c.coach}</td>
                <td style={{ padding: "12px 16px", color: "#9ca3af" }}>{c.capacity}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ fontFamily: "monospace", fontWeight: 600, color: c.registered >= c.capacity ? T.warning : T.accent }}>{c.registered}/{c.capacity}</span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: c.registered >= c.capacity ? `${T.warning}20` : `${T.accent}20`, color: c.registered >= c.capacity ? T.warning : T.accent }}>
                    {c.registered >= c.capacity ? "Full" : "Open"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminTeachersPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#fff", margin: 0 }}>Teachers</h1>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          <UserPlus size={16} /> Add Teacher
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
        {TEACHERS.map(teacher => (
          <div key={teacher.id} style={{ background: "#1f1f18", border: "1px solid #3a3528", borderRadius: 12, padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              {teacher.photo ? (
                <img src={teacher.photo} alt={`${teacher.firstName} ${teacher.lastName}`} loading="lazy" style={{ width: 48, height: 48, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
              ) : (
                <div style={{ width: 48, height: 48, borderRadius: 10, background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#fff", fontWeight: 600 }}>
                  {teacher.firstName[0]}{teacher.lastName[0]}
                </div>
              )}
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: 0 }}>{teacher.firstName} {teacher.lastName}</h3>
                <p style={{ fontSize: 12, color: T.accent, fontWeight: 600, margin: "2px 0 0" }}>{teacher.role}</p>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
              {teacher.certs.map(c => (
                <span key={c} style={{ fontSize: 12, fontWeight: 600, padding: "3px 8px", borderRadius: 4, background: "#3a3528", color: "#9ca3af" }}>{c}</span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "1px solid #3a3528", background: "transparent", color: "#d1d5db", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Edit</button>
              <button style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "1px solid #3a3528", background: "transparent", color: "#d1d5db", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Schedule</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminCommsPage() {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const handleSend = () => { setSent(true); setTimeout(() => { setSent(false); setMessage(""); }, 2000); };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#fff", margin: 0 }}>Communications</h1>
      <AdminCard title="Quick Announcement">
        <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Type an announcement for all members..." rows={4} style={{ width: "100%", padding: 12, background: "#2a2a20", border: "1px solid #3a3528", borderRadius: 8, color: "#fff", fontSize: 13, fontFamily: "'DM Sans', system-ui, sans-serif", resize: "none", outline: "none", boxSizing: "border-box", marginBottom: 12 }} />
        <button onClick={handleSend} disabled={!message.trim()} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 8, border: "none", background: message.trim() ? T.accent : "#3a3528", color: "#fff", fontWeight: 600, fontSize: 13, cursor: message.trim() ? "pointer" : "default" }}>
          {sent ? <><Check size={14} /> Sent!</> : <><Send size={14} /> Send to All Members</>}
        </button>
      </AdminCard>
      <AdminCard title="Recent Announcements">
        {ANNOUNCEMENTS.map(a => (
          <div key={a.id} style={{ padding: "12px 0", borderBottom: "1px solid #3a3528", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ color: "#fff", fontWeight: 600, fontSize: 14, margin: 0 }}>{a.title}</p>
              <p style={{ color: "#9ca3af", fontSize: 12, margin: "4px 0 0" }}>{a.message}</p>
            </div>
            {a.pinned && <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 8px", borderRadius: 4, background: `${T.accent}20`, color: T.accent }}>Pinned</span>}
          </div>
        ))}
      </AdminCard>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SALES WRAPPER
// ═══════════════════════════════════════════════════════════════
const WRAPPER_FEATURES = [
  { icon: CalendarDays, label: "Class Scheduling", sub: "Weekly schedule with real-time reservations" },
  { icon: TrendingUp, label: "Practice Tracking", sub: "Reflections, streaks, and milestone badges" },
  { icon: Heart, label: "Community Feed", sub: "Member milestones and celebrations" },
  { icon: Users, label: "Teacher Profiles", sub: "Bios, certifications, and specialties" },
  { icon: CreditCard, label: "Membership Tiers", sub: "5 plans from drop-in to unlimited" },
  { icon: PartyPopper, label: "Events & Workshops", sub: "Sound baths, retreats, and teacher training" },
  { icon: Bell, label: "Smart Notifications", sub: "Class reminders and streak alerts" },
  { icon: LayoutDashboard, label: "Admin Dashboard", sub: "Full analytics, CRM, and broadcast tools" },
];

const WRAPPER_CARDS = [
  { icon: Shield, title: "Admin Dashboard", body: "Tap the shield icon in the app header to access the full admin suite -- analytics, member CRM, scheduling, and broadcast tools." },
  { icon: Flame, title: "Built for Firelight Yoga", body: "Custom-designed around your brand, class types, teachers, and the community your members already love -- your Fire Room and Earth Room sanctuary in North Portland." },
  { icon: MapPin, title: "Community-First Design", body: "Celebrate milestones, track streaks, share guest passes, and build the kind of studio loyalty that keeps members coming back to the mat." },
];

function DemoWrapper({ children }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 48, height: "100vh", padding: "20px 32px", background: "#f5f0e8", fontFamily: "'DM Sans', system-ui, sans-serif", alignItems: "center", overflow: "hidden" }}>
      {/* Left Panel */}
      <div className="sales-panel sales-left" style={{ width: 280, flexShrink: 0, paddingTop: 20, maxHeight: "100vh", overflowY: "auto" }}>
        <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: T.accent, marginBottom: 28 }}>App Preview</p>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36 }}>
          <img src="/images/logo-icon.svg" alt="Firelight Yoga" style={{ width: 48, height: 48, borderRadius: 12 }} />
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, margin: 0, color: T.text, lineHeight: 1.1 }}>FIRELIGHT</h2>
            <p style={{ fontSize: 14, color: T.textMuted, margin: "2px 0 0" }}>Yoga Studio App</p>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {WRAPPER_FEATURES.map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <f.icon size={20} color={T.textMuted} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <p style={{ fontWeight: 700, fontSize: 15, margin: 0, color: T.text }}>{f.label}</p>
                <p style={{ fontSize: 14, color: T.textMuted, margin: "2px 0 0", lineHeight: 1.4 }}>{f.sub}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 48, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: T.textFaint }}>Built by</span>
          <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: "0.08em", color: T.text }}>LUMI</span>
          <span style={{ fontSize: 12, color: T.textFaint }}>--</span>
          <a href="https://lumiclass.app" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 600, color: T.accent, textDecoration: "none", display: "flex", alignItems: "center", gap: 3 }}>
            LumiClass.app <ExternalLink size={11} />
          </a>
        </div>
      </div>

      {/* Center -- the app */}
      <div style={{ flexShrink: 0 }}>
        {children}
      </div>

      {/* Right Panel */}
      <div className="sales-panel sales-right" style={{ width: 300, flexShrink: 0, paddingTop: 20, maxHeight: "100vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: 20 }}>
        {WRAPPER_CARDS.map((card, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "24px 22px", border: `1px solid ${T.border}` }}>
            <card.icon size={24} color={T.accent} style={{ marginBottom: 14 }} />
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, margin: "0 0 8px", color: T.text }}>{card.title}</h3>
            <p style={{ fontSize: 15, color: T.textMuted, margin: 0, lineHeight: 1.55 }}>{card.body}</p>
          </div>
        ))}

        <div style={{ textAlign: "center", padding: "16px 0 0" }}>
          <p style={{ fontSize: 12, color: T.textFaint, margin: 0 }}>
            Powered by <span style={{ fontWeight: 800, letterSpacing: "0.08em", color: T.textMuted }}>LUMI</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("home");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [classRegistrations, setClassRegistrations] = useState({});
  const [reservationClass, setReservationClass] = useState(null);
  const [feedCelebrations, setFeedCelebrations] = useState({});

  const registerForClass = useCallback((classId) => {
    setClassRegistrations(prev => ({ ...prev, [classId]: true }));
  }, []);

  const openReservation = useCallback((classData) => {
    setReservationClass(classData);
  }, []);

  const celebrateFeed = useCallback((feedId) => {
    setFeedCelebrations(prev => ({ ...prev, [feedId]: prev[feedId] ? 0 : 1 }));
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const handleLogoClick = useCallback(() => {
    setPage("home");
  }, []);

  const unreadCount = 2;

  const mainTabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "schedule", label: "Schedule", icon: CalendarDays },
    { id: "events", label: "Events", icon: PartyPopper },
    { id: "practice", label: "Practice", icon: TrendingUp },
    { id: "more", label: "More", icon: Menu },
  ];

  const moreItems = [
    { id: "classes", label: "Classes", icon: Calendar },
    { id: "teachers", label: "FLY Team", icon: Users },
    { id: "membership", label: "Pricing", icon: CreditCard },
    { id: "community", label: "Community", icon: Heart },
    { id: "rewards", label: "FLY Rewards", icon: Gift },
  ];

  const adminTabs = [
    { id: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "admin-members", label: "Members", icon: Users },
    { id: "admin-schedule", label: "Schedule", icon: CalendarDays },
    { id: "admin-teachers", label: "Teachers", icon: UserCheck },
    { id: "admin-comms", label: "Communications", icon: Megaphone },
  ];

  const isMoreActive = moreItems.some(item => item.id === page);

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage />;
      case "classes": return <ClassesPage />;
      case "schedule": return <SchedulePage />;
      case "practice": return <PracticePage />;
      case "community": return <CommunityPage />;
      case "teachers": return <TeachersPage />;
      case "membership": return <MembershipPage />;
      case "events": return <EventsPage />;
      case "rewards": return (
        <div>
          <PageHero title="FLY Rewards" subtitle="Earn points with every class, redeem for perks" image="/images/studio/pdx-location.jpg" />
          <div style={{ padding: "0 16px" }}>
            <div style={{ background: `linear-gradient(135deg, ${T.bg}, hsl(20,25%,16%))`, borderRadius: 16, padding: "24px 20px", color: "#fff", marginBottom: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.accent, margin: "0 0 8px" }}>Your Points</p>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 700 }}>1,240</div>
              <p style={{ fontSize: 13, color: "#b8a898", margin: "4px 0 0" }}>35 points to next reward</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[{ pts: 500, reward: "Free Guest Pass", icon: UserPlus }, { pts: 1000, reward: "Free Mat & Towel Rental (1 Month)", icon: Gift }, { pts: 1500, reward: "$20 Retail Credit", icon: DollarSign }, { pts: 2500, reward: "Free Workshop Registration", icon: Award }].map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: T.accentGhost, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <r.icon size={20} color={T.accent} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: 14, margin: 0, color: T.text }}>{r.reward}</p>
                    <p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>{r.pts} points</p>
                  </div>
                  <button style={{ padding: "6px 14px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 700, cursor: r.pts <= 1240 ? "pointer" : "default", background: r.pts <= 1240 ? T.accent : T.bgDim, color: r.pts <= 1240 ? "#fff" : T.textFaint }}>
                    {r.pts <= 1240 ? "Redeem" : "Locked"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
      case "admin-dashboard": return <AdminDashboard />;
      case "admin-members": return <AdminMembersPage />;
      case "admin-schedule": return <AdminSchedulePage />;
      case "admin-teachers": return <AdminTeachersPage />;
      case "admin-comms": return <AdminCommsPage />;
      default: return <HomePage />;
    }
  };

  // ——— ADMIN LAYOUT ———
  if (isAdmin) {
    return (
      <AppContext.Provider value={{ page, setPage, classRegistrations, registerForClass, openReservation, feedCelebrations, celebrateFeed }}>
        <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif", background: "#141410", color: "#fff" }}>
          <aside style={{ width: 240, background: "#1a1a14", borderRight: "1px solid #3a3528", display: "flex", flexDirection: "column", position: "fixed", top: 0, bottom: 0 }}>
            <div style={{ padding: "16px 14px", borderBottom: "1px solid #3a3528", display: "flex", alignItems: "center", gap: 10 }}>
              <img src="/images/logo-icon.svg" alt="Firelight Yoga" style={{ width: 36, height: 36, borderRadius: 8 }} />
              <div>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "#fff", display: "block", lineHeight: 1 }}>{STUDIO_CONFIG.name}</span>
                <span style={{ fontSize: 11, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.15em" }}>Admin</span>
              </div>
            </div>
            <nav style={{ flex: 1, padding: "12px 8px", overflow: "auto" }}>
              <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#71717a", padding: "0 10px", margin: "0 0 8px" }}>Management</p>
              {adminTabs.map(tab => {
                const active = page === tab.id;
                return (
                  <button key={tab.id} onClick={() => setPage(tab.id)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", background: active ? T.accent : "transparent", color: active ? "#fff" : "#a1a1aa", fontSize: 13, fontWeight: active ? 600 : 400, cursor: "pointer", marginBottom: 2, textAlign: "left" }}>
                    <tab.icon size={18} />
                    <span>{tab.label}</span>
                    {active && <ChevronRight size={14} style={{ marginLeft: "auto", opacity: 0.6 }} />}
                  </button>
                );
              })}
            </nav>
            <div style={{ borderTop: "1px solid #3a3528", padding: "10px 8px" }}>
              <button onClick={() => { setIsAdmin(false); setPage("home"); }} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", background: "transparent", color: "#a1a1aa", fontSize: 13, cursor: "pointer", textAlign: "left" }}>
                <LogOut size={18} />
                <span>Exit Admin</span>
              </button>
            </div>
          </aside>
          <main style={{ flex: 1, marginLeft: 240, padding: 24, overflow: "auto" }}>
            {renderPage()}
          </main>
        </div>
      </AppContext.Provider>
    );
  }

  // ——— CONSUMER LAYOUT ———
  return (
    <AppContext.Provider value={{ page, setPage, classRegistrations, registerForClass, openReservation, feedCelebrations, celebrateFeed }}>
      <DemoWrapper>
      <div style={{ width: 390, maxWidth: 390, height: "94vh", background: T.bgDim, fontFamily: "'DM Sans', system-ui, sans-serif", position: "relative", borderRadius: 20, overflow: "hidden", boxShadow: "0 8px 60px rgba(0,0,0,.12), 0 2px 12px rgba(0,0,0,.06)", display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <header style={{ flexShrink: 0, zIndex: 30, background: T.bg, color: "#fff", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={handleLogoClick} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", color: "#fff" }}>
            <img src="/images/logo-icon.svg" alt="Firelight Yoga" style={{ width: 38, height: 38, borderRadius: 10 }} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, lineHeight: 1, letterSpacing: "0.02em" }}>{STUDIO_CONFIG.name}</span>
              <span style={{ fontSize: 11, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.15em" }}>{STUDIO_CONFIG.subtitle}</span>
            </div>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <button onClick={() => { setIsAdmin(true); setPage("admin-dashboard"); }} aria-label="Admin panel" style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: T.accent }}>
              <Shield size={20} />
            </button>
            <button onClick={() => setShowNotifications(true)} aria-label="Notifications" style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: "#fff", position: "relative" }}>
              <Bell size={20} />
              {unreadCount > 0 && <span style={{ position: "absolute", top: 4, right: 4, width: 14, height: 14, borderRadius: "50%", background: T.accent, fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>{unreadCount}</span>}
            </button>
            <button onClick={() => setShowSettings(true)} aria-label="Settings" style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: "#fff" }}>
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: "auto", paddingBottom: 0 }}>
          {renderPage()}
        </main>

        {/* More Menu */}
        {showMore && (
          <div onClick={() => setShowMore(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 40 }}>
            <div onClick={e => e.stopPropagation()} style={{ position: "absolute", bottom: 68, left: 16, right: 16, maxWidth: 358, margin: "0 auto", background: T.bgCard, borderRadius: 16, padding: "14px 12px", boxShadow: "0 8px 32px rgba(0,0,0,.15)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 6px 8px" }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20 }}>More</span>
                <button onClick={() => setShowMore(false)} aria-label="Close menu" style={{ padding: 4, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer" }}><X size={18} color={T.textMuted} /></button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {moreItems.map(item => {
                  const active = page === item.id;
                  return (
                    <button key={item.id} onClick={() => { setPage(item.id); setShowMore(false); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "14px 8px", borderRadius: 10, border: "none", cursor: "pointer", background: active ? T.accentGhost : T.bgDim, color: active ? T.accent : T.textMuted }}>
                      <item.icon size={22} />
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Nav */}
        <nav style={{ flexShrink: 0, zIndex: 30, background: T.bgCard, borderTop: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-around", padding: "6px 4px 10px" }}>
            {mainTabs.map(tab => {
              const active = tab.id === "more" ? (isMoreActive || showMore) : page === tab.id;
              if (tab.id === "more") {
                return (
                  <button key={tab.id} onClick={() => setShowMore(true)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "6px 12px", borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", color: active ? T.accent : T.textFaint }}>
                    <tab.icon size={20} strokeWidth={active ? 2.5 : 2} />
                    <span style={{ fontSize: 12, fontWeight: active ? 700 : 500 }}>{tab.label}</span>
                  </button>
                );
              }
              return (
                <button key={tab.id} onClick={() => setPage(tab.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "6px 12px", borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", color: active ? T.accent : T.textFaint }}>
                  <tab.icon size={20} strokeWidth={active ? 2.5 : 2} />
                  <span style={{ fontSize: 12, fontWeight: active ? 700 : 500 }}>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Modals */}
        {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
        {showNotifications && <NotificationsModal onClose={() => setShowNotifications(false)} />}
        {reservationClass && <ReservationModal classData={reservationClass} onConfirm={registerForClass} onClose={() => setReservationClass(null)} />}
      </div>
      </DemoWrapper>
    </AppContext.Provider>
  );
}
