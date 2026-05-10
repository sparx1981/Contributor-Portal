import React, { useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { auth } from '../lib/firebase';
import { 
  LayoutDashboard, 
  Package, 
  Box,
  Upload, 
  Users, 
  BookOpen, 
  Settings, 
  Bell, 
  ChevronDown,
  LogOut,
  User as UserIcon,
  Building2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Check,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import TrimbleLogo from './TrimbleLogo';
import OrganizationRequestModal from './OrganizationRequestModal';
import UpgradeInterestModal from './UpgradeInterestModal';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  collapsed?: boolean;
}

const SidebarItem = ({ icon, label, active, onClick, collapsed }: SidebarItemProps) => (
  <button 
    onClick={onClick}
    title={collapsed ? label : undefined}
    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors relative group ${
      active 
        ? 'bg-trimble-blue text-white' 
        : 'text-slate-600 hover:bg-slate-100'
    }`}
  >
    <div className="shrink-0">{icon}</div>
    {!collapsed && <span className="truncate">{label}</span>}
    {collapsed && active && (
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-white" />
    )}
  </button>
);

export default function Layout({ 
  children, 
  activeTab, 
  setActiveTab,
  activeAccount,
  setActiveAccount,
  isUploadingExtension
}: { 
  children: React.ReactNode, 
  activeTab: string, 
  setActiveTab: (tab: string) => void,
  activeAccount: { id: string, name: string, type: string },
  setActiveAccount: (acc: any) => void,
  isUploadingExtension: boolean
}) {
  const { user } = useAuth();
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [accToSwitch, setAccToSwitch] = useState<any>(null);
  const [showOrgRequestModal, setShowOrgRequestModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [monetizeExpanded, setMonetizeExpanded] = useState(true);
  const [orgsExpanded, setOrgsExpanded] = useState(true);
  const [upgradeExpanded, setUpgradeExpanded] = useState(true);

  const accounts = [
    { id: 'personal', name: 'Individual Account', type: 'Personal', icon: <UserIcon className="w-4 h-4" /> },
    { id: 'org1', name: 'BuildSoft GmbH', type: 'Organisation', icon: <Building2 className="w-4 h-4" /> },
    { id: 'org2', name: 'SketchUp Experts', type: 'Organisation', icon: <Building2 className="w-4 h-4" /> },
  ];

  const handleAccountSwitch = (acc: any) => {
    if (isUploadingExtension && acc.id !== activeAccount.id) {
      setAccToSwitch(acc);
    } else {
      setActiveAccount(acc);
      setShowAccountSwitcher(false);
    }
  };

  const handleLogout = () => auth.signOut();

  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [contentOpen, setContentOpen] = useState(false);

  const contentLinks = [
    { label: 'Models', id: '3d-content-models' },
    { label: 'Collections', id: '3d-content-collections' },
    { label: 'Catalogues', id: '3d-content-catalogues' },
    { label: 'Materials', id: '3d-content-materials' },
  ];

  const resourceGroups = [
    {
      name: 'Go To Market',
      links: [
        { label: '3D Warehouse', url: 'https://3dwarehouse.sketchup.com/' },
        { label: 'Extension Warehouse', url: 'https://extensions.sketchup.com/' },
        { label: 'Trimble Marketplace', url: 'https://marketplace.trimble.com/en-US/home' },
      ].sort((a, b) => a.label.localeCompare(b.label))
    },
    {
      name: 'Developer',
      links: [
        { label: 'Connect', url: 'https://www.trimble.com/en/products/trimble-connect/integrations' },
        { label: 'SketchUp Developer', url: 'https://developer.sketchup.com/' },
        { label: 'SketchUp For Web', url: 'https://developer.sketchup.com/' },
        { label: 'Tekla', url: 'https://developer.tekla.com/' },
        { label: 'Trimble Developers', url: 'https://www.trimble.com/en/developer/docs' },
      ].sort((a, b) => a.label.localeCompare(b.label))
    }
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <motion.aside 
        animate={{ width: isCollapsed ? 64 : 256 }}
        className="bg-white border-r border-slate-200 flex flex-col z-20 relative transition-all duration-300 ease-in-out"
      >
        <div className={`p-4 border-b border-slate-200 h-16 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
           {!isCollapsed ? (
             <div className="flex items-center gap-2">
               <TrimbleLogo className="h-6" />
               <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Contributor</span>
             </div>
           ) : (
             <div className="h-8 w-8 bg-trimble-blue rounded-lg flex items-center justify-center text-white font-bold">T</div>
           )}
        </div>
        
        <nav className="flex-1 py-4 overflow-y-auto search-nav">
          <SidebarItem 
            icon={<LayoutDashboard className="w-5 h-5" />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
            collapsed={isCollapsed}
          />
          <SidebarItem 
            icon={<Package className="w-5 h-5" />} 
            label="My Extensions" 
            active={activeTab === 'listings'}
            onClick={() => setActiveTab('listings')}
            collapsed={isCollapsed}
          />
          <div className="relative">
            <SidebarItem 
              icon={<Box className="w-5 h-5" />} 
              label="My 3D Content" 
              active={activeTab.startsWith('3d-content')}
              onClick={() => {
                if (activeTab === '3d-content' || activeTab.startsWith('3d-content-')) {
                   setContentOpen(!contentOpen);
                } else {
                   setActiveTab('3d-content-models');
                   setContentOpen(true);
                }
              }}
              collapsed={isCollapsed}
            />
            {contentOpen && !isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white"
              >
                {contentLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => {
                      setActiveTab(link.id);
                    }}
                    className={`w-full text-left pl-12 pr-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeTab === link.id ? 'text-[#005F9E]' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
              </motion.div>
            )}
            {contentOpen && isCollapsed && (
              <div className="absolute left-full top-0 ml-1 w-48 bg-white shadow-xl border border-slate-200 rounded-xl py-2 z-[100]">
                {contentLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => {
                      setActiveTab(link.id);
                      setContentOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-trimble-blue transition-all"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {activeAccount.type === 'Organisation' && (
            <SidebarItem 
              icon={<Users className="w-5 h-5" />} 
              label="Team Management" 
              active={activeTab === 'team'}
              onClick={() => setActiveTab('team')}
              collapsed={isCollapsed}
            />
          )}

          <div className="my-4 border-t border-slate-100 mx-4" />
          
          <div className="relative">
            <SidebarItem 
              icon={<BookOpen className="w-5 h-5" />} 
              label="Resources" 
              active={activeTab === 'resources' || resourcesOpen}
              onClick={() => setResourcesOpen(!resourcesOpen)}
              collapsed={isCollapsed}
            />
            {resourcesOpen && !isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-slate-50 border-y border-slate-100"
              >
                {resourceGroups.map((group) => (
                  <div key={group.name} className="py-2">
                    <div className="px-12 py-1 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{group.name}</div>
                    {group.links.map((link) => (
                      <button
                        key={link.label}
                        onClick={() => window.open(link.url, '_blank')}
                        className="w-full text-left pl-12 pr-4 py-1.5 text-[11px] font-bold text-slate-500 hover:text-trimble-blue hover:bg-white transition-all uppercase tracking-widest"
                      >
                        {link.label}
                      </button>
                    ))}
                  </div>
                ))}
              </motion.div>
            )}
            {resourcesOpen && isCollapsed && (
              <div className="absolute left-full top-0 ml-1 w-56 bg-white shadow-xl border border-slate-200 rounded-xl py-2 z-[100] max-h-[80vh] overflow-y-auto">
                {resourceGroups.map((group) => (
                  <div key={group.name} className="border-b last:border-0 border-slate-100 pb-2 mb-2 last:pb-0 last:mb-0">
                    <div className="px-4 py-1 text-[9px] font-black text-slate-300 uppercase tracking-widest">{group.name}</div>
                    {group.links.map((link) => (
                      <button
                        key={link.label}
                        onClick={() => {
                          window.open(link.url, '_blank');
                          setResourcesOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-trimble-blue transition-all"
                      >
                        {link.label}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="p-2 border-t border-slate-200">
           <SidebarItem 
            icon={<Settings className="w-5 h-5" />} 
            label="Account Settings" 
            active={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
            collapsed={isCollapsed}
          />
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center py-3 text-slate-400 hover:text-trimble-blue hover:bg-slate-50 rounded-xl transition-all mt-2 border border-transparent hover:border-slate-200 group"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
            ) : (
              <div className="flex items-center gap-2">
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs font-bold uppercase tracking-widest">Collapse Menu</span>
              </div>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-medium text-slate-800 capitalize leading-none pt-1">
              {activeTab.replace('-', ' ')}
            </h2>
            <div className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              {activeAccount.type}
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <button 
              onClick={() => setActiveTab('submit')}
              className="p-2 bg-trimble-blue text-white rounded-lg hover:bg-trimble-blue-dark transition-all shadow-sm flex items-center justify-center group"
              title="Submit Content"
            >
              <Upload className="w-5 h-5" />
            </button>

            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotifications(!showNotifications);
                }}
                className={`relative p-2 transition-colors rounded-lg ${showNotifications ? 'bg-slate-100 text-trimble-blue' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-40 overflow-hidden"
                    >
                      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Notifications</span>
                        <button className="text-[10px] font-bold text-trimble-blue hover:underline">Mark all as read</button>
                      </div>
                      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        <div className="p-6 space-y-6">
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                               <Check className="w-3.5 h-3.5 text-green-500" />
                               <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">Approvals</span>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 py-8">
                               <p className="text-[10px] font-bold text-slate-400">Approvals will show here</p>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-3">
                               <X className="w-3.5 h-3.5 text-red-500" />
                               <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">Denials</span>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 py-8">
                               <p className="text-[10px] font-bold text-slate-400">Denials will show here</p>
                            </div>
                          </div>

                          <div className="pb-4">
                            <div className="flex items-center gap-2 mb-3">
                               <Bell className="w-3.5 h-3.5 text-trimble-blue" />
                               <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">Events</span>
                            </div>
                            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm space-y-3">
                               <div>
                                 <h4 className="text-sm font-bold text-slate-800">June Developer Meetup</h4>
                                 <p className="text-[11px] text-slate-500 leading-relaxed">Join us this June when we discuss the latest API changes.</p>
                               </div>
                               <button className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-trimble-blue text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors border border-slate-200">
                                 More Info
                               </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                        <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">View All Notifications</button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <button 
                onClick={() => setShowAccountSwitcher(!showAccountSwitcher)}
                className="flex items-center gap-3 p-1 pl-1 sm:pl-3 rounded-full hover:bg-slate-50 transition-colors border border-slate-200"
              >
                <div className="text-right hidden md:block">
                  <p className="text-xs font-bold text-slate-800 truncate max-w-[120px]">{activeAccount.name}</p>
                  <p className="text-[10px] text-slate-400">{user?.email}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-trimble-blue flex items-center justify-center text-white text-xs font-bold">
                  {user?.displayName ? user.displayName[0] : 'U'}
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showAccountSwitcher ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showAccountSwitcher && (
                  <>
                    <div 
                      className="fixed inset-0 z-30" 
                      onClick={() => setShowAccountSwitcher(false)} 
                    />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 z-40 overflow-hidden"
                    >
                      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Switch Account Context</p>
                        <div className="space-y-1">
                          {accounts.map((acc) => (
                            <button
                              key={acc.id}
                              onClick={() => handleAccountSwitch(acc)}
                              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                                activeAccount.id === acc.id 
                                  ? 'bg-white shadow-sm border border-slate-200' 
                                  : 'hover:bg-white hover:shadow-sm'
                              }`}
                            >
                              <div className={`p-2 rounded-lg ${activeAccount.id === acc.id ? 'bg-trimble-blue text-white' : 'bg-slate-100 text-slate-500'}`}>
                                {acc.id === 'personal' ? <UserIcon className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                              </div>
                              <div className="text-left flex-1 min-w-0">
                                <p className={`text-sm font-bold truncate ${activeAccount.id === acc.id ? 'text-slate-900' : 'text-slate-600'}`}>{acc.name}</p>
                                <p className="text-[10px] text-slate-400 font-medium">{acc.type}</p>
                              </div>
                              {activeAccount.id === acc.id && (
                                <div className="w-2 h-2 rounded-full bg-trimble-blue" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="p-2 space-y-2 border-t border-slate-100 bg-slate-50/30">
                        <div className="p-3 bg-white rounded-lg border border-blue-100 shadow-sm transition-all duration-300">
                           <div className="flex items-center justify-between mb-1">
                             <p className="text-[10px] font-bold text-trimble-blue uppercase tracking-widest">Monetize Content</p>
                             <button 
                               onClick={() => setMonetizeExpanded(!monetizeExpanded)}
                               className="p-1 text-slate-400 hover:text-trimble-blue hover:bg-blue-50 rounded transition-colors"
                             >
                               {monetizeExpanded ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                             </button>
                           </div>
                           <AnimatePresence initial={false}>
                             {monetizeExpanded && (
                               <motion.div
                                 initial={{ height: 0, opacity: 0 }}
                                 animate={{ height: 'auto', opacity: 1 }}
                                 exit={{ height: 0, opacity: 0 }}
                                 className="overflow-hidden"
                               >
                                 <p className="text-xs text-slate-600 font-medium mb-3">Sell your extensions and models through our Global Marketplaces.</p>
                                 <button 
                                   onClick={() => {
                                     setActiveTab('vendor-onboarding');
                                     setShowAccountSwitcher(false);
                                   }}
                                   className="w-full py-2 bg-trimble-blue text-white rounded-lg text-xs font-bold hover:bg-trimble-blue-dark transition-colors shadow-sm"
                                 >
                                   Become a Vendor
                                 </button>
                               </motion.div>
                             )}
                           </AnimatePresence>
                        </div>

                        <div className="p-3 bg-white rounded-lg border border-slate-100 shadow-sm transition-all duration-300">
                           <div className="flex items-center justify-between mb-1">
                             <p className="text-[10px] font-bold text-trimble-blue uppercase tracking-widest">Organizations</p>
                             <button 
                               onClick={() => setOrgsExpanded(!orgsExpanded)}
                               className="p-1 text-slate-400 hover:text-trimble-blue hover:bg-slate-50 rounded transition-colors"
                             >
                               {orgsExpanded ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                             </button>
                           </div>
                           <AnimatePresence initial={false}>
                             {orgsExpanded && (
                               <motion.div
                                 initial={{ height: 0, opacity: 0 }}
                                 animate={{ height: 'auto', opacity: 1 }}
                                 exit={{ height: 0, opacity: 0 }}
                                 className="overflow-hidden"
                               >
                                 <p className="text-xs text-slate-600 font-medium mb-3">Managing your brand and your team couldn't be simpler.</p>
                                 <button 
                                   onClick={() => {
                                     setShowOrgRequestModal(true);
                                     setShowAccountSwitcher(false);
                                   }}
                                   className="w-full py-2 bg-trimble-blue text-white rounded-lg text-xs font-bold hover:bg-trimble-blue-dark transition-colors shadow-sm"
                                 >
                                   Request an Organization
                                 </button>
                               </motion.div>
                             )}
                           </AnimatePresence>
                        </div>

                        <div className="p-3 bg-white rounded-lg border border-amber-100 shadow-sm transition-all duration-300">
                           <div className="flex items-center justify-between mb-1">
                             <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Upgrade Your Account</p>
                             <button 
                               onClick={() => setUpgradeExpanded(!upgradeExpanded)}
                               className="p-1 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                             >
                               {upgradeExpanded ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                             </button>
                           </div>
                           <AnimatePresence initial={false}>
                             {upgradeExpanded && (
                               <motion.div
                                 initial={{ height: 0, opacity: 0 }}
                                 animate={{ height: 'auto', opacity: 1 }}
                                 exit={{ height: 0, opacity: 0 }}
                                 className="overflow-hidden"
                               >
                                 <p className="text-xs text-slate-600 font-medium mb-3">Become a premium contributor to the Trimble ecosystem and receive streamlined reviews, discounts and more.</p>
                                 <button 
                                   onClick={() => {
                                     setShowUpgradeModal(true);
                                     setShowAccountSwitcher(false);
                                   }}
                                   className="w-full py-2 bg-[#D4AF37] text-white rounded-lg text-xs font-bold hover:bg-[#C5A028] transition-colors shadow-sm shadow-[#D4AF37]/20 flex items-center justify-center gap-2 group"
                                 >
                                   Find Out More
                                 </button>
                               </motion.div>
                             )}
                           </AnimatePresence>
                        </div>
                      </div>

                      <div className="p-2">
                         <button 
                          onClick={handleLogout}
                          className="w-full flex items-center justify-center gap-2 p-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out of Trimble ID
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Viewport */}
        <main className={`flex-1 overflow-y-auto bg-slate-50 ${activeTab === 'submit' ? 'p-4' : 'p-8'}`}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>

        {/* Account Switch Confirmation Modal */}
        <AnimatePresence>
          {accToSwitch && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setAccToSwitch(null)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative z-10 overflow-hidden"
              >
                <div className="p-8">
                  <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                    <LogOut className="w-6 h-6 rotate-180" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Switch Account Context?</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    You are attempting to change account during an upload, this will cause the upload process to start again from the new account, do you wish to continue?
                  </p>
                </div>
                <div className="flex border-t border-slate-100">
                  <button 
                    onClick={() => setAccToSwitch(null)}
                    className="flex-1 px-6 py-4 text-sm font-bold text-slate-400 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      setActiveAccount(accToSwitch);
                      setShowAccountSwitcher(false);
                      setActiveTab('submit');
                      setAccToSwitch(null);
                    }}
                    className="flex-1 px-6 py-4 text-sm font-bold text-trimble-blue border-l border-slate-100 hover:bg-blue-50 transition-colors"
                  >
                    Yes, Continue
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <OrganizationRequestModal 
          isOpen={showOrgRequestModal} 
          onClose={() => setShowOrgRequestModal(false)} 
        />

        <UpgradeInterestModal 
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          accounts={accounts}
        />
      </div>
    </div>
  );
}
