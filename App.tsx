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
  PartyPopper
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
  "Naveen Rao",
  "Prashanth Shetty",
  "Sandeep Kulal",
  "Sharan Poojary",
  "Vinayaka Bhat",
  "Guruprasad"
];

const DISTRICT_LOAD = [
  { day: 'Mon', usage: 1200 },
  { day: 'Tue', usage: 1350 },
  { day: 'Wed', usage: 1100 },
  { day: 'Thu', usage: 1580 },
  { day: 'Fri', usage: 1420 },
  { day: 'Sat', usage: 1920 },
  { day: 'Sun', usage: 1790 },
];

const ELECTRICITY_USAGE = [
  { day: 'Mon', usage: 12 },
  { day: 'Tue', usage: 15 },
  { day: 'Wed', usage: 10 },
  { day: 'Thu', usage: 18 },
  { day: 'Fri', usage: 14 },
  { day: 'Sat', usage: 22 },
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
      <div className="absolute inset-0 bg-blue-900/10 backdrop-blur-[1px]"></div>
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
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px]"></div>
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
                  <select 
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-200/50 rounded-2xl py-3.5 pl-11 pr-10 text-sm font-bold outline-none appearance-none"
                  >
                    {DK_BRANCHES.slice(1).map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 rotate-90" />
                </div>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-slate-50/50 border border-slate-200/50 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" placeholder="+91 XXXXX XXXXX" />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50/50 border border-slate-200/50 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" placeholder="Email" />
                </div>
              </>
            ) : (
              <>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <select 
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-200/50 rounded-2xl py-3.5 pl-11 pr-10 text-sm font-bold outline-none appearance-none"
                  >
                    {DK_BRANCHES.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
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
    { role: 'assistant', content: "Hello! I'm your PowerNet Smart Assistant. How can I help you with your electricity or WiFi services today?" }
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
    <div className="max-w-4xl mx-auto h-[700px] flex flex-col bg-white/90 rounded-[4rem] border border-white shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="p-8 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.5)]">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-black italic uppercase tracking-tighter">Smart AI Assistant</h3>
            <p className="text-[9px] font-black uppercase text-blue-400 tracking-widest">Powered by Gemini Pro</p>
          </div>
        </div>
        <button onClick={onBack} className="p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-6 rounded-[2.5rem] shadow-sm ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100'
            }`}>
              <p className="text-[15px] font-bold leading-relaxed">{m.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-50 p-6 rounded-[2.5rem] rounded-tl-none border border-slate-100 flex gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 border-t border-slate-100 bg-white">
        <div className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about bills, outages, or plan upgrades..."
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-5 pl-8 pr-20 font-bold outline-none focus:border-blue-500 transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-4 bg-blue-600 text-white rounded-2xl shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const UsageGraph = ({ data, color, label }: { data: any[], color: string, label: string }) => (
  <div className="bg-white/80 backdrop-blur-md p-8 rounded-[3.5rem] border border-white shadow-xl">
    <div className="flex items-center justify-between mb-8">
      <div>
        <h4 className="text-2xl font-black italic uppercase text-slate-900 tracking-tighter">{label}</h4>
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Analysis Cycle</p>
      </div>
      <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
        <TrendingUp className="w-4 h-4" />
        <span className="text-[10px] font-black uppercase tracking-widest">Active Status</span>
      </div>
    </div>
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`usageGradient-${label}`} x1="0" x2="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
          <Tooltip contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05)', fontWeight: 900, fontSize: '12px', textTransform: 'uppercase' }} />
          <Area type="monotone" dataKey="usage" stroke={color} strokeWidth={4} fillOpacity={1} fill={`url(#usageGradient-${label})`} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const UsagePieChart = ({ data, label }: { data: any[], label: string }) => (
  <div className="bg-white/80 backdrop-blur-md p-8 rounded-[3.5rem] border border-white shadow-xl h-full flex flex-col">
    <div className="flex items-center justify-between mb-8">
      <div>
        <h4 className="text-2xl font-black italic uppercase text-slate-900 tracking-tighter">{label}</h4>
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Weekly Breakdown</p>
      </div>
      <ActivitySquare className="w-6 h-6 text-blue-600 opacity-20" />
    </div>
    <div className="flex-1 min-h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="usage"
            nameKey="day"
            label={({ day, percent }) => `${day} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="rgba(255,255,255,0.2)" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05)', fontWeight: 900, fontSize: '12px', textTransform: 'uppercase' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const RecentActivityFeed = ({ 
  user, 
  bills, 
  complaints, 
  notifications, 
  lang, 
  onNavigate 
}: { 
  user: LoggedInUser | null, 
  bills: Bill[], 
  complaints: Complaint[], 
  notifications: AppNotification[], 
  lang: Language, 
  onNavigate: (tab: string, item?: any) => void 
}) => {
  const activities = useMemo(() => {
    const list: any[] = [];
    
    bills.forEach(b => {
      if (b.status === 'PAID' && b.paidAt) {
        list.push({
          id: `act-bill-${b.id}`,
          type: 'PAYMENT',
          title: `Payment for #${b.id}`,
          desc: user?.role === 'admin' ? `Consumer ${b.userName} paid ${formatCurrency(b.amount, lang)}` : `Cleared dues for ${b.period}`,
          time: b.paidAt,
          icon: CreditCard,
          color: 'text-green-500',
          bg: 'bg-green-50',
          data: b,
          tab: user?.role === 'user' ? 'billing' : 'dashboard'
        });
      }
    });

    complaints.forEach(c => {
      list.push({
        id: `act-comp-${c.id}`,
        type: 'COMPLAINT',
        title: `Ticket ${c.id}`,
        desc: `${c.category}: ${c.status}`,
        time: c.createdAt,
        icon: ClipboardList,
        color: c.status === ComplaintStatus.RESOLVED ? 'text-green-500' : 'text-blue-500',
        bg: c.status === ComplaintStatus.RESOLVED ? 'bg-green-50' : 'bg-blue-50',
        data: c,
        tab: 'complaints'
      });
    });

    notifications.filter(n => n.type === 'MAINTENANCE').forEach(n => {
       list.push({
         id: `act-notif-${n.id}`,
         type: 'MAINTENANCE',
         title: n.title,
         desc: n.message,
         time: n.timestamp,
         icon: Hammer,
         color: 'text-orange-500',
         bg: 'bg-orange-50',
         data: n,
         tab: 'notifications'
       });
    });

    return list.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8);
  }, [bills, complaints, notifications, user, lang]);

  return (
    <div className="bg-white/80 backdrop-blur-md p-10 rounded-[4rem] border border-white shadow-xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h4 className="text-2xl font-black italic uppercase text-slate-900 tracking-tighter">Recent Activity</h4>
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Live Pulse Feed</p>
        </div>
        <div className="p-3 bg-slate-900 text-white rounded-2xl">
           <Radio className="w-5 h-5 animate-pulse" />
        </div>
      </div>
      <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {activities.length === 0 ? (
          <div className="py-20 text-center text-slate-300 font-black uppercase italic tracking-widest text-[10px]">No activity logs found</div>
        ) : activities.map(act => (
          <div 
            key={act.id} 
            onClick={() => onNavigate(act.tab, act.data)}
            className="flex items-center gap-6 p-5 rounded-[2.5rem] hover:bg-white hover:shadow-lg hover:translate-x-1 transition-all cursor-pointer group border border-transparent hover:border-slate-50"
          >
            <div className={`p-4 rounded-2xl ${act.bg} ${act.color} transition-all group-hover:scale-110 shadow-sm`}>
               <act.icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
               <div className="flex items-center justify-between">
                  <h5 className="font-black italic text-[15px] uppercase tracking-tighter text-slate-900 leading-none">{act.title}</h5>
                  <span className="text-[9px] font-black uppercase text-slate-300 tracking-wider whitespace-nowrap ml-4">{formatRelativeTime(act.time)}</span>
               </div>
               <p className="text-slate-500 font-bold text-[11px] mt-1 line-clamp-1 group-hover:text-slate-800 transition-colors uppercase tracking-tight">{act.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
          </div>
        ))}
      </div>
    </div>
  );
};

const StandardBackArrow = ({ onClick }: { onClick: () => void }) => (
  <button 
    onClick={onClick} 
    className="w-12 h-12 rounded-full bg-white/90 border border-slate-200 shadow-xl flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white transition-all active:scale-90 group"
  >
    <ChevronLeft className="w-7 h-7 group-hover:-translate-x-0.5 transition-transform" />
  </button>
);

const StandardSwitch = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
  <button 
    onClick={onChange}
    className={`w-14 h-8 rounded-full transition-all duration-300 relative flex items-center px-1 shadow-inner ${checked ? 'bg-blue-600' : 'bg-slate-300'}`}
  >
    <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-transform transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
  </button>
);

