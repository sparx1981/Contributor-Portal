import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  ExternalLink, 
  Eye, 
  Download,
  Plus,
  Activity,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Calendar,
  EyeOff,
  Star,
  Sparkles,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const initialListings = [
  { 
    id: '1', 
    extensionId: 'ext-1',
    accountId: 'org1',
    title: 'FloorPlan Pro', 
    status: 'published', 
    platform: 'SketchUp',
    product: 'SketchUp Desktop',
    type: 'extension', 
    version: '1.2.0', 
    pricing: 'Perpetual', 
    downloads: 1240, 
    std: 142,
    updatedAt: '2026-05-01',
    isPromoted: true,
    promotion: {
      type: 'Front Page',
      startDate: '2026-05-01',
      endDate: '2026-06-01'
    }
  },
  { 
    id: '1-update', 
    extensionId: 'ext-1',
    accountId: 'org1',
    title: 'FloorPlan Pro', 
    status: 'accepted', 
    platform: 'SketchUp',
    product: 'SketchUp Desktop',
    type: 'extension', 
    version: '1.3.0', 
    pricing: 'Perpetual', 
    downloads: 0, 
    std: 0,
    updatedAt: '2026-05-10',
    isPromoted: true
  },
  { 
    id: '1-old', 
    extensionId: 'ext-1',
    accountId: 'org1',
    title: 'FloorPlan Pro', 
    status: 'historic', 
    platform: 'SketchUp',
    product: 'SketchUp Desktop',
    type: 'extension', 
    version: '1.1.0', 
    pricing: 'Perpetual', 
    downloads: 850, 
    std: 90,
    updatedAt: '2026-04-01',
    isPromoted: true
  },
  { 
    id: '2', 
    extensionId: 'ext-2',
    accountId: 'personal',
    title: 'RenderBot', 
    status: 'denied', 
    platform: 'SketchUp',
    product: 'SketchUp For Web',
    type: 'extension', 
    version: '0.8.5', 
    pricing: 'Free Trial', 
    downloads: 0, 
    std: 0,
    updatedAt: '2026-05-08',
    isPromoted: false,
    denialReason: 'The extension package contains obfuscated code that violates our security policy. Please provide a clear-text version or ensure all third-party libraries are documented.'
  },
  { 
    id: '2-draft', 
    extensionId: 'ext-2',
    accountId: 'personal',
    title: 'RenderBot', 
    status: 'denied', 
    platform: 'SketchUp',
    product: 'SketchUp For Web',
    type: 'extension', 
    version: '0.9.0', 
    pricing: 'Free Trial', 
    downloads: 0, 
    std: 0,
    updatedAt: '2026-05-10',
    isPromoted: false,
    denialReason: 'Incomplete documentation. The user manual link provided returns a 404 error. Please update the documentation URL and resubmit.'
  },
  { 
    id: '3', 
    extensionId: 'ext-3',
    accountId: 'org2',
    title: 'Modern Coffee Table', 
    status: 'published', 
    platform: 'SketchUp',
    product: 'SketchUp Desktop',
    type: 'model', 
    version: '1.0.0', 
    pricing: 'Free', 
    fileSize: '4.2 MB',
    downloads: 842, 
    std: 0,
    updatedAt: '2026-04-15',
    isPromoted: false,
    author: { name: 'SketchUp Experts' }
  },
  {
    id: 'm1',
    extensionId: 'ext-m1',
    accountId: 'personal',
    title: 'Industrial Pendant Lamp',
    status: 'published',
    platform: 'SketchUp',
    product: 'SketchUp Desktop',
    type: 'model',
    version: '1.0.0',
    pricing: 'Free',
    fileSize: '164 KB',
    downloads: 2468,
    std: 0,
    updatedAt: '2026-05-01',
    isPromoted: false,
    author: { name: 'Render Plus Software' },
    previewUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    productTag: true
  },
  {
    id: 'm2',
    extensionId: 'ext-m2',
    accountId: 'personal',
    title: 'Black Desk Lamp',
    status: 'published',
    platform: 'SketchUp',
    product: 'SketchUp Desktop',
    type: 'model',
    version: '1.0.0',
    pricing: 'Free',
    fileSize: '190 KB',
    downloads: 1522,
    std: 0,
    updatedAt: '2026-05-02',
    isPromoted: false,
    author: { name: 'Render Plus Software' },
    previewUrl: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    productTag: true
  },
  {
    id: 'm3',
    extensionId: 'ext-m3',
    accountId: 'personal',
    title: 'Bronze Sconce Lamp',
    status: 'published',
    platform: 'SketchUp',
    product: 'SketchUp Desktop',
    type: 'model',
    version: '1.1.0',
    pricing: 'Free',
    fileSize: '360 KB',
    downloads: 3674,
    updatedAt: '2026-05-03',
    isPromoted: false,
    author: { name: 'Render Plus Software' },
    previewUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    productTag: true
  },
  {
    id: 'm4',
    extensionId: 'ext-m4',
    accountId: 'personal',
    title: 'Black Metal Pendant Lamp',
    status: 'published',
    type: 'model',
    pricing: 'Free',
    fileSize: '59 KB',
    downloads: 272,
    updatedAt: '2026-05-04',
    author: { name: 'Render Plus Software' },
    previewUrl: 'https://images.unsplash.com/photo-1553095066-5014bc7b7f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    productTag: true
  },
  {
    id: 'm5',
    extensionId: 'ext-m5',
    accountId: 'personal',
    title: 'Wooden Path Lamp',
    status: 'published',
    type: 'model',
    pricing: 'Free',
    fileSize: '416 KB',
    downloads: 33,
    updatedAt: '2026-05-05',
    author: { name: 'Render Plus Software' },
    previewUrl: 'https://images.unsplash.com/photo-1542728928-1413ee09973d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    productTag: true
  },
  {
    id: 'm6',
    extensionId: 'ext-m6',
    accountId: 'personal',
    title: 'White Desk Lamp',
    status: 'published',
    type: 'model',
    pricing: 'Free',
    fileSize: '174 KB',
    downloads: 576,
    updatedAt: '2026-05-06',
    author: { name: 'Render Plus Software' },
    previewUrl: 'https://images.unsplash.com/photo-1517991104123-1d56a72ad0bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    productTag: true
  },
  {
    id: 'm7',
    extensionId: 'ext-m7',
    accountId: 'personal',
    title: 'Silver Desk Lamp with a Blue Shade',
    status: 'published',
    type: 'model',
    pricing: 'Free',
    fileSize: '1.8 MB',
    downloads: 494,
    updatedAt: '2026-05-07',
    author: { name: 'Render Plus Software' },
    previewUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    productTag: true
  },
  {
    id: 'm8',
    extensionId: 'ext-m8',
    accountId: 'personal',
    title: 'Black and Silver Floor Lamp',
    status: 'published',
    type: 'model',
    pricing: 'Free',
    fileSize: '206 KB',
    downloads: 1460,
    updatedAt: '2026-05-08',
    author: { name: 'Render Plus Software' },
    previewUrl: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    productTag: true
  },
  { 
    id: '4', 
    extensionId: 'ext-4',
    accountId: 'org1',
    title: 'SuiteTools', 
    status: 'draft', 
    platform: 'Tekla',
    product: 'Tekla Structures',
    type: 'extension', 
    version: '1.0.0', 
    pricing: 'Fixed Term', 
    downloads: 0, 
    std: 0,
    updatedAt: '2026-05-09',
    isPromoted: false
  },
  { 
    id: '5', 
    extensionId: 'ext-5',
    accountId: 'org2',
    title: 'ConnectSync', 
    status: 'published', 
    platform: 'Connect',
    product: 'Connect',
    type: 'extension', 
    version: '2.0.4', 
    pricing: 'Perpetual', 
    downloads: 3105, 
    std: 842,
    updatedAt: '2026-05-05',
    isPromoted: true,
    promotion: {
      type: 'Highlighted Keywords',
      startDate: '2026-05-03',
      endDate: '2026-05-17'
    }
  }
];

