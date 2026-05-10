import React, { useState } from 'react';
import { Info, ChevronRight, Check, Trash2, FileText, Globe, Video, User, CreditCard, ExternalLink, HelpCircle, Package, Edit3, X, ChevronLeft, Share2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ExtensionUploadFlowProps {
  onBack: () => void;
  onSave: (data: any) => void;
  onComplete: () => void;
  organizationName?: string;
  initialData?: any;
  isUpdate?: boolean;
}

export default function ExtensionUploadFlow({ onBack, onComplete, organizationName = 'Trimble Inc', initialData, isUpdate, onSave }: ExtensionUploadFlowProps) {
  const [step, setStep] = useState(isUpdate ? 0 : (initialData ? 3 : 0));
  const [activeCreateTab, setActiveCreateTab] = useState<'file' | 'details' | 'pricing'>(isUpdate || !initialData ? 'file' : 'details');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialData?.categories || []);
  const [formData, setFormData] = useState({
    isListingPage: false,
    title: initialData?.title || '',
    summary: initialData?.summary || 'Professional floor plan generation tool for SketchUp Desktop. Features includes automated wall creation and smart door placement.',
    file: null as File | null,
    fileType: initialData?.platform === 'Tekla' ? 'TSEP' : 'RBZ',
    version: initialData?.version || '1.0.0',
    releaseNotes: isUpdate ? '' : 'Initial release of the content.',
    encryptionType: 'None',
    cudaEnabled: false,
    sketchupCompatibility: initialData?.sketchupCompatibility || ['SketchUp 2024'],
    osCompatibility: initialData?.osCompatibility || ['Windows', 'Mac OS X'],
    languages: initialData?.languages || ['English'],
    testingInstructions: initialData?.testingInstructions || 'Install the extension. Open from Extensions > ' + (initialData?.title || 'test'),
    promoVideo: initialData?.promoVideo || '',
    website: initialData?.website || 'https://trimble.com',
    keywords: initialData?.keywords || ['architecture', 'design', 'modeling'],
    descriptionType: (initialData?.descriptionType as 'plain' | 'markdown') || 'plain',
    description: initialData?.description || 'Detailed description for ' + (initialData?.title || 'this extension') + '. This content provides high quality geometry for professionals.',
    supportContact: initialData?.supportContact || 'support@trimble.com',
    icon: initialData?.icon || null,
    screenshots: initialData?.screenshots || [] as string[],
  });

  const [showIconModal, setShowIconModal] = useState(false);
  const [showWhyCantPublishModal, setShowWhyCantPublishModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const missingFields = [
    { label: 'Extension Title', value: formData.title, tab: 'Overview' },
    { label: 'Extension Summary', value: formData.summary, tab: 'Overview' },
    { label: 'Categories', value: selectedCategories.length > 0 ? 'filled' : '', tab: 'Overview' },
    { label: 'Version Number', value: formData.version, tab: 'Version & Compatibility' },
    { label: 'Release Notes', value: formData.releaseNotes, tab: 'Version & Compatibility' },
    { label: 'Testing Instructions', value: formData.testingInstructions, tab: 'Version & Compatibility' },
    { label: 'SketchUp Compatibility', value: formData.sketchupCompatibility.length > 0 ? 'filled' : '', tab: 'Version & Compatibility' },
    { label: 'OS Compatibility', value: formData.osCompatibility.length > 0 ? 'filled' : '', tab: 'Version & Compatibility' },
    { label: 'Supported Languages', value: formData.languages.length > 0 ? 'filled' : '', tab: 'Version & Compatibility' },
    { label: 'Description', value: formData.description, tab: 'Extension Details' },
    { label: 'Keywords', value: formData.keywords.length > 0 ? 'filled' : '', tab: 'Extension Details' },
    { label: 'Support Contact', value: formData.supportContact, tab: 'Pricing & Support' },
  ].filter(f => !f.value || (typeof f.value === 'string' && f.value.trim() === ''));

  const canSubmit = missingFields.length === 0;

  const steps = [
    { id: 0, label: 'Upload' },
    { id: 1, label: 'Overview' },
    { id: 2, label: 'Categories' },
    { id: 3, label: 'Create' },
  ];

  const rbzCategories = [
    '3D Printing', 'Analysis', 'Architecture', 'Construction', 
    'Drawing', 'Education', 'Energy Analysis', 'Engineering', 
    'Entertainment', 'Film & Stage', 'Gaming', 'HVAC', 
    'Interior Design', 'Kitchen & Bath', 'Landscape Architecture', 
    'Product Design', 'Reporting', 'Scheduling', 'Tool', 
    'Urban Planning', 'Utilities', 'Woodworking'
  ].sort();

  const otherCategories = [
    'Conceptual design', 'Design / Engineering / Analysis', 'Detailing', 
    'Fabrication', 'Erection / Installation / Pour', 'Contracting', 
    'Scheduling', 'Take off / Estimation', 'Cast in place concrete', 
    'Precast concrete', 'Offshore', 'Steel structures', 'Timber structures', 
    'Reinforcement', 'Drawing creation', 'Drawing management', 
    'Drawing editing', 'Drawing annotation', 'View, simulate, navigate', 
    'Compare, review, manage data', 'Productivity', 'Interoperability', 
    'System setup'
  ].sort();

  const categories = formData.fileType === 'RBZ' ? rbzCategories : otherCategories;

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(cat)) {
        return prev.filter(c => c !== cat);
      }
      if (prev.length < 3) {
        return [...prev, cat];
      }
      return prev;
    });
  };

  const handleContinue = () => {
    if (step === 0 && isUpdate) {
      setStep(3); // Jump to Information screen if update
      return;
    }
    if (step < 3) {
      setStep(step + 1);
    } else {
      onSave({ 
        ...formData, 
        status: 'ready_to_publish', 
        type: 'extension',
        categories: selectedCategories
      });
      onComplete();
    }
  };

  const handleFileSelection = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    // If update mode, force match the original type
    if (isUpdate && initialData) {
      const requiredType = initialData.platform === 'Tekla' ? 'tsep' : 'rbz';
      if (extension !== requiredType) {
        alert(`Invalid file type. This content was originally shared as a .${requiredType.toUpperCase()} file. Please upload a matching package.`);
        return;
      }
    }

    const validExtensions = ['tsep', 'dll', 'uel', 'cs', 'vb', 'msi', 'exe', 'cxl', 'ted', 'tcalc', 'rbz', 'json'];
    
    if (extension && validExtensions.includes(extension)) {
      setFormData(prev => ({ 
        ...prev, 
        file, 
        fileType: extension.toUpperCase() 
      }));
    } else {
      alert("Unsupported file type. Please upload a valid extension package.");
    }
  };

  const getFileSizeDisplay = () => {
    if (!formData.file) return '---';
    const size = formData.file.size;
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const renderStepContent = () => {
    switch (step) {
              case 0:
        return (
          <div className="space-y-8 animate-in fade-in duration-500 slide-in-from-bottom-4">
            <div>
              <h2 className="text-2xl font-bold text-[#005F9E]">{isUpdate ? 'Upload Update Package' : 'Upload Extension File'}</h2>
              <p className="text-sm text-slate-500 mt-1">
                {isUpdate 
                  ? `Upload the new package for ${initialData?.title}. Must be a .${formData.fileType} file.`
                  : 'Upload your package to begin the submission process.'
                }
              </p>
            </div>

            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) handleFileSelection(file);
              }}
              className="border-2 border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center hover:border-[#005F9E] hover:bg-blue-50/30 transition-all group"
            >
              <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:text-[#005F9E] transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              </div>
              
              {formData.file ? (
                <div className="space-y-2">
                  <p className="text-lg font-bold text-slate-800">{formData.file.name}</p>
                  <p className="text-xs font-bold text-[#005F9E] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100 italic">
                    Detected: {formData.fileType}
                  </p>
                  <button 
                    onClick={() => setFormData(prev => ({ ...prev, file: null, fileType: '' }))}
                    className="text-xs font-bold text-red-500 mt-4 hover:underline"
                  >
                    Remove and try another file
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-lg font-bold text-slate-800 mb-2">Drag and drop your file here</p>
                  <p className="text-sm text-slate-400 max-w-xs mb-8">
                    Supported types: .rbz, .tsep, .dll, .uel, .cs, .vb, .msi, .exe, .cxl, .ted, .tcalc, .json
                  </p>
                  <input 
                    type="file" 
                    id="file-upload" 
                    className="hidden" 
                    onChange={(e) => e.target.files?.[0] && handleFileSelection(e.target.files[0])}
                    accept=".tsep,.dll,.uel,.cs,.vb,.msi,.exe,.cxl,.ted,.tcalc,.rbz,.json"
                  />
                  <label 
                    htmlFor="file-upload"
                    className="bg-trimble-blue text-white px-8 py-3 rounded-xl font-bold hover:bg-trimble-blue-dark transition-all cursor-pointer shadow-lg shadow-trimble-blue/20"
                  >
                    Select File
                  </label>
                </>
              )}
            </div>

            <div className="flex justify-end pt-8">
              <button 
                onClick={handleContinue}
                disabled={!formData.file}
                className="bg-[#7fb3d5] text-white px-8 py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        );
       case 1:
         return (
           <div className="space-y-8 animate-in fade-in duration-500 slide-in-from-bottom-4">
             <div>
               <h2 className="text-2xl font-bold text-[#005F9E]">Add New Extension</h2>
               <p className="text-sm text-slate-500 mt-1">(Don't worry, you can add more details later!)</p>
             </div>

             <div className="space-y-6">
               {formData.fileType === 'RBZ' && (
                 <>
                   <div className="flex items-center gap-3 group px-1">
                     <div 
                       onClick={() => setFormData(prev => ({ ...prev, isListingPage: !prev.isListingPage }))}
                       className={`w-6 h-6 rounded border-2 flex items-center justify-center cursor-pointer transition-all ${
                         formData.isListingPage ? 'bg-[#005F9E] border-[#005F9E]' : 'bg-white border-slate-300'
                       }`}
                     >
                       {formData.isListingPage && <Check className="w-4 h-4 text-white" />}
                     </div>
                     <div className="flex items-center gap-2">
                       <span className="text-sm font-medium text-slate-700">Listing Page</span>
                       <div className="relative group/tooltip">
                         <Info className="w-4 h-4 text-slate-400 cursor-help" />
                         <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1.5 px-3 rounded-lg opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity whitespace-pre-wrap z-50 shadow-xl w-80 text-left">
                           A Listing Page is an extension listing that acts like a regular extension page, but instead of hosting the extension file on Extension Warehouse, the developer hosts the file on their own servers and we provide a link to the developer's website where the user can download the extension from the developer. We prefer to not use Listing Pages as they do not provide as seamless of a user experience as regular hosted extensions.
                           There are limited reasons that we allow Listing Pages. Typically this includes extensions where:
                           <br/><br/>
                           • The extension is packaged in a executable installer.<br/>
                           • The licensing model for the extension is not supported by Extension Warehouse (subscription licensing for example).<br/>
                           • Other technical reasons.<br/>
                           Please describe in detail why you are requesting a Listing Page.
                         </div>
                       </div>
                     </div>
                   </div>

                   <p className="text-sm text-slate-600 pl-1">
                     Note: Listing Pages cannot become regular Extensions and vice versa.
                   </p>
                 </>
               )}

               <div className="space-y-2">
                 <label className="text-sm font-medium text-slate-700">Extension Title <span className="text-red-500">*</span></label>
                 <input 
                   type="text" 
                   value={formData.title}
                   onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                   className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg outline-none focus:border-[#005F9E] focus:ring-1 focus:ring-[#005F9E] transition-all text-slate-800"
                 />
               </div>

               <div className="space-y-2">
                 <div className="flex justify-between items-center">
                   <label className="text-sm font-medium text-slate-700">Extension Summary <span className="text-red-500">*</span></label>
                   <span className="text-xs text-slate-400 font-bold">{formData.summary.length}/120</span>
                 </div>
                 <textarea 
                   value={formData.summary}
                   onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value.slice(0, 120) }))}
                   rows={6}
                   className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg outline-none focus:border-[#005F9E] focus:ring-1 focus:ring-[#005F9E] transition-all text-slate-800 resize-none"
                 />
               </div>
             </div>

            <div className="flex justify-end pt-8">
              <button 
                onClick={handleContinue}
                disabled={!formData.title || !formData.summary}
                className="bg-[#7fb3d5] text-white px-8 py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8 animate-in fade-in duration-500 slide-in-from-right-4">
             <div className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-bold text-[#005F9E]">Select Categories</h2>
                <p className="text-sm text-slate-500 mt-1">Select between 1 and 3 categories that best describe your extension.</p>
              </div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                Selected: <span className={selectedCategories.length > 0 ? 'text-[#005F9E]' : ''}>{selectedCategories.length} / 3</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => toggleCategory(cat)}
                  className={`p-3 rounded-xl transition-all text-[11px] font-bold text-left border-2 ${
                    selectedCategories.includes(cat) 
                      ? 'bg-blue-50 border-[#005F9E] text-[#005F9E] shadow-sm' 
                      : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex justify-between pt-8">
              <button onClick={() => setStep(1)} className="px-6 py-2.5 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Back</button>
              <button 
                onClick={handleContinue}
                disabled={selectedCategories.length === 0}
                className="bg-[#7fb3d5] text-white px-8 py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8 animate-in fade-in duration-700 slide-in-from-right-4">
             {/* Top Extension Information Panel */}
             <div className="bg-slate-50/50 rounded-2xl p-8 border border-slate-100">
               <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">EXTENSION INFORMATION</h2>
               <div className="flex flex-col md:flex-row gap-8">
                 <div className="flex flex-col items-center gap-2">
                   <div 
                     onClick={() => setShowIconModal(true)}
                     className="w-24 h-24 bg-white border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-trimble-blue shadow-sm cursor-pointer hover:border-trimble-blue hover:bg-blue-50/50 transition-all group overflow-hidden"
                   >
                     {formData.icon ? (
                       <img src={formData.icon} alt="Icon" className="w-full h-full object-cover" />
                     ) : (
                       <>
                         <span className="text-[10px] font-black bg-trimble-blue text-white px-2 py-0.5 rounded-sm mb-1 uppercase tracking-tighter">{formData.fileType || 'TSEP'}</span>
                         <Package className="w-8 h-8 group-hover:scale-110 transition-transform" />
                       </>
                     )}
                   </div>
                   <span className="text-xs font-bold text-slate-500">{formData.title || 'test'}</span>
                 </div>
 
                 <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                   <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">EXTENSION TITLE <span className="text-red-500">*</span></label>
                     <input 
                       type="text" 
                       value={formData.title}
                       onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                       className="w-full bg-transparent border-b border-slate-200 py-1 font-bold text-slate-800 focus:border-trimble-blue outline-none transition-colors"
                       placeholder="Title"
                     />
                   </div>
                   <div className="space-y-2">
                     <div className="flex justify-between">
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">EXTENSION SUMMARY <span className="text-red-500">*</span></label>
                       <span className="text-[10px] font-bold text-slate-300">{formData.summary.length}/120</span>
                     </div>
                     <textarea 
                       value={formData.summary}
                       onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value.slice(0, 120) }))}
                       rows={2}
                       className="w-full bg-transparent border border-slate-200 rounded-lg p-3 text-sm text-slate-600 focus:border-trimble-blue outline-none transition-colors resize-none"
                       placeholder="Summary"
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       CATEGORIES <span className="text-red-500">*</span>
                       <button onClick={() => setStep(2)} className="text-trimble-blue hover:underline lowercase font-normal italic flex items-center gap-1">
                         <Edit3 className="w-3 h-3" /> edit
                       </button>
                     </label>
                     <div className="flex flex-wrap gap-2 pt-1">
                       {selectedCategories.length > 0 ? selectedCategories.map(cat => (
                         <span key={cat} className="text-[10px] font-bold bg-white border border-slate-200 px-2.5 py-1 rounded-full text-slate-500">
                           {cat}
                         </span>
                       )) : (
                         <span className="text-[10px] font-bold bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full text-slate-400">
                           'System setup'
                         </span>
                       )}
                     </div>
                   </div>
 
                   <div className="flex justify-end items-end gap-3 md:col-span-2 mt-4">
                     <button 
                       onClick={() => {
                         onSave({ ...formData, status: 'draft', type: 'extension', categories: selectedCategories });
                         onComplete();
                       }}
                       className="px-6 py-2.5 bg-white border border-slate-300 rounded-lg font-black text-sm text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                     >
                       Save Draft
                     </button>
                     <button 
                       onClick={() => setShowPreviewModal(true)}
                       className="px-6 py-2.5 bg-white border border-slate-300 rounded-lg font-black text-sm text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                     >
                       Preview Listing
                     </button>
                     {canSubmit ? (
                       <button 
                         onClick={() => {
                           onSave({ ...formData, status: 'ready_to_publish', type: 'extension', categories: selectedCategories });
                           onComplete();
                         }}
                         className="px-8 py-2.5 bg-[#7fb3d5] text-white rounded-lg font-bold text-sm hover:opacity-90 transition-all shadow-[0_4px_12px_rgba(127,179,213,0.4)] border border-[#6ea0c0]"
                       >
                         {initialData?.id ? 'Save & Update' : 'Submit For Review'}
                       </button>
                     ) : (
                       <button 
                         onClick={() => setShowWhyCantPublishModal(true)}
                         className="px-8 py-2.5 bg-slate-100 text-slate-400 rounded-lg font-bold text-sm hover:bg-slate-200 transition-all shadow-sm flex items-center gap-2 border border-slate-200"
                       >
                         Why Can't I Publish?
                         <HelpCircle className="w-4 h-4" />
                       </button>
                     )}
                   </div>
                 </div>
               </div>
             </div>
 
             {/* Tabs */}
             <div className="border-b border-slate-200">
               <div className="flex gap-12 overflow-x-auto pb-px">
                 {[
                   { id: 'file', label: 'Version & Compatibility' },
                   { id: 'details', label: 'Extension Details' },
                   { id: 'pricing', label: 'Pricing & Support' }
                 ].map(tab => (
                   <button
                     key={tab.id}
                     onClick={() => setActiveCreateTab(tab.id as any)}
                     className={`pb-4 px-2 text-sm font-bold transition-all relative ${
                       activeCreateTab === tab.id ? 'text-trimble-blue' : 'text-slate-400 hover:text-slate-600'
                     }`}
                   >
                     {tab.label}
                     {activeCreateTab === tab.id && (
                       <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-1 bg-trimble-blue rounded-t-full" />
                     )}
                   </button>
                 ))}
               </div>
             </div>

            {/* Tab Content */}
            <div className="py-8 min-h-[600px]">
              <AnimatePresence mode="wait">
                {activeCreateTab === 'file' && (
                  <motion.div 
                    key="file"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-12"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-800">Version Number <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          placeholder="1.0.0"
                          value={formData.version}
                          onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-trimble-blue transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-bold text-slate-800">Release Notes <span className="text-red-500">*</span></label>
                          <span className="text-[10px] font-bold text-slate-300">{formData.releaseNotes.length}/1000</span>
                        </div>
                        <textarea 
                          value={formData.releaseNotes}
                          onChange={(e) => setFormData(prev => ({ ...prev, releaseNotes: e.target.value }))}
                          rows={6}
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-trimble-blue transition-all resize-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-slate-100">
                      <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-800">Encryption Type <span className="text-red-500">*</span></label>
                        <select 
                          value={formData.encryptionType}
                          onChange={(e) => setFormData(prev => ({ ...prev, encryptionType: e.target.value }))}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl appearance-none bg-no-repeat bg-[right_16px_center] cursor-pointer outline-none focus:border-trimble-blue font-bold text-slate-700"
                        >
                          <option>None</option>
                          <option>Ruby Encryption</option>
                          <option>Custom RSA</option>
                        </select>
                        <a href="#" className="inline-block text-xs font-bold text-trimble-blue hover:underline">More About Encryption Types</a>
                        
                        <div className="pt-4">
                          <label className="flex items-center gap-3 group cursor-pointer">
                            <div 
                              onClick={() => setFormData(prev => ({ ...prev, cudaEnabled: !prev.cudaEnabled }))}
                              className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                                formData.cudaEnabled ? 'bg-trimble-blue border-trimble-blue text-white' : 'bg-white border-slate-200'
                              }`}
                            >
                              {formData.cudaEnabled && <Check className="w-4 h-4" />}
                            </div>
                            <span className="text-sm font-bold text-slate-700">Mark as NVIDIA CUDA-Enabled</span>
                            <Info className="w-4 h-4 text-slate-300" />
                          </label>
                        </div>
                      </div>
                      
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 h-fit">
                        <p className="text-sm font-medium text-slate-600 leading-relaxed italic">"test test test"</p>
                      </div>
                    </div>

                    <div className="space-y-8 pt-8 border-t border-slate-100">
                      <h3 className="text-lg font-bold text-slate-800">Compatibility</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-3">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">SketchUp Compatibility <span className="text-red-500">*</span></label>
                          <div className="border border-slate-200 rounded-xl overflow-hidden h-64 overflow-y-auto">
                            {['SketchUp 2026', 'SketchUp 2025', 'SketchUp 2024', 'SketchUp 2023', 'SketchUp 2022', 'SketchUp 2021'].map(v => (
                              <button 
                                key={v}
                                onClick={() => {
                                  const list = formData.sketchupCompatibility;
                                  setFormData(prev => ({
                                    ...prev,
                                    sketchupCompatibility: list.includes(v) ? list.filter(i => i !== v) : [...list, v]
                                  }));
                                }}
                                className={`w-full text-left px-4 py-3 text-sm font-bold border-b border-slate-50 last:border-0 transition-all ${
                                  formData.sketchupCompatibility.includes(v) ? 'bg-blue-50 text-trimble-blue' : 'text-slate-600 hover:bg-slate-50'
                                }`}
                              >
                                {v}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">OS Compatibility <span className="text-red-500">*</span></label>
                          <div className="border border-slate-200 rounded-xl overflow-hidden h-64 overflow-y-auto">
                            {['Windows', 'Mac OS X', 'Linux', 'Web', 'iOS', 'Android'].map(v => (
                              <button 
                                key={v}
                                onClick={() => {
                                  const list = formData.osCompatibility;
                                  setFormData(prev => ({
                                    ...prev,
                                    osCompatibility: list.includes(v) ? list.filter(i => i !== v) : [...list, v]
                                  }));
                                }}
                                className={`w-full text-left px-4 py-3 text-sm font-bold border-b border-slate-50 last:border-0 transition-all ${
                                  formData.osCompatibility.includes(v) ? 'bg-blue-50 text-trimble-blue' : 'text-slate-600 hover:bg-slate-50'
                                }`}
                              >
                                {v}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Supported Languages <span className="text-red-500">*</span></label>
                          <div className="border border-slate-200 rounded-xl overflow-hidden h-64 overflow-y-auto">
                            {['Czech', 'German', 'English', 'Spanish', 'French', 'Italian', 'Japanese', 'Korean', 'Portuguese', 'Russian', 'Chinese'].map(v => (
                              <button 
                                key={v}
                                onClick={() => {
                                  const list = formData.languages;
                                  setFormData(prev => ({
                                    ...prev,
                                    languages: list.includes(v) ? list.filter(i => i !== v) : [...list, v]
                                  }));
                                }}
                                className={`w-full text-left px-4 py-3 text-sm font-bold border-b border-slate-50 last:border-0 transition-all ${
                                  formData.languages.includes(v) ? 'bg-blue-50 text-trimble-blue' : 'text-slate-600 hover:bg-slate-50'
                                }`}
                              >
                                {v}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-8 border-t border-slate-100">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-slate-800">Testing instructions <span className="text-red-500">*</span></label>
                        <span className="text-[10px] font-bold text-slate-300">{formData.testingInstructions.length}/1000</span>
                      </div>
                      <p className="text-xs text-slate-500 italic">Add instructions for the SketchUp moderation team on how to test your extension. Please include new features for updates, as well as any licenses needed to use the extension.</p>
                      <textarea 
                        value={formData.testingInstructions}
                        onChange={(e) => setFormData(prev => ({ ...prev, testingInstructions: e.target.value }))}
                        rows={6}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-trimble-blue transition-all font-mono text-sm bg-slate-50/50"
                        placeholder="e.g. To test the floor plan generator, open the plugin from Extensions -> FloorPlan Pro. Click 'New Layout'..."
                      />
                    </div>
                  </motion.div>
                )}

                {activeCreateTab === 'details' && (
                  <motion.div 
                    key="details"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-12"
                  >
                    <div className="space-y-6">
                      <label className="text-sm font-bold text-slate-800">Screenshots <span className="text-red-500">*</span></label>
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {formData.screenshots.map((src, idx) => (
                          <div key={idx} className="aspect-[940/470] bg-slate-50 border border-slate-200 rounded-xl overflow-hidden relative group">
                            <img src={src} className="w-full h-full object-cover" alt={`Screenshot ${idx + 1}`} />
                            <button 
                              onClick={() => setFormData(prev => ({ ...prev, screenshots: prev.screenshots.filter((_, i) => i !== idx) }))}
                              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        {formData.screenshots.length < 5 && (
                          <div 
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.multiple = true;
                              input.onchange = (e) => {
                                const files = Array.from((e.target as HTMLInputElement).files || []);
                                files.slice(0, 5 - formData.screenshots.length).forEach(file => {
                                  const reader = new FileReader();
                                  reader.onload = (ev) => {
                                    setFormData(prev => ({ ...prev, screenshots: [...prev.screenshots, ev.target?.result as string] }));
                                  };
                                  reader.readAsDataURL(file);
                                });
                              };
                              input.click();
                            }}
                            className="aspect-[940/470] border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-trimble-blue hover:bg-blue-50/50 transition-all group"
                          >
                            <Plus className="w-6 h-6 text-slate-300 group-hover:text-trimble-blue mb-1" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Add Screenshot</span>
                          </div>
                        )}
                      </div>
                      <div className="bg-slate-50/30 border border-slate-100 rounded-2xl p-6">
                        <ul className="text-[10px] text-slate-400 space-y-1 font-medium">
                          <li>Recommended Dimensions: 940px x 470px</li>
                          <li>Max File Number: 5 | Max File Size: 3MB</li>
                          <li>Allowed Formats: .jpg, .jpeg, .png</li>
                        </ul>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-800">Promo Video</label>
                        <div className="relative">
                          <Video className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                          <input 
                            type="text" 
                            placeholder="https://youtu.be/..."
                            value={formData.promoVideo}
                            onChange={(e) => setFormData(prev => ({ ...prev, promoVideo: e.target.value }))}
                            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-trimble-blue transition-all"
                          />
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-1 mt-1">Supported Video: YouTube</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-800">Website</label>
                        <div className="relative">
                          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                          <input 
                            type="text" 
                            placeholder="https://yoursite.com"
                            value={formData.website}
                            onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-trimble-blue transition-all"
                          />
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-1 mt-1">Website must be a valid URL with https protocol</p>
                      </div>
                    </div>

                    <div className="space-y-4 pt-8 border-t border-slate-100">
                      <label className="text-sm font-bold text-slate-800">Keywords <span className="text-red-500">*</span></label>
                      <div className="flex flex-wrap gap-2 p-3 border border-slate-200 rounded-xl bg-slate-50/30">
                        {formData.keywords.map(kw => (
                          <span key={kw} className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 shadow-sm">
                            {kw}
                            <button onClick={() => setFormData(prev => ({ ...prev, keywords: prev.keywords.filter(k => k !== kw) }))} className="text-slate-300 hover:text-red-500 transition-colors">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                        <input 
                          type="text"
                          placeholder="Ex. architecture..."
                          className="bg-transparent outline-none text-xs font-bold text-slate-600 flex-1 min-w-[120px]"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const val = (e.currentTarget as HTMLInputElement).value.trim();
                              if (val && !formData.keywords.includes(val)) {
                                setFormData(prev => ({ ...prev, keywords: [...prev.keywords, val] }));
                                (e.currentTarget as HTMLInputElement).value = '';
                              }
                            }
                          }}
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-1">Press Enter to create</p>
                    </div>

                    <div className="space-y-6 pt-8 border-t border-slate-100">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-slate-800">Description <span className="text-red-500">*</span></label>
                        <div className="flex gap-4">
                          <button 
                            onClick={() => setFormData(prev => ({ ...prev, descriptionType: 'plain' }))}
                            className={`flex items-center gap-2 text-xs font-bold transition-all ${formData.descriptionType === 'plain' ? 'text-trimble-blue' : 'text-slate-400'}`}
                          >
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.descriptionType === 'plain' ? 'border-trimble-blue' : 'border-slate-200'}`}>
                              {formData.descriptionType === 'plain' && <div className="w-1.5 h-1.5 bg-trimble-blue rounded-full" />}
                            </div>
                            Plain Text
                          </button>
                          <button 
                            onClick={() => setFormData(prev => ({ ...prev, descriptionType: 'markdown' }))}
                            className={`flex items-center gap-2 text-xs font-bold transition-all ${formData.descriptionType === 'markdown' ? 'text-trimble-blue' : 'text-slate-400'}`}
                          >
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.descriptionType === 'markdown' ? 'border-trimble-blue' : 'border-slate-200'}`}>
                              {formData.descriptionType === 'markdown' && <div className="w-1.5 h-1.5 bg-trimble-blue rounded-full" />}
                            </div>
                            Markdown
                          </button>
                        </div>
                      </div>
                      <textarea 
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value.slice(0, 5000) }))}
                        rows={12}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-trimble-blue transition-all text-sm text-slate-600 bg-slate-50/50"
                        placeholder="Tell users why they need your extension..."
                      />
                      <div className="flex justify-end">
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{formData.description.length}/5000</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeCreateTab === 'pricing' && (
                  <motion.div 
                    key="pricing"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-12"
                  >
                    <div className="space-y-6">
                      <label className="text-sm font-bold text-slate-800">Pricing <span className="text-red-500">*</span></label>
                      <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-8 flex items-center gap-6">
                        <div className="p-4 bg-white rounded-xl shadow-sm border border-blue-50">
                          <CreditCard className="w-8 h-8 text-trimble-blue" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-slate-800 mb-1 italic">This is a free extension</p>
                          <p className="text-sm text-slate-500 leading-relaxed max-w-lg">Your extension will be listed as Free on the Marketplace. Users will be able to download and use it without any charge through our system.</p>
                        </div>
                      </div>
                      <button className="text-xs font-bold text-trimble-blue hover:underline flex items-center gap-2 mt-2">
                        <ExternalLink className="w-3 h-3" /> Change pricing model in Developer Settings
                      </button>
                    </div>

                    <div className="space-y-4 pt-12 border-t border-slate-100">
                      <label className="text-sm font-bold text-slate-800">Customer Support <span className="text-red-500">*</span></label>
                      <p className="text-xs text-slate-400 font-medium max-w-2xl leading-relaxed">This field will affect the support contact information for this extension only. Go to your settings to update it globally.</p>
                      
                      <div className="max-w-md pt-4">
                        <div className="relative">
                           <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                           <input 
                             type="text" 
                             value={formData.supportContact}
                             onChange={(e) => setFormData(prev => ({ ...prev, supportContact: e.target.value }))}
                             className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-trimble-blue transition-all font-bold text-slate-700"
                           />
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-1 mt-2">Website must be a valid URL with https protocol</p>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-100 p-8 rounded-3xl mt-12 flex items-start gap-6">
                      <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
                         <HelpCircle className="w-6 h-6" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-bold text-amber-900">Final Verification Required</h4>
                        <p className="text-xs text-amber-700 font-medium leading-relaxed">By submitting this extension, you agree to the Trimble Developer Terms & Conditions. Extensions undergo automated validation and manual review by our moderation team. This process typically takes 3-5 business days.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-4 px-6 md:px-12">
      {/* Icon Upload Modal */}
      <AnimatePresence>
        {showIconModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowIconModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">Upload Extension Icon</h3>
                <button onClick={() => setShowIconModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      setFormData(prev => ({ ...prev, icon: ev.target?.result as string }));
                      setShowIconModal(false);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="border-2 border-dashed border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center hover:border-trimble-blue hover:bg-blue-50/30 transition-all cursor-pointer"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        setFormData(prev => ({ ...prev, icon: ev.target?.result as string }));
                        setShowIconModal(false);
                      };
                      reader.readAsDataURL(file);
                    }
                  };
                  input.click();
                }}
              >
                <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mb-4">
                  <Globe className="w-8 h-8" />
                </div>
                <p className="text-sm font-bold text-slate-700">Drag and drop file here to upload</p>
                <div className="mt-4 flex flex-col items-center gap-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recommended: 256x256 px</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Formats: PNG, JPG, JPEG</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Why Can't I Publish Modal */}
      <AnimatePresence>
        {showWhyCantPublishModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWhyCantPublishModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-50 text-amber-500 rounded-lg">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Why Can't I Publish?</h3>
                </div>
                <button onClick={() => setShowWhyCantPublishModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-sm text-slate-500 mb-6 font-medium">To submit your extension for review, please ensure all required fields are filled out. The following items are missing:</p>
              
              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 mb-8">
                {Array.from(new Set(missingFields.map(f => f.tab))).map(tabName => (
                  <div key={tabName} className="space-y-2">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{tabName}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {missingFields.filter(f => f.tab === tabName).map(field => (
                        <div key={field.label} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="w-2 h-2 rounded-full bg-red-400" />
                          <span className="text-xs font-bold text-slate-600">{field.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setShowWhyCantPublishModal(false)}
                className="w-full py-3 bg-trimble-blue text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all"
              >
                I'll complete my listing now
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreviewModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPreviewModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative bg-[#f0f2f5] w-full max-w-6xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-trimble-blue text-white rounded flex items-center justify-center">
                    <Package className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-slate-800">
                    {formData.fileType === 'RBZ' ? 'Extension Warehouse Preview' : 'Tekla Warehouse Preview'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowPreviewModal(false)}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content Scrollable */}
              <div className="flex-1 overflow-y-auto bg-white">
                {formData.fileType === 'RBZ' ? (
                  /* Extension Warehouse (SketchUp) Preview */
                  <div className="p-6 md:p-12">
                    <div className="max-w-5xl mx-auto space-y-8">
                       {/* Breadcrumbs */}
                       <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest italic">
                          <span className="hover:text-trimble-blue cursor-pointer">EXTENSION WAREHOUSE</span>
                          <ChevronRight className="w-3 h-3" />
                          <span className="hover:text-trimble-blue cursor-pointer">{(selectedCategories[0] || 'GENERAL').toUpperCase()}</span>
                          <ChevronRight className="w-3 h-3" />
                          <span className="text-slate-800">{(formData.title || 'TEST').toUpperCase()}</span>
                       </div>
 
                       <div className="flex flex-col md:flex-row gap-12 pt-4">
                          {/* Main Image and Carousel */}
                          <div className="flex-1 space-y-6">
                             <div className="w-full aspect-[16/9] bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center overflow-hidden shadow-sm relative">
                                {formData.screenshots.length > 0 ? (
                                  <img src={formData.screenshots[0]} alt="Main" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="flex flex-col items-center gap-4 text-slate-200">
                                    <Package className="w-32 h-32" />
                                  </div>
                                )}
                                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-slate-600 shadow-sm border border-slate-200">
                                   1 / {formData.screenshots.length || 1}
                                </div>
                             </div>
                             
                             <div className="flex gap-3 overflow-x-auto pb-2 h-20">
                                {formData.screenshots.length > 0 ? formData.screenshots.map((src, i) => (
                                  <div key={i} className={`aspect-video h-full rounded-lg border-2 shrink-0 overflow-hidden ${i === 0 ? 'border-trimble-blue' : 'border-slate-100'}`}>
                                    <img src={src} className="w-full h-full object-cover" alt={`Thumb ${i}`} />
                                  </div>
                                )) : (
                                  <>
                                    <div className="aspect-video h-full bg-slate-200 rounded-lg border-2 border-trimble-blue shrink-0" />
                                    <div className="aspect-video h-full bg-slate-50 border border-slate-100 rounded-lg shrink-0" />
                                    <div className="aspect-video h-full bg-slate-50 border border-slate-100 rounded-lg shrink-0" />
                                  </>
                                )}
                             </div>
 
                             <div className="border-b border-slate-100">
                               <div className="flex gap-8">
                                  {['Extension Overview', 'Reviews (0)', 'Release Notes'].map(tab => (
                                    <button 
                                      key={tab}
                                      className={`pb-4 text-sm font-bold transition-colors relative ${tab === 'Extension Overview' ? 'text-trimble-blue' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                      {tab}
                                      {tab === 'Extension Overview' && <motion.div layoutId="extTab" className="absolute bottom-0 left-0 right-0 h-1 bg-trimble-blue rounded-t-full" />}
                                    </button>
                                  ))}
                               </div>
                             </div>
 
                             <div className="prose prose-slate max-w-none">
                               <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                 {formData.description || 'This extension provides powerful new tools for your SketchUp workflow. It integrates seamlessly into the menu system and offers high-performance enhancements for productivity.'}
                               </p>
                             </div>
                          </div>
 
                          {/* Sidebar Info */}
                          <div className="w-full md:w-80 shrink-0 space-y-8">
                             <div className="space-y-4">
                                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">{formData.title || 'test'}</h1>
                                <div className="flex items-center gap-2">
                                   <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                                      <User className="w-3 h-3 text-slate-400" />
                                   </div>
                                   <span className="text-xs font-bold text-trimble-blue hover:underline cursor-pointer">{organizationName}</span>
                                </div>
                             </div>
 
                             <div className="flex flex-col gap-3">
                               <button className="w-full bg-trimble-blue text-white py-3 rounded-lg font-black text-sm shadow-lg shadow-trimble-blue/20 hover:bg-trimble-blue-dark transition-all">
                                  DOWNLOAD
                               </button>
                               <button className="w-full bg-white border border-slate-200 text-slate-600 py-3 rounded-lg font-black text-sm hover:bg-slate-50 transition-all">
                                  CONTACT DEVELOPER
                               </button>
                             </div>
 
                             <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-6">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Extension metadata</h3>
                                <div className="space-y-4">
                                   {[
                                      { label: 'Version', value: formData.version || '1.0.0' },
                                      { label: 'Updated', value: 'May 10, 2026' },
                                      { label: 'File Size', value: getFileSizeDisplay() },
                                      { label: 'Languages', value: formData.languages[0] || 'English' },
                                      { label: 'OS', value: formData.osCompatibility.join(', ') },
                                   ].map(item => (
                                     <div key={item.label} className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{item.label}</p>
                                        <p className="text-xs font-bold text-slate-700">{item.value}</p>
                                     </div>
                                   ))}
                                </div>
                             </div>
 
                             <div className="space-y-3">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Share this extension</h4>
                                <div className="flex gap-2">
                                   <button className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors">Facebook</button>
                                   <button className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors">Twitter</button>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                ) : (
                  /* Tekla Warehouse Preview */
                  <div className="p-6 md:p-12">
                    <div className="max-w-5xl mx-auto space-y-12">
                      {/* Top Header Section */}
                      <div className="flex flex-col md:flex-row gap-12">
                        <div className="w-full md:w-80 aspect-square bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center overflow-hidden shadow-sm shrink-0">
                          {formData.screenshots.length > 0 ? (
                            <img src={formData.screenshots[0]} alt="Screenshot" className="w-full h-full object-cover" />
                          ) : formData.icon ? (
                            <img src={formData.icon} alt="Icon" className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex flex-col items-center gap-4 text-slate-300">
                              <Package className="w-24 h-24" />
                              <span className="text-[10px] font-black uppercase tracking-widest">{formData.fileType || 'TSEP'}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 space-y-6">
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-xs font-bold text-trimble-blue">
                              <Globe className="w-3 h-3" />
                              <span className="hover:underline cursor-pointer">{organizationName}</span>
                            </div>
                            <h1 className="text-4xl font-bold text-slate-800 tracking-tight">{formData.title || 'Extension Name'}</h1>
                            <p className="text-xs font-medium text-slate-400">twh-{ (formData.title || 'extension').toLowerCase().replace(/\s+/g, '-') }</p>
                          </div>

                          <p className="text-sm text-slate-600 leading-relaxed max-w-2xl font-medium">
                            {formData.summary || 'Introducing algorithmic modelling for your workflow. This extension provides a set of components that can create and interact with objects live in the software interface.'}
                          </p>

                          <div className="flex items-center gap-2 text-[#005F9E] text-xs font-bold">
                            <CreditCard className="w-4 h-4" />
                            <span>Requires subscription</span>
                          </div>
                        </div>
                      </div>

                      {/* Screenshots / Thumbnails */}
                      <div className="space-y-4 p-4 border border-slate-50 rounded-xl bg-slate-50/30">
                        <div className="flex gap-4 items-center">
                           <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 transition-colors shadow-sm">
                              <ChevronLeft className="w-4 h-4" />
                           </button>
                           <div className="flex-1 h-32 flex gap-4 overflow-hidden">
                              {formData.screenshots.length > 0 ? formData.screenshots.map((src, i) => (
                                <div key={i} className="w-48 h-full bg-slate-100 border border-slate-200 rounded-lg shrink-0 overflow-hidden">
                                  <img src={src} className="w-full h-full object-cover" alt={`Screenshot ${i + 1}`} />
                                </div>
                              )) : (
                                <>
                                  <div className="w-48 h-full bg-slate-200 border border-slate-300 rounded-lg shrink-0 flex items-center justify-center">
                                     <Package className="w-8 h-8 text-slate-400" />
                                  </div>
                                  <div className="w-48 h-full bg-slate-100 border border-slate-200 rounded-lg shrink-0" />
                                  <div className="w-48 h-full bg-slate-100 border border-slate-200 rounded-lg shrink-0" />
                                </>
                              )}
                           </div>
                           <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 transition-colors shadow-sm">
                              <ChevronRight className="w-4 h-4" />
                           </button>
                        </div>
                        <div className="flex justify-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          1 / {formData.screenshots.length || 1}
                        </div>
                      </div>

                      {/* Tabs */}
                      <div className="border-b border-slate-200">
                        <div className="flex gap-8">
                           {['Versions (1)', 'Details', 'Statistics', 'Feedback'].map(tab => (
                             <button 
                               key={tab}
                               className={`pb-4 text-xs font-bold transition-colors relative uppercase tracking-widest ${tab === 'Details' ? 'text-trimble-blue' : 'text-slate-400'}`}
                             >
                               {tab}
                               {tab === 'Details' && <motion.div layoutId="previewTab" className="absolute bottom-0 left-0 right-0 h-1 bg-trimble-blue rounded-t-full" />}
                             </button>
                           ))}
                        </div>
                      </div>

                      {/* Details Section */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                        <div className="lg:col-span-2 space-y-12">
                           <div className="space-y-6">
                               <ul className="space-y-4 text-xs text-slate-600 font-medium leading-relaxed">
                                 <li className="flex gap-3">
                                   <div className="w-1.5 h-1.5 rounded-full bg-trimble-blue mt-1.5 shrink-0" />
                                   <span>{formData.releaseNotes || "See the 'Release Notes' under the version downloads for the latest updates, and the TUA page for documentation."}</span>
                                 </li>
                                 <li className="flex gap-3">
                                   <div className="w-1.5 h-1.5 rounded-full bg-trimble-blue mt-1.5 shrink-0" />
                                   <span>Download requires a valid subscription or Maintenance agreement.</span>
                                 </li>
                                 <li className="flex gap-3">
                                   <div className="w-1.5 h-1.5 rounded-full bg-trimble-blue mt-1.5 shrink-0" />
                                   <span>This extension works with the current software versions as specified in the compatibility section.</span>
                                 </li>
                                 <li className="flex gap-3">
                                   <div className="w-1.5 h-1.5 rounded-full bg-trimble-blue mt-1.5 shrink-0" />
                                   <span>Check out the documentation for common issues and setup guides.</span>
                                 </li>
                               </ul>
                           </div>

                           <div className="space-y-8">
                              <h2 className="text-2xl font-bold text-slate-800">Introduction</h2>
                              <div className="prose prose-slate max-w-none text-sm text-slate-600 font-medium leading-relaxed bg-[#fafafa] p-6 rounded-xl border border-slate-100">
                                 {formData.description || 'The live link is a set of components that can create and interact with objects live in the software. This allows for parametric control and rapid iteration during the design phase.'}
                              </div>
                              
                              <div className="w-full aspect-[21/9] bg-slate-100 rounded-xl relative overflow-hidden group border border-slate-200">
                                 <div className="absolute inset-0 flex items-center justify-center bg-slate-900/10 group-hover:bg-slate-900/20 transition-all pointer-events-none">
                                    <Video className="w-16 h-16 text-white/80" />
                                 </div>
                                 <div className="w-full h-full bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-2">
                                       <Package className="w-12 h-12 text-slate-300" />
                                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Take your design to the next level</span>
                                    </div>
                                 </div>
                              </div>

                              <button className="bg-[#005F9E] text-white px-4 py-2 rounded font-bold text-xs flex items-center gap-2 hover:bg-[#004e82] transition-colors">
                                 Show more <ChevronRight className="w-4 h-4 rotate-90" />
                              </button>
                           </div>
                        </div>

                        <div className="space-y-12">
                           {/* Company Support Table */}
                           <div className="space-y-6">
                              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Company support</h3>
                              <div className="divide-y divide-slate-100 border-t border-slate-100">
                                 {[
                                   { label: 'Website', value: formData.website || 'https://support.trimble.com' },
                                   { label: 'Help & support', value: formData.supportContact || 'https://help.trimble.com' },
                                   { label: 'Discussion forum', value: 'https://forum.trimble.com' },
                                   { label: 'Copyright information', value: '© Trimble Inc. and affiliates' },
                                 ].map((prop, i) => (
                                   <div key={i} className="py-3 flex flex-col gap-1">
                                      <span className="text-xs font-bold text-slate-500">{prop.label}</span>
                                      <span className="text-xs font-bold text-trimble-blue hover:underline cursor-pointer truncate">{prop.value}</span>
                                   </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-8 relative">
         {/* Progress Line */}
         <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -z-10 -translate-y-1/2" />
         
         {steps.map((s) => (
           <div key={s.id} className="flex flex-col items-center gap-3 relative z-10 bg-slate-50 h-full">
             <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-all duration-500 ${
               step >= s.id ? 'bg-[#005F9E] text-white' : 'bg-white text-slate-300 border-slate-100'
             }`}>
               {step > s.id ? <Check className="w-5 h-5" /> : <span className="text-sm font-bold">{s.id}</span>}
             </div>
             <span className={`text-xs font-bold uppercase tracking-widest ${step >= s.id ? 'text-[#005F9E]' : 'text-slate-400'}`}>
               {s.label}
             </span>
           </div>
         ))}
      </div>

      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
        <button 
          onClick={initialData ? onBack : (step === 3 ? () => setStep(2) : onBack)}
          className="mb-8 flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-[#005F9E] transition-colors"
        >
          <motion.span animate={{ x: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>←</motion.span>
          {initialData ? "Back to Listings" : (step === 3 ? "Back to Categories" : "Back to Submission Types")}
        </button>
        {renderStepContent()}
      </div>
    </div>
  );
}