const PaymentGateway = ({ 
  bill, 
  user, 
  onSuccess, 
  onCancel,
  lang,
  walletBalance,
  effectiveAmount
}: { 
  bill: Bill, 
  user: LoggedInUser, 
  onSuccess: (billId: string, cashback: number, method: string) => void, 
  onCancel: () => void,
  lang: Language,
  walletBalance: number,
  effectiveAmount: number
}) => {
  const [step, setStep] = useState<'REVIEW' | 'METHOD' | 'PIN' | 'PROCESSING' | 'SUCCESS'>('REVIEW');
  const [method, setMethod] = useState<'UPI' | 'CARD' | 'BANK' | 'WALLET'>('UPI');
  const [pin, setPin] = useState('');
  const cashbackEarned = useMemo(() => Math.floor(effectiveAmount * 0.05), [effectiveAmount]);
  
  const handlePay = () => {
    setStep('PROCESSING');
    setTimeout(() => {
      setStep('SUCCESS');
      onSuccess(bill.id, cashbackEarned, method);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={onCancel}></div>
      <div className="bg-white rounded-[4rem] w-full max-w-2xl shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
        {step === 'REVIEW' && (
          <div className="p-12 sm:p-16 space-y-10">
            <h3 className="text-4xl font-black italic uppercase text-slate-900 tracking-tighter">Review {bill.type} Bill</h3>
            <div className="bg-slate-50 p-10 rounded-[3rem] space-y-4">
              <div className="flex justify-between border-b pb-4"><span className="text-[10px] font-black uppercase text-slate-400">Bill ID</span><span className="font-black italic">{bill.id}</span></div>
              <div className="flex justify-between border-b pb-4"><span className="text-[10px] font-black uppercase text-slate-400">Period</span><span className="font-black italic">{bill.period}</span></div>
              <div className="flex justify-between pt-4"><span className="text-xl font-black uppercase">Amount</span><span className="text-3xl font-black italic text-blue-600">{formatCurrency(effectiveAmount, lang)}</span></div>
            </div>
            <button onClick={() => setStep('METHOD')} className="w-full py-7 bg-slate-900 text-white font-black uppercase tracking-[0.3em] rounded-[2.5rem] shadow-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-4">
              Select Payment Method <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
        {step === 'METHOD' && (
          <div className="p-12 sm:p-16 space-y-10">
            <h3 className="text-4xl font-black italic uppercase text-slate-900 tracking-tighter">Choose Method</h3>
            <div className="space-y-4">
              {['UPI', 'CARD', 'BANK', 'WALLET'].map(m => {
                const isWallet = m === 'WALLET';
                const isInsufficient = isWallet && walletBalance < effectiveAmount;
                return (
                  <button 
                    key={m} 
                    onClick={() => !isInsufficient && setMethod(m as any)} 
                    disabled={isInsufficient}
                    className={`w-full p-6 rounded-[2rem] border-2 flex items-center gap-6 transition-all ${method === m ? 'border-blue-600 bg-blue-50/50 shadow-md' : 'border-slate-100'} ${isInsufficient ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:border-blue-200'}`}
                  >
                    <div className={`p-4 rounded-2xl ${method === m ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>
                      {isWallet ? <Wallet className="w-7 h-7" /> : <CreditCard className="w-7 h-7" />}
                    </div>
                    <div className="text-left">
                      <p className="text-lg font-black italic">{isWallet ? 'PowerNet Wallet' : `${m} Payment`}</p>
                      {isWallet && (
                        <p className={`text-[10px] font-bold uppercase tracking-widest ${isInsufficient ? 'text-red-500' : 'text-blue-500'}`}>
                          Balance: {formatCurrency(walletBalance, lang)} {isInsufficient && '(Insufficient Funds)'}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            <button 
              onClick={() => setStep('PIN')} 
              className="w-full py-7 bg-blue-600 text-white font-black uppercase tracking-[0.3em] rounded-[2.5rem] shadow-xl hover:bg-blue-700 transition-all"
            >
              Pay {formatCurrency(effectiveAmount, lang)} Now
            </button>
          </div>
        )}
        {step === 'PIN' && (
          <div className="p-12 sm:p-16 space-y-10 text-center">
            <h3 className="text-4xl font-black italic uppercase text-slate-900 tracking-tighter">Secure Authorization</h3>
            <p className="text-slate-500 font-bold max-w-md mx-auto">Please enter your 4-digit transaction PIN to confirm the payment of {formatCurrency(effectiveAmount, lang)}.</p>
            <div className="relative max-w-[240px] mx-auto mt-8">
              <input 
                type="password" 
                maxLength={4}
                value={pin}
                autoFocus
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-[2rem] py-6 text-center text-4xl font-black tracking-[1.2em] outline-none focus:border-blue-500 transition-all shadow-inner"
                placeholder="****"
              />
            </div>
            <div className="flex gap-4">
               <button onClick={() => setStep('METHOD')} className="flex-1 py-6 bg-slate-100 text-slate-500 font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all">Back</button>
               <button 
                 onClick={handlePay} 
                 disabled={pin.length !== 4}
                 className="flex-[2] py-6 bg-blue-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50"
               >
                 Confirm Payment
               </button>
            </div>
          </div>
        )}
        {step === 'PROCESSING' && (
          <div className="p-24 text-center space-y-10 flex flex-col items-center justify-center min-h-[500px]">
            <Loader2 className="w-20 h-20 animate-spin text-blue-600" />
            <h3 className="text-3xl font-black italic uppercase text-slate-900 tracking-tighter">Processing Securely</h3>
          </div>
        )}
        {step === 'SUCCESS' && (
          <div className="p-16 text-center space-y-12">
            <div className="w-32 h-32 bg-green-500 rounded-[4rem] mx-auto flex items-center justify-center text-white shadow-2xl animate-bounce"><Trophy className="w-16 h-16" /></div>
            <div className="space-y-4">
                <h3 className="text-5xl font-black italic uppercase text-slate-900 tracking-tighter">Success!</h3>
                <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 animate-in zoom-in duration-700">
                    <p className="text-blue-600 font-black italic text-2xl uppercase tracking-tighter">Yeh! You earned ₹{cashbackEarned} cashback!</p>
                    <p className="text-slate-400 text-xs font-bold uppercase mt-2">Added to your PowerNet Wallet</p>
                </div>
            </div>
            <button onClick={onCancel} className="w-full py-6 bg-blue-600 text-white font-black uppercase tracking-[0.2em] rounded-[2rem] shadow-xl flex items-center justify-center gap-3">
                <Receipt className="w-5 h-5" /> Receipt Downloaded
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const simulateReceiptDownload = (bill: Bill, finalAmount: number) => {
    const content = `
        PowerNet Receipt
        ----------------
        Bill ID: ${bill.id}
        Service: ${bill.type}
        Consumer: ${bill.userName || 'Valued Customer'}
        Amount: ₹${finalAmount}
        Period: ${bill.period}
        Payment Status: ${bill.status}
        Payment Method: ${bill.paymentMethod || 'N/A'}
        Paid On: ${bill.paidAt ? new Date(bill.paidAt).toLocaleString() : 'N/A'}
        Branch: ${bill.branch}
        ----------------
        Thank you for choosing PowerNet!
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PowerNet_Receipt_${bill.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

const BillDetailsView = ({ bill, onBack, onPay, lang, finalAmount, isSchemeApplied }: { bill: Bill, onBack: () => void, onPay: (b: Bill) => void, lang: Language, finalAmount: number, isSchemeApplied: boolean }) => {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-700 max-w-5xl mx-auto py-4">
            <div className="flex items-center gap-6">
                <StandardBackArrow onClick={onBack} />
                <div>
                    <h3 className="text-4xl font-black italic uppercase text-slate-900 tracking-tighter">Invoice #{bill.id}</h3>
                    <p className="text-[11px] font-black uppercase text-slate-400 tracking-[0.4em]">Payment History & Breakdown</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <div className="bg-white/90 p-12 rounded-[4rem] border border-white shadow-xl space-y-12">
                        <div className="flex items-center justify-between">
                            <div className={`p-8 rounded-[2.5rem] ${bill.type === ServiceType.ELECTRICITY ? 'bg-orange-50 text-orange-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                {bill.type === ServiceType.ELECTRICITY ? <Zap className="w-12 h-12" /> : <Wifi className="w-12 h-12" />}
                            </div>
                            <div className="text-right">
                                <span className={`px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest ${bill.status === 'PAID' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    {bill.status}
                                </span>
                                <p className="text-[12px] font-black uppercase text-slate-400 mt-4 tracking-widest">{bill.period}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-[12px] font-black uppercase text-slate-400 tracking-[0.3em] border-b pb-4">Financial Overview</h4>
                            <div className="grid grid-cols-2 gap-10">
                                <div>
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Total Amount</p>
                                    <div className="flex items-center gap-3">
                                      <p className="text-4xl font-black italic text-slate-900">{formatCurrency(finalAmount, lang)}</p>
                                      {isSchemeApplied && (
                                        <span className="bg-blue-600 text-white text-[9px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest">Griha Jyothi Applied</span>
                                      )}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Due Date</p>
                                    <p className="text-2xl font-black italic text-slate-600">{bill.dueDate}</p>
                                </div>
                            </div>
                        </div>

                        {bill.status === 'PAID' && (
                            <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 space-y-8 animate-in slide-in-from-bottom-4">
                                <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-3">
                                    <ShieldCheck className="w-4 h-4 text-green-500" /> Transaction Confirmed
                                </h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div className="flex items-center gap-5">
                                        <div className="p-4 bg-white rounded-2xl shadow-sm"><CreditCard className="w-6 h-6 text-blue-600" /></div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Payment Method</p>
                                            <p className="font-black text-slate-700 uppercase">{bill.paymentMethod || 'Credit/Debit'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5">
                                        <div className="p-4 bg-white rounded-2xl shadow-sm"><Calendar className="w-6 h-6 text-blue-600" /></div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Processed On</p>
                                            <p className="font-black text-slate-700">{bill.paidAt ? new Date(bill.paidAt).toLocaleString() : 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {bill.status === 'PAID' ? (
                          <button 
                            onClick={() => simulateReceiptDownload(bill, finalAmount)} 
                            className="w-full py-7 bg-slate-900 text-white font-black uppercase tracking-[0.3em] rounded-[2.5rem] hover:bg-blue-600 transition-all flex items-center justify-center gap-4 shadow-xl"
                          >
                            <Download className="w-6 h-6" /> Download Receipt
                          </button>
                        ) : (
                          <button 
                            onClick={() => onPay(bill)} 
                            className="w-full py-7 bg-blue-600 text-white font-black uppercase tracking-[0.3em] rounded-[2.5rem] hover:bg-blue-700 transition-all flex items-center justify-center gap-4 shadow-xl"
                          >
                            <CreditCard className="w-6 h-6" /> Pay Now
                          </button>
                        )}
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
                        <h4 className="text-xl font-black italic uppercase tracking-tighter relative z-10">Service Details</h4>
                        <div className="mt-8 space-y-6 relative z-10">
                            <div>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Branch Location</p>
                                <p className="font-bold text-lg">{bill.branch}</p>
                            </div>
                            {bill.unitsConsumed && (
                                <div>
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Consumption</p>
                                    <p className="font-bold text-lg">{bill.unitsConsumed} Units</p>
                                </div>
                            )}
                            <div>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Consumer Name</p>
                                <p className="font-bold text-lg">{bill.userName || 'Member'}</p>
                            </div>
                        </div>
                        <Activity className="absolute -bottom-10 -right-10 w-32 h-32 opacity-5" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const NotificationDetailsView = ({ notification, onBack }: { notification: AppNotification, onBack: () => void }) => {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-700 max-w-5xl mx-auto py-4">
            <div className="flex items-center gap-6">
                <StandardBackArrow onClick={onBack} />
                <div>
                    <h3 className="text-4xl font-black italic uppercase text-slate-900 tracking-tighter">Notification Info</h3>
                    <p className="text-[11px] font-black uppercase text-slate-400 tracking-[0.4em]">Detailed Alert Records</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-8">
                    <div className="bg-white/90 p-12 rounded-[4rem] border border-white shadow-xl space-y-10">
                        <div className="flex items-start justify-between">
                            <div className="space-y-4">
                                <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest inline-block ${
                                    notification.type === 'MAINTENANCE' ? 'bg-orange-100 text-orange-600' : 
                                    notification.type === 'ALERT' ? 'bg-red-100 text-red-600' : 
                                    notification.type === 'SUCCESS' ? 'bg-green-100 text-green-600' : 
                                    'bg-blue-100 text-blue-600'
                                }`}>
                                    {notification.type}
                                </div>
                                <h4 className="text-4xl font-black italic uppercase text-slate-900 tracking-tighter leading-tight">
                                    {notification.title}
                                </h4>
                            </div>
                            <div className={`p-8 rounded-[2.5rem] ${
                                notification.type === 'MAINTENANCE' ? 'bg-orange-50 text-orange-500' : 
                                notification.type === 'ALERT' ? 'bg-red-100 text-red-500' : 
                                notification.type === 'SUCCESS' ? 'bg-green-50 text-green-500' : 
                                'bg-blue-100 text-blue-500'
                            }`}>
                                {notification.type === 'MAINTENANCE' ? <Hammer className="w-10 h-10" /> : 
                                 notification.type === 'ALERT' ? <AlertCircle className="w-10 h-10" /> : 
                                 notification.type === 'SUCCESS' ? <Trophy className="w-10 h-10" /> : 
                                 <Bell className="w-10 h-10" />}
                            </div>
                        </div>

                        <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 italic font-bold text-slate-700 text-xl leading-relaxed">
                            "{notification.message}"
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Received On</p>
                                <div className="flex items-center gap-3 text-slate-600 font-bold">
                                    <Clock className="w-5 h-5 text-blue-500" />
                                    {new Date(notification.timestamp).toLocaleString()}
                                </div>
                            </div>
                            {notification.targetBranch && (
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Target Area</p>
                                    <div className="flex items-center gap-3 text-slate-600 font-bold">
                                        <MapPin className="w-5 h-5 text-blue-500" />
                                        {notification.targetBranch}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-slate-900 p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden h-fit">
                        <h4 className="text-2xl font-black italic uppercase tracking-tighter mb-8">Related Actions</h4>
                        <div className="space-y-4">
                            <button onClick={onBack} className="w-full p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-left font-bold transition-all flex items-center justify-between group">
                                <span>Back to All Alerts</span>
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button onClick={() => window.print()} className="w-full p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-left font-bold transition-all flex items-center justify-between group">
                                <span>Print Log Details</span>
                                <FileText className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                        <Activity className="absolute -bottom-10 -right-10 w-40 h-40 opacity-5" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const ComplaintTrackingView = ({ 
  complaint, 
  lang, 
  role,
  onBack, 
  onFeedback,
  onAssignTechnician,
  onUpdateStatus
}: { 
  complaint: Complaint, 
  lang: Language, 
  role?: LoginRole,
  onBack: () => void, 
  onFeedback: (rating: number, comment: string) => void,
  onAssignTechnician: (techName: string) => void,
  onUpdateStatus?: (status: ComplaintStatus) => void
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const isSolving = complaint.status === ComplaintStatus.SOLVING || complaint.status === ComplaintStatus.RESOLVED;
  const isResolved = complaint.status === ComplaintStatus.RESOLVED;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-right-6 duration-700 max-w-5xl mx-auto">
      <div className="flex items-center gap-6">
        <StandardBackArrow onClick={onBack} />
        <div>
          <h3 className="text-4xl font-black italic uppercase text-slate-900 tracking-tighter">Ticket #{complaint.id}</h3>
          <p className="text-[11px] font-black uppercase text-slate-400 tracking-[0.4em]">Tracking Details</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white/90 p-12 rounded-[4rem] border border-white shadow-xl space-y-10">
            <div className="flex items-start justify-between">
              <div>
                <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${complaint.status === ComplaintStatus.RESOLVED ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{complaint.status}</span>
                <h4 className="text-3xl font-black italic uppercase text-slate-900 mt-6 tracking-tighter">{complaint.category}</h4>
              </div>
              <div className="p-8 rounded-[2rem] bg-slate-50">{complaint.type === ServiceType.ELECTRICITY ? <Zap className="w-10 h-10" /> : <Wifi className="w-10 h-10" />}</div>
            </div>
            <p className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 italic font-bold text-slate-600">"{complaint.description}"</p>
            
            {complaint.technicianName && (
              <div className="flex items-center gap-4 p-6 bg-blue-50 rounded-3xl border border-blue-100">
                <Wrench className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-[10px] font-black uppercase text-blue-400">Assigned Technician</p>
                  <p className="font-black text-slate-900">{complaint.technicianName}</p>
                </div>
              </div>
            )}

            {complaint.rating && (
              <div className="p-10 bg-blue-50 rounded-[3rem] border border-blue-100 space-y-6 animate-in slide-in-from-bottom-4">
                 <div className="flex items-center justify-between">
                    <h5 className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Consumer Satisfaction Feedback</h5>
                    <div className="flex gap-1.5">
                       {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className={`w-5 h-5 ${complaint.rating! >= s ? 'fill-blue-600 text-blue-600' : 'text-slate-200'}`} />
                       ))}
                    </div>
                 </div>
                 {complaint.feedback && <p className="p-6 bg-white/50 rounded-2xl italic font-bold text-slate-700 border border-white/50">"{complaint.feedback}"</p>}
              </div>
            )}
          </div>

          {role === 'admin' && (
            <div className="space-y-8 animate-in zoom-in-95">
              <div className="bg-white/90 p-12 rounded-[4rem] border border-white shadow-xl space-y-8">
                <h4 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">Progress Management</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                   {[
                     { status: ComplaintStatus.PENDING, label: 'Pending', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
                     { status: ComplaintStatus.SOLVING, label: 'In Progress', icon: Hammer, color: 'text-blue-600', bg: 'bg-blue-50' },
                     { status: ComplaintStatus.RESOLVED, label: 'Resolved', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' }
                   ].map(item => (
                     <button 
                       key={item.status} 
                       onClick={() => onUpdateStatus?.(item.status)}
                       className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 relative overflow-hidden ${complaint.status === item.status ? `border-slate-900 ${item.bg}` : 'border-slate-100 hover:border-slate-200 opacity-60'}`}
                     >
                       {complaint.status === item.status && (
                         <div className="absolute top-2 right-2 bg-slate-900 text-white p-1 rounded-full animate-in zoom-in duration-300">
                           <Check className="w-3 h-3" />
                         </div>
                       )}
                       <item.icon className={`w-8 h-8 ${item.color}`} />
                       <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                     </button>
                   ))}
                </div>
              </div>

              {complaint.status !== ComplaintStatus.RESOLVED && (
                <div className="bg-slate-900 p-12 rounded-[4rem] text-white space-y-8 shadow-2xl">
                  <h4 className="text-3xl font-black italic uppercase tracking-tighter">Assign Field Support</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {TECHNICIANS.map(tech => (
                      <button 
                        key={tech} 
                        onClick={() => onAssignTechnician(tech)}
                        className={`p-6 rounded-2xl border-2 text-left transition-all flex items-center justify-between group ${complaint.technicianName === tech ? 'border-blue-500 bg-blue-600/20' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                      >
                        <div className="flex flex-col">
                            <span className="font-black text-xs uppercase tracking-widest text-blue-400 mb-1">Field Tech</span>
                            <span className="font-bold text-lg">{tech}</span>
                        </div>
                        <ArrowUpRight className={`w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform ${complaint.technicianName === tech ? 'opacity-100 text-blue-500' : 'opacity-20'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {role === 'user' && complaint.status === ComplaintStatus.RESOLVED && !complaint.rating && (
            <div className="bg-blue-600 p-12 rounded-[4rem] text-white space-y-8 shadow-2xl">
              <h4 className="text-3xl font-black italic uppercase tracking-tighter">Your Feedback</h4>
              <div className="flex gap-4">{[1, 2, 3, 4, 5].map(s => (<button key={s} onClick={() => setRating(s)} className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${rating >= s ? 'bg-white text-blue-600 scale-110' : 'bg-white/10'}`}><Star className={`w-8 h-8 ${rating >= s ? 'fill-blue-600' : ''}`} /></button>))}</div>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="w-full bg-white/10 border-2 border-white/20 rounded-[2rem] p-6 text-white font-bold outline-none h-32" placeholder="Tell us more..."></textarea>
              <button onClick={() => onFeedback(rating, comment)} disabled={rating === 0} className="w-full py-6 bg-white text-blue-600 font-black uppercase tracking-widest rounded-[2rem] disabled:opacity-50">Submit Feedback</button>
            </div>
          )}
        </div>
        <div className="bg-slate-900 p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden h-fit">
          <h4 className="text-2xl font-black italic uppercase tracking-tighter relative z-10">Status Path</h4>
          <div className="mt-10 space-y-10 relative z-10">
            {[{ label: 'Ticket Created', status: true }, { label: 'Technician Assigned', status: !!complaint.technicianName || isSolving }, { label: 'Work In Progress', status: isSolving }, { label: 'Resolved', status: isResolved }].map((step, i) => (
              <div key={i} className="flex gap-6 items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-500 ${step.status ? 'bg-blue-600' : 'bg-slate-800'}`}>{step.status ? <Check className="w-4 h-4" /> : <Clock className="w-4 h-4" />}</div>
                <p className={`font-black uppercase text-[10px] tracking-widest transition-colors duration-500 ${step.status ? 'text-white' : 'text-slate-600'}`}>{step.label}</p>
              </div>
            ))}
          </div>
          <Activity className="absolute -bottom-10 -right-10 w-40 h-40 opacity-5" />
        </div>
      </div>
    </div>
  );
};

const RaiseComplaintForm = ({ type, user, onSubmitted, onCancel }: { type: ServiceType, user: LoggedInUser, onSubmitted: (complaint: Partial<Complaint>) => void, onCancel?: () => void }) => {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(user.branch || 'Mangalore City');
  const [contactPhone, setContactPhone] = useState(user.phone || '');
  const [loading, setLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const handleAutoLocate = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)} (Detected)`);
        setIsLocating(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location. Please check your permissions.");
        setIsLocating(false);
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onSubmitted({
        type,
        category,
        description,
        branch: user.branch || 'Mangalore City',
        location: location,
        userName: user.name,
        technicianPhone: contactPhone,
      });
      setLoading(false);
    }, 1500);
  };

  const categories = type === ServiceType.ELECTRICITY 
    ? ['Power Outage', 'Voltage Fluctuation', 'Billing Error', 'Meter Issue', 'Sparking/Fire Hazard']
    : ['No Connection', 'Slow Internet', 'Billing Error', 'Router Configuration', 'Intermittent Connection'];

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 py-4">
      <div className="bg-white/90 p-10 rounded-[4rem] border border-white shadow-2xl space-y-10">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">New Issue Report</h3>
            <p className="text-slate-500 font-bold text-sm">Provide details for your technical grievance for {type === ServiceType.ELECTRICITY ? 'Electricity' : 'WiFi'}.</p>
          </div>
          {onCancel && <button onClick={onCancel} className="p-3 bg-slate-100 rounded-2xl text-slate-400 hover:bg-slate-200"><X className="w-5 h-5" /></button>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-4">Incident Location</label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-700 outline-none focus:border-blue-500 transition-all"
                  placeholder="Enter area or landmark"
                />
              </div>
              <button 
                type="button"
                onClick={handleAutoLocate}
                className="px-6 rounded-2xl bg-blue-50 border-2 border-blue-100 text-blue-600 hover:bg-blue-100 transition-all flex items-center gap-2 font-black uppercase text-[10px] tracking-widest"
              >
                {isLocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation2 className="w-4 h-4" />}
                {isLocating ? 'Locating...' : 'Auto Locate'}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-4">Contact Phone Number</label>
            <div className="relative">
              <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                required
                type="tel" 
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-700 outline-none focus:border-blue-500 transition-all"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-4">Issue Category</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`p-5 rounded-2xl border-2 text-left text-xs font-black transition-all ${category === cat ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-4">Description of problem</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] p-6 text-slate-900 font-bold outline-none focus:border-blue-500 h-36 transition-all"
              placeholder="Explain the issue in detail..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={!category || !description || loading}
            className="w-full py-6 bg-blue-600 text-white font-black uppercase tracking-[0.3em] rounded-[2rem] shadow-xl hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-4"
          >
            {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <><Plus className="w-5 h-5" /> Submit</>}
          </button>
        </form>
      </div>
    </div>
  );
};

const SubmissionSuccessView = ({ complaint, onFeedback, onFinish }: { complaint: Complaint, onFeedback: (rating: number, comment: string) => void, onFinish: () => void }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
        onFeedback(rating, comment);
        setSubmitted(true);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-in zoom-in-95 duration-700 py-12">
            <div className="text-center space-y-8">
                <div className="w-40 h-40 bg-green-500 rounded-[4rem] flex items-center justify-center text-white shadow-2xl mx-auto animate-bounce">
                    <CheckCircle2 className="w-24 h-24" />
                </div>
                <div>
                    <h3 className="text-5xl font-black italic uppercase tracking-tighter text-slate-900">Issue Logged Successfully</h3>
                    <p className="text-slate-400 font-bold text-xl uppercase tracking-widest mt-4">Ticket ID: {complaint.id}</p>
                </div>
            </div>

            <div className="bg-white/90 p-12 rounded-[5rem] border border-white shadow-xl space-y-12 text-center">
                {!submitted ? (
                    <>
                        <div className="space-y-4">
                            <h4 className="text-3xl font-black italic uppercase tracking-tighter">How was the reporting experience?</h4>
                            <p className="text-slate-500 font-bold">Help us improve the PowerNet portal by providing your quick feedback.</p>
                        </div>
                        <div className="flex justify-center gap-6">
                            {[1, 2, 3, 4, 5].map(s => (
                                <button 
                                    key={s} 
                                    onClick={() => setRating(s)}
                                    className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all ${rating >= s ? 'bg-blue-600 text-white scale-110 shadow-lg' : 'bg-slate-50 text-slate-300 hover:bg-slate-100'}`}
                                >
                                    <Star className={`w-10 h-10 ${rating >= s ? 'fill-white' : ''}`} />
                                </button>
                            ))}
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Any additional comments? (Optional)</label>
                            <textarea 
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] p-8 text-slate-900 font-bold outline-none focus:border-blue-500 transition-all h-32 text-center"
                                placeholder="Tell us how we can make reporting easier..."
                            ></textarea>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button onClick={onFinish} className="py-6 bg-slate-100 text-slate-500 font-black uppercase tracking-widest rounded-[2rem] hover:bg-slate-200 transition-all">Skip for now</button>
                            <button 
                                onClick={handleSubmit} 
                                disabled={rating === 0}
                                className="py-6 bg-blue-600 text-white font-black uppercase tracking-widest rounded-[2rem] hover:bg-blue-700 transition-all shadow-xl disabled:opacity-50"
                            >
                                Submit Feedback
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="space-y-8 py-12 animate-in fade-in duration-500">
                        <div className="p-10 bg-blue-50 rounded-[3rem] border border-blue-100 italic font-black text-blue-600 text-2xl uppercase">
                            Thank you for your feedback!
                        </div>
                        <button 
                            onClick={onFinish} 
                            className="w-full py-8 bg-slate-900 text-white font-black uppercase tracking-[0.3em] rounded-[2.5rem] shadow-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-4"
                        >
                            View All My Tickets <ArrowRight className="w-6 h-6" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const SmartBillingSection = ({ onProceed, isGrihaJyothiEnabled, lang }: { onProceed: (bill: Bill) => void, isGrihaJyothiEnabled: boolean, lang: Language }) => {
  const [meterNo, setMeterNo] = useState('');
  const [isReading, setIsReading] = useState(false);
  const [estimate, setEstimate] = useState<{units: number, cost: number} | null>(null);

  const handleFetchReading = () => {
    if (!meterNo || meterNo.length !== 8) {
      alert("Please enter a valid 8-digit meter number.");
      return;
    }
    setIsReading(true);
    setEstimate(null);
    
    setTimeout(() => {
      const units = Math.floor(50 + Math.random() * 350);
      const rate = 7;
      let cost = units * rate;
      if (isGrihaJyothiEnabled) {
        const billableUnits = Math.max(0, units - 200);
        cost = billableUnits * rate;
      }
      setEstimate({ units, cost });
      setIsReading(false);
    }, 2500);
  };

  const handlePayEstimate = () => {
    if (!estimate) return;
    const tempBill: Bill = {
      id: `EST-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: 'U-SMART',
      userName: 'Valued Consumer',
      type: ServiceType.ELECTRICITY,
      amount: estimate.cost,
      dueDate: new Date().toLocaleDateString(),
      status: 'UNPAID',
      period: 'Live Fetch',
      branch: 'Digital Hub',
      unitsConsumed: estimate.units
    };
    onProceed(tempBill);
  };

  return (
    <div className="bg-white/90 p-12 rounded-[4rem] border border-white shadow-xl space-y-10 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-8">
          <div className="p-6 bg-indigo-50 text-indigo-600 rounded-[2rem] shadow-sm animate-pulse">
            <Cpu className="w-12 h-12" />
          </div>
          <div>
            <h4 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">Real-time Smart Billing</h4>
            <p className="text-slate-500 font-bold text-sm max-w-md">Connect directly to your digital meter to fetch live consumption data and generate an instant invoice.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Network Online</span>
        </div>
      </div>

      <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Tag className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              maxLength={8}
              value={meterNo}
              onChange={(e) => setMeterNo(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 8-digit Meter No"
              className="w-full bg-white border-2 border-slate-200 rounded-2xl py-5 pl-14 pr-6 font-black text-slate-900 outline-none focus:border-blue-500 transition-all uppercase tracking-wider"
            />
          </div>
          <button 
            onClick={handleFetchReading}
            disabled={!meterNo || isReading || meterNo.length !== 8}
            className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 disabled:opacity-50 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10"
          >
            {isReading ? <Loader2 className="w-6 h-6 animate-spin" /> : <RefreshCw className="w-6 h-6" />}
            {isReading ? 'Syncing...' : 'Fetch Reading'}
          </button>
        </div>
      </div>

      {estimate && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in zoom-in-95 duration-500">
          <div className="bg-blue-50 p-10 rounded-[3rem] border border-blue-100 flex flex-col items-center text-center space-y-3">
            <p className="text-[10px] font-black uppercase text-blue-400 tracking-[0.3em]">Fetched Consumption</p>
            <h5 className="text-6xl font-black italic text-blue-600 tracking-tighter">{estimate.units} <span className="text-xl font-bold uppercase">Units</span></h5>
            <p className="text-slate-400 text-xs font-bold uppercase italic">Direct Meter Data Readout</p>
          </div>
          <div className="bg-slate-900 p-10 rounded-[3rem] text-white flex flex-col items-center justify-center text-center space-y-6">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em]">Estimated Invoice</p>
              <h5 className="text-6xl font-black italic text-blue-400 tracking-tighter">{formatCurrency(estimate.cost, lang)}</h5>
              {isGrihaJyothiEnabled && estimate.units > 0 && (
                <span className="text-[9px] font-black bg-blue-600 px-3 py-1 rounded-full uppercase">
                  Griha Jyothi: Subtracted 200 free units
                </span>
              )}
            </div>
            {estimate.cost > 0 ? (
              <button 
                onClick={handlePayEstimate}
                className="w-full py-5 bg-blue-600 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-2xl"
              >
                <CreditCard className="w-5 h-5" /> Proceed to Payment
              </button>
            ) : (
              <div className="w-full p-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 rounded-[2.5rem] animate-in zoom-in-95 duration-700 shadow-[0_0_50px_rgba(37,99,235,0.4)] border border-white/20 relative overflow-hidden group">
                 <div className="flex flex-col items-center gap-4 relative z-10">
                    <div className="p-4 bg-white/20 rounded-full backdrop-blur-md group-hover:scale-110 transition-transform">
                      <PartyPopper className="w-10 h-10 text-yellow-300 animate-pulse" />
                    </div>
                    <div>
                      <h6 className="text-3xl font-black italic uppercase tracking-tighter text-white drop-shadow-lg">BOOM! Zero Dues!</h6>
                      <p className="text-[11px] font-black uppercase tracking-[0.1em] text-blue-100 mt-2">Exempt under Griha Jyothi Yojana</p>
                    </div>
                    <div className="px-6 py-2 bg-white/10 rounded-full border border-white/10">
                       <p className="text-[9px] font-bold uppercase text-white tracking-widest">Enjoy your free power benefit! 🎉</p>
                    </div>
                 </div>
                 <Sparkles className="absolute top-0 right-0 w-32 h-32 opacity-20 -rotate-12 translate-x-10 -translate-y-10" />
                 <Sparkles className="absolute bottom-0 left-0 w-32 h-32 opacity-20 rotate-12 -translate-x-10 translate-y-10" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ServiceCatalog = ({ notifications, userBranch, serviceType }: { notifications: AppNotification[], userBranch?: string, serviceType?: ServiceType }) => {
    const relevantAlerts = useMemo(() => {
        return notifications.filter(n => {
            const isAlertOrMaintenance = (n.type === 'ALERT' || n.type === 'MAINTENANCE');
            const isCorrectBranch = (!n.targetBranch || n.targetBranch === userBranch);
            const isCorrectService = !serviceType || !n.serviceType || n.serviceType === serviceType;
            return isAlertOrMaintenance && isCorrectBranch && isCorrectService;
        });
    }, [notifications, userBranch, serviceType]);

    if (relevantAlerts.length === 0) return null;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-4 px-6">
                <div className="p-3 bg-red-50 text-red-600 rounded-xl shadow-sm">
                    <Layers2 className="w-6 h-6" />
                </div>
                <h4 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">Live Service Catalog & Alerts</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relevantAlerts.map(alert => (
                    <div key={alert.id} className="bg-white/90 p-8 rounded-[3rem] border-2 border-red-100 shadow-xl flex items-start gap-6 group hover:translate-y-[-4px] transition-all overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600"></div>
                        <div className={`p-5 rounded-2xl ${alert.type === 'ALERT' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                            {alert.type === 'ALERT' ? <AlertTriangle className="w-7 h-7 animate-pulse" /> : <Hammer className="w-7 h-7" />}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <h5 className="text-lg font-black italic uppercase text-slate-900 tracking-tight leading-tight">{alert.title}</h5>
                                <span className="text-[9px] font-black uppercase text-slate-300 tracking-widest whitespace-nowrap">{formatRelativeTime(alert.timestamp)}</span>
                            </div>
                            <p className="text-slate-500 font-bold text-sm leading-relaxed">{alert.message}</p>
                        </div>
                        <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:scale-110 transition-transform">
                            <Megaphone className="w-24 h-24 rotate-[-15deg] text-slate-900" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const WiFiRechargeSection = ({ currentPlan, onRecharge, lang }: { currentPlan: WiFiPlan, onRecharge: (plan: WiFiPlan) => void, lang: Language }) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-slate-900 p-12 rounded-[4rem] border border-white/5 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3 text-blue-400">
             <Signal className="w-8 h-8" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em]">Active Connection</span>
          </div>
          <h4 className="text-4xl font-black italic uppercase tracking-tighter text-white">{currentPlan.name}</h4>
          <div className="flex gap-4">
             <span className="px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-400 border border-white/10">{currentPlan.speed} Speed</span>
             <span className="px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-400 border border-white/10">Unlimited Data</span>
          </div>
        </div>
        <div className="relative z-10 text-center md:text-right">
           <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] mb-2">Subscription Cost</p>
           <h5 className="text-6xl font-black italic text-blue-500 tracking-tighter">{formatCurrency(currentPlan.price, lang)}/mo</h5>
        </div>
        <Sparkles className="absolute -bottom-20 -right-20 w-80 h-80 text-white/5 rotate-12" />
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between px-6">
          <div>
            <h4 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">Available WiFi Plans</h4>
            <p className="text-slate-500 font-bold text-sm">Upgrade or renew your high-speed connectivity.</p>
          </div>
          <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
            <GanttChartSquare className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {WIFI_PLANS.map(plan => (
            <div key={plan.id} className={`bg-white/90 p-10 rounded-[3.5rem] border-4 transition-all hover:scale-[1.03] shadow-xl flex flex-col justify-between gap-10 group relative overflow-hidden ${plan.id === currentPlan.id ? 'border-blue-600' : 'border-white'}`}>
               {plan.id === currentPlan.id && (
                 <div className="absolute top-0 right-0 p-4 bg-blue-600 text-white rounded-bl-3xl z-10">
                   <Check className="w-5 h-5" />
                 </div>
               )}
               <div className="space-y-6">
                  <div className="flex justify-between items-start">
                     <div className={`p-5 rounded-2xl ${plan.id === currentPlan.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all'}`}>
                        <Wifi className="w-8 h-8" />
                     </div>
                     {plan.id === currentPlan.id && <span className="text-[9px] font-black uppercase tracking-widest bg-blue-100 text-blue-600 px-3 py-1 rounded-full border border-blue-200">Selected Plan</span>}
                  </div>
                  <div>
                     <h5 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 leading-tight">{plan.name}</h5>
                     <p className="text-slate-400 text-xs font-bold uppercase mt-1 tracking-widest">{plan.speed} Fiber Technology</p>
                  </div>
                  <div className="space-y-2">
                     <div className="flex items-center gap-3 text-slate-600"><CheckCircle2 className="w-4 h-4 text-green-500" /><span className="text-[10px] font-bold uppercase tracking-widest">{plan.dataLimit} Data</span></div>
                     <div className="flex items-center gap-3 text-slate-600"><CheckCircle2 className="w-4 h-4 text-green-500" /><span className="text-[10px] font-bold uppercase tracking-widest">Free Router Inclusion</span></div>
                     <div className="flex items-center gap-3 text-slate-600"><CheckCircle2 className="w-4 h-4 text-green-500" /><span className="text-[10px] font-bold uppercase tracking-widest">24/7 Tech Support</span></div>
                  </div>
               </div>
               <div className="space-y-6">
                  <div className="text-center pt-6 border-t border-slate-100">
                     <h6 className="text-4xl font-black italic text-slate-900 tracking-tighter">{formatCurrency(plan.price, lang)}</h6>
                     <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mt-1">Inclusive of GST</p>
                  </div>
                  <button 
                    onClick={() => onRecharge(plan)}
                    className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl ${plan.id === currentPlan.id ? 'bg-slate-900 text-white hover:bg-blue-600' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                  >
                    {plan.id === currentPlan.id ? 'Renew Current' : 'Upgrade Now'} <ArrowRight className="w-5 h-5" />
                  </button>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PowercutAlertModal = ({ 
  onClose, 
  onBroadcast 
}: { 
  onClose: () => void, 
  onBroadcast: (branch: string, title: string, message: string, serviceType: ServiceType) => void 
}) => {
  const [branch, setBranch] = useState('All District');
  const [title, setTitle] = useState('Scheduled Power Interruption');
  const [message, setMessage] = useState('Emergency maintenance work will be carried out between 10:00 AM and 04:00 PM.');

  const handleSend = () => {
    onBroadcast(branch === 'All District' ? '' : branch, title, message, ServiceType.ELECTRICITY);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={onClose}></div>
      <div className="bg-white rounded-[4rem] w-full max-w-2xl shadow-2xl relative z-10 overflow-hidden border border-white animate-in zoom-in-95 duration-300">
        <div className="p-12 sm:p-16 space-y-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl shadow-sm">
                <Megaphone className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black italic uppercase text-slate-900 tracking-tighter leading-none">Emergency Broadcast</h3>
            </div>
            <button onClick={onClose} className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-4">Target Branch / Area</label>
              <div className="relative">
                <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select 
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 pl-14 pr-6 font-bold text-slate-900 outline-none appearance-none focus:border-red-500 transition-all"
                >
                  <option value="All District">All Dakshina Kannada District</option>
                  {DK_BRANCHES.slice(1).map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-4">Alert Headline</label>
              <div className="relative">
                <AlertTriangle className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 pl-14 pr-6 font-bold text-slate-900 outline-none focus:border-red-500 transition-all"
                  placeholder="Alert Title"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-4">Detailed Message</label>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] p-8 text-slate-900 font-bold outline-none focus:border-red-500 transition-all h-32"
                placeholder="Explain the outage duration and cause..."
              ></textarea>
            </div>
          </div>

          <button 
            onClick={handleSend}
            className="w-full py-7 bg-red-600 text-white font-black uppercase tracking-[0.3em] rounded-[2.5rem] shadow-xl hover:bg-red-700 transition-all flex items-center justify-center gap-4"
          >
            Launch Alert Broadcast <ArrowRight className="w-5 h-5" />
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
  const [activeWiFiPlan, setActiveWiFiPlan] = useState<WiFiPlan>(WIFI_PLANS[0]);
  const [showPowercutModal, setShowPowercutModal] = useState(false);

  const [outageArea, setOutageArea] = useState('');
  const [restoreTime, setRestoreTime] = useState('06:00 PM');
  const [wifiAnnounceArea, setWifiAnnounceArea] = useState('');
  const [wifiAnnounceIssue, setWifiAnnounceIssue] = useState('General Maintenance');

  const [bills, setBills] = useState<Bill[]>(() => {
    const saved = localStorage.getItem('powernet_bills');
    return saved ? JSON.parse(saved) : MOCK_BILLS;
  });
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem('powernet_complaints');
    return saved ? JSON.parse(saved) : MOCK_COMPLAINTS;
  });
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('powernet_notifications');
    return saved ? JSON.parse(saved) : MOCK_NOTIFICATIONS;
  });
  const [walletBalance, setWalletBalance] = useState<number>(() => {
    const saved = localStorage.getItem('powernet_wallet_balance');
    return saved ? parseFloat(saved) : 1500;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [selectedBillForPayment, setSelectedBillForPayment] = useState<Bill | null>(null);
  const [selectedBillForDetails, setSelectedBillForDetails] = useState<Bill | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<AppNotification | null>(null);
  const [userPageMode, setUserPageMode] = useState<'OVERVIEW' | 'RAISE' | 'TRACK' | 'SUCCESS' | 'AI'>('OVERVIEW');
  const [lastComplaintId, setLastComplaintId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('powernet_bills', JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem('powernet_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('powernet_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('powernet_wallet_balance', walletBalance.toString());
  }, [walletBalance]);

  const unreadCount = useMemo(() => {
      if (!user) return 0;
      return notifications.filter(n => {
          if (n.read) return false;
          
          const isAdminAlert = n.id.startsWith('N-A-') || n.id.startsWith('N-AP-') || n.id.startsWith('BR-');
          
          if (user.role === 'admin') {
            if (!isAdminAlert) return false;
            if (user.branch === 'Central Head Office') return true;
            return !n.targetBranch || n.targetBranch === user.branch;
          } else {
            if (n.id.startsWith('N-A-') || n.id.startsWith('N-AP-')) return false;
            if (n.userId && n.userId !== user.name) return false;
            return !n.targetBranch || n.targetBranch === user.branch;
          }
      }).length;
  }, [notifications, user]);

  const t = (key: string) => (translations[lang] as any)[key] || key;

  const getFinalAmount = (bill: Bill) => {
    if (isGrihaJyothiEnabled && bill.type === ServiceType.ELECTRICITY && bill.unitsConsumed !== undefined) {
      const billableUnits = Math.max(0, bill.unitsConsumed - 200);
      const rate = 7;
      return billableUnits * rate;
    }
    return bill.amount;
  };

  const handleNotificationClick = (notification?: AppNotification) => {
    if (notification) {
        if (notification.id.startsWith('N-RES-') || notification.id.startsWith('N-QRES-')) {
          const parts = notification.id.split('-');
          const ticketId = parts.slice(2, -1).join('-');
          const complaint = complaints.find(c => c.id === ticketId);
          if (complaint) {
            setSelectedComplaint(complaint);
            setActiveTab('complaints');
            setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, read: true } : n));
            return;
          }
        }
        setSelectedNotification(notification);
        setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, read: true } : n));
    } else {
        setActiveTab('notifications');
        setNotifications(prev => prev.map(n => {
            const isAdminAlert = n.id.startsWith('N-A-') || n.id.startsWith('N-AP-') || n.id.startsWith('BR-');
            if (user?.role === 'admin') {
                if (!isAdminAlert) return n;
                if (user.branch === 'Central Head Office' || !n.targetBranch || n.targetBranch === user.branch) return { ...n, read: true };
            } else {
                if (n.id.startsWith('N-A-') || n.id.startsWith('N-AP-')) return n;
                if (!n.targetBranch || n.targetBranch === user?.branch || n.userId === user?.name) return { ...n, read: true };
            }
            return n;
        }));
    }
  };

  const handleFeedNavigation = (tab: string, item?: any) => {
    setActiveTab(tab);
    if (tab === 'complaints' && item) setSelectedComplaint(item);
    if (tab === 'notifications' && item) setSelectedNotification(item);
    if (tab === 'billing' && item) {
      if (item.status === 'UNPAID') {
        setSelectedBillForPayment(item);
      } else {
        setSelectedBillForDetails(item);
      }
    }
  };

  const handleSearchNavigation = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const query = searchTerm.toLowerCase().trim();
      if (!query) return;

      if (query.includes('electricity') || query.includes('power') || query.includes('light')) {
        setActiveTab('electricity');
        setSelectedComplaint(null);
        setSelectedBillForDetails(null);
        setSelectedNotification(null);
        setUserPageMode('OVERVIEW');
      } else if (query.includes('wifi') || query.includes('internet') || query.includes('net')) {
        setActiveTab('wifi');
        setSelectedComplaint(null);
        setSelectedBillForDetails(null);
        setSelectedNotification(null);
        setUserPageMode('OVERVIEW');
      } else if (query.includes('bill') || query.includes('payment') || query.includes('wallet') || query.includes('invoice')) {
        setActiveTab(user?.role === 'user' ? 'billing' : 'dashboard');
        setSelectedComplaint(null);
        setSelectedBillForDetails(null);
        setSelectedNotification(null);
        setUserPageMode('OVERVIEW');
      } else if (query.includes('profile') || query.includes('account') || query.includes('user') || query.includes('me')) {
        setActiveTab('profile');
        setSelectedComplaint(null);
        setSelectedBillForDetails(null);
        setSelectedNotification(null);
        setUserPageMode('OVERVIEW');
      } else if (query.includes('alert') || query.includes('notification')) {
        setActiveTab('notifications');
        setSelectedComplaint(null);
        setSelectedBillForDetails(null);
        setSelectedNotification(null);
        setUserPageMode('OVERVIEW');
      } else if (query.includes('complaint') || query.includes('ticket') || query.includes('issue')) {
        if (user?.role === 'admin') {
          setActiveTab('complaints');
        } else {
          setActiveTab('electricity');
          setUserPageMode('TRACK');
        }
        setSelectedComplaint(null);
        setSelectedBillForDetails(null);
        setSelectedNotification(null);
      } else if (query.includes('dashboard') || query.includes('home')) {
        setActiveTab('dashboard');
        setSelectedComplaint(null);
        setSelectedBillForDetails(null);
        setSelectedNotification(null);
        setUserPageMode('OVERVIEW');
      }
    }
  };

  const startVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitRecognition;
    if (!SpeechRecognition) return alert("Voice not supported.");
    const rec = new SpeechRecognition();
    rec.onstart = () => setIsListening(true);
    rec.onend = () => setIsListening(false);
    rec.onresult = (e: any) => setSearchTerm(e.results[0][0].transcript);
    rec.start();
  };

  const handleFeedback = (rating: number, comment: string) => {
    const idToUpdate = selectedComplaint?.id || lastComplaintId;
    if (!idToUpdate) return;
    setComplaints(prev => prev.map(c => c.id === idToUpdate ? { ...c, rating, feedback: comment } : c));
    if (selectedComplaint) {
      setSelectedComplaint(prev => prev ? { ...prev, rating, feedback: comment } : null);
    }
  };

  const handleAssignTechnician = (techName: string) => {
    if (!selectedComplaint) return;
    const techPhone = `+91 ${Math.floor(Math.random() * 90000 + 10000)} ${Math.floor(Math.random() * 90000 + 10000)}`;
    setComplaints(prev => prev.map(c => c.id === selectedComplaint.id ? { ...c, technicianName: techName, technicianPhone: techPhone, status: ComplaintStatus.SOLVING, updatedAt: new Date().toISOString() } : c));
    const newNotif: AppNotification = {
      id: `N-TECH-${selectedComplaint.id}-${Date.now()}`,
      title: 'Technician Assigned',
      message: `${techName} (${techPhone}) has been assigned to your ticket #${selectedComplaint.id}.`,
      type: 'INFO',
      userId: selectedComplaint.userName,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    setSelectedComplaint(prev => prev ? { ...prev, technicianName: techName, technicianPhone: techPhone, status: ComplaintStatus.SOLVING } : null);
  };

  const handleUpdateStatus = (status: ComplaintStatus) => {
    if (!selectedComplaint) return;
    setComplaints(prev => prev.map(c => c.id === selectedComplaint.id ? { ...c, status, updatedAt: new Date().toISOString() } : c));
    if (status === ComplaintStatus.RESOLVED) {
       const newNotif: AppNotification = {
         id: `N-RES-${selectedComplaint.id}-${Date.now()}`,
         title: 'Complaint Resolved',
         message: `Your ticket #${selectedComplaint.id} has been resolved. We value your feedback.`,
         type: 'SUCCESS',
         userId: selectedComplaint.userName,
         timestamp: new Date().toISOString(),
         read: false
       };
       setNotifications(prev => [newNotif, ...prev]);
    }
    setSelectedComplaint(prev => prev ? { ...prev, status } : null);
  };

  const handleQuickStatusUpdate = (id: string, status: ComplaintStatus) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === id) {
        if (status === ComplaintStatus.RESOLVED) {
          const newNotif: AppNotification = {
            id: `N-QRES-${id}-${Date.now()}`,
            title: 'Complaint Resolved',
            message: `Your ticket #${id} has been marked as resolved.`,
            type: 'SUCCESS',
            userId: c.userName,
            timestamp: new Date().toISOString(),
            read: false
          };
          setNotifications(prevNotifs => [newNotif, ...prevNotifs]);
        }
        return { ...c, status, updatedAt: new Date().toISOString() };
      }
      return c;
    }));
  };

  const handleQuickAssign = (id: string, team: string) => {
    const techPhone = `+91 99887 76655`;
    setComplaints(prev => prev.map(c => {
      if (c.id === id) {
        const newNotif: AppNotification = {
          id: `N-QTECH-${id}-${Date.now()}`,
          title: 'Staff Assigned',
          message: `${team} (${techPhone}) is now handling your request #${id}.`,
          type: 'INFO',
          userId: c.userName,
          timestamp: new Date().toISOString(),
          read: false
        };
        setNotifications(prevNotifs => [newNotif, ...prevNotifs]);
        return { ...c, technicianName: team, technicianPhone: techPhone, status: ComplaintStatus.SOLVING, updatedAt: new Date().toISOString() };
      }
      return c;
    }));
  };

  const handleRaiseComplaint = (data: Partial<Complaint>) => {
    const newId = `C-${Math.floor(1000 + Math.random() * 9000)}`;
    const newComplaint: Complaint = { ...data, id: newId, userId: user?.name || 'anonymous', userName: user?.name || 'anonymous', status: ComplaintStatus.PENDING, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as Complaint;
    setComplaints(prev => [newComplaint, ...prev]);
    setLastComplaintId(newId);
    
    const userNotif: AppNotification = { 
        id: `N-U-${newId}`, 
        title: `Complaint Filed Successfully`, 
        message: `Your complaint for ${data.category} has been filed. Ticket ID: ${newId}. Status: PENDING.`, 
        type: 'SUCCESS', 
        userId: user?.name, 
        timestamp: new Date().toISOString(), 
        read: false,
        serviceType: data.type
    };
    
    const adminNotif: AppNotification = { 
        id: `N-A-${newId}`, 
        title: `New Incident: ${newId}`, 
        message: `${user?.name} reported ${data.category} in ${data.location}.`, 
        type: 'ALERT', 
        targetBranch: data.branch, 
        timestamp: new Date().toISOString(), 
        read: false,
        serviceType: data.type
    };
    
    setNotifications(prev => [adminNotif, userNotif, ...prev]);
    setUserPageMode('SUCCESS');
  };

  const handleBroadcastAlert = (targetBranch: string, title: string, message: string, serviceType: ServiceType) => {
    const newId = `BR-${Math.floor(10000 + Math.random() * 90000)}`;
    setNotifications(prev => [{ id: newId, title, message, type: 'ALERT', targetBranch: targetBranch || undefined, serviceType, timestamp: new Date().toISOString(), read: false }, ...prev]);
  };

  const handlePaymentSuccess = (billId: string, cashback: number, method: string) => {
    const billToPay = bills.find(b => b.id === billId);
    const finalAmt = billToPay ? getFinalAmount(billToPay) : (selectedBillForPayment?.amount || 0);
    setBills(prev => prev.map(b => b.id === billId ? { ...b, status: 'PAID', paymentMethod: method, paidAt: new Date().toISOString() } : b));
    setWalletBalance(prev => prev + cashback - (method === 'WALLET' ? finalAmt : 0));
    
    const userPaymentNotif: AppNotification = { 
      id: `N-P-${billId}-${Date.now()}`, 
      title: `Payment Successful`, 
      message: `Bill #${billId} cleared. You earned ₹${cashback} cashback!`, 
      type: 'SUCCESS', 
      userId: user?.name, 
      timestamp: new Date().toISOString(), 
      read: false,
      serviceType: billToPay?.type
    };

    const adminPaymentAlert: AppNotification = {
      id: `N-AP-${billId}-${Date.now()}`,
      title: `Consumer Payment Received`,
      message: `${user?.name || 'Consumer'} paid ${formatCurrency(finalAmt, lang)} for period ${billToPay?.period || 'N/A'}. Bill ID: ${billId}.`,
      type: 'SUCCESS',
      targetBranch: billToPay?.branch || user?.branch,
      timestamp: new Date().toISOString(), 
      read: false,
      serviceType: billToPay?.type
    };

    if (selectedBillForPayment?.id.startsWith('WREC-')) {
       const planId = selectedBillForPayment.id.split('-')[1];
       const plan = WIFI_PLANS.find(p => p.id === planId);
       if (plan) setActiveWiFiPlan(plan);
    }
    setNotifications(prev => [adminPaymentAlert, userPaymentNotif, ...prev]);
  };

  const filteredComplaints = useMemo(() => {
    return complaints.filter(c => {
      if (user?.role === 'admin' && user?.branch !== 'Central Head Office' && c.branch !== user.branch) return false;
      if (user?.role === 'user' && c.userName !== user.name) return false;
      const s = searchTerm.toLowerCase();
      return c.id.toLowerCase().includes(s) || c.category.toLowerCase().includes(s) || (c.userName && c.userName.toLowerCase().includes(s));
    });
  }, [complaints, searchTerm, user]);

  const filteredNotifications = useMemo(() => {
      if (!user) return [];
      return notifications.filter(n => {
          const isAdminAlert = n.id.startsWith('N-A-') || n.id.startsWith('N-AP-') || n.id.startsWith('BR-');
          
          if (user.role === 'admin') {
            if (!isAdminAlert) return false;
            if (user.branch === 'Central Head Office') return true;
            return !n.targetBranch || n.targetBranch === user.branch;
          } else {
            if (n.id.startsWith('N-A-') || n.id.startsWith('N-AP-')) return false;
            if (n.userId && n.userId !== user.name) return false;
            return !n.targetBranch || n.targetBranch === user.branch;
          }
      });
  }, [notifications, user]);

  const lastSubmittedComplaint = useMemo(() => complaints.find(c => c.id === lastComplaintId), [complaints, lastComplaintId]);
  const totalOutstandingAmount = useMemo(() => bills.filter(b => b.status === 'UNPAID').reduce((sum, b) => sum + getFinalAmount(b), 0), [bills, isGrihaJyothiEnabled]);

  const handleWiFiRechargeInitiate = (plan: WiFiPlan) => {
    setSelectedBillForPayment({ id: `WREC-${plan.id}-${Math.floor(1000 + Math.random() * 9000)}`, userId: user?.name || 'U-WIFI', userName: user?.name || 'WiFi Consumer', type: ServiceType.WIFI, amount: plan.price, dueDate: new Date().toLocaleDateString(), status: 'UNPAID', period: '30 Days Cycle', branch: user?.branch || 'Mangalore City' });
  };

  const unpaidElec = useMemo(() => bills.find(b => b.type === ServiceType.ELECTRICITY && b.status === 'UNPAID'), [bills]);
  const unpaidWifi = useMemo(() => bills.find(b => b.type === ServiceType.WIFI && b.status === 'UNPAID'), [bills]);

  return (
    <div className={`min-h-screen transition-all duration-700 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      {view === 'LANDING' ? <LandingView onGetStarted={() => setView('LOGIN')} /> : (
        <>
          <AbstractBackground isDark={isDark} />
          {view === 'LOGIN' ? <LoginView onLogin={(u) => { setUser(u); setView('APP'); }} /> : (
            <>
              {selectedBillForPayment && (
                <PaymentGateway bill={selectedBillForPayment} user={user!} lang={lang} walletBalance={walletBalance} effectiveAmount={selectedBillForPayment.id.startsWith('EST-') || selectedBillForPayment.id.startsWith('WREC-') ? selectedBillForPayment.amount : getFinalAmount(selectedBillForPayment)} onCancel={() => setSelectedBillForPayment(null)} onSuccess={handlePaymentSuccess} />
              )}
              {showPowercutModal && <PowercutAlertModal onClose={() => setShowPowercutModal(false)} onBroadcast={handleBroadcastAlert} />}
              <nav className="fixed left-0 top-0 bottom-0 w-80 bg-white/80 backdrop-blur-3xl border-r z-[60] flex flex-col items-start py-12 px-8 justify-between shadow-2xl overflow-y-auto">
                <div className="w-full space-y-12">
                  <div className="flex items-center gap-5 px-6 py-5 bg-slate-900 rounded-[2.5rem] shadow-2xl cursor-pointer" onClick={() => {setActiveTab('dashboard'); setSelectedComplaint(null); setSelectedNotification(null); setUserPageMode('OVERVIEW');}}>
                    {user?.role === 'admin' ? <Shield className="text-blue-500 w-8 h-8" /> : <Zap className="text-blue-500 w-8 h-8" />}
                    <span className="text-white font-black italic text-2xl tracking-tighter uppercase">{user?.role === 'admin' ? 'AdminNet' : 'PowerNet'}</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {[
                      {id:'dashboard', label:user?.role === 'admin' ? t('district_dashboard') : t('dashboard'), icon:LayoutDashboard},
                      {id:'notifications', label:t('alerts'), icon:Bell, badge: unreadCount},
                      user?.role === 'admin' ? {id:'complaints', label:t('all_complaints'), icon:ClipboardList} : null,
                      {id:'electricity', label:t('electricity'), icon:Zap},
                      {id:'wifi', label:t('wifi'), icon:Wifi},
                      user?.role === 'user' ? {id:'billing', label:t('billing'), icon:CreditCard} : null,
                      {id:'profile', label:t('profile'), icon:User}
                    ].filter(Boolean).map((i: any) => (
                      <button key={i.id} onClick={() => { i.id === 'notifications' ? handleNotificationClick() : setActiveTab(i.id); setSelectedComplaint(null); setSelectedBillForDetails(null); setSelectedNotification(null); setUserPageMode('OVERVIEW'); }} className={`flex items-center justify-between px-8 py-6 rounded-3xl transition-all group ${activeTab === i.id ? 'bg-slate-900 text-white shadow-2xl scale-[1.02]' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
                        <div className="flex items-center gap-6"><i.icon className={`w-5 h-5 ${activeTab === i.id ? 'text-blue-500' : ''}`} /> <span className="text-[10px] font-black uppercase tracking-[0.2em]">{i.label}</span></div>
                        {i.badge > 0 && <span className="bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full animate-pulse">{i.badge}</span>}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => setView('LANDING')} className="flex items-center gap-6 px-8 py-6 text-slate-500 hover:text-red-500 transition-all w-full group mt-12"><LogOut className="w-6 h-6 group-hover:-translate-x-2 transition-transform" /> <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('logout')}</span></button>
              </nav>
              <main className="ml-80 min-h-screen flex flex-col relative z-10">
                <header className="sticky top-0 bg-white/70 backdrop-blur-2xl border-b px-12 py-8 flex items-center justify-between z-50 shadow-sm">
                   <div className="flex items-center gap-8">{(activeTab !== 'dashboard' && !selectedComplaint && !selectedBillForDetails && !selectedNotification) && <StandardBackArrow onClick={() => {setActiveTab('dashboard'); setUserPageMode('OVERVIEW');}} />}<h2 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900">{t(activeTab)}</h2></div>
                   <div className="flex items-center gap-8">
                      <div className="relative group hidden sm:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          value={searchTerm} 
                          onChange={(e) => setSearchTerm(e.target.value)} 
                          onKeyDown={handleSearchNavigation}
                          type="text" 
                          className="bg-white border-2 border-slate-100 rounded-2xl py-3 pl-12 pr-16 font-bold outline-none focus:border-blue-500 transition-all" 
                          placeholder="Search Portal..." 
                        />
                        <button onClick={startVoiceSearch} className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full ${isListening ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'}`}>
                          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </button>
                      </div>
                      <StandardSwitch checked={isDark} onChange={() => setIsDark(!isDark)} />
                      <div className="w-14 h-14 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-blue-500 font-black text-2xl shadow-2xl border-4 border-white">{user?.name[0]}</div>
                   </div>
                </header>
                <div className="p-16 md:p-24 max-w-[1500px] w-full mx-auto flex-1 space-y-16">
                  {userPageMode === 'AI' ? (
                    <AIAssistantView context={{ user, bills, complaints }} onBack={() => setUserPageMode('OVERVIEW')} />
                  ) : selectedComplaint ? (
                    <ComplaintTrackingView 
                      complaint={selectedComplaint} 
                      lang={lang} 
                      role={user?.role} 
                      onBack={() => setSelectedComplaint(null)} 
                      onFeedback={handleFeedback} 
                      onAssignTechnician={handleAssignTechnician}
                      onUpdateStatus={handleUpdateStatus}
                    />
                  ) : activeTab === 'notifications' ? (
                    <div className="space-y-8 animate-in fade-in duration-500">
                      {selectedNotification ? <NotificationDetailsView notification={selectedNotification} onBack={() => setSelectedNotification(null)} /> : <>
                        <h3 className="text-4xl font-black italic uppercase tracking-tighter mb-12">Portal Notifications</h3>
                        <div className="grid gap-6">
                          {filteredNotifications.length === 0 ? <div className="py-24 text-center border-2 border-dashed border-slate-100 rounded-[3rem] text-slate-300 font-black uppercase italic tracking-widest text-[10px]">No notifications for your area</div> : filteredNotifications.map(n => (
                            <div key={n.id} onClick={() => handleNotificationClick(n)} className={`bg-white/90 p-10 rounded-[4rem] border border-white shadow-xl flex items-center gap-10 hover:translate-x-2 transition-transform cursor-pointer group ${!n.read ? 'border-l-8 border-l-blue-600' : ''}`}>
                              <div className={`p-8 rounded-[2rem] ${n.type === 'MAINTENANCE' ? 'bg-orange-100 text-orange-600' : n.type === 'ALERT' ? 'bg-red-100 text-red-600' : n.type === 'SUCCESS' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>{n.type === 'MAINTENANCE' ? <Hammer className="w-8 h-8" /> : n.type === 'ALERT' ? <AlertCircle className="w-8 h-8" /> : n.type === 'SUCCESS' ? <Trophy className="w-8 h-8" /> : <Bell className="w-8 h-8" />}</div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3"><h4 className="font-black italic text-2xl text-slate-900 tracking-tighter uppercase">{n.title}</h4><span className="text-[10px] font-black uppercase text-slate-300">{formatRelativeTime(n.timestamp)}</span></div>
                                <p className="text-slate-500 font-bold mt-2 text-lg line-clamp-1 group-hover:text-slate-900 transition-colors">{n.message}</p>
                              </div>
                              <ChevronRight className="w-8 h-8 text-slate-200 group-hover:text-blue-500 group-hover:translate-x-2 transition-all" />
                            </div>
                          ))}
                        </div>
                      </>}
                    </div>
                  ) : activeTab === 'dashboard' ? (
                    user?.role === 'admin' ? (
                      <div className="space-y-16 animate-in fade-in duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                          {[{label: 'Active Tickets', val: filteredComplaints.filter(c => c.status !== ComplaintStatus.RESOLVED).length, icon: ClipboardList, color: 'text-orange-600'}, {label: 'Total Collected', val: formatCurrency(bills.filter(b => b.status === 'PAID').reduce((s,b)=>s+b.amount,0), lang), icon: Wallet, color: 'text-green-600'}, {label: 'Outstanding Dues', val: formatCurrency(bills.filter(b=>b.status==='UNPAID').reduce((s,b)=>s+b.amount,0), lang), icon: CreditCard, color: 'text-blue-600'}].map((s,i) => (
                            <div key={i} className="bg-white/90 p-12 rounded-[4rem] border border-white shadow-xl flex items-center justify-between group hover:translate-y-[-8px] transition-all">
                              <div><p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">{s.label}</p><h4 className="text-4xl font-black italic tracking-tighter text-slate-900">{s.val}</h4></div>
                              <div className={`p-6 bg-slate-50 ${s.color} rounded-[2rem] shadow-lg`}><s.icon className="w-10 h-10" /></div>
                            </div>
                          ))}
                          <div className="bg-red-50 p-12 rounded-[4rem] border border-red-100 shadow-xl flex items-center justify-between group hover:translate-y-[-8px] transition-all cursor-pointer" onClick={() => setShowPowercutModal(true)}>
                            <div><p className="text-[11px] font-black text-red-400 uppercase tracking-widest mb-2">Emergency Broadcast</p><h4 className="text-3xl font-black italic tracking-tighter text-red-900">Powercut Alert</h4></div>
                            <div className="p-6 bg-red-600 text-white rounded-[2rem] shadow-lg"><Megaphone className="w-10 h-10" /></div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                          <div className="lg:col-span-2 space-y-12"><UsageGraph label="District Energy Distribution" data={DISTRICT_LOAD} color="#2563eb" /><UsagePieChart label="Regional Load Distribution" data={DISTRICT_LOAD} /></div>
                          <div><RecentActivityFeed user={user} bills={bills} complaints={complaints} notifications={notifications} lang={lang} onNavigate={handleFeedNavigation} /></div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-16 animate-in fade-in duration-700">
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                             {[{label: 'Electricity Load', val: '1.2 kWh', icon: Zap, color: 'text-blue-600'}, {label: 'WiFi Traffic', val: '42.8 GB', icon: Wifi, color: 'text-indigo-600'}, {label: 'Total Bill', val: formatCurrency(totalOutstandingAmount, lang), icon: Wallet, color: 'text-green-600'}].map((s,i) => (
                               <div key={i} className="bg-white/90 p-12 rounded-[4.5rem] border border-white shadow-xl flex items-center justify-between group hover:translate-y-[-10px] transition-all">
                                  <div><p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{s.label}</p><h4 className="text-4xl font-black italic tracking-tighter text-slate-900">{s.val}</h4></div>
                                  <div className={`p-6 bg-slate-50 ${s.color} rounded-[2rem] shadow-sm`}><s.icon className="w-10 h-10" /></div>
                               </div>
                             ))}
                           </div>

                           <div className="bg-slate-900 p-12 rounded-[4rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 text-white relative overflow-hidden">
                              <div className="relative z-10 space-y-2">
                                <h3 className="text-3xl font-black italic uppercase tracking-tighter">Need Technical Support?</h3>
                                <p className="text-slate-400 font-bold max-w-md">Our AI Assistant can help you resolve common issues, check your bill breakdown, or suggest power-saving modes.</p>
                              </div>
                              <button 
                                onClick={() => setUserPageMode('AI')}
                                className="px-12 py-6 bg-blue-600 text-white font-black uppercase tracking-[0.2em] rounded-[2rem] hover:bg-blue-700 transition-all flex items-center gap-4 relative z-10 shadow-xl"
                              >
                                <Sparkles className="w-6 h-6 animate-pulse" /> Talk to AI Assistant
                              </button>
                              <Activity className="absolute -bottom-10 -right-10 w-64 h-64 opacity-5 rotate-12" />
                           </div>

                           <div className="mt-12 space-y-8">
                             <div className="flex items-center gap-4 px-6">
                               <div className="p-3 bg-orange-50 text-orange-600 rounded-xl shadow-sm">
                                 <AlertCircle className="w-6 h-6" />
                               </div>
                               <h4 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">Priority Reminders</h4>
                             </div>

                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-2">
                                {unpaidElec ? (
                                  <div className="bg-white/90 p-8 rounded-[3.5rem] border-2 border-orange-100 shadow-xl flex items-center gap-8 group hover:scale-[1.02] transition-all cursor-pointer" onClick={() => handleFeedNavigation('billing', unpaidElec)}>
                                    <div className="p-6 bg-orange-50 text-orange-600 rounded-[2rem]">
                                      <Zap className="w-10 h-10 animate-pulse" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between mb-1">
                                        <h5 className="text-xl font-black italic uppercase text-slate-900 tracking-tight">Electricity Due</h5>
                                        <span className="text-[9px] font-black uppercase text-red-500 bg-red-50 px-3 py-1 rounded-full border border-red-100">Pay Now</span>
                                      </div>
                                      <p className="text-slate-500 font-bold text-xs uppercase tracking-wider">Invoice #{unpaidElec.id} • Due {unpaidElec.dueDate}</p>
                                      <p className="text-3xl font-black italic text-slate-900 mt-2">{formatCurrency(getFinalAmount(unpaidElec), lang)}</p>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="bg-white/90 p-8 rounded-[3.5rem] border border-slate-100 shadow-sm flex items-center gap-8 opacity-60">
                                    <div className="p-6 bg-green-50 text-green-600 rounded-[2rem]">
                                      <CheckCircle2 className="w-10 h-10" />
                                    </div>
                                    <div>
                                      <h5 className="text-xl font-black italic uppercase text-slate-400 tracking-tight">Electricity Clear</h5>
                                      <p className="text-slate-400 font-bold text-xs uppercase">No pending dues found</p>
                                    </div>
                                  </div>
                                )}

                                {unpaidWifi ? (
                                  <div className="bg-white/90 p-8 rounded-[3.5rem] border-2 border-indigo-100 shadow-xl flex items-center gap-8 group hover:scale-[1.02] transition-all cursor-pointer" onClick={() => handleFeedNavigation('billing', unpaidWifi)}>
                                    <div className="p-6 bg-indigo-50 text-indigo-600 rounded-[2rem]">
                                      <Wifi className="w-10 h-10 animate-pulse" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between mb-1">
                                        <h5 className="text-xl font-black italic uppercase text-slate-900 tracking-tight">WiFi Bill Pending</h5>
                                        <span className="text-[9px] font-black uppercase text-red-500 bg-red-50 px-3 py-1 rounded-full border border-red-100">Pay Now</span>
                                      </div>
                                      <p className="text-slate-500 font-bold text-xs uppercase tracking-wider">Plan Renewal • Due {unpaidWifi.dueDate}</p>
                                      <p className="text-3xl font-black italic text-slate-900 mt-2">{formatCurrency(unpaidWifi.amount, lang)}</p>
                                    </div>
                                  </div>
                                ) : (
                                  <div 
                                    className="bg-white/90 p-8 rounded-[3.5rem] border-2 border-blue-50 shadow-xl flex items-center gap-8 group hover:scale-[1.02] transition-all cursor-pointer"
                                    onClick={() => setActiveTab('wifi')}
                                  >
                                    <div className="p-6 bg-blue-50 text-blue-600 rounded-[2rem] group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                      <Wifi className="w-10 h-10" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between mb-1">
                                        <h5 className="text-xl font-black italic uppercase text-slate-900 tracking-tight">{activeWiFiPlan.name}</h5>
                                        <span className="text-[9px] font-black uppercase text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">Active</span>
                                      </div>
                                      <p className="text-slate-500 font-bold text-xs uppercase tracking-wider">{activeWiFiPlan.speed} • Unlimited Data</p>
                                      <div className="mt-4 space-y-2">
                                         <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-400">
                                            <span>Usage: 42.8 GB</span>
                                            <span>Cycle: 22 Days Left</span>
                                         </div>
                                         <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 w-[70%]" />
                                         </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                             </div>
                           </div>

                           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12"><UsageGraph label="Electricity Usage" data={ELECTRICITY_USAGE} color="#2563eb" /><UsagePieChart label="Weekly Consumption" data={ELECTRICITY_USAGE} /></div>
                           <div className="mt-12"><RecentActivityFeed user={user} bills={bills} complaints={complaints} notifications={notifications} lang={lang} onNavigate={handleFeedNavigation} /></div>
                      </div>
                    )
                  ) : activeTab === 'complaints' ? (
                    <div className="grid gap-8">
                      {filteredComplaints.length === 0 ? <div className="text-center py-32 bg-white/50 rounded-[5rem] border-2 border-dashed border-slate-200"><Search className="w-20 h-20 text-slate-300 mx-auto mb-6" /><p className="font-black text-slate-400 uppercase tracking-[0.3em] italic">No incident matches found</p></div> : filteredComplaints.map(c => (
                        <div key={c.id} className="bg-white/90 p-12 rounded-[4.5rem] border border-white shadow-xl flex items-center justify-between group hover:scale-[1.02] transition-all duration-300">
                          <div className="flex items-center gap-12">
                              <div className={`p-10 rounded-[3rem] bg-slate-50 ${c.type === ServiceType.ELECTRICITY ? 'text-orange-600' : 'text-indigo-600'}`}>{c.type === ServiceType.ELECTRICITY ? <Zap className="w-10 h-10" /> : <Wifi className="w-10 h-10" />}</div>
                              <div><div className="flex items-center gap-4"><h4 className="font-black italic uppercase text-slate-900 text-3xl tracking-tighter">{c.category}</h4>{!c.technicianName && <span className="bg-red-100 text-red-600 text-[9px] font-black px-3 py-1 rounded-full uppercase">Unassigned</span>}</div><p className="text-[12px] font-black text-slate-400 uppercase mt-2">Branch: {c.branch} • User: {c.userName || 'Unknown'}</p></div>
                          </div>
                          <div className="flex items-center gap-6"><span className={`px-8 py-4 rounded-full text-[11px] font-black uppercase tracking-widest ${c.status === ComplaintStatus.RESOLVED ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{c.status}</span><button onClick={() => setSelectedComplaint(c)} className="p-5 bg-slate-900 text-white rounded-[2rem] hover:bg-blue-600 transition-colors shadow-xl"><Eye className="w-7 h-7" /></button></div>
                        </div>
                      ))}
                    </div>
                  ) : activeTab === 'electricity' ? (
                    user?.role === 'admin' ? (
                      <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                           <div className="bg-white/90 p-10 rounded-[3.5rem] border border-white shadow-xl flex items-center gap-8">
                              <div className="p-6 bg-orange-50 text-orange-600 rounded-[2rem] shadow-sm"><ActivitySquare className="w-10 h-10" /></div>
                              <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Branch Stability</p><h5 className="text-4xl font-black italic text-slate-900">98.5%</h5></div>
                           </div>
                           <div className="bg-white/90 p-10 rounded-[3.5rem] border border-white shadow-xl flex items-center gap-8">
                              <div className="p-6 bg-blue-50 text-blue-600 rounded-[2rem] shadow-sm"><Zap className="w-10 h-10" /></div>
                              <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Load</p><h5 className="text-4xl font-black italic text-slate-900">142 MW</h5></div>
                           </div>
                           <div className="bg-white/90 p-10 rounded-[3.5rem] border border-white shadow-xl flex items-center gap-8">
                              <div className="p-6 bg-red-50 text-red-600 rounded-[2rem] shadow-sm"><AlertTriangle className="w-10 h-10" /></div>
                              <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Issues</p><h5 className="text-4xl font-black italic text-slate-900">{filteredComplaints.filter(c => c.status !== ComplaintStatus.RESOLVED && c.type === ServiceType.ELECTRICITY).length}</h5></div>
                           </div>
                           <div className="bg-white/90 p-10 rounded-[3.5rem] border border-white shadow-xl flex items-center gap-8">
                              <div className="p-6 bg-green-50 text-green-600 rounded-[2rem] shadow-sm"><Archive className="w-10 h-10" /></div>
                              <div><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Resolved Today</p><h5 className="text-4xl font-black italic text-slate-900">8</h5></div>
                           </div>
                        </div>

                        <div className="bg-white/90 p-12 rounded-[4rem] border border-white shadow-xl space-y-10">
                          <div className="flex items-center justify-between">
                            <div>
                               <h4 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">New Electricity Complaints</h4>
                               <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-1">Real-time incident management for {user?.branch}</p>
                            </div>
                            <div className="flex items-center gap-4">
                               <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                               <span className="text-[10px] font-black uppercase tracking-widest">Live Log</span>
                            </div>
                          </div>
                          
                          <div className="space-y-6">
                            {filteredComplaints.filter(c => c.status !== ComplaintStatus.RESOLVED && c.type === ServiceType.ELECTRICITY).length === 0 ? (
                              <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[3rem] text-slate-300 font-black uppercase italic tracking-widest">No active electricity complaints</div>
                            ) : (
                              filteredComplaints.filter(c => c.status !== ComplaintStatus.RESOLVED && c.type === ServiceType.ELECTRICITY).map(c => (
                                <div key={c.id} className="p-8 border border-slate-50 bg-slate-50/30 rounded-[3rem] flex flex-col lg:flex-row lg:items-center justify-between gap-8 group hover:bg-white hover:shadow-xl hover:border-slate-100 transition-all duration-500">
                                   <div className="flex items-start gap-8">
                                      <div className={`p-6 rounded-[2rem] ${c.status === ComplaintStatus.PENDING ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                        <Zap className="w-8 h-8" />
                                      </div>
                                      <div>
                                         <div className="flex items-center gap-3">
                                            <h6 className="font-black italic text-xl uppercase tracking-tight text-slate-900">{c.category}</h6>
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ID: {c.userId}</span>
                                         </div>
                                         <p className="text-slate-500 font-bold text-sm mt-1">{c.location} • {formatRelativeTime(c.createdAt)}</p>
                                         {c.technicianName && <p className="text-[10px] font-black uppercase text-blue-600 mt-2 flex items-center gap-2"><Hammer className="w-3 h-3" /> Assigned to {c.technicianName}</p>}
                                      </div>
                                   </div>
                                   <div className="flex flex-wrap items-center gap-4">
                                      <div className="bg-white p-2 rounded-full border border-slate-100 flex gap-2">
                                         <button onClick={() => handleQuickAssign(c.id, 'Team A')} className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${c.technicianName === 'Team A' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>Team A</button>
                                         <button onClick={() => handleQuickAssign(c.id, 'Team B')} className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${c.technicianName === 'Team B' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>Team B</button>
                                      </div>
                                      <div className="h-8 w-px bg-slate-200 hidden lg:block mx-2"></div>
                                      <div className="flex gap-2">
                                         <button onClick={() => handleQuickStatusUpdate(c.id, ComplaintStatus.SOLVING)} className={`p-4 rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm ${c.status === ComplaintStatus.SOLVING ? 'bg-blue-600 text-white ring-4 ring-blue-500/20' : ''}`} title="In Progress"><Hammer className="w-5 h-5" /></button>
                                         <button onClick={() => handleQuickStatusUpdate(c.id, ComplaintStatus.RESOLVED)} className="p-4 rounded-2xl bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all shadow-sm" title="Resolve"><CheckCircle2 className="w-5 h-5" /></button>
                                      </div>
                                   </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                           <div className="bg-slate-900 p-12 rounded-[4rem] text-white space-y-8 shadow-2xl relative overflow-hidden">
                              <div className="relative z-10">
                                 <h4 className="text-3xl font-black italic uppercase tracking-tighter">Outage Announcement</h4>
                                 <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Broadcast restoration timeline to consumers</p>
                              </div>
                              <div className="space-y-6 relative z-10">
                                 <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-4">Affected Area</label>
                                    <div className="relative">
                                       <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                       <input 
                                          type="text" 
                                          value={outageArea}
                                          onChange={(e) => setOutageArea(e.target.value)}
                                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 font-bold outline-none focus:border-blue-500 transition-all"
                                          placeholder="e.g. Kadri Park Vicinity"
                                       />
                                    </div>
                                 </div>
                                 <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-4">Expected Restoration</label>
                                    <div className="relative">
                                       <Timer className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                       <input 
                                          type="text" 
                                          value={restoreTime}
                                          onChange={(e) => setRestoreTime(e.target.value)}
                                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 font-bold outline-none focus:border-blue-500 transition-all"
                                          placeholder="e.g. 08:30 PM Today"
                                       />
                                    </div>
                                 </div>
                                 <button 
                                    onClick={() => handleBroadcastAlert(user?.branch || 'Local', 'Unscheduled Power Outage', `Power failure reported in ${outageArea}. Expected restoration by ${restoreTime}. Teams are working on it.`, ServiceType.ELECTRICITY)}
                                    className="w-full py-6 bg-blue-600 text-white font-black uppercase tracking-[0.2em] rounded-[2rem] hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-900/20"
                                 >
                                    <Megaphone className="w-5 h-5" /> Notify All Branch Users
                                 </button>
                              </div>
                              <Activity className="absolute -bottom-10 -right-10 w-64 h-64 opacity-5 rotate-12" />
                           </div>

                           <div className="bg-white/90 p-12 rounded-[4rem] border border-white shadow-xl space-y-8">
                              <h4 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">Maintenance Schedule</h4>
                              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                                 {[
                                   { area: 'Mary Hill Grid', date: 'Oct 30, 2023', time: '11:00 AM - 02:00 PM', type: 'Planned' },
                                   { area: 'Ashok Nagar', date: 'Nov 02, 2023', time: '10:00 AM - 04:00 PM', type: 'Grid Upgrade' },
                                   { area: 'Cable Replacement', date: 'Nov 05, 2023', time: '09:00 AM - 12:00 PM', type: 'Cable Replacement' }
                                 ].map((item, i) => (
                                   <div key={i} className="p-6 border border-slate-50 bg-slate-50/50 rounded-[2.5rem] flex items-center justify-between group hover:bg-white hover:shadow-md transition-all">
                                      <div className="flex items-center gap-5">
                                         <div className="p-4 rounded-2xl bg-white text-blue-600 shadow-sm"><Calendar className="w-6 h-6" /></div>
                                         <div>
                                            <h6 className="font-bold text-slate-900">{item.area}</h6>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.date} • {item.time}</p>
                                         </div>
                                      </div>
                                      <span className="text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 px-3 py-1 rounded-full">{item.type}</span>
                                   </div>
                                 ))}
                              </div>
                           </div>
                        </div>

                        <div className="bg-white/90 p-12 rounded-[4rem] border border-white shadow-xl space-y-10">
                           <div className="flex items-center justify-between px-4">
                              <h4 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">Resolved Incident History</h4>
                              <Archive className="w-8 h-8 text-slate-200" />
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {filteredComplaints.filter(c => c.status === ComplaintStatus.RESOLVED && c.type === ServiceType.ELECTRICITY).length === 0 ? (
                                <div className="col-span-2 py-12 text-center text-slate-300 italic font-black uppercase tracking-widest">No history records found</div>
                              ) : (
                                filteredComplaints.filter(c => c.status === ComplaintStatus.RESOLVED && c.type === ServiceType.ELECTRICITY).map(c => (
                                  <div key={c.id} className="p-6 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center justify-between opacity-70 hover:opacity-100 transition-all cursor-pointer" onClick={() => setSelectedComplaint(c)}>
                                     <div className="flex items-center gap-5">
                                        <div className="p-4 rounded-2xl bg-white text-green-600 shadow-sm"><CheckCircle2 className="w-6 h-6" /></div>
                                        <div>
                                           <div className="flex items-center gap-2">
                                              <h6 className="font-bold text-slate-900 text-sm">{c.category}</h6>
                                              {c.rating && (
                                                <div className="flex gap-0.5">
                                                   {[1, 2, 3, 4, 5].map(s => <Star key={s} className={`w-3 h-3 ${c.rating! >= s ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} />)}
                                                </div>
                                              )}
                                           </div>
                                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{c.location} • Resolved {formatRelativeTime(c.updatedAt)}</p>
                                        </div>
                                     </div>
                                     <button className="p-3 hover:bg-slate-200 rounded-xl text-slate-400 transition-all"><FileText className="w-4 h-4" /></button>
                                  </div>
                                ))
                              )}
                           </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-16 animate-in fade-in duration-700">
                        {userPageMode === 'SUCCESS' && lastSubmittedComplaint ? <SubmissionSuccessView complaint={lastSubmittedComplaint} onFeedback={handleFeedback} onFinish={() => setUserPageMode('TRACK')} /> : userPageMode === 'RAISE' ? <div className="animate-in fade-in slide-in-from-right-8 duration-700"><div className="flex items-center gap-6 mb-12"><StandardBackArrow onClick={() => setUserPageMode('OVERVIEW')} /><div><h3 className="text-4xl font-black italic uppercase text-slate-900 tracking-tighter">Submit Report</h3><p className="text-[11px] font-black uppercase text-slate-400 tracking-[0.4em]">Issue Details</p></div></div><RaiseComplaintForm type={ServiceType.ELECTRICITY} user={user!} onSubmitted={handleRaiseComplaint} onCancel={() => setUserPageMode('OVERVIEW')} /></div> : <div className="space-y-16">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <button onClick={() => setUserPageMode('RAISE')} className={`p-12 rounded-[4rem] flex flex-col items-center gap-6 border-4 transition-all group ${userPageMode === 'RAISE' ? 'bg-blue-600 border-blue-400 text-white shadow-2xl' : 'bg-white border-white text-slate-900 shadow-xl hover:border-slate-100'}`}><div className={`p-6 rounded-[2rem] ${userPageMode === 'RAISE' ? 'bg-white/20' : 'bg-slate-100'} transition-all`}><FileWarning className="w-12 h-12" /></div><div className="text-center"><h5 className="text-2xl font-black italic uppercase tracking-tighter">{t('raise_complaint')}</h5><p className={`text-xs font-bold mt-2 ${userPageMode === 'RAISE' ? 'text-white/70' : 'text-slate-400'}`}>Report technical issues instantly</p></div></button>
                                <button onClick={() => setUserPageMode('TRACK')} className={`p-12 rounded-[4rem] flex flex-col items-center gap-6 border-4 transition-all group ${userPageMode === 'TRACK' ? 'bg-blue-600 border-blue-400 text-white shadow-2xl' : 'bg-white border-white text-slate-900 shadow-xl hover:border-slate-100'}`}><div className={`p-6 rounded-[2rem] ${userPageMode === 'TRACK' ? 'bg-white/20' : 'bg-slate-100'} transition-all`}><History className="w-12 h-12" /></div><div className="text-center"><h5 className="text-2xl font-black italic uppercase tracking-tighter">{t('track_complaints')}</h5><p className={`text-xs font-bold mt-2 ${userPageMode === 'TRACK' ? 'text-white/70' : 'text-slate-400'}`}>Check tickets</p></div></button>
                            </div>
                            {userPageMode === 'OVERVIEW' && <>
                              <ServiceCatalog notifications={notifications} userBranch={user?.branch} serviceType={ServiceType.ELECTRICITY} />
                              <SmartBillingSection lang={lang} isGrihaJyothiEnabled={isGrihaJyothiEnabled} onProceed={(tempBill) => setSelectedBillForPayment(tempBill)} />
                              <div className="bg-white/90 p-12 rounded-[4rem] border border-white shadow-xl flex items-center justify-between gap-10"><div className="flex items-center gap-8"><div className="p-6 bg-blue-50 text-blue-600 rounded-[2rem] shadow-sm"><Lightbulb className="w-12 h-12" /></div><div><h4 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">Griha Jyothi Yojana</h4><p className="text-slate-500 font-bold text-sm max-w-md">Benefit up to 200 units free per month.</p></div></div><div className="flex flex-col items-center gap-3"><span className="text-[10px] font-black uppercase tracking-widest">{isGrihaJyothiEnabled ? 'Active' : 'Enroll'}</span><StandardSwitch checked={isGrihaJyothiEnabled} onChange={() => setIsGrihaJyothiEnabled(!isGrihaJyothiEnabled)} /></div></div>
                            </>}
                            {userPageMode === 'TRACK' && <div className="bg-white/90 p-16 rounded-[4.5rem] border border-white shadow-xl space-y-12"><h4 className="text-4xl font-black italic uppercase tracking-tighter">Active Tickets</h4><div className="space-y-6">{filteredComplaints.filter(c => c.type === ServiceType.ELECTRICITY).map(c => <div key={c.id} onClick={() => setSelectedComplaint(c)} className="p-10 border border-slate-100 rounded-[3rem] flex items-center justify-between hover:bg-slate-50 cursor-pointer shadow-sm group"><div className="flex items-center gap-10"><div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center ${c.status === ComplaintStatus.RESOLVED ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>{c.status === ComplaintStatus.RESOLVED ? <Check className="w-8 h-8" /> : <Clock className="w-8 h-8" />}</div><div><h5 className="font-black italic text-2xl uppercase tracking-tighter text-slate-900">{c.category}</h5><p className="text-[12px] font-black text-slate-400 uppercase mt-2">{c.id}</p></div></div><ChevronRight className="w-8 h-8 text-slate-200 group-hover:text-blue-600 transition-all" /></div>)}</div></div>}
                        </div>}
                      </div>
                    )
                  ) : activeTab === 'wifi' ? (
                    user?.role === 'admin' ? (
                      <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                           <div className="bg-white/90 p-10 rounded-[3.5rem] border border-white shadow-xl flex items-center gap-8 group hover:translate-y-[-8px] transition-all">
                              <div className="p-6 bg-indigo-50 text-indigo-600 rounded-[2rem] shadow-sm"><Signal className="w-10 h-10" /></div>
                              <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Load</p><h5 className="text-4xl font-black italic text-slate-900">1.2 Tbps</h5></div>
                           </div>
                           <div className="bg-white/90 p-10 rounded-[3.5rem] border border-white shadow-xl flex items-center gap-8 group hover:translate-y-[-8px] transition-all">
                              <div className="p-6 bg-green-50 text-green-600 rounded-[2rem] shadow-sm"><MonitorCheck className="w-10 h-10" /></div>
                              <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Node Uptime</p><h5 className="text-4xl font-black italic text-slate-900">99.9%</h5></div>
                           </div>
                           <div className="bg-white/90 p-10 rounded-[3.5rem] border border-white shadow-xl flex items-center gap-8 group hover:translate-y-[-8px] transition-all">
                              <div className="p-6 bg-red-50 text-red-600 rounded-[2rem] shadow-sm"><AlertCircle className="w-10 h-10" /></div>
                              <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Tickets</p><h5 className="text-4xl font-black italic text-slate-900">{filteredComplaints.filter(c => c.status !== ComplaintStatus.RESOLVED && c.type === ServiceType.WIFI).length}</h5></div>
                           </div>
                           <div className="bg-white/90 p-10 rounded-[3.5rem] border border-white shadow-xl flex items-center gap-8 group hover:translate-y-[-8px] transition-all">
                              <div className="p-6 bg-blue-50 text-blue-600 rounded-[2rem] shadow-sm"><Server className="w-10 h-10" /></div>
                              <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Branch Hubs</p><h5 className="text-4xl font-black italic text-slate-900">12</h5></div>
                           </div>
                        </div>

                        <div className="bg-white/90 p-12 rounded-[4rem] border border-white shadow-xl space-y-10">
                          <div className="flex items-center justify-between px-4">
                             <div>
                                <h4 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">Consumer WiFi Incident Log</h4>
                                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-1">Fiber & Broadband maintenance for {user?.branch}</p>
                             </div>
                             <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl"><Wifi className="w-6 h-6 animate-pulse" /></div>
                          </div>

                          <div className="space-y-6">
                            {filteredComplaints.filter(c => c.status !== ComplaintStatus.RESOLVED && c.type === ServiceType.WIFI).length === 0 ? (
                              <div className="py-24 text-center border-2 border-dashed border-slate-100 rounded-[3rem] text-slate-300 font-black uppercase italic tracking-widest">No pending WiFi tickets found</div>
                            ) : (
                              filteredComplaints.filter(c => c.status !== ComplaintStatus.RESOLVED && c.type === ServiceType.WIFI).map(c => (
                                <div key={c.id} className="p-8 border border-slate-50 bg-slate-50/30 rounded-[3rem] flex flex-col lg:flex-row lg:items-center justify-between gap-8 group hover:bg-white hover:shadow-xl hover:border-slate-100 transition-all duration-500">
                                   <div className="flex items-start gap-8">
                                      <div className={`p-6 rounded-[2.5rem] ${c.status === ComplaintStatus.PENDING ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'}`}>
                                        <HardDrive className="w-8 h-8" />
                                      </div>
                                      <div>
                                         <div className="flex items-center gap-3">
                                            <h6 className="font-black italic text-xl uppercase tracking-tight text-slate-900">{c.category}</h6>
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">User ID: {c.userId}</span>
                                         </div>
                                         <p className="text-slate-500 font-bold text-sm mt-1">{c.location} • {formatRelativeTime(c.createdAt)}</p>
                                         <div className="flex gap-2 mt-3">
                                            <span className="px-3 py-1 bg-white border border-slate-100 rounded-full text-[8px] font-black uppercase text-slate-400 tracking-widest">Area: {c.branch}</span>
                                            {c.technicianName && <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-[8px] font-black uppercase text-indigo-600 tracking-widest">Staff: {c.technicianName}</span>}
                                         </div>
                                      </div>
                                   </div>
                                   <div className="flex flex-wrap items-center gap-4">
                                      <div className="bg-white p-2 rounded-full border border-slate-100 flex gap-2">
                                         <button onClick={() => handleQuickAssign(c.id, 'Team Alpha')} className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${c.technicianName === 'Team Alpha' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>Team Alpha</button>
                                         <button onClick={() => handleQuickAssign(c.id, 'Team Beta')} className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${c.technicianName === 'Team Beta' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>Team Beta</button>
                                      </div>
                                      <div className="flex gap-2">
                                         <button onClick={() => handleQuickStatusUpdate(c.id, ComplaintStatus.SOLVING)} className={`p-4 rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all ${c.status === ComplaintStatus.SOLVING ? 'bg-blue-600 text-white shadow-md' : ''}`} title="Begin Solving"><Hammer className="w-5 h-5" /></button>
                                         <button onClick={() => handleQuickStatusUpdate(c.id, ComplaintStatus.RESOLVED)} className="p-4 rounded-2xl bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all shadow-sm" title="Mark Fixed"><CheckCircle2 className="w-5 h-5" /></button>
                                      </div>
                                   </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                           <div className="bg-indigo-900 p-12 rounded-[4rem] text-white space-y-8 shadow-2xl relative overflow-hidden">
                              <div className="relative z-10">
                                 <h4 className="text-3xl font-black italic uppercase tracking-tighter">Network Announcement</h4>
                                 <p className="text-indigo-300 font-bold text-xs uppercase tracking-widest mt-1">Alert consumers about regional fiber issues</p>
                              </div>
                              <div className="space-y-6 relative z-10">
                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                       <label className="text-[10px] font-black uppercase text-indigo-400 tracking-widest ml-4">Target Area</label>
                                       <div className="relative">
                                          <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
                                          <input 
                                             type="text" 
                                             value={wifiAnnounceArea}
                                             onChange={(e) => setWifiAnnounceArea(e.target.value)}
                                             className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 font-bold outline-none focus:border-indigo-500 transition-all"
                                             placeholder="e.g. Suratkal North"
                                          />
                                       </div>
                                    </div>
                                    <div className="space-y-3">
                                       <label className="text-[10px] font-black uppercase text-indigo-400 tracking-widest ml-4">Issue Category</label>
                                       <select 
                                          value={wifiAnnounceIssue}
                                          onChange={(e) => setWifiAnnounceIssue(e.target.value)}
                                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 font-bold outline-none appearance-none focus:border-indigo-500 transition-all text-sm"
                                       >
                                          <option value="General Maintenance">General Maintenance</option>
                                          <option value="Fiber Cut">Fiber Cut</option>
                                          <option value="Router Upgrade">Router Upgrade</option>
                                          <option value="Downtime">System Downtime</option>
                                       </select>
                                    </div>
                                 </div>
                                 <button 
                                    onClick={() => handleBroadcastAlert(user?.branch || 'WiFi Hub', `Network Alert: ${wifiAnnounceIssue}`, `Our teams are addressing a ${wifiAnnounceIssue} in ${wifiAnnounceArea}. Connectivity will be restored shortly.`, ServiceType.WIFI)}
                                    className="w-full py-6 bg-white text-indigo-900 font-black uppercase tracking-[0.2em] rounded-[2rem] hover:bg-indigo-50 transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-900/40"
                                 >
                                    <Megaphone className="w-5 h-5" /> Push Area Notification
                                 </button>
                              </div>
                              <Signal className="absolute -bottom-10 -right-10 w-64 h-64 opacity-5 rotate-12" />
                           </div>

                           <div className="bg-white/90 p-12 rounded-[4rem] border border-white shadow-xl space-y-10">
                              <div className="flex items-center justify-between px-2">
                                 <h4 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">WiFi Resolution History</h4>
                                 <History className="w-8 h-8 text-slate-200" />
                              </div>
                              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-4 custom-scrollbar">
                                 {filteredComplaints.filter(c => c.status === ComplaintStatus.RESOLVED && c.type === ServiceType.WIFI).length === 0 ? (
                                   <div className="py-12 text-center text-slate-300 italic font-black uppercase tracking-widest">No past resolutions recorded</div>
                                 ) : (
                                   filteredComplaints.filter(c => c.status === ComplaintStatus.RESOLVED && c.type === ServiceType.WIFI).map(c => (
                                     <div key={c.id} className="p-6 border border-slate-50 bg-slate-50/50 rounded-[2.5rem] flex items-center justify-between opacity-80 group hover:opacity-100 transition-all cursor-pointer" onClick={() => setSelectedComplaint(c)}>
                                        <div className="flex items-center gap-5">
                                           <div className="p-4 rounded-2xl bg-white text-green-500 shadow-sm group-hover:scale-110 transition-transform"><Check className="w-6 h-6" /></div>
                                           <div>
                                              <div className="flex items-center gap-2">
                                                 <h6 className="font-bold text-slate-900 text-sm">{c.category}</h6>
                                                 {c.rating && (
                                                   <div className="flex gap-0.5">
                                                      {[1, 2, 3, 4, 5].map(s => <Star key={s} className={`w-3 h-3 ${c.rating! >= s ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} />)}
                                                   </div>
                                                 )}
                                              </div>
                                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Fixed {formatRelativeTime(c.updatedAt)} by {c.technicianName || 'Maintenance'}</p>
                                           </div>
                                        </div>
                                        <span className="text-[8px] font-black bg-white border border-slate-100 px-3 py-1 rounded-full text-slate-400">LOGGED</span>
                                     </div>
                                   ))
                                 )}
                              </div>
                           </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-16 animate-in fade-in duration-700">
                        {userPageMode === 'SUCCESS' && lastSubmittedComplaint ? <SubmissionSuccessView complaint={lastSubmittedComplaint} onFeedback={handleFeedback} onFinish={() => setUserPageMode('TRACK')} /> : userPageMode === 'RAISE' ? <div className="animate-in fade-in slide-in-from-right-8 duration-700"><div className="flex items-center gap-6 mb-12"><StandardBackArrow onClick={() => setUserPageMode('OVERVIEW')} /><div><h3 className="text-4xl font-black italic uppercase text-slate-900 tracking-tighter">Submit Report</h3><p className="text-[11px] font-black uppercase text-slate-400 tracking-[0.4em]">Issue Details</p></div></div><RaiseComplaintForm type={ServiceType.WIFI} user={user!} onSubmitted={handleRaiseComplaint} onCancel={() => setUserPageMode('OVERVIEW')} /></div> : <div className="space-y-16">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <button onClick={() => setUserPageMode('RAISE')} className={`p-12 rounded-[4rem] flex flex-col items-center gap-6 border-4 transition-all group ${userPageMode === 'RAISE' ? 'bg-blue-600 border-blue-400 text-white shadow-2xl' : 'bg-white border-white text-slate-900 shadow-xl hover:border-slate-100'}`}><div className={`p-6 rounded-[2rem] ${userPageMode === 'RAISE' ? 'bg-white/20' : 'bg-slate-100'} transition-all`}><FileWarning className="w-12 h-12" /></div><div className="text-center"><h5 className="text-2xl font-black italic uppercase tracking-tighter">{t('raise_complaint')}</h5><p className={`text-xs font-bold mt-2 ${userPageMode === 'RAISE' ? 'text-white/70' : 'text-slate-400'}`}>Report technical issues instantly</p></div></button>
                                <button onClick={() => setUserPageMode('TRACK')} className={`p-12 rounded-[4rem] flex flex-col items-center gap-6 border-4 transition-all group ${userPageMode === 'TRACK' ? 'bg-blue-600 border-blue-400 text-white shadow-2xl' : 'bg-white border-white text-slate-900 shadow-xl hover:border-slate-100'}`}><div className={`p-6 rounded-[2rem] ${userPageMode === 'TRACK' ? 'bg-white/20' : 'bg-slate-100'} transition-all`}><History className="w-12 h-12" /></div><div className="text-center"><h5 className="text-2xl font-black italic uppercase tracking-tighter">{t('track_complaints')}</h5><p className={`text-xs font-bold mt-2 ${userPageMode === 'TRACK' ? 'text-white/70' : 'text-slate-400'}`}>Check tickets</p></div></button>
                            </div>
                            {userPageMode === 'OVERVIEW' && <>
                              <ServiceCatalog notifications={notifications} userBranch={user?.branch} serviceType={ServiceType.WIFI} />
                              <WiFiRechargeSection lang={lang} currentPlan={activeWiFiPlan} onRecharge={handleWiFiRechargeInitiate} />
                            </>}
                            {userPageMode === 'TRACK' && <div className="bg-white/90 p-16 rounded-[4.5rem] border border-white shadow-xl space-y-12"><h4 className="text-4xl font-black italic uppercase tracking-tighter">Active Tickets</h4><div className="space-y-6">{filteredComplaints.filter(c => c.type === ServiceType.WIFI).map(c => <div key={c.id} onClick={() => setSelectedComplaint(c)} className="p-10 border border-slate-100 rounded-[3rem] flex items-center justify-between hover:bg-slate-50 cursor-pointer shadow-sm group"><div className="flex items-center gap-10"><div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center ${c.status === ComplaintStatus.RESOLVED ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>{c.status === ComplaintStatus.RESOLVED ? <Check className="w-8 h-8" /> : <Clock className="w-8 h-8" />}</div><div><h5 className="font-black italic text-2xl uppercase tracking-tighter text-slate-900">{c.category}</h5><p className="text-[12px] font-black text-slate-400 uppercase mt-2">{c.id}</p></div></div><ChevronRight className="w-8 h-8 text-slate-200 group-hover:text-blue-600 transition-all" /></div>)}</div></div>}
                        </div>}
                      </div>
                    )
                  ) : activeTab === 'billing' ? (
                    <div className="grid gap-12">
                      {selectedBillForDetails ? <BillDetailsView bill={selectedBillForDetails} onPay={(b) => { setSelectedBillForDetails(null); setSelectedBillForPayment(b); }} lang={lang} onBack={() => setSelectedBillForDetails(null)} finalAmount={getFinalAmount(selectedBillForDetails)} isSchemeApplied={isGrihaJyothiEnabled && selectedBillForDetails.type === ServiceType.ELECTRICITY && (selectedBillForDetails.unitsConsumed || 0) <= 200} /> : <>
                          <div className="bg-slate-900 p-16 rounded-[4.5rem] shadow-2xl flex items-center justify-between text-white"><div className="space-y-4"><h3 className="text-4xl font-black italic uppercase tracking-tighter">PowerNet Wallet</h3></div><h4 className="text-7xl font-black italic text-blue-500 tracking-tighter">{formatCurrency(walletBalance, lang)}</h4></div>
                          <div className="space-y-8">{bills.map(b => <div key={b.id} onClick={() => setSelectedBillForDetails(b)} className="p-12 bg-white border border-slate-100 rounded-[4rem] flex items-center justify-between group shadow-sm hover:shadow-xl transition-all cursor-pointer"><div className="flex items-center gap-12"><div className={`p-10 rounded-[3rem] shadow-lg ${b.type === ServiceType.ELECTRICITY ? 'bg-orange-50 text-orange-600' : 'bg-indigo-50 text-indigo-600'}`}>{b.type === ServiceType.ELECTRICITY ? <Zap className="w-14 h-14" /> : <Wifi className="w-14 h-14" />}</div><div><h4 className="text-4xl font-black italic text-slate-900 tracking-tighter">{formatCurrency(getFinalAmount(b), lang)}</h4><p className="text-[14px] font-black uppercase text-slate-400 tracking-widest mt-2">{b.period}</p></div></div><div className="flex items-center gap-10" onClick={e => e.stopPropagation()}><span className={`px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest ${b.status === 'PAID' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{b.status}</span>{b.status === 'UNPAID' && <button onClick={() => setSelectedBillForPayment(b)} className="px-14 py-7 bg-blue-600 text-white rounded-[2.5rem] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-700 transition-all">Pay Now</button>}</div></div>)}</div>
                       </>}
                    </div>
                  ) : activeTab === 'profile' ? (
                    <div className="max-w-6xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
                      <div className="bg-white/90 p-16 rounded-[5rem] border-4 border-white shadow-2xl flex flex-col md:flex-row items-center md:items-start gap-16 relative overflow-hidden">
                        <div className="w-64 h-64 bg-slate-900 rounded-[4rem] flex items-center justify-center text-blue-500 text-9xl font-black italic shadow-2xl relative z-10 border-4 border-white">
                          {user?.name[0]}
                        </div>
                        <div className="flex-1 space-y-8 relative z-10">
                          <div>
                            <div className="flex items-center gap-4 mb-2">
                               <h3 className="text-6xl font-black italic uppercase tracking-tighter text-slate-900">{user?.name}</h3>
                               <div className="p-2 bg-blue-600 rounded-full text-white"><ShieldCheck className="w-6 h-6" /></div>
                            </div>
                            <p className="text-slate-400 font-bold uppercase tracking-widest">Unified Service Identifier: PN-{user?.phone?.slice(-4) || '7782'}</p>
                          </div>
                          
                          <div className="flex flex-wrap gap-4">
                             <div className="px-10 py-5 bg-blue-50 text-blue-600 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center gap-3 border border-blue-100"><User className="w-4 h-4" /> {user?.role} Access</div>
                             <div className="px-10 py-5 bg-slate-50 text-slate-600 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center gap-3 border border-slate-100"><Building2 className="w-4 h-4" /> {user?.branch}</div>
                             <div className="px-10 py-5 bg-green-50 text-green-600 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center gap-3 border border-green-100"><ShieldCheck className="w-4 h-4" /> Account Verified</div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                             <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Account Language</label>
                                <div className="flex bg-slate-50 p-2 rounded-3xl border border-slate-100">
                                   {['en', 'kn', 'hi'].map(l => (
                                     <button key={l} onClick={() => setLang(l as Language)} className={`flex-1 py-4 rounded-2xl font-black uppercase text-xs transition-all ${lang === l ? 'bg-white shadow-lg text-blue-600' : 'text-slate-400'}`}>{l}</button>
                                   ))}
                                </div>
                             </div>
                             <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Portal Theme</label>
                                <div className="flex bg-slate-50 p-2 rounded-3xl border border-slate-100">
                                   <button onClick={() => setIsDark(false)} className={`flex-1 py-4 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 transition-all ${!isDark ? 'bg-white shadow-lg text-orange-500' : 'text-slate-400'}`}><Sun className="w-4 h-4" /> Day</button>
                                   <button onClick={() => setIsDark(true)} className={`flex-1 py-4 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 transition-all ${isDark ? 'bg-white shadow-lg text-blue-500' : 'text-slate-400'}`}><Moon className="w-4 h-4" /> Night</button>
                                </div>
                             </div>
                          </div>
                        </div>
                        <Activity className="absolute -bottom-10 -right-10 w-96 h-96 opacity-[0.03] rotate-12" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {user?.role === 'admin' ? (
                          <>
                             <div className="bg-white/80 p-10 rounded-[4rem] border border-white shadow-xl flex flex-col items-center text-center gap-4">
                                <div className="p-6 bg-orange-50 text-orange-600 rounded-[2.5rem]"><ClipboardList className="w-12 h-12" /></div>
                                <div><h6 className="text-5xl font-black italic tracking-tighter">142</h6><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Tickets Resolved</p></div>
                             </div>
                             <div className="bg-white/80 p-10 rounded-[4rem] border border-white shadow-xl flex flex-col items-center text-center gap-4">
                                <div className="p-6 bg-blue-50 text-blue-600 rounded-[2.5rem]"><Megaphone className="w-12 h-12" /></div>
                                <div><h6 className="text-5xl font-black italic tracking-tighter">28</h6><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Broadcasts Sent</p></div>
                             </div>
                             <div className="bg-white/80 p-10 rounded-[4rem] border border-white shadow-xl flex flex-col items-center text-center gap-4">
                                <div className="p-6 bg-green-50 text-green-600 rounded-[2.5rem]"><TrendingUp className="w-12 h-12" /></div>
                                <div><h6 className="text-5xl font-black italic uppercase text-slate-400 tracking-widest mt-1">SLA Efficiency</p></div>
                             </div>
                          </>
                        ) : (
                          <>
                             <div className="bg-white/80 p-10 rounded-[4rem] border border-white shadow-xl flex flex-col items-center text-center gap-4">
                                <div className="p-6 bg-blue-50 text-blue-600 rounded-[2.5rem]"><CreditCard className="w-12 h-12" /></div>
                                <div><h6 className="text-5xl font-black italic tracking-tighter">12</h6><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Total Bills Paid</p></div>
                             </div>
                             <div className="bg-white/80 p-10 rounded-[4rem] border border-white shadow-xl flex flex-col items-center text-center gap-4">
                                <div className="p-6 bg-indigo-50 text-indigo-600 rounded-[2.5rem]"><Trophy className="w-12 h-12" /></div>
                                <div><h6 className="text-5xl font-black italic text-slate-900 tracking-tighter">₹245</h6><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Loyalty Cashback</p></div>
                             </div>
                             <div className="bg-white/80 p-10 rounded-[4rem] border border-white shadow-xl flex flex-col items-center text-center gap-4">
                                <div className="p-6 bg-orange-50 text-orange-600 rounded-[2.5rem]"><History className="w-12 h-12" /></div>
                                <div><h6 className="text-5xl font-black italic tracking-tighter">4</h6><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Tickets Raised</p></div>
                             </div>
                          </>
                        )}
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