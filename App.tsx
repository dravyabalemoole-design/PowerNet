import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Zap, 
  Wifi, 
  LayoutDashboard, 
  ClipboardList, 
  CreditCard, 
  Bell, 
  Plus,
  ArrowRight,
  TrendingUp,
  LogOut,
  ChevronRight,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  Phone,
  Check,
  X,
  Sparkles,
  Shield,
  Building2,
  RefreshCw,
  Layers,
  Smartphone,
  MapPin,
  Loader2,
  Megaphone,
  Wallet,
  ActivitySquare,
  Moon,
  Sun,
  ChevronLeft,
  Navigation,
  Cpu,
  Search,
  Star,
  Clock,
  Download,
  Users,
  FileText,
  Hammer,
  Radio,
  BarChart3,
  UserCheck,
  Mic,
  MicOff,
  Globe,
  ArrowUpRight,
  Home,
  Languages,
  Mail,
  Lock,
  Activity,
  Wrench,
  ChevronDown,
  Info,
  History,
  FileWarning,
  Trophy,
  Receipt,
  Calendar,
  Tag,
  Navigation2,
  Lightbulb,
  Signal,
  GanttChartSquare,
  AlertTriangle,
  Layers2,
  Database,
  BarChart,
  HardDrive,
  Timer,
  Archive,
  MonitorCheck,
  Server,
  MessageSquare,
  Send,
  PartyPopper,
  ZapOff,
  ShieldAlert,
  LineChart,
  Compass,
  ScrollText
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { ServiceType, ComplaintStatus, Complaint, Bill, LoginRole, LoggedInUser, AppNotification, Language, WiFiPlan } from './types';
import { MOCK_COMPLAINTS, MOCK_BILLS, WIFI_PLANS, DK_BRANCHES, MOCK_NOTIFICATIONS } from './constants';
import { getSmartAssistance } from './services/geminiService';
import { translations } from './translations';

const TECHNICIANS = [
  "Naveen Rao", "Prashanth Shetty", "Sandeep Kulal", "Sharan Poojary", "Vinayaka Bhat", "Guruprasad"
];

const DISTRICT_LOAD = [
  { day: 'Mon', usage: 1200 }, { day: 'Tue', usage: 1350 }, { day: 'Wed', usage: 1100 },
  { day: 'Thu', usage: 1580 }, { day: 'Fri', usage: 1420 }, { day: 'Sat', usage: 1920 },
  { day: 'Sun', usage: 1790 },
];

const WIFI_TRAFFIC_LOAD = [
  { day: 'Mon', usage: 450 }, { day: 'Tue', usage: 520 }, { day: 'Wed', usage: 480 },
  { day: 'Thu', usage: 610 }, { day: 'Fri', usage: 590 }, { day: 'Sat', usage: 850 },
  { day: 'Sun', usage: 780 },
];

const ELECTRICITY_USAGE = [
  { day: 'Mon', usage: 12 }, { day: 'Tue', usage: 15 }, { day: 'Wed', usage: 10 },
  { day: 'Thu', usage: 18 }, { day: 'Fri', usage: 14 }, { day: 'Sat', usage: 22 },
  { day: 'Sun', usage: 19 },
];

const PIE_COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe', '#eff6ff'];

const formatCurrency = (amount: number, lang: Language = 'en') => {
  return new Intl.NumberFormat(lang === 'en' ? 'en-IN' : lang === 'kn' ? 'kn-IN' : 'hi-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

const formatRelativeTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return date.toLocaleDateString();
};

const AbstractBackground = ({ isDark }: { isDark: boolean }) => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    <div className="absolute inset-0">
      <img 
        src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2070&auto=format&fit=crop" 
        alt="Power grid background" 
        className={`w-full h-full object-cover transition-all duration-1000 ${isDark ? 'opacity-60 grayscale' : 'opacity-10 grayscale brightness-110'}`}
      />
      <div className={`absolute inset-0 transition-colors duration-1000 ${isDark ? 'bg-gradient-to-b from-slate-950/70 via-slate-950/20 to-slate-950/90' : 'bg-slate-50/80'}`}></div>
    </div>
    <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-400/10 blur-[120px] rounded-full animate-float"></div>
    <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-indigo-500/10 blur-[140px] rounded-full animate-float" style={{ animationDelay: '-5s' }}></div>
  </div>
);

const Footer = () => (
  <footer className="mt-20 border-t border-slate-200 bg-white/50 backdrop-blur-sm pt-16 pb-12 px-6 relative z-10">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600 rounded-lg">
             <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight italic text-slate-900">PowerNet</h1>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed">Unified Electricity & WiFi Management Portal for Dakshina Kannada.</p>
      </div>
      <div className="text-right">
        <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Regional Headquarters</h4>
        <p className="text-sm text-slate-500 font-bold italic">Dakshina Kannada District, Karnataka</p>
      </div>
    </div>
  </footer>
);

const LandingView = ({ onGetStarted }: { onGetStarted: () => void }) => (
  <div className="min-h-screen text-white relative flex flex-col items-center justify-center overflow-hidden bg-slate-950">
    <div className="absolute inset-0 z-0 overflow-hidden">
      <img 
        src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2070&auto=format&fit=crop" 
        alt="Power Grid" 
        className="w-full h-full object-cover scale-110 opacity-90 brightness-110 transition-all duration-1000"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
    </div>

    <div className="relative z-10 w-full max-w-7xl px-6 flex flex-col items-center text-center">
      <div className="relative mb-6 animate-in fade-in zoom-in duration-1000 ease-out">
        <div className="w-32 h-32 md:w-44 md:h-44 rounded-full bg-blue-600/40 backdrop-blur-3xl border border-blue-400/50 flex items-center justify-center relative animate-float">
           <div className="z-10 bg-slate-900 p-4 md:p-6 rounded-full shadow-[0_0_50px_rgba(59,130,246,0.5)] border border-white/20">
              <Zap className="w-12 h-12 md:w-20 md:h-20 text-blue-500 fill-blue-500/30 drop-shadow-[0_0_30px_rgba(59,130,246,1)]" />
           </div>
        </div>
      </div>
      <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-4 drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
        Power<span className="text-blue-500">Net</span>
      </h1>
      <div className="space-y-3 mb-8 max-w-3xl">
        <p className="text-white text-lg md:text-2xl leading-tight font-black uppercase italic tracking-tighter drop-shadow-2xl">
          Unified Electricity & WiFi Management System
        </p>
        <p className="text-blue-400 text-sm md:text-base font-bold italic tracking-wide uppercase drop-shadow-xl">
          Empowering Dakshina Kannada with seamless utility tracking and high-speed connectivity.
        </p>
      </div>
      <button onClick={onGetStarted} className="px-10 py-5 bg-blue-600 text-white font-black uppercase tracking-[0.3em] rounded-[2.5rem] hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all shadow-[0_0_60px_rgba(37,99,235,0.7)] flex items-center gap-4 group text-xs">
        Get Started 
        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
      </button>
    </div>
  </div>
);

const LoginView = ({ onLogin }: { onLogin: (user: LoggedInUser) => void }) => {
  const [role, setRole] = useState<LoginRole>('user');
  const [branch, setBranch] = useState('Mangalore City');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');

  const validateEmail = (emailStr: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'user' && !validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    onLogin({
      name: name || (role === 'admin' ? (branch === 'Central Head Office' ? 'District Admin' : `${branch} Head`) : 'Consumer'),
      role,
      email,
      phone,
      adminId: staffId,
      branch: branch,
      language: 'en'
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="w-full max-w-[1100px] flex bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="hidden lg:flex w-[40%] bg-slate-900 p-12 flex-col justify-between text-white relative overflow-hidden">
           <div className="relative z-10">
              <div className="flex items-center gap-2 mb-12">
                <Shield className="w-8 h-8 text-blue-500 fill-blue-500" />
                <span className="text-2xl font-black italic tracking-tighter">PowerNet</span>
              </div>
              <h2 className="text-4xl font-bold leading-tight mb-6">Regional Utility Hub</h2>
              <p className="text-slate-400 text-lg">Unified oversight for Dakshina Kannada operations, billing, and maintenance.</p>
           </div>
           <div className="relative z-10 p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="w-5 h-5 text-blue-400" />
                <span className="text-[10px] font-black uppercase tracking-widest">Active Region</span>
              </div>
              <p className="text-sm font-bold text-slate-300">Dakshina Kannada District Command</p>
           </div>
        </div>

        <div className="flex-1 p-10 lg:p-16 flex flex-col justify-center">
          <div className="mb-8">
            <h3 className="text-3xl font-black text-slate-800 mb-2 italic tracking-tighter uppercase">
              {role === 'user' ? 'Customer Sign In' : 'Administrator Login'}
            </h3>
            <p className="text-slate-500 font-medium">Please select your portal and verify credentials.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
             <button onClick={() => setRole('user')} className={`flex items-center justify-center gap-3 p-5 rounded-[1.5rem] border-2 transition-all ${role === 'user' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 bg-slate-50 text-slate-400'}`}>
                <UserCheck className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Customer</span>
             </button>
             <button onClick={() => setRole('admin')} className={`flex items-center justify-center gap-3 p-5 rounded-[1.5rem] border-2 transition-all ${role === 'admin' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 bg-slate-50 text-slate-400'}`}>
                <Shield className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Admin / Staff</span>
             </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {role === 'user' ? (
              <>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-50/50 border border-slate-200/50 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" placeholder="Your Name" />
                </div>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <select value={branch} onChange={(e) => setBranch(e.target.value)} className="w-full bg-slate-50/50 border border-slate-200/50 rounded-2xl py-3.5 pl-11 pr-10 text-sm font-bold outline-none appearance-none">{DK_BRANCHES.slice(1).map(b => <option key={b} value={b}>{b}</option>)}</select>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 rotate-90" />
                </div>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-slate-50/50 border border-slate-200/50 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" placeholder="+91 XXXXX XXXXX" />
                </div>
                <div className="relative">
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${emailError ? 'text-red-400' : 'text-slate-300'}`} />
                  <input required type="email" value={email} onChange={(e) => { setEmail(e.target.value); setEmailError(''); }} className={`w-full bg-slate-50/50 border ${emailError ? 'border-red-400 ring-4 ring-red-500/10' : 'border-slate-200/50'} rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all`} placeholder="Email" />
                  {emailError && <p className="text-red-500 text-[10px] font-bold mt-1 ml-4">{emailError}</p>}
                </div>
              </>
            ) : (
              <>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <select value={branch} onChange={(e) => setBranch(e.target.value)} className="w-full bg-slate-50/50 border border-slate-200/50 rounded-2xl py-3.5 pl-11 pr-10 text-sm font-bold outline-none appearance-none">{DK_BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}</select>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 rotate-90" />
                </div>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input required type="text" value={staffId} onChange={(e) => setStaffId(e.target.value)} className="w-full bg-slate-50/50 border border-slate-200/50 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" placeholder="Staff ID (DK-ST-XXXX)" />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50/50 border border-slate-200/50 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" placeholder="Password" />
                </div>
              </>
            )}
            <button type="submit" className="w-full py-5 bg-blue-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-3 mt-4">
              Continue to Portal <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const AIAssistantView = ({ context, onBack }: { context: any, onBack: () => void }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: "Hello! I'm your PowerNet Smart Assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    const response = await getSmartAssistance(userMsg, context);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-[700px] flex flex-col bg-white rounded-[4rem] border border-white shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="p-8 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-all"><ChevronLeft className="w-6 h-6 text-white" /></button>
          <div className="p-3 bg-blue-600 rounded-2xl shadow-lg"><Sparkles className="w-6 h-6 text-white" /></div>
          <div><h3 className="text-xl font-black italic uppercase tracking-tighter">Smart AI Assistant</h3></div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-6 rounded-[2.5rem] shadow-sm ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-50 text-slate-800 rounded-tl-none'}`}>
              <p className="text-[15px] font-bold leading-relaxed">{m.content}</p>
            </div>
          </div>
        ))}
        {loading && <div className="flex justify-start"><div className="bg-slate-50 p-6 rounded-[2.5rem] flex gap-2"><div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div><div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div><div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div></div></div>}
      </div>

      <div className="p-8 border-t border-slate-100 bg-white">
        <div className="relative">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask about bills, outages, or plan upgrades..." className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-5 pl-8 pr-20 font-bold outline-none focus:border-blue-500 transition-all" />
          <button onClick={handleSend} disabled={!input.trim() || loading} className="absolute right-3 top-1/2 -translate-y-1/2 p-4 bg-blue-600 text-white rounded-2xl shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50"><Send className="w-5 h-5" /></button>
        </div>
      </div>
    </div>
  );
};