const platformProducts: Record<string, string[]> = {
  'SketchUp': ['SketchUp Desktop', 'SketchUp For Web'],
  'Tekla': ['Tekla Structures', 'Tekla Tedds', 'Tekla Structural Designer', 'Tekla Powerfab', 'Open BIM (IFC)', 'Standalone'],
  'Connect': ['Connect']
};

const StatusBadge = ({ status, isParent = false, hasPendingUpdate = false }: { status: string; isParent?: boolean; hasPendingUpdate?: boolean }) => {
  const styles: Record<string, any> = {
    published: { bg: 'bg-green-50', text: 'text-green-700', icon: <CheckCircle2 className="w-3 h-3" />, label: 'Published' },
    accepted: { bg: 'bg-blue-50', text: 'text-blue-700', icon: <CheckCircle2 className="w-3 h-3" />, label: 'Accepted' },
    draft: { bg: 'bg-slate-100', text: 'text-slate-600', icon: <FileText className="w-3 h-3" />, label: 'Draft' },
    historic: { bg: 'bg-slate-50', text: 'text-slate-400', icon: <Activity className="w-3 h-3" />, label: 'Historic' },
    in_review: { bg: 'bg-amber-50', text: 'text-amber-700', icon: <Clock className="w-3 h-3" />, label: 'In Review' },
    denied: { bg: 'bg-red-50', text: 'text-red-700', icon: <XCircle className="w-3 h-3" />, label: 'Denied' },
  };

  const style = styles[status] || styles.draft;

  return (
    <div className={`flex ${isParent ? 'flex-col items-start' : 'items-center'} gap-1.5`}>
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${style.bg} ${style.text}`}>
        {style.icon}
        {style.label}
      </div>
      {isParent && hasPendingUpdate && (
        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-orange-50 text-orange-600 border border-orange-100 shadow-sm">
          + Update Pending
        </div>
      )}
    </div>
  );
};

export default function ListingsView({ 
  listings, 
  setListings, 
  onEdit, 
  onCreateUpdate,
  onDelete,
  addActivity
}: { 
  listings: any[], 
  setListings: React.Dispatch<React.SetStateAction<any[]>>, 
  onEdit?: (listing: any) => void, 
  onCreateUpdate?: (listing: any) => void,
  onDelete?: (id: string) => void,
  addActivity?: (activity: any) => void
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    platform: 'All',
    product: 'All',
    status: 'All',
    pricing: 'All',
    pageSize: '20'
  });
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null }>({ key: '', direction: null });
  const [showScheduleModal, setShowScheduleModal] = useState<string | null>(null);
  const [showPublishConfirmModal, setShowPublishConfirmModal] = useState<any | null>(null);
  const [scheduleDate, setScheduleDate] = useState('');

  const [showPromoteModal, setShowPromoteModal] = useState<string | null>(null);
  const [showPromotionDetails, setShowPromotionDetails] = useState<any | null>(null);
  const [showDenialReasonModal, setShowDenialReasonModal] = useState<any | null>(null);
  const [previewingListing, setPreviewingListing] = useState<any | null>(null);
  const [promotionOptions, setPromotionOptions] = useState({
    type: 'front_page',
    duration: '7'
  });

  const handlePromote = (e: React.FormEvent) => {
    e.preventDefault();
    if (showPromoteModal) {
      const today = new Date().toISOString().split('T')[0];
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + parseInt(promotionOptions.duration));
      
      setListings(prev => prev.map(item => item.id === showPromoteModal ? { 
        ...item, 
        isPromoted: true,
        promotion: {
          type: promotionOptions.type === 'front_page' ? 'Front Page' : 'Highlighted in Search',
          startDate: today,
          endDate: endDate.toISOString().split('T')[0]
        }
      } : item));
      const promoted = listings.find(l => l.id === showPromoteModal);
      if (promoted && addActivity) {
        addActivity({
          type: 'sales',
          text: `Promotion purchased for ${promoted.title}`,
          icon: 'DollarSign',
          color: 'bg-green-100 text-green-600'
        });
      }
      setShowPromoteModal(null);
    }
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handlePublish = (listingId: string) => {
    const listingToPublish = listings.find(l => l.id === listingId);
    if (!listingToPublish) return;

    if (addActivity) {
      addActivity({
        type: 'publish',
        text: `Version ${listingToPublish.version} of ${listingToPublish.title} published`,
        icon: 'Package',
        color: 'bg-green-100 text-green-600'
      });
    }

    setListings(prev => prev.map(item => {
      // If it's the same extension, unpublish previous published version
      if (item.extensionId === listingToPublish.extensionId) {
        if (item.id === listingId) {
          return { ...item, status: 'published' };
        } else if (item.status === 'published') {
          return { ...item, status: 'historic' };
        }
      }
      return item;
    }));
    setShowPublishConfirmModal(null);
  };

  const handleUnpublish = (id: string) => {
    const listing = listings.find(l => l.id === id);
    if (listing && addActivity) {
      addActivity({
        type: 'draft',
        text: `${listing.title} unpublished and moved to draft`,
        icon: 'Clock',
        color: 'bg-amber-100 text-amber-600'
      });
    }
    setListings(prev => prev.map(item => item.id === id ? { ...item, status: 'draft' } : item));
  };

  const handleSchedulePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (showScheduleModal) {
      alert(`Extension ${showScheduleModal} scheduled for publish on ${scheduleDate}`);
      setShowScheduleModal(null);
      setScheduleDate('');
    }
  };

  const statusOrder: Record<string, number> = {
    'accepted': 0,
    'published': 1,
    'draft': 2,
    'historic': 3,
    'in_review': 4,
    'denied': 5
  };

  const sortedAndFilteredGroups = useMemo(() => {
    // 1. Filter flat listings first
    const filteredListings = listings.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPlatform = filters.platform === 'All' || item.platform === filters.platform;
      const matchesProduct = filters.product === 'All' || item.product === filters.product;
      const matchesStatus = filters.status === 'All' || item.status === filters.status;
      const matchesPricing = filters.pricing === 'All' || item.pricing === filters.pricing;
      return matchesSearch && matchesPlatform && matchesProduct && matchesStatus && matchesPricing;
    });

    // 2. Group by extensionId
    const groups: Record<string, any[]> = {};
    filteredListings.forEach(item => {
      if (!groups[item.extensionId]) {
        groups[item.extensionId] = [];
      }
      groups[item.extensionId].push(item);
    });

    // 3. Process each group
    const processedGroups = Object.entries(groups).map(([extId, versions]) => {
      // Sort versions within group
      const sortedVersions = [...versions].sort((a, b) => {
        const orderA = statusOrder[a.status] ?? 99;
        const orderB = statusOrder[b.status] ?? 99;
        if (orderA !== orderB) return orderA - orderB;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });

      const publishedVersion = sortedVersions.find(v => v.status === 'published');
      const hasPendingUpdate = sortedVersions.some(v => v.status === 'accepted');
      
      const primaryVersion = publishedVersion || sortedVersions[0];

      return {
        id: extId,
        primary: primaryVersion,
        versions: sortedVersions,
        hasPendingUpdate,
        status: publishedVersion ? 'published' : sortedVersions[0].status
      };
    });

    // 4. Sort groups
    if (sortConfig.key && sortConfig.direction) {
      processedGroups.sort((a: any, b: any) => {
        const valA = a.primary[sortConfig.key];
        const valB = b.primary[sortConfig.key];
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filters.pageSize === 'All' ? processedGroups : processedGroups.slice(0, parseInt(filters.pageSize));
  }, [listings, searchTerm, filters, sortConfig]);

  const platforms = ['All', 'SketchUp', 'Tekla', 'Connect'];
  const statuses = ['All', 'published', 'accepted', 'in_review', 'draft', 'denied', 'historic'];
  const pricingModels = ['All', 'Free', 'Free Trial', 'Perpetual', 'Fixed Term'];
  const pageSizes = ['10', '20', '50', '100', 'All'];

  return (
    <div className="space-y-6 relative">
      {/* Preview Modal */}
      <AnimatePresence>
        {previewingListing && (
          <PreviewModal 
            listing={previewingListing} 
            onClose={() => setPreviewingListing(null)} 
          />
        )}
      </AnimatePresence>

      {/* Publish Confirmation Modal */}
      <AnimatePresence>
        {showPublishConfirmModal && (
          <div className="fixed inset-0 flex items-center justify-center z-[110]">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPublishConfirmModal(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Confirm Publication</h3>
              </div>
              
              <div className="space-y-4 mb-8">
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                  You are about to publish <span className="text-slate-900 font-bold">Version {showPublishConfirmModal.version}</span>.
                </p>
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl text-xs text-amber-800 font-medium">
                  Note: Publishing this version will automatically unpublish the current version of <span className="font-bold">{showPublishConfirmModal.title}</span> and move it to historic.
                </div>
                <p className="text-sm text-slate-600 font-medium">Do you wish to continue?</p>
              </div>

              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setShowPublishConfirmModal(null)}
                  className="px-6 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handlePublish(showPublishConfirmModal.id)}
                  className="bg-trimble-blue text-white px-8 py-3 rounded-xl font-bold hover:bg-trimble-blue-dark transition-all shadow-lg shadow-trimble-blue/20"
                >
                  Confirm & Publish
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Promotion Details Modal */}
      <AnimatePresence>
        {showPromotionDetails && (
          <div className="fixed inset-0 flex items-center justify-center z-[100]">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPromotionDetails(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-50 text-trimble-blue rounded-2xl flex items-center justify-center mb-6">
                  <Star className="w-8 h-8 fill-current" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">Active Promotion</h3>
                <p className="text-sm font-bold text-trimble-blue mb-6">{showPromotionDetails.title}</p>
                
                <div className="w-full space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</span>
                    <span className="text-sm font-bold text-slate-700">{showPromotionDetails.promotion.type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Started</span>
                    <span className="text-sm font-bold text-slate-700">{showPromotionDetails.promotion.startDate}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Due to End</span>
                    <span className="text-sm font-bold text-trimble-blue">{showPromotionDetails.promotion.endDate}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setShowPromotionDetails(null)}
                  className="mt-8 w-full py-3 bg-slate-800 text-white rounded-xl font-bold text-sm hover:bg-slate-900 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Promote Listing Modal */}
      <AnimatePresence>
        {showPromoteModal && (
          <div className="fixed inset-0 flex items-center justify-center z-[100]">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPromoteModal(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8"
            >
              <div className="absolute top-8 right-8 text-[9px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200 uppercase tracking-tight">
                Premium Tier Only
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 text-trimble-blue rounded-lg">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Promote Extension</h3>
              </div>
              
              <p className="text-sm text-slate-500 mb-8 font-medium">Boost your visibility and drive more downloads by promoting your extension on the Trimble Marketplace.</p>

              <form onSubmit={handlePromote} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Promotion Placement</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      type="button"
                      onClick={() => setPromotionOptions(prev => ({ ...prev, type: 'front_page' }))}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${
                        promotionOptions.type === 'front_page' ? 'border-trimble-blue bg-blue-50/50' : 'border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <p className="text-sm font-bold text-slate-800">Front Page</p>
                      <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-widest">$99.00 / week</p>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setPromotionOptions(prev => ({ ...prev, type: 'search' }))}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${
                        promotionOptions.type === 'search' ? 'border-trimble-blue bg-blue-50/50' : 'border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <p className="text-sm font-bold text-slate-800">Search Results</p>
                      <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-widest">$49.00 / week</p>
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Duration</label>
                  <select 
                    value={promotionOptions.duration}
                    onChange={(e) => setPromotionOptions(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-trimble-blue text-sm font-bold"
                  >
                    <option value="7">1 Week</option>
                    <option value="14">2 Weeks</option>
                    <option value="30">1 Month</option>
                  </select>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Fee</p>
                    <p className="text-lg font-black text-slate-800">
                      ${promotionOptions.type === 'front_page' ? (parseInt(promotionOptions.duration)/7 * 99).toFixed(2) : (parseInt(promotionOptions.duration)/7 * 49).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-50">
                  <button 
                    type="button"
                    onClick={() => setShowPromoteModal(null)}
                    className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    Close
                  </button>
                  <button 
                    type="submit"
                    className="bg-trimble-blue text-white px-8 py-3 rounded-xl font-bold hover:bg-trimble-blue-dark transition-all shadow-lg shadow-trimble-blue/20 whitespace-nowrap"
                  >
                    Confirm & Pay
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Schedule Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowScheduleModal(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-3xl shadow-2xl z-[70] p-8"
            >
              <h3 className="text-xl font-bold text-slate-800 mb-2">Schedule Publish</h3>
              <p className="text-xs text-slate-500 mb-6 font-medium">Choose a future date to automatically publish this extension.</p>
              <form onSubmit={handleSchedulePublish} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Publish Date</label>
                  <input 
                    type="date" 
                    required
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-trimble-blue text-sm font-medium"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowScheduleModal(null)}
                    className="px-6 py-2.5 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="bg-trimble-blue text-white px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-trimble-blue-dark transition-all"
                  >
                    Set Schedule
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Denial Reason Modal */}
      <AnimatePresence>
        {showDenialReasonModal && (
          <div className="fixed inset-0 flex items-center justify-center z-[110]">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDenialReasonModal(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                  <XCircle className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Review Result</h3>
              </div>
              
              <div className="space-y-4 mb-8">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-700">
                    <XCircle className="w-3 h-3" />
                    Denied
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Version</p>
                  <p className="text-sm font-bold text-slate-700">{showDenialReasonModal.version}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Denial Reason</p>
                  <div className="bg-red-50/50 border border-red-100 p-4 rounded-2xl text-sm text-red-900 font-medium leading-relaxed">
                    {showDenialReasonModal.denialReason || "No specific reason was provided. Please contact Trimble support for more information."}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowDenialReasonModal(null)}
                className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold text-sm hover:bg-slate-900 transition-all shadow-lg shadow-slate-800/20"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative flex-1 w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search extensions by name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-trimble-blue/20 focus:border-trimble-blue transition-all text-sm font-medium"
            />
          </div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2">
            <Filter className="w-3 h-3" />
            Active Filters: {Object.values(filters).filter(v => v !== 'All').length}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Platform</label>
            <select 
              value={filters.platform}
              onChange={(e) => setFilters(prev => ({ ...prev, platform: e.target.value, product: 'All' }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-trimble-blue text-xs font-bold text-slate-600 appearance-none bg-no-repeat bg-[right_12px_center] cursor-pointer"
            >
              {platforms.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Product</label>
            <select 
              value={filters.product}
              onChange={(e) => setFilters(prev => ({ ...prev, product: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-trimble-blue text-xs font-bold text-slate-600 appearance-none bg-no-repeat bg-[right_12px_center] cursor-pointer"
            >
              <option value="All">All Products</option>
              {filters.platform === 'All' 
                ? Object.values(platformProducts).flat().map(p => <option key={p} value={p}>{p}</option>)
                : platformProducts[filters.platform]?.map(p => <option key={p} value={p}>{p}</option>)
              }
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Status</label>
            <select 
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-trimble-blue text-xs font-bold text-slate-600 appearance-none bg-no-repeat bg-[right_12px_center] cursor-pointer"
            >
              {statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s.replace('_', ' ').toUpperCase()}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Pricing Model</label>
            <select 
              value={filters.pricing}
              onChange={(e) => setFilters(prev => ({ ...prev, pricing: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-trimble-blue text-xs font-bold text-slate-600 appearance-none bg-no-repeat bg-[right_12px_center] cursor-pointer"
            >
              {pricingModels.map(pm => <option key={pm} value={pm}>{pm}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Page Size</label>
            <select 
              value={filters.pageSize}
              onChange={(e) => setFilters(prev => ({ ...prev, pageSize: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-trimble-blue text-xs font-bold text-slate-600 appearance-none bg-no-repeat bg-[right_12px_center] cursor-pointer"
            >
              {pageSizes.map(ps => <option key={ps} value={ps}>{ps}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px] table-fixed">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 transition-colors">
                <th 
                  onDoubleClick={() => handleSort('title')}
                  className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer select-none hover:text-slate-600 group w-[25%] sm:w-[20%] lg:w-[15%]"
                >
                  <div className="flex items-center gap-2">
                    Extension Name
                    <span className={`transition-opacity ${sortConfig.key === 'title' ? 'opacity-100' : 'opacity-0 group-hover:opacity-30'}`}>
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  </div>
                </th>
                <th 
                  onDoubleClick={() => handleSort('platform')}
                  className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer select-none hover:text-slate-600 group w-[12%] hidden sm:table-cell"
                >
                  <div className="flex items-center gap-2">
                    Platform
                    <span className={`transition-opacity ${sortConfig.key === 'platform' ? 'opacity-100' : 'opacity-0 group-hover:opacity-30'}`}>
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  </div>
                </th>
                <th 
                  onDoubleClick={() => handleSort('product')}
                  className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer select-none hover:text-slate-600 group w-[12%] hidden lg:table-cell"
                >
                  <div className="flex items-center gap-2">
                    Product
                    <span className={`transition-opacity ${sortConfig.key === 'product' ? 'opacity-100' : 'opacity-0 group-hover:opacity-30'}`}>
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  </div>
                </th>
                <th 
                  onDoubleClick={() => handleSort('status')}
                  className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer select-none hover:text-slate-600 group w-[15%]"
                >
                  <div className="flex items-center gap-2">
                    Status
                    <span className={`transition-opacity ${sortConfig.key === 'status' ? 'opacity-100' : 'opacity-0 group-hover:opacity-30'}`}>
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  </div>
                </th>
                <th 
                  onDoubleClick={() => handleSort('pricing')}
                  className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer select-none hover:text-slate-600 group w-[12%] hidden sm:table-cell"
                >
                  <div className="flex items-center gap-2">
                    Pricing
                    <span className={`transition-opacity ${sortConfig.key === 'pricing' ? 'opacity-100' : 'opacity-0 group-hover:opacity-30'}`}>
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  </div>
                </th>
                <th 
                  onDoubleClick={() => handleSort('downloads')}
                  className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer select-none hover:text-slate-600 group w-[18%]"
                >
                  <div className="flex items-center gap-2">
                    Performance
                    <span className={`transition-opacity ${sortConfig.key === 'downloads' ? 'opacity-100' : 'opacity-0 group-hover:opacity-30'}`}>
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  </div>
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedAndFilteredGroups.length > 0 ? sortedAndFilteredGroups.map((group) => (
                <ListingGroupRow 
                  key={group.id} 
                  group={group} 
                  onEdit={onEdit}
                  onCreateUpdate={onCreateUpdate}
                  onPublishRequest={(version: any) => setShowPublishConfirmModal(version)}
                  onUnpublish={handleUnpublish}
                  onSchedule={(id: string) => setShowScheduleModal(id)}
                  onPromote={() => setShowPromoteModal(group.primary.id)}
                  onShowPromotionDetails={() => setShowPromotionDetails(group.primary)}
                  onShowDenialReason={(version: any) => setShowDenialReasonModal(version)}
                  onDelete={onDelete}
                  onPreview={(version: any) => setPreviewingListing(version)}
                />
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-medium">
                    No extensions found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
           <p className="text-xs text-slate-400 font-medium">
             Showing <span className="font-bold text-slate-600">{sortedAndFilteredGroups.length}</span> extensions
           </p>
           <div className="flex gap-2">
             <button className="p-2 border border-slate-200 rounded bg-white text-slate-400 cursor-not-allowed">
               <ChevronLeft className="w-4 h-4" />
             </button>
             <button className="p-2 border border-slate-200 rounded bg-white text-slate-400 cursor-not-allowed">
               <ChevronRight className="w-4 h-4" />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}

function ListingGroupRow({ group, onEdit, onCreateUpdate, onPublishRequest, onUnpublish, onSchedule, onPromote, onShowPromotionDetails, onShowDenialReason, onDelete, onPreview }: any) {
  const [isExpanded, setIsExpanded] = useState(false);
  const primary = group.primary;

  return (
    <>
      <tr className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className={`p-1 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
              <ChevronDown className="w-4 h-4" />
            </div>
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-200 transition-colors">
                <PackageIcon className="w-5 h-5" />
              </div>
              {primary.isPromoted && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onShowPromotionDetails(primary); }}
                  className="absolute -top-1 -left-1 w-5 h-5 bg-trimble-blue text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm hover:scale-110 transition-transform z-10"
                >
                  <Star className="w-2.5 h-2.5 fill-current" />
                </button>
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">{primary.title}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{group.versions.length} {group.versions.length === 1 ? 'VERSION' : 'VERSIONS'}</p>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-50 text-[10px] font-bold text-trimble-blue uppercase tracking-wider">
            {primary.platform}
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
            {primary.product}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <StatusBadge status={group.status} isParent hasPendingUpdate={group.hasPendingUpdate} />
        </td>
        <td className="px-6 py-4">
           <p className="text-sm text-slate-600 font-medium">{primary.pricing}</p>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-start gap-8">
            <div className="flex flex-col">
               <div className="flex items-center gap-1 text-slate-800 font-bold text-sm">
                 <Download className="w-3 h-3 text-slate-400" />
                 {group.versions.reduce((acc: number, v: any) => acc + v.downloads, 0).toLocaleString()}
               </div>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Downloads</p>
            </div>
            {group.versions.reduce((acc: number, v: any) => acc + v.std, 0) > 0 && (
              <div className="flex flex-col">
                 <div className="flex items-center gap-1 text-slate-800 font-bold text-sm">
                   <TrendingUp className="w-3 h-3 text-green-500" />
                   {group.versions.reduce((acc: number, v: any) => acc + v.std, 0).toLocaleString()}
                 </div>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Units</p>
              </div>
            )}
          </div>
        </td>
        <td className="px-6 py-4 text-right">
           <div className="flex items-center justify-end pr-4">
              <div className="relative group/parent-menu">
                <button 
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-[100] invisible group-hover/parent-menu:visible opacity-0 group-hover/parent-menu:opacity-100 transition-all">
                   <button 
                    onClick={(e) => { e.stopPropagation(); onCreateUpdate?.(primary); }}
                    className="w-full px-4 py-2 text-left text-[11px] font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Plus className="w-3.5 h-3.5 text-trimble-blue" />
                    Create Update
                  </button>
                   <button 
                    onClick={(e) => { e.stopPropagation(); window.open('https://extensions.sketchup.com/', '_blank'); }}
                    className="w-full px-4 py-2 text-left text-[11px] font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    View Public Listing
                  </button>
                  {primary.status === 'published' && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); onPromote(); }}
                      className="w-full px-4 py-2 text-left text-[11px] font-bold text-slate-600 hover:bg-amber-100 bg-amber-50/50 flex items-center gap-2 transition-colors"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      Promote
                    </button>
                  )}
                </div>
              </div>
           </div>
        </td>
      </tr>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.tr 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-50/30"
          >
            <td colSpan={7} className="p-0">
               <div className="">
                  <table className="w-full table-fixed">
                     <tbody className="divide-y divide-slate-100">
                        {group.versions.map((version: any) => (
                           <tr key={version.id} className="hover:bg-slate-100/50 transition-colors group/row">
                              <td className="pl-24 pr-6 py-3 w-[25%] sm:w-[20%] lg:w-[15%] relative">
                                 <div className="absolute left-16 top-0 bottom-0 w-px bg-slate-200"></div>
                                 <div className="absolute left-16 top-1/2 w-4 h-px bg-slate-200"></div>
                                 <div className="flex flex-col gap-1">
                                    <div>
                                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Version</p>
                                       <p className="text-xs font-black text-slate-700">{version.version}</p>
                                    </div>
                                    <div>
                                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Modified</p>
                                       <p className="text-[9px] font-bold text-slate-500">{version.updatedAt}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-3 w-[12%] hidden sm:table-cell"></td>
                              <td className="px-6 py-3 w-[12%] hidden lg:table-cell"></td>
                              <td className="px-6 py-3 whitespace-nowrap w-[15%]">
                                 <StatusBadge status={version.status} />
                              </td>
                              <td className="px-6 py-3 w-[12%] hidden sm:table-cell"></td>
                              <td className="px-6 py-3 whitespace-nowrap w-[18%]">
                                 <div className="flex items-start gap-8">
                                    <div className="flex flex-col">
                                       <div className="flex items-center gap-1 text-slate-600 font-bold text-xs">
                                          <Download className="w-2.5 h-2.5 text-slate-300" />
                                          {version.downloads.toLocaleString()}
                                       </div>
                                       <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Downloads</p>
                                    </div>
                                    {version.std > 0 ? (
                                       <div className="flex flex-col">
                                          <div className="flex items-center gap-1 text-slate-600 font-bold text-xs">
                                             <TrendingUp className="w-2.5 h-2.5 text-green-400" />
                                             {version.std}
                                          </div>
                                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Units</p>
                                       </div>
                                    ) : (
                                       <div className="flex flex-col opacity-0">
                                          <div className="flex items-center gap-1 text-slate-600 font-bold text-xs">
                                             <TrendingUp className="w-2.5 h-2.5 text-green-400" />
                                             0
                                          </div>
                                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Units</p>
                                       </div>
                                    )}
                                 </div>
                              </td>
                              <td className="px-6 py-3 text-right">
                                 <div className="flex items-center justify-end gap-2 pr-4 relative">
                                    <div className="relative group/menu">
                                       <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-white border border-transparent hover:border-slate-100">
                                          <MoreVertical className="w-4 h-4" />
                                       </button>
                                       <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-[100] invisible group-hover/menu:visible opacity-0 group-hover/menu:opacity-100 transition-all">
                                          {version.status !== 'denied' && (
                                             <>
                                            <button 
                                              onClick={() => onEdit?.(version)}
                                              className="w-full px-4 py-2 text-left text-[11px] font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                                            >
                                              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                                              Edit Version
                                            </button>
                                            <button 
                                              onClick={() => onPreview?.(version)}
                                              className="w-full px-4 py-2 text-left text-[11px] font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                                            >
                                              <Eye className="w-3.5 h-3.5 text-slate-400" />
                                              Preview Listing
                                            </button>
                                          </>
                                        )}
                                          
                                          {version.status === 'denied' && (
                                            <button 
                                              onClick={() => onShowDenialReason(version)}
                                              className="w-full px-4 py-2 text-left text-[11px] font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
                                            >
                                              <XCircle className="w-3.5 h-3.5" />
                                              See Reason for Denial
                                            </button>
                                          )}
                                          
                                          {version.status !== 'published' && version.status !== 'draft' && version.status !== 'denied' && (
                                            <>
                                              <button 
                                                onClick={() => onPublishRequest(version)}
                                                className="w-full px-4 py-2 text-left text-[11px] font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                                              >
                                                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                                Publish This Version
                                              </button>
                                              <button 
                                                onClick={() => onSchedule(version.id)}
                                                className="w-full px-4 py-2 text-left text-[11px] font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                                              >
                                                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                                                Schedule Publish
                                              </button>
                                            </>
                                          )}

                                          {version.status === 'published' && (
                                            <button 
                                              onClick={() => onUnpublish(version.id)}
                                              className="w-full px-4 py-2 text-left text-[11px] font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
                                            >
                                              <EyeOff className="w-3.5 h-3.5" />
                                              Unpublish
                                            </button>
                                          )}

                                          <button 
                                             onClick={() => { if(confirm(`Are you sure you want to delete version ${version.version}? This action cannot be undone.`)) onDelete?.(version.id); }}
                                             className="w-full px-4 py-2 text-left text-[11px] font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-slate-50 mt-1"
                                          >
                                             <Trash2 className="w-3.5 h-3.5" />
                                             Delete Version
                                          </button>
                                       </div>
                                    </div>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  );
}

function PreviewModal({ listing, onClose }: { listing: any; onClose: () => void }) {
  const isSketchUp = listing.platform === 'SketchUp';

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        className="relative bg-[#f0f2f5] w-full max-w-6xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 ${isSketchUp ? 'bg-trimble-blue' : 'bg-red-600'} text-white rounded flex items-center justify-center`}>
              <PackageIcon className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-slate-800">
              {isSketchUp ? 'Extension Warehouse Preview' : 'Tekla Warehouse Preview'}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-white">
          <div className="p-6 md:p-12">
            <div className="max-w-5xl mx-auto space-y-8">
               {isSketchUp ? (
                 <>
                   <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest italic">
                      <span>EXTENSION WAREHOUSE</span>
                      <ChevronRight className="w-3 h-3" />
                      <span>{listing.platform.toUpperCase()}</span>
                      <ChevronRight className="w-3 h-3" />
                      <span className="text-slate-800">{listing.title.toUpperCase()}</span>
                   </div>

                   <div className="flex flex-col md:flex-row gap-12 pt-4">
                      <div className="flex-1 space-y-6">
                         <div className="w-full aspect-[16/9] bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center overflow-hidden shadow-sm relative">
                            {listing.previewUrl ? (
                              <img src={listing.previewUrl} alt="Main" className="w-full h-full object-cover" />
                            ) : (
                              <div className="flex flex-col items-center gap-4 text-slate-200">
                                <PackageIcon className="w-32 h-32" />
                              </div>
                            )}
                         </div>
                         
                         <div className="prose prose-slate max-w-none">
                           <h3 className="text-lg font-bold text-slate-800">About this Extension</h3>
                           <p className="text-sm text-slate-600 leading-relaxed font-medium">
                             This is a preview of the listing for {listing.title}. Here you would see the full description, features, and screenshots intended for potential users.
                           </p>
                         </div>
                      </div>

                      <div className="w-full md:w-80 shrink-0 space-y-8">
                         <div className="space-y-4">
                            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">{listing.title}</h1>
                            <p className="text-xs font-bold text-trimble-blue">By {listing.author?.name || 'Contributor'}</p>
                         </div>

                         <div className="flex flex-col gap-3">
                           <button className="w-full bg-trimble-blue text-white py-3 rounded-lg font-black text-sm shadow-lg shadow-trimble-blue/20 hover:bg-trimble-blue-dark transition-all uppercase">
                              Download
                           </button>
                         </div>

                         <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-6">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Extension metadata</h3>
                            <div className="space-y-4">
                               {[
                                  { label: 'Version', value: listing.version },
                                  { label: 'Updated', value: listing.updatedAt },
                                  { label: 'Platform', value: listing.platform },
                                  { label: 'Pricing', value: listing.pricing },
                               ].map(item => (
                                 <div key={item.label} className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{item.label}</p>
                                    <p className="text-xs font-bold text-slate-700">{item.value}</p>
                                 </div>
                               ))}
                            </div>
                         </div>
                      </div>
                   </div>
                 </>
               ) : (
                 <div className="space-y-12">
                   <div className="flex flex-col md:flex-row gap-12 text-left">
                     <div className="w-full md:w-80 aspect-square bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center overflow-hidden shadow-sm shrink-0">
                       <PackageIcon className="w-24 h-24 text-slate-200" />
                     </div>
                     <div className="flex-1 space-y-6">
                       <div className="space-y-4">
                         <h1 className="text-4xl font-bold text-slate-800 tracking-tight">{listing.title}</h1>
                         <p className="text-xs font-medium text-slate-400">twh-{listing.title.toLowerCase().replace(/\s+/g, '-')}</p>
                       </div>
                       <p className="text-sm text-slate-600 leading-relaxed max-w-2xl font-medium">
                         Tekla Warehouse provides a unified platform for sharing and using BIM components. Previewing version {listing.version} of this content.
                       </p>
                     </div>
                   </div>
                 </div>
               )}
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
          <button 
            onClick={onClose}
            className="px-8 py-2.5 bg-slate-800 text-white rounded-xl font-bold text-sm hover:bg-slate-900 transition-all shadow-lg"
          >
            Close Preview
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function PackageIcon({ className }: { className?: string }) { return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>; }
