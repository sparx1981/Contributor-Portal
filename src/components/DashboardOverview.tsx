import React from 'react';
import { 
  TrendingUp, 
  Download, 
  DollarSign, 
  MousePointer2, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  AlertCircle,
  Package,
  Users,
  Trash2
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Activity } from '../App';

const data = [
  { name: 'Mon', views: 4000, downloads: 2400, sales: 2400 },
  { name: 'Tue', views: 3000, downloads: 1398, sales: 2210 },
  { name: 'Wed', views: 2000, downloads: 9800, sales: 2290 },
  { name: 'Thu', views: 2780, downloads: 3908, sales: 2000 },
  { name: 'Fri', views: 1890, downloads: 4800, sales: 2181 },
  { name: 'Sat', views: 2390, downloads: 3800, sales: 2500 },
  { name: 'Sun', views: 3490, downloads: 4300, sales: 2100 },
];

const accountStats: Record<string, any> = {
  personal: {
    views: '1,242',
    downloads: '142',
    revenue: '$0.00',
    clicks: '84',
    viewGrowth: '2.1',
    downloadGrowth: '0.4',
    revenueGrowth: '0',
    clickGrowth: '1.2',
  },
  org1: { // BuildSoft GmbH
    views: '45,821',
    downloads: '12,402',
    revenue: '$18,290.00',
    clicks: '3,481',
    viewGrowth: '15.4',
    downloadGrowth: '11.2',
    revenueGrowth: '8.1',
    clickGrowth: '21.4',
  },
  org2: { // SketchUp Experts
    views: '8,391',
    downloads: '2,105',
    revenue: '$4,102.50',
    clicks: '1,240',
    viewGrowth: '5.2',
    downloadGrowth: '2.4',
    revenueGrowth: '1.5',
    clickGrowth: '8.7',
  }
};

const StatCard = ({ title, value, change, changeType, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className={`flex items-center gap-1 text-xs font-bold ${changeType === 'up' ? 'text-green-600' : 'text-red-600'}`}>
        {changeType === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {change}%
      </div>
    </div>
    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
    <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
  </div>
);

const ActivityIcon = ({ name, className }: { name: string, className?: string }) => {
  switch (name) {
    case 'Package': return <Package className={className} />;
    case 'Clock': return <Clock className={className} />;
    case 'DollarSign': return <DollarSign className={className} />;
    case 'Users': return <Users className={className} />;
    case 'Trash2': return <Trash2 className={className} />;
    default: return <Clock className={className} />;
  }
};

export default function DashboardOverview({ activeAccount, activities }: { activeAccount: { id: string, name: string, type: string }, activities: Activity[] }) {
  const [filterType, setFilterType] = React.useState<'All' | 'Extensions' | '3D Content'>('All');
  const baseStats = accountStats[activeAccount.id] || accountStats.personal;

  // Derive filtered stats based on filterType
  const getFilteredValue = (val: string, factor: number) => {
    if (val.startsWith('$')) {
      const num = parseFloat(val.replace(/[$,]/g, ''));
      return `$${(num * factor).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    const num = parseInt(val.replace(/,/g, ''));
    return Math.floor(num * factor).toLocaleString();
  };

  const factor = filterType === 'All' ? 1 : filterType === 'Extensions' ? 0.65 : 0.35;

  const stats = {
    ...baseStats,
    views: getFilteredValue(baseStats.views, factor),
    downloads: getFilteredValue(baseStats.downloads, factor),
    revenue: getFilteredValue(baseStats.revenue, factor),
    clicks: getFilteredValue(baseStats.clicks, factor),
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Filter Toggle */}
      <div className="flex bg-white p-1 rounded-xl border border-slate-200 w-fit shadow-sm">
        {['All', 'Extensions', '3D Content'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type as any)}
            className={`px-6 py-2 text-xs font-bold rounded-lg transition-all ${
              filterType === type 
                ? 'bg-trimble-blue text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Page Views" 
          value={stats.views} 
          change={stats.viewGrowth} 
          changeType="up" 
          icon={TrendingUp} 
          color="bg-blue-100 text-blue-600"
        />
        <StatCard 
          title="Total Downloads" 
          value={stats.downloads} 
          change={stats.downloadGrowth} 
          changeType="up" 
          icon={Download} 
          color="bg-purple-100 text-purple-600"
        />
        <StatCard 
          title="Net Revenue" 
          value={stats.revenue} 
          change={stats.revenueGrowth} 
          changeType={stats.revenueGrowth === '0' ? 'up' : 'up'} 
          icon={DollarSign} 
          color="bg-green-100 text-green-600"
        />
        <StatCard 
          title="Referral Clicks" 
          value={stats.clicks} 
          change={stats.clickGrowth} 
          changeType="up" 
          icon={MousePointer2} 
          color="bg-orange-100 text-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
               Traffic Overview
               <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-400 uppercase tracking-widest ml-2">Last 7 Days</span>
            </h3>
            <select className="text-xs font-bold text-slate-400 bg-transparent outline-none">
              <option>Download Metrics</option>
              <option>Page Views</option>
              <option>Sales Volume</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.map(d => ({ ...d, views: Math.floor(d.views * factor) }))}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0063A3" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0063A3" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 'bold' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 'bold' }} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="views" stroke="#0063A3" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full max-h-[440px]">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center justify-between shrink-0">
            Recent Activity
            <button className="text-[10px] font-black text-trimble-blue uppercase tracking-widest hover:underline px-2 py-1 bg-blue-50 rounded-md transition-colors">View All</button>
          </h3>
          <div className="space-y-1 overflow-y-auto pr-2 custom-scrollbar flex-1">
            {activities.length > 0 ? (
              activities.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 transition-all group animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 ${item.color}`}>
                    <ActivityIcon name={item.icon} className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-800 leading-tight mb-1 truncate group-hover:text-slate-900 transition-colors">{item.text}</p>
                    <div className="flex items-center gap-2">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.time}</p>
                       <span className="w-1 h-1 rounded-full bg-slate-200" />
                       <span className="text-[10px] font-medium text-slate-400 italic">via Web Console</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center h-full">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                  <AlertCircle className="w-6 h-6 text-slate-200" />
                </div>
                <p className="text-sm font-bold text-slate-400">No activity in this account</p>
                <p className="text-[10px] text-slate-300 font-medium px-8 mt-2 leading-relaxed">Start publishing content or inviting team members to see activity history.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Exports & Reports */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Exports & Reports</h3>
            <p className="text-xs text-slate-400 font-medium tracking-tight">Structured data for audits and accounting.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Licences.csv', size: '1.2 MB', desc: 'Full history of perpetual and term licenses sold.' },
            { name: 'Trials.csv', size: '840 KB', desc: 'Daily active trial starts and conversions.' },
            { name: 'Tax Summation.csv', size: '320 KB', desc: 'Regional tax breakdowns for current fiscal year.' }
          ].map((file) => (
            <div key={file.name} className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer flex justify-between items-center">
              <div>
                <p className="text-sm font-bold text-slate-800">{file.name}</p>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">{file.size} • CSV</p>
                <p className="text-[10px] text-slate-500 mt-1">{file.desc}</p>
              </div>
              <button className="p-2 text-slate-300 group-hover:text-trimble-blue transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