const UsageGraph = ({ data, color, label }: { data: any[], color: string, label: string }) => (
  <div className="bg-white/80 backdrop-blur-md p-8 rounded-[3.5rem] border border-white shadow-xl">
    <div className="flex items-center justify-between mb-8">
      <div><h4 className="text-2xl font-black italic uppercase text-slate-900 tracking-tighter">{label}</h4><p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Analysis Cycle</p></div>
      <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-full"><TrendingUp className="w-4 h-4" /><span className="text-[10px] font-black uppercase">Active</span></div>
    </div>
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`usageGradient-${label}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
          <Tooltip contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05)', fontWeight: 900, fontSize: '12px' }} />
          <Area type="monotone" dataKey="usage" stroke={color} strokeWidth={4} fillOpacity={1} fill={`url(#usageGradient-${label})`} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const UsagePieChart = ({ data, label }: { data: any[], label: string }) => (
  <div className="bg-white/80 backdrop-blur-md p-8 rounded-[3.5rem] border border-white shadow-xl h-full flex flex-col">
    <div className="flex items-center justify-between mb-8">
      <div><h4 className="text-2xl font-black italic uppercase text-slate-900 tracking-tighter">{label}</h4><p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Weekly Breakdown</p></div>
      <ActivitySquare className="w-6 h-6 text-blue-600 opacity-20" />
    </div>
    <div className="flex-1 min-h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="usage" nameKey="day" label={({ day, percent }) => `${day} ${(percent * 100).toFixed(0)}%`}>
            {data.map((_, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="rgba(255,255,255,0.2)" strokeWidth={2} />)}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05)', fontWeight: 900, fontSize: '12px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const RecentActivityFeed = ({ user, bills, complaints, notifications, lang, onNavigate }: { user: LoggedInUser | null, bills: Bill[], complaints: Complaint[], notifications: AppNotification[], lang: Language, onNavigate: (tab: string, item?: any) => void }) => {
  const activities = useMemo(() => {
    const list: any[] = [];
    bills.forEach(b => { if (b.status === 'PAID' && b.paidAt) list.push({ id: `act-bill-${b.id}`, type: 'PAYMENT', title: `Payment #${b.id}`, desc: `Cleared dues for ${b.period}`, time: b.paidAt, icon: CreditCard, color: 'text-green-500', bg: 'bg-green-50', data: b, tab: user?.role === 'user' ? 'billing' : 'dashboard' }); });
    complaints.forEach(c => { list.push({ id: `act-comp-${c.id}`, type: 'COMPLAINT', title: `Ticket ${c.id}`, desc: `${c.category}: ${c.status}`, time: c.createdAt, icon: ClipboardList, color: c.status === ComplaintStatus.RESOLVED ? 'text-green-500' : 'text-blue-500', bg: c.status === ComplaintStatus.RESOLVED ? 'bg-green-50' : 'bg-blue-50', data: c, tab: user?.role === 'admin' ? 'incident_log' : 'complaints' }); });
    return list.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8);
  }, [bills, complaints, notifications, user, lang]);

  return (
    <div className="bg-white/80 backdrop-blur-md p-10 rounded-[4rem] border border-white shadow-xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-10">
        <div><h4 className="text-2xl font-black italic uppercase text-slate-900 tracking-tighter">Recent Activity</h4><p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Live Feed</p></div>
        <div className="p-3 bg-slate-900 text-white rounded-2xl"><Radio className="w-5 h-5 animate-pulse" /></div>
      </div>
      <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {activities.length === 0 ? <div className="py-20 text-center text-slate-300 font-black uppercase italic tracking-widest text-[10px]">No activity logs</div> : activities.map(act => (
          <div key={act.id} onClick={() => onNavigate(act.tab, act.data)} className="flex items-center gap-6 p-5 rounded-[2.5rem] hover:bg-white hover:shadow-lg transition-all cursor-pointer group">
            <div className={`p-4 rounded-2xl ${act.bg} ${act.color} transition-all group-hover:scale-110`}><act.icon className="w-6 h-6" /></div>
            <div className="flex-1">
              <div className="flex items-center justify-between"><h5 className="font-black italic text-[15px] uppercase text-slate-900">{act.title}</h5><span className="text-[9px] font-black uppercase text-slate-300">{formatRelativeTime(act.time)}</span></div>
              <p className="text-slate-500 font-bold text-[11px] mt-1 line-clamp-1">{act.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-blue-500 transition-all" />
          </div>
        ))}
      </div>
    </div>
  );
};

const PaymentGateway = ({ bill, user, onSuccess, onCancel, lang, walletBalance, effectiveAmount }: { bill: Bill, user: LoggedInUser, onSuccess: (billId: string, cashback: number, method: string) => void, onCancel: () => void, lang: Language, walletBalance: number, effectiveAmount: number }) => {
  const [step, setStep] = useState<'REVIEW' | 'METHOD' | 'PIN' | 'PROCESSING' | 'SUCCESS'>('REVIEW');
  const [method, setMethod] = useState<'UPI' | 'CARD' | 'WALLET'>('UPI');
  const [pin, setPin] = useState('');
  const cashbackEarned = useMemo(() => Math.floor(effectiveAmount * (0.05 + Math.random() * 0.05)), [effectiveAmount]);
  
  const handleVerifyPin = () => {
    if (pin.length === 4) {
      setStep('PROCESSING');
      setTimeout(() => {
        setStep('SUCCESS');
        onSuccess(bill.id, cashbackEarned, method);
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md">
      <div className="bg-white rounded-[4rem] w-full max-w-2xl shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
        {step === 'REVIEW' && (
          <div className="p-12 sm:p-16 space-y-10">
            <h3 className="text-4xl font-black italic uppercase text-slate-900 tracking-tighter">Review Bill</h3>
            <div className="bg-slate-50 p-10 rounded-[3rem] space-y-4">
              <div className="flex justify-between border-b pb-4 text-slate-400 uppercase text-[10px]"><span>Bill ID</span><span className="text-slate-900 font-black italic">#{bill.id}</span></div>
              <div className="flex justify-between pt-4 text-xl font-black uppercase"><span>Amount</span><span className="text-3xl text-blue-600 italic font-black">{formatCurrency(effectiveAmount, lang)}</span></div>
            </div>
            <button onClick={() => setStep('METHOD')} className="w-full py-7 bg-slate-900 text-white font-black uppercase tracking-[0.3em] rounded-[2.5rem] shadow-2xl hover:bg-blue-600 transition-all">Select Payment Method</button>
          </div>
        )}
        {step === 'METHOD' && (
          <div className="p-12 sm:p-16 space-y-10">
            <h3 className="text-4xl font-black italic uppercase text-slate-900 tracking-tighter">Choose Method</h3>
            <div className="space-y-4">
              {['UPI', 'CARD', 'WALLET'].map(m => {
                 const isWallet = m === 'WALLET';
                 const isInsuf = isWallet && walletBalance < effectiveAmount;
                 return (
                  <button key={m} onClick={() => !isInsuf && setMethod(m as any)} disabled={isInsuf} className={`w-full p-6 rounded-[2rem] border-2 flex items-center gap-6 transition-all ${method === m ? 'border-blue-600 bg-blue-50' : 'border-slate-100'} ${isInsuf ? 'opacity-50 grayscale' : ''}`}>
                    <div className={`p-4 rounded-2xl ${method === m ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}><CreditCard className="w-7 h-7" /></div>
                    <div className="text-left"><p className="text-lg font-black italic">{isWallet ? 'PowerNet Wallet' : `${m} Payment`}</p></div>
                  </button>
                 );
              })}
            </div>
            <button onClick={() => setStep('PIN')} className="w-full py-7 bg-blue-600 text-white font-black uppercase tracking-[0.3em] rounded-[2.5rem] shadow-xl hover:bg-blue-700 transition-all">Proceed to Secure PIN</button>
          </div>
        )}
        {step === 'PIN' && (
          <div className="p-12 sm:p-16 space-y-10 text-center">
            <h3 className="text-4xl font-black italic uppercase text-slate-900 tracking-tighter">Secure Verification</h3>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Enter 4-Digit Security PIN</p>
            <div className="flex justify-center gap-4">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className={`w-16 h-20 rounded-2xl border-4 flex items-center justify-center text-3xl font-black transition-all ${pin[i] ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 bg-slate-50'}`}>
                  {pin[i] ? '•' : ''}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button key={num} onClick={() => pin.length < 4 && setPin(p => p + num)} className="h-16 rounded-2xl bg-slate-50 text-slate-900 font-black text-xl hover:bg-slate-900 hover:text-white transition-all">{num}</button>
              ))}
              <button onClick={() => setPin('')} className="h-16 rounded-2xl bg-red-50 text-red-500 font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Clear</button>
              <button onClick={() => pin.length < 4 && setPin(p => p + '0')} className="h-16 rounded-2xl bg-slate-50 text-slate-900 font-black text-xl hover:bg-slate-900 hover:text-white transition-all">0</button>
              <button onClick={handleVerifyPin} disabled={pin.length !== 4} className="h-16 rounded-2xl bg-blue-600 text-white font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all disabled:opacity-50">Done</button>
            </div>
          </div>
        )}
        {step === 'PROCESSING' && <div className="p-24 text-center space-y-10 flex flex-col items-center justify-center min-h-[500px]"><Loader2 className="w-20 h-20 animate-spin text-blue-600" /><h3 className="text-3xl font-black italic uppercase">Processing Securely...</h3></div>}
        {step === 'SUCCESS' && (
          <div className="p-16 text-center space-y-12 animate-in zoom-in-95 duration-500">
            <div className="relative">
              <div className="w-32 h-32 bg-green-500 rounded-[4rem] mx-auto flex items-center justify-center text-white shadow-2xl animate-bounce">
                <CheckCircle2 className="w-16 h-16" />
              </div>
              <Sparkles className="absolute -top-4 -right-4 w-12 h-12 text-yellow-400 animate-pulse" />
              <Sparkles className="absolute -bottom-4 -left-4 w-12 h-12 text-blue-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
            <div>
              <h3 className="text-5xl font-black italic uppercase text-slate-900 tracking-tighter">Payment Successful!</h3>
              <p className="text-slate-400 font-bold uppercase tracking-widest mt-4">Thank you for your prompt payment.</p>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Trophy className="w-6 h-6 text-yellow-300" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Exclusive Reward</span>
                </div>
                <h4 className="text-4xl font-black italic mb-2 tracking-tighter">You've Earned {formatCurrency(cashbackEarned, lang)}</h4>
                <p className="text-blue-100 font-bold text-xs">Instantly credited to your PowerNet Wallet!</p>
              </div>
              <PartyPopper className="absolute -bottom-4 -right-4 w-32 h-32 opacity-20 rotate-12 group-hover:scale-125 transition-transform duration-700" />
            </div>
            <button onClick={onCancel} className="w-full py-7 bg-slate-900 text-white font-black uppercase tracking-[0.3em] rounded-[2.5rem] hover:bg-blue-600 transition-all shadow-xl">Back to Services</button>
          </div>
        )}
      </div>
    </div>
  );
};

const StandardBackArrow = ({ onClick, dark }: { onClick: () => void, dark?: boolean }) => (
  <button onClick={onClick} className={`w-12 h-12 rounded-full border shadow-xl flex items-center justify-center transition-all active:scale-90 group ${dark ? 'bg-slate-800 border-white/10 text-white hover:bg-blue-600' : 'bg-white/90 border-slate-200 text-slate-600 hover:bg-slate-900 hover:text-white'}`}><ChevronLeft className="w-7 h-7" /></button>
);

const StandardSwitch = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
  <button onClick={onChange} className={`w-14 h-8 rounded-full transition-all duration-300 relative flex items-center px-1 ${checked ? 'bg-blue-600' : 'bg-slate-300'}`}>
    <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
  </button>
);

const BillDetailsView = ({ bill, onBack, onPay, lang, finalAmount, isSchemeApplied }: { bill: Bill, onBack: () => void, onPay: (b: Bill) => void, lang: Language, finalAmount: number, isSchemeApplied: boolean }) => (
  <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-700 max-w-5xl mx-auto">
    <div className="flex items-center gap-6"><StandardBackArrow onClick={onBack} /><div><h3 className="text-4xl font-black italic uppercase text-slate-900 tracking-tighter">Invoice #{bill.id}</h3><p className="text-[11px] font-black uppercase text-slate-400 tracking-[0.4em]">Breakdown</p></div></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-8">
        <div className="bg-white/90 p-12 rounded-[4rem] border border-white shadow-xl space-y-10">
          <div className="flex items-center justify-between">
            <div className={`p-8 rounded-[2.5rem] ${bill.type === ServiceType.ELECTRICITY ? 'bg-orange-50 text-orange-600' : 'bg-indigo-50 text-indigo-600'}`}>{bill.type === ServiceType.ELECTRICITY ? <Zap className="w-12 h-12" /> : <Wifi className="w-12 h-12" />}</div>
            <div className="text-right"><span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${bill.status === 'PAID' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{bill.status}</span><p className="text-[12px] font-black uppercase text-slate-400 mt-4">{bill.period}</p></div>
          </div>
          <div className="space-y-6">
            <h4 className="text-[12px] font-black uppercase text-slate-400 tracking-[0.3em] border-b pb-4">Financial Overview</h4>
            <div className="grid grid-cols-2 gap-10">
              <div><p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Total Due</p><div className="flex items-center gap-3"><p className="text-4xl font-black italic text-slate-900">{formatCurrency(finalAmount, lang)}</p></div></div>
              <div><p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Due Date</p><p className="text-2xl font-black italic text-slate-600">{bill.dueDate}</p></div>
            </div>
            {isSchemeApplied && <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 text-[10px] font-black uppercase">Benefit: Griha Jyothi Yojana Applied</div>}
          </div>
          {bill.status === 'UNPAID' ? <button onClick={() => onPay(bill)} className="w-full py-7 bg-blue-600 text-white font-black uppercase tracking-[0.3em] rounded-[2.5rem] hover:bg-blue-700 transition-all shadow-xl">Pay Now</button> : <button className="w-full py-7 bg-slate-900 text-white font-black uppercase tracking-[0.3em] rounded-[2.5rem] flex items-center justify-center gap-4"><Download className="w-6 h-6" /> Download Receipt</button>}
        </div>
      </div>
      <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl h-fit">
        <h4 className="text-xl font-black italic uppercase tracking-tighter">Service Details</h4>
        <div className="mt-8 space-y-6">
          <div><p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Branch</p><p className="font-bold">{bill.branch}</p></div>
          {bill.unitsConsumed && <div><p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Consumption</p><p className="font-bold">{bill.unitsConsumed} Units</p></div>}
          <div><p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Consumer</p><p className="font-bold">{bill.userName || 'Member'}</p></div>
        </div>
      </div>
    </div>
  </div>
);

const NotificationDetailsView = ({ notification, onBack, role }: { notification: AppNotification, onBack: () => void, role?: LoginRole }) => (
  <div className="animate-in fade-in slide-in-from-right-8 duration-700 max-w-6xl mx-auto">
    {role === 'admin' ? (
      /* Unified Admin Technical Command Briefing View for all branches */
      <div className="space-y-12">
        <div className="flex items-center gap-8">
          <StandardBackArrow onClick={onBack} dark />
          <div>
            <h3 className="text-4xl font-black italic uppercase text-slate-900 tracking-tighter">System Intelligence Briefing</h3>
            <p className="text-[11px] font-black uppercase text-slate-400 tracking-[0.5em] mt-1">High-Level Dispatch Log</p>
          </div>
        </div>
        
        <div className="bg-slate-900 p-12 rounded-[4rem] border border-white/10 shadow-2xl space-y-12 relative overflow-hidden">
          <div className="flex items-start justify-between relative z-10">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest inline-block ${notification.type === 'ALERT' ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' : notification.type === 'MAINTENANCE' ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white'}`}>{notification.type} STATUS</div>
                <div className="px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest inline-block bg-white/10 text-white/60 border border-white/10">CLASS: {notification.serviceType || 'CORE_SYSTEM'}</div>
              </div>
              <h4 className="text-5xl font-black italic uppercase text-white tracking-tighter leading-tight max-w-3xl">{notification.title}</h4>
            </div>
            <div className={`p-10 rounded-[3rem] ${notification.type === 'ALERT' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'} shadow-inner`}>
              {notification.type === 'ALERT' ? <ShieldAlert className="w-16 h-16" /> : notification.type === 'MAINTENANCE' ? <Hammer className="w-16 h-16" /> : <Server className="w-16 h-16" />}
            </div>
          </div>

          <div className="p-12 bg-white/5 rounded-[3rem] border border-white/5 backdrop-blur-md relative z-10 group overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
            <p className="text-blue-100 font-bold text-2xl leading-relaxed italic">"{notification.message}"</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
             <div className="p-8 bg-black/30 rounded-3xl border border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">System Reference</p>
                <p className="text-white font-mono text-lg font-bold">LOG_ID: {notification.id}</p>
             </div>
             <div className="p-8 bg-black/30 rounded-3xl border border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Timestamp</p>
                <p className="text-white font-mono text-lg font-bold">{new Date(notification.timestamp).toLocaleString()}</p>
             </div>
             <div className="p-8 bg-black/30 rounded-3xl border border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Origin Jurisdiction</p>
                <p className="text-white font-mono text-lg font-bold">{notification.targetBranch || 'DISTRICT_WID'}</p>
             </div>
          </div>
          
          <Activity className="absolute bottom-[-50px] right-[-50px] w-96 h-96 opacity-[0.03] rotate-45 pointer-events-none" />
        </div>
      </div>
    ) : (
      /* User Consumer Notification Detail View */
      <div className="space-y-12 max-w-5xl mx-auto">
        <div className="flex items-center gap-6">
          <StandardBackArrow onClick={onBack} />
          <div>
            <h3 className="text-4xl font-black italic uppercase text-slate-900 tracking-tighter">Alert Info</h3>
            <p className="text-[11px] font-black uppercase text-slate-400 tracking-[0.4em]">Log Entry</p>
          </div>
        </div>
        <div className="bg-white/90 p-12 rounded-[4rem] border border-white shadow-xl space-y-10">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest inline-block ${notification.type === 'MAINTENANCE' ? 'bg-orange-100 text-orange-600' : notification.type === 'ALERT' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>{notification.type}</div>
              <h4 className="text-4xl font-black italic uppercase text-slate-900 tracking-tighter leading-tight">{notification.title}</h4>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-slate-50">{notification.type === 'MAINTENANCE' ? <Hammer className="w-10 h-10" /> : <Bell className="w-10 h-10" />}</div>
          </div>
          <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 italic font-bold text-slate-700 text-xl leading-relaxed">"{notification.message}"</div>
          <div className="flex gap-8">
            <div className="flex items-center gap-3 text-slate-400 font-black uppercase text-[10px]"><Clock className="w-4 h-4" /> {new Date(notification.timestamp).toLocaleString()}</div>
            {notification.targetBranch && <div className="flex items-center gap-3 text-slate-400 font-black uppercase text-[10px]"><MapPin className="w-4 h-4" /> {notification.targetBranch}</div>}
          </div>
        </div>
      </div>
    )}
  </div>
);

const ComplaintTrackingView = ({ complaint, role, onBack, onFeedback, onAssignTechnician, onUpdateStatus, adminMode }: { complaint: Complaint, role?: LoginRole, onBack: () => void, onFeedback: (rating: number, comment: string) => void, onAssignTechnician?: (techName: string) => void, onUpdateStatus?: (status: ComplaintStatus) => void, adminMode?: boolean }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  // Calculate current dynamic step for the Status Path
  const steps = ['Logged', 'Assigned', 'Solving', 'Fixed'];
  const currentStepIndex = useMemo(() => {
    if (complaint.status === ComplaintStatus.RESOLVED) return 3; // Fixed
    if (complaint.status === ComplaintStatus.SOLVING) return 2;  // Solving
    if (complaint.technicianName) return 1;                      // Assigned
    return 0;                                                    // Logged
  }, [complaint]);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-right-6 duration-700 max-w-5xl mx-auto">
      <div className="flex items-center gap-6"><StandardBackArrow onClick={onBack} /><div><h3 className="text-4xl font-black italic uppercase text-slate-900 tracking-tighter">Ticket #{complaint.id}</h3><p className="text-[11px] font-black uppercase text-slate-400 tracking-[0.4em]">Tracking</p></div></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white/90 p-12 rounded-[4rem] border border-white shadow-xl space-y-10">
            <div className="flex items-start justify-between">
              <div><span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${complaint.status === ComplaintStatus.RESOLVED ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{complaint.status === ComplaintStatus.RESOLVED ? complaint.status : 'Work in Progress'}</span><h4 className="text-3xl font-black italic uppercase text-slate-900 mt-6 tracking-tighter">{complaint.category}</h4></div>
              <div className="p-8 rounded-[2rem] bg-slate-50">{complaint.type === ServiceType.ELECTRICITY ? <Zap className="w-10 h-10" /> : <Wifi className="w-10 h-10" />}</div>
            </div>
            <p className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 italic font-bold text-slate-600">"{complaint.description}"</p>
            {complaint.technicianName && <div className="flex items-center gap-4 p-6 bg-blue-50 rounded-3xl border border-blue-100"><Wrench className="w-6 h-6 text-blue-600" /><div><p className="text-[10px] font-black uppercase text-blue-400">Technician</p><p className="font-black">{complaint.technicianName}</p></div></div>}
          </div>
          {adminMode && role === 'admin' && <div className="bg-white/90 p-12 rounded-[4rem] border border-white shadow-xl space-y-8">
            <h4 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">Manage Ticket</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               {Object.values(ComplaintStatus).map(s => (
                 <button 
                   key={s} 
                   onClick={() => onUpdateStatus?.(s)} 
                   className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 ${complaint.status === s ? 'border-slate-900 bg-slate-50' : 'border-slate-100 hover:border-slate-200'}`}
                 >
                   <span className="text-[10px] font-black uppercase tracking-widest">{s}</span>
                 </button>
               ))}
            </div>
            {complaint.status !== ComplaintStatus.RESOLVED && <div className="pt-8 border-t border-slate-100 space-y-4">
              <p className="text-[10px] font-black uppercase text-slate-400">Assign Technician</p>
              <div className="flex flex-wrap gap-3">{TECHNICIANS.map(tech => <button key={tech} onClick={() => onAssignTechnician?.(tech)} className={`px-6 py-3 rounded-full text-xs font-bold transition-all ${complaint.technicianName === tech ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>{tech}</button>)}</div>
            </div>}
          </div>}
          {role === 'user' && complaint.status === ComplaintStatus.RESOLVED && !complaint.rating && <div className="bg-blue-600 p-12 rounded-[4rem] text-white space-y-8 shadow-2xl">
            <h4 className="text-3xl font-black italic uppercase tracking-tighter">Your Feedback</h4>
            <div className="flex gap-4">{[1,2,3,4,5].map(s => <button key={s} onClick={() => setRating(s)} className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${rating >= s ? 'bg-white text-blue-600' : 'bg-white/10'}`}><Star className={`w-8 h-8 ${rating >= s ? 'fill-blue-600' : ''}`} /></button>)}</div>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="w-full bg-white/10 border-2 border-white/20 rounded-[2rem] p-6 text-white font-bold outline-none h-32" placeholder="Tell us more..."></textarea>
            <button onClick={() => onFeedback(rating, comment)} disabled={rating === 0} className="w-full py-6 bg-white text-blue-600 font-black uppercase tracking-widest rounded-[2rem]">Submit</button>
          </div>}
        </div>
        <div className="bg-slate-900 p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden h-fit">
          <h4 className="text-2xl font-black italic uppercase tracking-tighter">Status Path</h4>
          <div className="mt-10 space-y-0">
            {steps.map((s, i) => {
              const isCompleted = i < currentStepIndex || complaint.status === ComplaintStatus.RESOLVED;
              const isCurrent = i === currentStepIndex && complaint.status !== ComplaintStatus.RESOLVED;
              
              return (
                <div key={i} className="flex flex-col">
                  <div className="flex gap-6 items-center py-4">
                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500 relative z-10 
                      ${isCompleted ? 'bg-blue-600 border-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 
                        isCurrent ? 'bg-slate-800 border-blue-400 animate-pulse ring-4 ring-blue-500/20' : 
                        'bg-slate-800 border-white/20'}`}
                    >
                      {isCompleted ? <Check className="w-5 h-5 text-white" /> : <span className={`font-black text-xs ${isCurrent ? 'text-blue-400' : 'text-white/40'}`}>{i + 1}</span>}
                    </div>
                    <div>
                      <p className={`font-black uppercase text-[11px] tracking-[0.2em] transition-colors duration-500 ${isCompleted || isCurrent ? 'text-white' : 'text-white/20'}`}>{s}</p>
                      {isCurrent && <p className="text-[8px] font-bold text-blue-400 uppercase tracking-widest mt-1">Operational Stage</p>}
                    </div>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="ml-[1.15rem] w-0.5 h-10 bg-slate-800 relative">
                      <div className={`absolute top-0 left-0 w-full transition-all duration-700 bg-blue-600 ${isCompleted ? 'h-full' : 'h-0'}`}></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <Activity className="absolute -bottom-10 -right-10 w-40 h-40 opacity-5" />
        </div>
      </div>
    </div>
  );
};

const ComplaintTrackingList = ({ complaints, onSelect, serviceType }: { complaints: Complaint[], onSelect: (c: Complaint) => void, serviceType?: ServiceType }) => {
  const displayTitle = serviceType ? `Tickets: ${serviceType}` : 'Incident Matrix';
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-white/90 p-12 rounded-[4rem] border border-white shadow-xl space-y-10">
        <h4 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">{displayTitle}</h4>
        <div className="space-y-6">
          {complaints.length === 0 ? (
            <div className="p-16 text-center text-slate-300 font-black uppercase italic tracking-widest">No active tickets found</div>
          ) : complaints.map(c => {
            const isWIP = c.status !== ComplaintStatus.RESOLVED;
            return (
              <div key={c.id} onClick={() => onSelect(c)} className="p-10 border border-slate-100 rounded-[3rem] flex items-center justify-between hover:bg-slate-50 cursor-pointer group shadow-sm transition-all hover:scale-[1.01]">
                <div className="flex items-center gap-10">
                  <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center relative ${isWIP ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                    {isWIP ? <Clock className="w-8 h-8 animate-pulse" /> : <Check className="w-8 h-8" />}
                    {isWIP && <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>}
                  </div>
                  <div>
                    <h5 className="font-black italic text-2xl uppercase tracking-tighter text-slate-900">{c.category}</h5>
                    <div className="flex items-center gap-4 mt-2">
                      <p className="text-[12px] font-black text-slate-400 uppercase">{c.id}</p>
                      <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${isWIP ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                        {isWIP ? 'Work in Progress' : 'Resolved'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                   <span className="text-[10px] font-black uppercase text-slate-300 hidden sm:block">{formatRelativeTime(c.createdAt)}</span>
                   <ChevronRight className="w-8 h-8 text-slate-200 group-hover:text-blue-500 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const RaiseComplaintForm = ({ type, user, onSubmitted, onCancel }: { type: ServiceType, user: LoggedInUser, onSubmitted: (complaint: Partial<Complaint>) => void, onCancel?: () => void }) => {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(user.branch || '');
  const [contactPhone, setContactPhone] = useState(user.phone || '');
  const [loading, setLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const handleAutoLocate = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLocation(`Lat: ${pos.coords.latitude.toFixed(4)}, Long: ${pos.coords.longitude.toFixed(4)}`); setIsLocating(false); },
      () => { setIsLocating(false); alert("Unable to locate. Please type area manually."); }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onSubmitted({ type, category, description, branch: user.branch || 'Mangalore City', location: location, userName: user.name, technicianPhone: contactPhone });
      setLoading(false);
    }, 1500);
  };

  const categories = type === ServiceType.ELECTRICITY ? ['Power Outage', 'Fluctuation', 'Billing', 'Meter', 'Safety'] : ['No Sync', 'Slow Speed', 'Billing', 'Router', 'Drops'];

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-white/90 p-10 rounded-[4rem] border border-white shadow-2xl space-y-10">
        <div className="flex items-center gap-6">
          {onCancel && <StandardBackArrow onClick={onCancel} />}
          <div>
            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">New Report</h3>
            <p className="text-slate-500 font-bold text-sm">Grievance for {type}.</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4"><label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-4">Incident Area</label><div className="flex gap-3"><input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-700 outline-none focus:border-blue-500 transition-all" placeholder="Area or landmark" /><button type="button" onClick={handleAutoLocate} className="px-6 rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all flex items-center gap-2 font-black uppercase text-[10px] tracking-widest">{isLocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation2 className="w-4 h-4" />} Locate</button></div></div>
          <div className="space-y-4"><label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-4">Contact Phone</label><input required type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-700 outline-none focus:border-blue-500 transition-all" placeholder="+91 XXXXX XXXXX" /></div>
          <div className="space-y-4"><label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-4">Category</label><div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{categories.map(cat => <button key={cat} type="button" onClick={() => setCategory(cat)} className={`p-4 rounded-2xl border-2 text-xs font-black transition-all ${category === cat ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}>{cat}</button>)}</div></div>
          <div className="space-y-4"><label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-4">Description</label><textarea required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] p-6 text-slate-900 font-bold outline-none focus:border-blue-500 h-32 transition-all" placeholder="Describe the issue..."></textarea></div>
          <button type="submit" disabled={!category || !description || loading} className="w-full py-6 bg-blue-600 text-white font-black uppercase tracking-[0.3em] rounded-[2rem] shadow-xl hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-4">{loading ? <Loader2 className="animate-spin w-6 h-6" /> : <><Plus className="w-5 h-5" /> Submit Report</>}</button>
        </form>
      </div>
    </div>
  );
};

const SubmissionSuccessView = ({ complaint, onFeedback, onFinish }: { complaint: Complaint, onFeedback: (rating: number, comment: string) => void, onFinish: () => void }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = () => { onFeedback(rating, comment); setSubmitted(true); };
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in zoom-in-95 duration-700 py-12">
      <div className="flex justify-start">
        <StandardBackArrow onClick={onFinish} />
      </div>
      <div className="text-center space-y-8"><div className="w-40 h-40 bg-green-500 rounded-[4rem] flex items-center justify-center text-white shadow-2xl mx-auto animate-bounce"><CheckCircle2 className="w-24 h-24" /></div><div><h3 className="text-5xl font-black italic uppercase tracking-tighter text-slate-900">Issue Logged</h3><p className="text-slate-400 font-bold text-xl uppercase tracking-widest mt-4">Ticket ID: {complaint.id}</p></div></div>
      <div className="bg-white/90 p-12 rounded-[5rem] border border-white shadow-xl space-y-12 text-center">
        {!submitted ? (<><div className="space-y-4"><h4 className="text-3xl font-black italic uppercase tracking-tighter">Rate the Portal</h4><p className="text-slate-500 font-bold">Help us improve the experience.</p></div><div className="flex justify-center gap-6">{[1,2,3,4,5].map(s => <button key={s} onClick={() => setRating(s)} className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all ${rating >= s ? 'bg-blue-600 text-white scale-110 shadow-lg' : 'bg-slate-50 text-slate-300 hover:bg-slate-100'}`}><Star className={`w-10 h-10 ${rating >= s ? 'fill-white' : ''}`} /></button>)}</div><textarea value={comment} onChange={(e) => setComment(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] p-8 text-slate-900 font-bold outline-none focus:border-blue-500 h-32 text-center" placeholder="Optional comments..."></textarea><div className="grid grid-cols-2 gap-4"><button onClick={onFinish} className="py-6 bg-slate-100 text-slate-500 font-black uppercase tracking-widest rounded-[2rem]">Skip</button><button onClick={handleSubmit} disabled={rating === 0} className="py-6 bg-blue-600 text-white font-black uppercase tracking-widest rounded-[2rem] shadow-xl">Submit Feedback</button></div></>) : (<div className="space-y-8 py-12 animate-in fade-in duration-500"><div className="p-10 bg-blue-50 rounded-[3rem] italic font-black text-blue-600 text-2xl uppercase">Thank you!</div><button onClick={onFinish} className="w-full py-8 bg-slate-900 text-white font-black uppercase tracking-[0.3em] rounded-[2.5rem] shadow-2xl hover:bg-blue-600 transition-all">My Dashboard</button></div>)}
      </div>
    </div>
  );
};

const SmartBillingSection = ({ onProceed, isGrihaJyothiEnabled, lang }: { onProceed: (bill: Bill) => void, isGrihaJyothiEnabled: boolean, lang: Language }) => {
  const [meterNo, setMeterNo] = useState('');
  const [isReading, setIsReading] = useState(false);
  const [estimate, setEstimate] = useState<{units: number, cost: number} | null>(null);
  const handleFetch = () => {
    if (!meterNo || meterNo.length < 5) return;
    setIsReading(true); setEstimate(null);
    setTimeout(() => {
      const units = Math.floor(50 + Math.random() * 350);
      let cost = units * 7;
      if (isGrihaJyothiEnabled) cost = Math.max(0, (units - 200) * 7);
      setEstimate({ units, cost });
      setIsReading(false);
    }, 2500);
  };
  return (
    <div className="bg-white/90 p-12 rounded-[4rem] border border-white shadow-xl space-y-10 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-8"><div className="p-6 bg-indigo-50 text-indigo-600 rounded-[2rem] shadow-sm animate-pulse"><Cpu className="w-12 h-12" /></div><div><h4 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">Real-time Smart Billing</h4><p className="text-slate-500 font-bold text-sm max-w-md">Connect to digital meter to generate an instant invoice.</p></div></div>
      </div>
      <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100"><div className="flex flex-col sm:flex-row gap-4"><div className="relative flex-1"><Tag className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="text" maxLength={8} value={meterNo} onChange={(e) => setMeterNo(e.target.value.replace(/\D/g, ''))} placeholder="Enter Meter No" className="w-full bg-white border-2 border-slate-200 rounded-2xl py-5 pl-14 pr-6 font-black text-slate-900 outline-none focus:border-blue-500 transition-all uppercase tracking-wider" /></div><button onClick={handleFetch} disabled={!meterNo || isReading} className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 disabled:opacity-50 transition-all flex items-center justify-center gap-3">{isReading ? <Loader2 className="w-6 h-6 animate-spin" /> : <RefreshCw className="w-6 h-6" />} {isReading ? 'Syncing...' : 'Fetch Reading'}</button></div></div>
      {estimate && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in zoom-in-95 duration-500">
          <div className="bg-blue-50 p-10 rounded-[3rem] border border-blue-100 flex flex-col items-center text-center space-y-3"><p className="text-[10px] font-black uppercase text-blue-400 tracking-[0.3em]">Consumption</p><h5 className="text-6xl font-black italic text-blue-600 tracking-tighter">{estimate.units} Units</h5></div>
          <div className="bg-slate-900 p-10 rounded-[3rem] text-white flex flex-col items-center justify-center text-center space-y-6"><div><p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em]">Estimated Invoice</p><h5 className="text-6xl font-black italic text-blue-400 tracking-tighter">{formatCurrency(estimate.cost, lang)}</h5>{isGrihaJyothiEnabled && <span className="text-[9px] font-black bg-blue-600 px-3 py-1 rounded-full uppercase">Griha Jyothi: -200 units</span>}</div>{estimate.cost > 0 ? <button onClick={() => onProceed({ id: `EST-${Math.floor(1000 + Math.random() * 9000)}`, userId: 'U-SMART', type: ServiceType.ELECTRICITY, amount: estimate.cost, dueDate: 'Today', status: 'UNPAID', period: 'Live Fetch', branch: 'Digital Hub', unitsConsumed: estimate.units })} className="w-full py-5 bg-blue-600 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-2xl"><CreditCard className="w-5 h-5" /> Pay Now</button> : <div className="w-full p-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[2.5rem]"><div className="flex flex-col items-center gap-4"><PartyPopper className="w-10 h-10 text-yellow-300 animate-pulse" /><h6 className="text-3xl font-black italic uppercase text-white">Zero Dues!</h6><p className="text-[11px] font-black uppercase text-blue-100">Griha Jyothi Yojana</p></div></div>}</div>
        </div>
      )}
    </div>
  );
};

const ServiceCatalog = ({ notifications, userBranch, serviceType }: { notifications: AppNotification[], userBranch?: string, serviceType?: ServiceType }) => {
    const relevantAlerts = useMemo(() => notifications.filter(n => {
        const isAlertOrMaintenance = (n.type === 'ALERT' || n.type === 'MAINTENANCE');
        const isCorrectBranch = (n.targetBranch === userBranch);
        const isCorrectService = !serviceType || !n.serviceType || n.serviceType === serviceType;
        return isAlertOrMaintenance && isCorrectBranch && isCorrectService;
    }), [notifications, userBranch, serviceType]);
    if (relevantAlerts.length === 0) return null;
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-4 px-6"><div className="p-3 bg-red-50 text-red-600 rounded-xl shadow-sm"><Layers2 className="w-6 h-6" /></div><h4 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">Live Alerts for {userBranch}</h4></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relevantAlerts.map(alert => (
                    <div key={alert.id} className="bg-white/90 p-8 rounded-[3rem] border-2 border-red-100 shadow-xl flex items-start gap-6 group overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600"></div>
                        <div className={`p-5 rounded-2xl ${alert.type === 'ALERT' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>{alert.type === 'ALERT' ? <AlertTriangle className="w-7 h-7 animate-pulse" /> : <Hammer className="w-7 h-7" />}</div>
                        <div className="flex-1"><div className="flex items-center justify-between mb-1"><h5 className="text-lg font-black italic uppercase text-slate-900">{alert.title}</h5><span className="text-[9px] font-black uppercase text-slate-300">{formatRelativeTime(alert.timestamp)}</span></div><p className="text-slate-500 font-bold text-sm leading-relaxed">{alert.message}</p></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const WiFiRechargeSection = ({ currentPlan, onRecharge, lang }: { currentPlan: WiFiPlan, onRecharge: (plan: WiFiPlan) => void, lang: Language }) => (
  <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
    <div className="bg-slate-900 p-12 rounded-[4rem] border border-white/5 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-3 text-blue-400"><Signal className="w-8 h-8" /><span className="text-[10px] font-black uppercase tracking-[0.4em]">Active Connection</span></div>
        <h4 className="text-4xl font-black italic uppercase tracking-tighter text-white">{currentPlan.name}</h4>
        <div className="flex gap-4"><span className="px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-black uppercase text-blue-400">{currentPlan.speed} Speed</span><span className="px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-black uppercase text-indigo-400">{currentPlan.validity}</span></div>
      </div>
      <div className="relative z-10 text-center md:text-right"><p className="text-[10px] font-black uppercase text-slate-500 mb-2">Subscription</p><h5 className="text-6xl font-black italic text-blue-500 tracking-tighter">{formatCurrency(currentPlan.price, lang)}/mo</h5></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {WIFI_PLANS.map(plan => (
        <div key={plan.id} className={`bg-white/90 p-10 rounded-[3.5rem] border-4 transition-all hover:scale-[1.03] shadow-xl flex flex-col justify-between gap-10 group relative overflow-hidden ${plan.id === currentPlan.id ? 'border-blue-600' : 'border-white'}`}>
           <div className="space-y-6">
              <div className={`p-5 rounded-2xl ${plan.id === currentPlan.id ? 'bg-blue-600 text-white' : 'bg-slate-50'}`}><Wifi className="w-8 h-8" /></div>
              <div><h5 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">{plan.name}</h5><p className="text-slate-400 text-xs font-bold uppercase mt-1">{plan.speed} Fiber Technology</p></div>
           </div>
           <div className="space-y-6">
              <div className="text-center pt-6 border-t border-slate-100"><h6 className="text-4xl font-black italic text-slate-900 tracking-tighter">{formatCurrency(plan.price, lang)}</h6></div>
              <button onClick={() => onRecharge(plan)} className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl ${plan.id === currentPlan.id ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white'}`}>{plan.id === currentPlan.id ? 'Renew Current' : 'Upgrade'}</button>
           </div>
        </div>
      ))}
    </div>
  </div>
);

const PaymentReminders = ({ bills, user, onPay, lang }: { bills: Bill[], user: LoggedInUser, onPay: (b: Bill) => void, lang: Language }) => {
  const dueBills = useMemo(() => bills.filter(b => b.status === 'UNPAID' && b.userName === user.name), [bills, user]);
  if (dueBills.length === 0) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="flex items-center gap-4 px-2">
        <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><Bell className="w-5 h-5" /></div>
        <h4 className="text-xl font-black italic uppercase tracking-tighter text-slate-900">Priority Reminders</h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dueBills.map(bill => (
          <div key={bill.id} className="bg-white/90 p-8 rounded-[3rem] border-2 border-orange-100 shadow-xl flex items-center justify-between group overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500"></div>
            <div className="flex items-center gap-6">
              <div className={`p-5 rounded-2xl ${bill.type === ServiceType.ELECTRICITY ? 'bg-orange-50 text-orange-600' : 'bg-indigo-50 text-indigo-600'}`}>
                {bill.type === ServiceType.ELECTRICITY ? <Zap className="w-7 h-7" /> : <Wifi className="w-7 h-7" />}
              </div>
              <div>
                <h5 className="text-lg font-black italic uppercase text-slate-900">
                  {bill.type === ServiceType.ELECTRICITY ? 'Electricity Bill' : 'WiFi Recharge'}
                </h5>
                <p className="text-slate-500 font-bold text-sm">Due: {bill.dueDate} • {formatCurrency(bill.amount, lang)}</p>
              </div>
            </div>
            <button 
              onClick={() => onPay(bill)} 
              className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95"
            >
              Pay Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const PowercutAlertModal = ({ onClose, onBroadcast, user }: { onClose: () => void, onBroadcast: (branch: string, title: string, message: string, serviceType: ServiceType) => void, user: LoggedInUser | null }) => {
  const [branch, setBranch] = useState(user?.branch === 'Central Head Office' ? 'All District' : user?.branch || '');
  const [title, setTitle] = useState('Scheduled Power Interruption');
  const [message, setMessage] = useState('Emergency maintenance work between 10:00 AM and 04:00 PM.');
  const handleSend = () => { onBroadcast(branch === 'All District' ? '' : branch, title, message, ServiceType.ELECTRICITY); onClose(); };
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={onClose}></div>
      <div className="bg-white rounded-[5rem] w-full max-w-2xl shadow-[0_0_100px_rgba(239,68,68,0.2)] relative z-10 overflow-hidden border-4 border-red-500/20 animate-in zoom-in-95 duration-300">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
        <div className="p-12 sm:p-16 space-y-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="p-5 bg-red-600 text-white rounded-[2rem] shadow-[0_0_30px_rgba(220,38,38,0.4)] animate-pulse">
                <ShieldAlert className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-4xl font-black italic uppercase text-slate-900 tracking-tighter">Emergency Protocol</h3>
                <p className="text-red-500 font-black uppercase text-[10px] tracking-[0.3em] mt-1">High-Level System Broadcast</p>
              </div>
            </div>
            <button onClick={onClose} className="p-4 bg-slate-50 text-slate-400 rounded-3xl hover:bg-red-50 hover:text-red-500 transition-all border border-slate-100">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em] ml-2">Target Jurisdiction</label>
              <div className="relative group">
                <select value={branch} disabled={user?.branch !== 'Central Head Office'} onChange={(e) => setBranch(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 rounded-3xl py-5 px-8 font-black text-slate-900 outline-none appearance-none disabled:opacity-70 focus:border-red-500 transition-all">
                  {user?.branch === 'Central Head Office' && <option value="All District">All District Command</option>}
                  {DK_BRANCHES.slice(1).map(b => <option key={b} value={b}>{b} Unit</option>)}
                </select>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em] ml-2">Broadcast Headline</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 rounded-3xl py-5 px-8 font-black text-slate-900 outline-none focus:border-red-500 transition-all" placeholder="Enter Alert Title..." />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em] ml-2">Full Situation Brief</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 rounded-[2.5rem] p-8 text-slate-900 font-bold outline-none h-40 focus:border-red-500 transition-all resize-none" placeholder="Details of interruption..."></textarea>
            </div>
          </div>
          <button onClick={handleSend} className="w-full py-8 bg-red-600 text-white font-black uppercase tracking-[0.4em] rounded-[2.5rem] shadow-2xl hover:bg-red-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-6 group">
            Transmit Alert <Radio className="w-6 h-6 group-hover:animate-ping" />
          </button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [view, setView] = useState<'LANDING' | 'LOGIN' | 'APP'>('LANDING');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [lang, setLang] = useState<Language>('en');
  const [isDark, setIsDark] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isGrihaJyothiEnabled, setIsGrihaJyothiEnabled] = useState(false);
  const [activeWiFiPlan, setActiveWiFiPlan] = useState<WiFiPlan>(() => {
    const saved = localStorage.getItem('powernet_active_wifi_plan');
    return saved ? JSON.parse(saved) : WIFI_PLANS[0];
  });
  const [showPowercutModal, setShowPowercutModal] = useState(false);
  
  // Initial bills
  const [bills, setBills] = useState<Bill[]>(() => [
    ...MOCK_BILLS,
    { id: 'B-006', userId: 'U-100', userName: 'Consumer', type: ServiceType.ELECTRICITY, amount: 2450.00, dueDate: '2024-03-25', status: 'UNPAID', period: 'Feb 2024', branch: 'Mangalore City', unitsConsumed: 350 },
    { id: 'B-007', userId: 'U-100', userName: 'Consumer', type: ServiceType.WIFI, amount: 999.00, dueDate: '2024-03-28', status: 'UNPAID', period: 'Mar 2024', branch: 'Mangalore City' },
    { id: 'B-008', userId: 'U-100', userName: 'Consumer', type: ServiceType.ELECTRICITY, amount: 1850.00, dueDate: '2024-02-05', status: 'PAID', period: 'Jan 2024', branch: 'Mangalore City', unitsConsumed: 260, paidAt: '2024-02-01T10:00:00Z', paymentMethod: 'CARD' },
    { id: 'B-009', userId: 'U-100', userName: 'Consumer', type: ServiceType.WIFI, amount: 999.00, dueDate: '2024-02-01', status: 'PAID', period: 'Feb 2024', branch: 'Mangalore City', paidAt: '2024-01-28T14:30:00Z', paymentMethod: 'UPI' },
  ]);

  const [complaints, setComplaints] = useState<Complaint[]>(MOCK_COMPLAINTS);
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const [walletBalance, setWalletBalance] = useState<number>(1500);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [selectedBillForPayment, setSelectedBillForPayment] = useState<Bill | null>(null);
  const [selectedBillForDetails, setSelectedBillForDetails] = useState<Bill | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<AppNotification | null>(null);
  const [userPageMode, setUserPageMode] = useState<'OVERVIEW' | 'RAISE' | 'TRACK' | 'SUCCESS' | 'AI'>('OVERVIEW');
  const [lastComplaintId, setLastComplaintId] = useState<string | null>(null);

  const lastSubmittedComplaint = useMemo(() => complaints.find(c => c.id === lastComplaintId), [complaints, lastComplaintId]);

  useEffect(() => { localStorage.setItem('powernet_active_wifi_plan', JSON.stringify(activeWiFiPlan)); }, [activeWiFiPlan]);

  const handleNotificationClick = (n?: AppNotification) => {
    if (n) {
      setSelectedNotification(n);
      setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item));
    } else {
      setActiveTab('notifications');
      setNotifications(prev => prev.map(item => {
        const isRelevant = user?.role === 'admin' 
          ? ((user.branch === 'Central Head Office' || item.targetBranch === user.branch || !item.targetBranch) && !item.userId)
          : (item.userId === user?.name || item.targetBranch === user?.branch);
        return isRelevant ? { ...item, read: true } : item;
      }));
    }
  };

  const handlePaymentSuccess = (billId: string, cashback: number, method: string) => {
    const billToPay = bills.find(b => b.id === billId) || selectedBillForPayment;
    const amount = billToPay?.amount || 0;
    
    setBills(prev => {
        const exists = prev.some(b => b.id === billId);
        if (exists) {
            return prev.map(b => b.id === billId ? { ...b, status: 'PAID', paymentMethod: method, paidAt: new Date().toISOString() } : b);
        } else if (billToPay && !billId.startsWith('EST-')) {
             return [{ ...billToPay, status: 'PAID', paymentMethod: method, paidAt: new Date().toISOString() } as Bill, ...prev];
        }
        return prev;
    });

    setWalletBalance(prev => prev + cashback - (method === 'WALLET' ? amount : 0));
    
    if (billId.startsWith('WREC-')) {
       const parts = billId.split('-');
       const planId = `${parts[1]}-${parts[2]}`;
       const plan = WIFI_PLANS.find(p => p.id === planId);
       if (plan) setActiveWiFiPlan(plan);
    }
    
    const newTransactionNotification: AppNotification = {
        id: `TR-${Date.now()}`,
        title: 'Transaction Successful',
        message: `Successfully paid ${formatCurrency(amount, lang)} via ${method}. You earned ${formatCurrency(cashback, lang)} cashback!`,
        type: 'SUCCESS',
        timestamp: new Date().toISOString(),
        read: false,
        userId: user?.name // Personal notification
    };
    setNotifications(prev => [newTransactionNotification, ...prev]);
    
    setSelectedBillForPayment(null);
  };

  const handleBroadcastAlert = (targetBranch: string, title: string, message: string, serviceType: ServiceType) => {
    const newId = `BR-${Date.now()}`;
    setNotifications(prev => [{ id: newId, title, message, type: 'ALERT', targetBranch: targetBranch || undefined, serviceType, timestamp: new Date().toISOString(), read: false }, ...prev]);
  };

  const handleRaiseComplaint = (data: Partial<Complaint>) => {
    const newId = `C-${Math.floor(1000 + Math.random() * 9000)}`;
    const newC: Complaint = { ...data, id: newId, userId: user?.name || 'anonymous', userName: user?.name, status: ComplaintStatus.PENDING, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as Complaint;
    setComplaints(prev => [newC, ...prev]);
    
    // Notify Admins of the new report
    setNotifications(prev => [{
        id: `N-NEW-${Date.now()}`,
        title: 'Action Required: New Complaint',
        message: `New incident reported by ${user?.name} in ${data.branch}. Ticket ID: #${newId}.`,
        type: 'ALERT',
        timestamp: new Date().toISOString(),
        read: false,
        targetBranch: data.branch, // Branch specific
        serviceType: data.type
    }, ...prev]);

    setLastComplaintId(newId);
    setUserPageMode('SUCCESS');
  };

  const handleBackNavigation = () => {
    if (userPageMode !== 'OVERVIEW') {
      setUserPageMode('OVERVIEW');
    } else if (selectedComplaint) {
      setSelectedComplaint(null);
    } else if (selectedBillForDetails) {
      setSelectedBillForDetails(null);
    } else if (selectedNotification) {
      setSelectedNotification(null);
    } else if (activeTab !== 'dashboard') {
      setActiveTab('dashboard');
    }
  };

  const executeSearch = (term: string) => {
    const lowerTerm = term.toLowerCase().trim();
    if (!lowerTerm) return;

    const routes: Record<string, string[]> = {
      dashboard: ['dashboard', 'home', 'main', 'summary'],
      electricity: ['electricity', 'power', 'light', 'current', 'outage', 'meter', 'energy'],
      wifi: ['wifi', 'internet', 'fiber', 'network', 'broadband', 'recharge', 'data'],
      billing: ['billing', 'bill', 'payment', 'money', 'wallet', 'pay', 'invoice'],
      notifications: ['alerts', 'notifications', 'updates', 'messages', 'maintenance'],
      profile: ['profile', 'account', 'settings', 'user', 'language', 'theme'],
      incident_log: ['incident', 'log', 'reports', 'cases', 'issues', 'consumer']
    };

    for (const [tabId, keywords] of Object.entries(routes)) {
      if (keywords.some(k => lowerTerm.includes(k))) {
        if (tabId === 'billing' && user?.role === 'admin') continue;
        setActiveTab(tabId);
        setSearchTerm('');
        setSelectedComplaint(null);
        setSelectedBillForDetails(null);
        setSelectedNotification(null);
        setUserPageMode('OVERVIEW');
        return;
      }
    }
  };

  const unreadCount = useMemo(() => notifications.filter(n => !n.read && (user?.role === 'admin' ? ((user.branch === 'Central Head Office' || n.targetBranch === user.branch || !n.targetBranch) && !n.userId) : (n.targetBranch === user?.branch || n.userId === user?.name))).length, [notifications, user]);
  const filteredComplaints = useMemo(() => complaints.filter(c => (user?.role === 'admin' ? (user.branch === 'Central Head Office' || c.branch === user.branch) : (c.userName === user?.name)) && (c.id.includes(searchTerm) || c.category.toLowerCase().includes(searchTerm.toLowerCase()))), [complaints, searchTerm, user]);

  const t = (key: string) => (translations[lang] as any)[key] || key;
  const isAtRoot = activeTab === 'dashboard' && userPageMode === 'OVERVIEW' && !selectedComplaint && !selectedBillForDetails && !selectedNotification;
  const userServiceComplaints = useMemo(() => {
    const serviceType = activeTab === 'electricity' ? ServiceType.ELECTRICITY : ServiceType.WIFI;
    return complaints.filter(c => c.userName === user?.name && c.type === serviceType);
  }, [complaints, user, activeTab]);

  return (
    <div className={`min-h-screen transition-all duration-700 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      {view === 'LANDING' ? <LandingView onGetStarted={() => setView('LOGIN')} /> : (
        <>
          <AbstractBackground isDark={isDark} />
          {view === 'LOGIN' ? <LoginView onLogin={(u) => { setUser(u); setView('APP'); }} /> : (
            <>
              {selectedBillForPayment && <PaymentGateway bill={selectedBillForPayment} user={user!} lang={lang} walletBalance={walletBalance} effectiveAmount={selectedBillForPayment.amount} onCancel={() => setSelectedBillForPayment(null)} onSuccess={handlePaymentSuccess} />}
              {showPowercutModal && <PowercutAlertModal onClose={() => setShowPowercutModal(false)} onBroadcast={handleBroadcastAlert} user={user} />}
              <nav className="fixed left-0 top-0 bottom-0 w-80 bg-white/80 backdrop-blur-3xl border-r z-[60] flex flex-col items-start py-12 px-8 justify-between shadow-2xl overflow-y-auto">
                <div className="w-full space-y-12">
                  <div className="flex items-center gap-5 px-6 py-5 bg-slate-900 rounded-[2.5rem] shadow-2xl cursor-pointer" onClick={() => {setActiveTab('dashboard'); setSelectedComplaint(null); setUserPageMode('OVERVIEW');}}>
                    {user?.role === 'admin' ? <Shield className="text-blue-500 w-8 h-8" /> : <Zap className="text-blue-500 w-8 h-8" />}
                    <span className="text-white font-black italic text-2xl tracking-tighter uppercase">{user?.role === 'admin' ? 'AdminNet' : 'PowerNet'}</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {[
                      {id:'dashboard', label:t('dashboard'), icon:LayoutDashboard},
                      {id:'notifications', label:t('alerts'), icon:Bell, badge: unreadCount},
                      user?.role === 'admin' ? {id:'incident_log', label:t('incident_log'), icon:ScrollText} : null,
                      {id:'electricity', label:t('electricity'), icon:Zap},
                      {id:'wifi', label:t('wifi'), icon:Wifi},
                      user?.role === 'user' ? {id:'billing', label:t('billing'), icon:CreditCard} : null,
                      {id:'profile', label:t('profile'), icon:User}
                    ].filter(Boolean).map((i: any) => (
                      <button key={i.id} onClick={() => { i.id === 'notifications' ? handleNotificationClick() : setActiveTab(i.id); setSelectedComplaint(null); setUserPageMode('OVERVIEW'); }} className={`flex items-center justify-between px-8 py-6 rounded-3xl transition-all ${activeTab === i.id ? 'bg-slate-900 text-white shadow-2xl scale-[1.02]' : 'text-slate-600 hover:bg-slate-100'}`}>
                        <div className="flex items-center gap-6"><i.icon className="w-5 h-5" /> <span className="text-[10px] font-black uppercase tracking-[0.2em]">{i.label}</span></div>
                        {i.badge > 0 && <span className="bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">{i.badge}</span>}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => setView('LANDING')} className="flex items-center gap-6 px-8 py-6 text-slate-500 hover:text-red-500 transition-all w-full group"><LogOut className="w-6 h-6" /> <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('logout')}</span></button>
              </nav>
              <main className="ml-80 min-h-screen flex flex-col relative z-10">
                <header className="sticky top-0 bg-white/70 backdrop-blur-2xl border-b px-12 py-8 flex items-center justify-between z-50 shadow-sm">
                   <div className="flex items-center gap-8">
                      {!isAtRoot && (
                        <button 
                          onClick={handleBackNavigation}
                          className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white transition-all active:scale-90 group"
                          aria-label="Go back"
                        >
                          <ChevronLeft className="w-7 h-7" />
                        </button>
                      )}
                      <h2 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900">{t(activeTab)}</h2>
                   </div>
                   <div className="flex items-center gap-8">
                      <div className="relative group hidden sm:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          value={searchTerm} 
                          onChange={(e) => setSearchTerm(e.target.value)} 
                          onKeyDown={(e) => e.key === 'Enter' && executeSearch(searchTerm)}
                          type="text" 
                          className="bg-white border-2 border-slate-100 rounded-2xl py-3 pl-12 pr-10 font-bold outline-none focus:border-blue-500 transition-all w-64" 
                          placeholder="Search for services..." 
                        />
                      </div>
                      <StandardSwitch checked={isDark} onChange={() => setIsDark(!isDark)} />
                      <div className="w-14 h-14 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-blue-500 font-black text-2xl shadow-2xl border-4 border-white">{user?.name[0]}</div>
                   </div>
                </header>
                <div className="p-16 md:p-24 max-w-[1500px] w-full mx-auto flex-1 space-y-16">
                  {userPageMode === 'AI' ? <AIAssistantView context={{ user, bills, complaints }} onBack={() => setUserPageMode('OVERVIEW')} /> :
                  selectedComplaint ? <ComplaintTrackingView 
                    complaint={selectedComplaint} 
                    role={user?.role} 
                    adminMode={activeTab === 'incident_log'}
                    onBack={() => setSelectedComplaint(null)} 
                    onFeedback={(r, c) => { 
                      setComplaints(prev => prev.map(item => item.id === selectedComplaint.id ? { ...item, rating: r, feedback: c } : item)); 
                      setSelectedComplaint(null); 
                    }} 
                    onAssignTechnician={(t) => { 
                      setComplaints(prev => prev.map(item => item.id === selectedComplaint.id ? { ...item, technicianName: t, status: ComplaintStatus.SOLVING } : item)); 
                      setSelectedComplaint(prev => prev ? { ...prev, technicianName: t, status: ComplaintStatus.SOLVING } : null);
                      // Notify the targeted user only
                      setNotifications(prev => [{
                        id: `N-ASSIGN-${Date.now()}`,
                        title: 'Technician Dispatched',
                        message: `Technician ${t} has been assigned to ticket #${selectedComplaint.id}. Progress: SOLVING.`,
                        type: 'INFO',
                        timestamp: new Date().toISOString(),
                        read: false,
                        userId: selectedComplaint.userName
                      }, ...prev]);
                    }} 
                    onUpdateStatus={(s) => { 
                      setComplaints(prev => prev.map(item => item.id === selectedComplaint.id ? { ...item, status: s } : item)); 
                      setSelectedComplaint(prev => prev ? { ...prev, status: s } : null);
                      // Notify the targeted user only
                      setNotifications(prev => [{
                        id: `N-STATUS-${Date.now()}`,
                        title: s === ComplaintStatus.RESOLVED ? 'Action Required: Rate Your Service' : 'Ticket Progress Update',
                        message: s === ComplaintStatus.RESOLVED 
                          ? `Your ticket #${selectedComplaint.id} is now RESOLVED. Please click here to provide your feedback and rating!` 
                          : `Your ticket #${selectedComplaint.id} has been updated to: ${s}.`,
                        type: s === ComplaintStatus.RESOLVED ? 'SUCCESS' : 'INFO',
                        timestamp: new Date().toISOString(),
                        read: false,
                        userId: selectedComplaint.userName
                      }, ...prev]);
                    }} 
                  /> :
                  activeTab === 'notifications' ? (
                    selectedNotification ? <NotificationDetailsView notification={selectedNotification} onBack={() => setSelectedNotification(null)} role={user?.role} /> :
                    <div className="grid gap-6 animate-in fade-in duration-500">
                      {notifications.filter(n => user?.role === 'admin' ? ((user.branch === 'Central Head Office' || n.targetBranch === user.branch || !n.targetBranch) && !n.userId) : (n.targetBranch === user?.branch || n.userId === user?.name)).map(n => (
                        user?.role === 'admin' ? (
                          /* Unified techy style for all admin branches */
                          <div key={n.id} onClick={() => handleNotificationClick(n)} className={`bg-slate-900 p-8 rounded-3xl border border-white/10 shadow-2xl flex items-center gap-8 hover:bg-slate-800 transition-all cursor-pointer group relative overflow-hidden ${!n.read ? 'ring-2 ring-blue-500' : ''}`}>
                             <div className={`p-5 rounded-2xl ${n.type === 'ALERT' ? 'bg-red-500/20 text-red-400' : n.type === 'MAINTENANCE' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                {n.type === 'ALERT' ? <ShieldAlert className="w-6 h-6" /> : n.type === 'MAINTENANCE' ? <Hammer className="w-6 h-6" /> : <Server className="w-6 h-6" />}
                             </div>
                             <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                   <span className="text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 bg-white/10 text-white/60 rounded border border-white/10">Ref: {n.id}</span>
                                   <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded ${n.serviceType === ServiceType.ELECTRICITY ? 'bg-orange-500 text-white' : n.serviceType === ServiceType.WIFI ? 'bg-indigo-500 text-white' : 'bg-blue-500 text-white'}`}>
                                      {n.serviceType || 'Core System'}
                                   </span>
                                   {n.targetBranch && <span className="text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 bg-slate-700 text-slate-300 rounded flex items-center gap-1"><MapPin className="w-2 h-2" /> {n.targetBranch}</span>}
                                </div>
                                <h4 className="text-white font-black italic text-xl tracking-tight uppercase group-hover:text-blue-400 transition-colors leading-none">{n.title}</h4>
                                <p className="text-slate-400 font-bold text-sm mt-2 line-clamp-1 opacity-70 group-hover:opacity-100 transition-opacity">{n.message}</p>
                             </div>
                             <div className="text-right shrink-0">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{formatRelativeTime(n.timestamp)}</p>
                                {!n.read && <div className="w-3 h-3 bg-blue-500 rounded-full ml-auto mt-3 shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse"></div>}
                             </div>
                             <Activity className="absolute -bottom-10 -right-10 w-40 h-40 opacity-[0.03] rotate-12 pointer-events-none" />
                          </div>
                        ) : (
                          /* User Consumer UI */
                          <div key={n.id} onClick={() => handleNotificationClick(n)} className={`bg-white/90 p-10 rounded-[4rem] border border-white shadow-xl flex items-center gap-10 hover:translate-x-2 transition-transform cursor-pointer group ${!n.read ? 'border-l-8 border-l-blue-600' : ''}`}>
                            <div className={`p-8 rounded-[2rem] ${n.type === 'MAINTENANCE' ? 'bg-orange-100 text-orange-600' : n.type === 'ALERT' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>{n.type === 'MAINTENANCE' ? <Hammer className="w-8 h-8" /> : n.type === 'ALERT' ? <AlertCircle className="w-8 h-8" /> : <Bell className="w-8 h-8" />}</div>
                            <div className="flex-1"><h4 className="font-black italic text-2xl text-slate-900 tracking-tighter uppercase">{n.title}</h4><p className="text-slate-500 font-bold mt-2 text-lg line-clamp-1">{n.message}</p></div>
                            <ChevronRight className="w-8 h-8 text-slate-200 group-hover:text-blue-500 transition-all" />
                          </div>
                        )
                      ))}
                    </div>
                  ) :
                  activeTab === 'incident_log' ? (
                    <div className="space-y-12 animate-in fade-in duration-500">
                       <div className="bg-white/95 backdrop-blur-xl p-12 rounded-[5rem] border border-white shadow-2xl space-y-10 relative overflow-hidden">
                          <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-6">
                              <div className="p-6 bg-slate-900 text-white rounded-[2.5rem] shadow-xl">
                                <ScrollText className="w-10 h-10" />
                              </div>
                              <div>
                                <h4 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">Consumer Incident Log</h4>
                                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.4em] mt-1">Full-Control Command Interface</p>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-6 relative z-10">
                             {filteredComplaints.map(c => {
                               const isHigh = c.category === 'Power Outage' || c.category === 'Safety' || c.category === 'Connection Loss';
                               return (
                                <div key={c.id} onClick={() => setSelectedComplaint(c)} className="p-10 border-2 border-slate-50 bg-white/50 rounded-[3.5rem] flex items-center justify-between hover:bg-white hover:border-blue-200 cursor-pointer group shadow-sm hover:shadow-xl transition-all hover:scale-[1.01]">
                                  <div className="flex items-center gap-12">
                                    <div className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center relative transition-transform group-hover:rotate-12 ${c.type === ServiceType.ELECTRICITY ? 'bg-orange-50 text-orange-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                      {c.type === ServiceType.ELECTRICITY ? <Zap className="w-10 h-10" /> : <Wifi className="w-10 h-10" />}
                                      <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full border-4 border-white ${isHigh ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${isHigh ? 'bg-red-600 text-white shadow-sm' : 'bg-blue-100 text-blue-600'}`}>
                                          {isHigh ? 'Priority: Urgent' : 'Priority: Normal'}
                                        </span>
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{c.id} • {c.type}</span>
                                      </div>
                                      <h5 className="font-black italic text-3xl uppercase tracking-tighter text-slate-900 leading-none group-hover:text-blue-600 transition-colors">{c.category}</h5>
                                      <div className="flex items-center gap-4 mt-3">
                                        <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[11px] uppercase tracking-wider">
                                          <MapPin className="w-3.5 h-3.5" /> {c.branch}
                                        </div>
                                        <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
                                        <div className="text-slate-400 font-bold text-[11px] uppercase tracking-wider">Reporter: {c.userName}</div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-6">
                                     <div className="text-right hidden sm:block">
                                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Status</p>
                                        <p className={`text-sm font-black italic uppercase ${c.status === ComplaintStatus.RESOLVED ? 'text-green-500' : 'text-orange-500'}`}>{c.status}</p>
                                     </div>
                                     <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                        <ChevronRight className="w-8 h-8" />
                                     </div>
                                  </div>
                                </div>
                               );
                             })}
                          </div>
                       </div>
                    </div>
                  ) :
                  activeTab === 'dashboard' ? (
                    user?.role === 'admin' ? (
                      <div className="space-y-16 animate-in fade-in duration-500">
                        {/* Enhanced Admin Stat Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                          {[
                            {label: 'District Revenue', val: '₹14.2L', icon: Wallet, color: 'text-green-600', trend: '+12%', bg: 'bg-green-500/10'},
                            {label: 'Grid Load (MW)', val: '142 MW', icon: LineChart, color: 'text-blue-600', trend: 'Stable', bg: 'bg-blue-500/10'},
                            {label: 'Pending Dispatches', val: complaints.filter(c => c.status !== ComplaintStatus.RESOLVED).length, icon: ClipboardList, color: 'text-orange-600', trend: 'Active', bg: 'bg-orange-500/10'},
                          ].map((s,i) => (
                            <div key={i} className="bg-white/95 backdrop-blur-md p-10 rounded-[4.5rem] border-2 border-white shadow-[0_20px_40px_rgba(0,0,0,0.05)] flex flex-col justify-between group hover:translate-y-[-10px] transition-all relative overflow-hidden">
                              <div className="flex items-start justify-between mb-8 relative z-10">
                                <div>
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">{s.label}</p>
                                  <h4 className="text-5xl font-black italic tracking-tighter text-slate-900">{s.val}</h4>
                                </div>
                                <div className={`p-6 rounded-[2rem] ${s.bg} ${s.color} shadow-sm group-hover:scale-110 transition-transform`}>
                                  <s.icon className="w-10 h-10" />
                                </div>
                              </div>
                              <div className="flex items-center gap-3 relative z-10">
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${s.color === 'text-green-600' ? 'bg-green-100' : 'bg-blue-100'} ${s.color}`}>{s.trend}</span>
                                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">vs Last Cycle</span>
                              </div>
                              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -translate-y-1/2 translate-x-1/2 -z-0 opacity-50 group-hover:scale-150 transition-transform"></div>
                            </div>
                          ))}
                          <div className="bg-red-600 p-10 rounded-[4.5rem] shadow-[0_30px_60px_rgba(220,38,38,0.3)] flex flex-col justify-between group hover:translate-y-[-10px] transition-all cursor-pointer relative overflow-hidden" onClick={() => setShowPowercutModal(true)}>
                            <div className="flex items-start justify-between mb-8 relative z-10">
                              <div>
                                <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] mb-3">Priority Action</p>
                                <h4 className="text-4xl font-black italic tracking-tighter text-white">Broadcast Alert</h4>
                              </div>
                              <div className="p-6 bg-white/20 text-white rounded-[2rem] shadow-sm animate-pulse">
                                <Megaphone className="w-10 h-10" />
                              </div>
                            </div>
                            <div className="flex items-center gap-3 relative z-10">
                              <span className="px-4 py-1.5 bg-white text-red-600 rounded-full text-[9px] font-black uppercase tracking-widest">Emergency</span>
                              <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest">All Districts</span>
                            </div>
                            <Activity className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 rotate-12" />
                          </div>
                        </div>

                        {/* Admin Performance Overview with Graphs */}
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                          <div className="lg:col-span-3 space-y-12">
                            <UsageGraph label="Regional Load Matrix (Electricity)" data={DISTRICT_LOAD} color="#2563eb" />
                            <UsageGraph label="Network Traffic Analytics (WiFi)" data={WIFI_TRAFFIC_LOAD} color="#4f46e5" />
                            <div className={`grid grid-cols-1 ${user?.branch === 'Central Head Office' ? 'md:grid-cols-2' : ''} gap-12`}>
                               <UsagePieChart label="Regional Load Distribution" data={DISTRICT_LOAD} />
                               {/* Branch Status Monitor - ONLY IN CENTRAL ADMIN PANEL */}
                               {user?.branch === 'Central Head Office' && (
                                 <div className="bg-white/80 backdrop-blur-md p-10 rounded-[4rem] border border-white shadow-xl">
                                    <div className="flex items-center justify-between mb-10">
                                      <div><h4 className="text-2xl font-black italic uppercase text-slate-900 tracking-tighter">Branch Status</h4><p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Operational Health</p></div>
                                      <Compass className="w-8 h-8 text-blue-500 opacity-20" />
                                    </div>
                                    <div className="space-y-6 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                                      {DK_BRANCHES.slice(1).map(branch => (
                                        <div key={branch} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-3xl border border-slate-100">
                                          <div className="flex items-center gap-4">
                                            <div className={`w-3 h-3 rounded-full ${Math.random() > 0.1 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500 animate-pulse'}`}></div>
                                            <span className="font-black italic text-sm text-slate-700 uppercase tracking-tight">{branch}</span>
                                          </div>
                                          <span className="text-[10px] font-black uppercase text-slate-400">98% Efficient</span>
                                        </div>
                                      ))}
                                    </div>
                                 </div>
                               )}
                            </div>
                          </div>
                          <div><RecentActivityFeed user={user} bills={bills} complaints={complaints} notifications={notifications} lang={lang} onNavigate={(t, i) => { setActiveTab(t); if(t==='incident_log') setSelectedComplaint(i); }} /></div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-16 animate-in fade-in duration-700">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                          {[{label: 'Load', val: '1.2 kWh', icon: Zap, color: 'text-blue-600'}, {label: 'WiFi', val: '42.8 GB', icon: Wifi, color: 'text-indigo-600'}, {label: 'Wallet', val: formatCurrency(walletBalance, lang), icon: Wallet, color: 'text-green-600'}].map((s,i) => (
                            <div key={i} className="bg-white/90 p-12 rounded-[4.5rem] border border-white shadow-xl flex items-center justify-between group hover:translate-y-[-10px] transition-all">
                               <div><p className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-3">{s.label}</p><h4 className="text-4xl font-black italic tracking-tighter text-slate-900">{s.val}</h4></div>
                               <div className={`p-6 bg-slate-50 ${s.color} rounded-[2rem] shadow-sm`}><s.icon className="w-10 h-10" /></div>
                            </div>
                          ))}
                        </div>
                        <PaymentReminders bills={bills} user={user!} onPay={(b) => setSelectedBillForPayment(b)} lang={lang} />
                        <div className="bg-slate-900 p-12 rounded-[4rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 text-white relative overflow-hidden">
                           <div className="relative z-10 space-y-2"><h3 className="text-3xl font-black italic uppercase tracking-tighter">Need Technical Help?</h3><p className="text-slate-400 font-bold max-w-md">Our AI Assistant can troubleshoot outages, check bills, or suggest savings.</p></div>
                           <button onClick={() => setUserPageMode('AI')} className="px-12 py-6 bg-blue-600 text-white font-black uppercase tracking-[0.2em] rounded-[2rem] hover:bg-blue-700 transition-all flex items-center gap-4 relative z-10 shadow-xl"><Sparkles className="w-6 h-6 animate-pulse" /> Ask AI Agent</button>
                           <Activity className="absolute -bottom-10 -right-10 w-64 h-64 opacity-5 rotate-12" />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                           <div className="lg:col-span-2 space-y-12"><UsageGraph label="My Energy usage" data={ELECTRICITY_USAGE} color="#2563eb" /><UsagePieChart label="Weekly Consumption" data={ELECTRICITY_USAGE} /></div>
                           <div><RecentActivityFeed user={user} bills={bills} complaints={complaints} notifications={notifications} lang={lang} onNavigate={(t, i) => { setActiveTab(t); if(t==='complaints') setSelectedComplaint(i); }} /></div>
                        </div>
                      </div>
                    )
                  ) : activeTab === 'electricity' ? (
                    userPageMode === 'SUCCESS' && lastSubmittedComplaint ? <SubmissionSuccessView complaint={lastSubmittedComplaint} onFeedback={(r, c) => setComplaints(prev => prev.map(item => item.id === lastComplaintId ? { ...item, rating: r, feedback: c } : item))} onFinish={() => setUserPageMode('OVERVIEW')} /> :
                    userPageMode === 'RAISE' ? <RaiseComplaintForm type={ServiceType.ELECTRICITY} user={user!} onSubmitted={handleRaiseComplaint} onCancel={() => setUserPageMode('OVERVIEW')} /> :
                    userPageMode === 'TRACK' ? <ComplaintTrackingList complaints={userServiceComplaints} onSelect={setSelectedComplaint} serviceType={ServiceType.ELECTRICITY} /> :
                    user?.role === 'admin' ? (
                      <div className="space-y-12">
                        <UsageGraph label="District Grid Consumption Matrix" data={DISTRICT_LOAD} color="#2563eb" />
                        <ComplaintTrackingList complaints={filteredComplaints.filter(c => c.type === ServiceType.ELECTRICITY)} onSelect={setSelectedComplaint} serviceType={ServiceType.ELECTRICITY} />
                      </div>
                    ) : (
                      <div className="space-y-16">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <button onClick={() => setUserPageMode('RAISE')} className="p-12 bg-white rounded-[4rem] flex flex-col items-center gap-6 border-4 border-white shadow-xl hover:border-blue-100 transition-all group"><FileWarning className="w-12 h-12 text-blue-600 group-hover:scale-110 transition-transform" /><h5 className="text-2xl font-black italic uppercase tracking-tighter">Raise Issue</h5></button>
                          <button onClick={() => { setUserPageMode('TRACK'); }} className="p-12 bg-white rounded-[4rem] flex flex-col items-center gap-6 border-4 border-white shadow-xl hover:border-blue-100 transition-all group"><History className="w-12 h-12 text-indigo-600 group-hover:scale-110 transition-transform" /><h5 className="text-2xl font-black italic uppercase tracking-tighter">Track Status</h5></button>
                        </div>
                        <ServiceCatalog notifications={notifications} userBranch={user?.branch} serviceType={ServiceType.ELECTRICITY} />
                        <SmartBillingSection lang={lang} isGrihaJyothiEnabled={isGrihaJyothiEnabled} onProceed={(b) => setSelectedBillForPayment(b)} />
                        <div className="bg-white/90 p-12 rounded-[4rem] border border-white shadow-xl flex items-center justify-between gap-10">
                           <div className="flex items-center gap-8"><div className="p-6 bg-blue-50 text-blue-600 rounded-[2rem] shadow-sm"><Lightbulb className="w-12 h-12" /></div><div><h4 className="text-3xl font-black italic uppercase text-slate-900 tracking-tighter">Griha Jyothi Benefit</h4><p className="text-slate-500 font-bold text-sm max-w-md">200 units free per month.</p></div></div>
                           <StandardSwitch checked={isGrihaJyothiEnabled} onChange={() => setIsGrihaJyothiEnabled(!isGrihaJyothiEnabled)} />
                        </div>
                      </div>
                    )
                  ) : activeTab === 'wifi' ? (
                    userPageMode === 'SUCCESS' && lastSubmittedComplaint ? <SubmissionSuccessView complaint={lastSubmittedComplaint} onFeedback={(r, c) => setComplaints(prev => prev.map(item => item.id === lastComplaintId ? { ...item, rating: r, feedback: c } : item))} onFinish={() => setUserPageMode('OVERVIEW')} /> :
                    userPageMode === 'RAISE' ? <RaiseComplaintForm type={ServiceType.WIFI} user={user!} onSubmitted={handleRaiseComplaint} onCancel={() => setUserPageMode('OVERVIEW')} /> :
                    userPageMode === 'TRACK' ? <ComplaintTrackingList complaints={userServiceComplaints} onSelect={setSelectedComplaint} serviceType={ServiceType.WIFI} /> :
                    user?.role === 'admin' ? (
                      <div className="space-y-12">
                        <UsageGraph label="Regional Data Throughput Analysis" data={WIFI_TRAFFIC_LOAD} color="#4f46e5" />
                        <ComplaintTrackingList complaints={filteredComplaints.filter(c => c.type === ServiceType.WIFI)} onSelect={setSelectedComplaint} serviceType={ServiceType.WIFI} />
                      </div>
                    ) : (
                      <div className="space-y-16">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <button onClick={() => setUserPageMode('RAISE')} className="p-12 bg-white rounded-[4rem] flex flex-col items-center gap-6 border-4 border-white shadow-xl hover:border-blue-100 transition-all group"><FileWarning className="w-12 h-12 text-blue-600 group-hover:scale-110 transition-transform" /><h5 className="text-2xl font-black italic uppercase tracking-tighter">Report Fiber Issue</h5></button>
                          <button onClick={() => { setUserPageMode('TRACK'); }} className="p-12 bg-white rounded-[4rem] flex flex-col items-center gap-6 border-4 border-white shadow-xl hover:border-blue-100 transition-all group"><History className="w-12 h-12 text-indigo-600 group-hover:scale-110 transition-transform" /><h5 className="text-2xl font-black italic uppercase tracking-tighter">Track Ticket</h5></button>
                        </div>
                        <ServiceCatalog notifications={notifications} userBranch={user?.branch} serviceType={ServiceType.WIFI} />
                        <WiFiRechargeSection currentPlan={activeWiFiPlan} onRecharge={(p) => setSelectedBillForPayment({ id: `WREC-${p.id}-${Date.now()}`, userId: user?.name || 'U-WIFI', userName: user?.name, type: ServiceType.WIFI, amount: p.price, dueDate: 'Today', status: 'UNPAID', period: 'Renewal Cycle', branch: user?.branch || 'Mangalore City' })} lang={lang} />
                      </div>
                    )
                  ) : activeTab === 'billing' ? (
                    <div className="grid gap-12">
                      {selectedBillForDetails ? <BillDetailsView bill={selectedBillForDetails} onPay={(b) => { setSelectedBillForDetails(null); setSelectedBillForPayment(b); }} lang={lang} onBack={() => setSelectedBillForDetails(null)} finalAmount={selectedBillForDetails.amount} isSchemeApplied={isGrihaJyothiEnabled && selectedBillForDetails.type === ServiceType.ELECTRICITY && (selectedBillForDetails.unitsConsumed || 0) <= 200} /> : <>
                          <div className="bg-slate-900 p-16 rounded-[4.5rem] shadow-2xl flex items-center justify-between text-white"><div className="space-y-4"><h3 className="text-4xl font-black italic uppercase tracking-tighter">PowerNet Wallet</h3></div><h4 className="text-7xl font-black italic text-blue-500 tracking-tighter">{formatCurrency(walletBalance, lang)}</h4></div>
                          <div className="space-y-8">{bills.filter(b => b.userName === user?.name).map(b => <div key={b.id} onClick={() => setSelectedBillForDetails(b)} className="p-12 bg-white border border-slate-100 rounded-[4rem] flex items-center justify-between group shadow-sm hover:shadow-xl transition-all cursor-pointer"><div className="flex items-center gap-12"><div className={`p-10 rounded-[3rem] shadow-lg ${b.type === ServiceType.ELECTRICITY ? 'bg-orange-50 text-orange-600' : 'bg-indigo-50 text-indigo-600'}`}>{b.type === ServiceType.ELECTRICITY ? <Zap className="w-14 h-14" /> : <Wifi className="w-14 h-14" />}</div><div><h4 className="text-4xl font-black italic text-slate-900 tracking-tighter">{formatCurrency(b.amount, lang)}</h4><p className="text-[14px] font-black uppercase text-slate-400 tracking-widest mt-2">{b.period}</p></div></div><div className="flex items-center gap-10" onClick={e => e.stopPropagation()}><span className={`px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest ${b.status === 'PAID' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{b.status}</span>{b.status === 'UNPAID' && <button onClick={() => setSelectedBillForPayment(b)} className="px-14 py-7 bg-blue-600 text-white rounded-[2.5rem] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-700 transition-all">Pay Now</button>}</div></div>)}</div>
                       </>}
                    </div>
                  ) : activeTab === 'profile' ? (
                    <div className="max-w-6xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
                      <div className="bg-white/90 p-16 rounded-[5rem] border-4 border-white shadow-2xl flex flex-col md:flex-row items-center md:items-start gap-16 relative overflow-hidden">
                        <div className="w-64 h-64 bg-slate-900 rounded-[4rem] flex items-center justify-center text-blue-500 text-9xl font-black italic shadow-2xl border-4 border-white">{user?.name[0]}</div>
                        <div className="flex-1 space-y-8 relative z-10">
                          <div><div className="flex items-center gap-4 mb-2"><h3 className="text-6xl font-black italic uppercase tracking-tighter text-slate-900">{user?.name}</h3><div className="p-2 bg-blue-600 rounded-full text-white"><ShieldCheck className="w-6 h-6" /></div></div><p className="text-slate-400 font-bold uppercase tracking-widest">Unified Service ID: PN-{user?.phone?.slice(-4) || '8872'}</p></div>
                          <div className="flex flex-wrap gap-4"><div className="px-10 py-5 bg-blue-50 text-blue-600 rounded-3xl font-black text-xs uppercase flex items-center gap-3 border border-blue-100"><User className="w-4 h-4" /> {user?.role} Access</div><div className="px-10 py-5 bg-slate-50 text-slate-600 rounded-3xl font-black text-xs uppercase flex items-center gap-3 border border-slate-100"><Building2 className="w-4 h-4" /> {user?.branch}</div><div className="px-10 py-5 bg-green-50 text-green-600 rounded-3xl font-black text-xs uppercase flex items-center gap-3 border border-green-100"><ShieldCheck className="w-4 h-4" /> Verified</div></div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                             <div className="space-y-4"><label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Language</label><div className="flex bg-slate-50 p-2 rounded-3xl border border-slate-100">{['en', 'kn', 'hi'].map(l => (<button key={l} onClick={() => setLang(l as Language)} className={`flex-1 py-4 rounded-2xl font-black uppercase text-xs transition-all ${lang === l ? 'bg-white shadow-lg text-blue-600' : 'text-slate-400'}`}>{l}</button>))}</div></div>
                             <div className="space-y-4"><label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Interface Theme</label><div className="flex bg-slate-50 p-2 rounded-3xl border border-slate-100"><button onClick={() => setIsDark(false)} className={`flex-1 py-4 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 transition-all ${!isDark ? 'bg-white shadow-lg text-orange-500' : 'text-slate-400'}`}><Sun className="w-4 h-4" /> Day</button><button onClick={() => setIsDark(true)} className={`flex-1 py-4 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 transition-all ${isDark ? 'bg-white shadow-lg text-blue-500' : 'text-slate-400'}`}><Moon className="w-4 h-4" /> Night</button></div></div>
                          </div>
                        </div>
                        <Activity className="absolute -bottom-10 -right-10 w-96 h-96 opacity-[0.03] rotate-12" />
                      </div>
                    </div>
                  ) : null}
                </div>
                <Footer />
              </main>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default App;