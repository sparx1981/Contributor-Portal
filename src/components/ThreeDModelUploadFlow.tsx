import React, { useState } from 'react';
import { Info, ChevronRight, Check, Trash2, FileText, Globe, Video, User, CreditCard, ExternalLink, HelpCircle, Package, Edit3, X, ChevronLeft, Share2, Plus, Upload, AlertCircle, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ThreeDModelUploadFlowProps {
  onBack: () => void;
  onSave: (data: any) => void;
  onComplete: () => void;
  organizationName?: string;
  initialData?: any;
  isUpdate?: boolean;
}

const MAX_SKP_SIZE = 3 * 1024 * 1024 * 1024; // 3GB
const MAX_SKM_SIZE = 250 * 1024 * 1024; // 250MB

export default function ThreeDModelUploadFlow({ onBack, onComplete, organizationName = 'Trimble Inc', initialData, isUpdate, onSave }: ThreeDModelUploadFlowProps) {
  const [step, setStep] = useState(initialData?.id ? 1 : 0);
  const [activeCreateTab, setActiveCreateTab] = useState<'file' | 'details' | 'pricing'>('file');
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    uploadContext: 'Individual Account',
    category: 'None',
    subcategory: 'Requires a category to be selected',
    disableComments: false,
    productModel: false,
    file: null as File | null,
    fileType: 'SKP',
    version: initialData?.version || '1.0.0',
    releaseNotes: isUpdate ? '' : 'Initial release of the model content.',
    encryptionType: 'None',
    cudaEnabled: false,
    sketchupCompatibility: initialData?.sketchupCompatibility || ['SketchUp 2024'],
    osCompatibility: initialData?.osCompatibility || ['Windows', 'Mac OS X'],
    languages: initialData?.languages || ['English'],
    testingInstructions: initialData?.testingInstructions || 'Open the .skp file in SketchUp to preview the model geometry and materials.',
    promoVideo: initialData?.promoVideo || '',
    website: initialData?.website || 'https://trimble.com',
    keywords: initialData?.keywords || ['3d model', 'furniture', 'interior'],
    descriptionType: (initialData?.descriptionType as 'plain' | 'markdown') || 'plain',
    supportContact: initialData?.supportContact || 'support@trimble.com',
    icon: initialData?.icon || null,
    screenshots: initialData?.screenshots || [] as string[],
  });

  const categories = [
    'Furniture', 'Lighting', 'Appliances', 'Architecture', 'Landscaping', 'Transportation', 'People', 'Animals', '3D Design', 'Electronics', 'Sports'
  ].sort();

  const missingFields = [
    { label: 'Model Title', value: formData.title },
    { label: 'Category', value: formData.category !== 'None' ? 'filled' : '' },
    { label: 'Description', value: formData.description },
  ].filter(f => !f.value || (typeof f.value === 'string' && f.value.trim() === ''));

  const canSubmit = missingFields.length === 0;

  const handleFileSelection = (file: File) => {
    setError(null);
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (extension !== 'skp' && extension !== 'skm') {
      setError('Invalid file type. Please upload a .skp or .skm file.');
      return;
    }

    const maxSize = extension === 'skp' ? MAX_SKP_SIZE : MAX_SKM_SIZE;
    if (file.size > maxSize) {
      const sizeLimit = extension === 'skp' ? '3GB' : '250MB';
      setError(`File size too large. The limit for .${extension.toUpperCase()} files is ${sizeLimit}.`);
      return;
    }

    setFormData(prev => ({ 
      ...prev, 
      file, 
      fileType: extension.toUpperCase(),
      title: file.name.replace(/\.[^/.]+$/, "") 
    }));
  };

  const handleContinue = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      onSave({ 
        ...formData, 
        status: 'ready_to_publish', 
        type: 'model',
        categories: [formData.category]
      });
      onComplete();
    }
  };

  const getFileSizeDisplay = () => {
    if (!formData.file) return '---';
    const size = formData.file.size;
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const renderStep0 = () => (
    <div className="space-y-8 animate-in fade-in duration-500 slide-in-from-bottom-4">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors font-bold text-[10px] uppercase tracking-widest mb-2">
        <ChevronLeft className="w-3 h-3" /> Back to choices
      </button>
      <div>
        <h2 className="text-2xl font-bold text-[#005F9E]">{isUpdate ? 'Upload Model Update' : 'Upload Your Content'}</h2>
      </div>

      <div 
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file) handleFileSelection(file);
        }}
        className={`border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center transition-all group ${
          error ? 'border-red-200 bg-red-50/30' : 'border-slate-200 hover:border-[#005F9E] hover:bg-blue-50/30'
        }`}
      >
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all ${
          error ? 'bg-red-100 text-red-500' : 'bg-slate-50 text-slate-400 group-hover:scale-110 group-hover:text-[#005F9E]'
        }`}>
          <Upload className="w-8 h-8" />
        </div>
        
        {formData.file ? (
          <div className="space-y-2">
            <p className="text-lg font-bold text-slate-800">{formData.file.name}</p>
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs font-bold text-[#005F9E] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100 italic">
                Detected: {formData.fileType}
              </p>
              <p className="text-xs text-slate-400 font-medium">Size: {getFileSizeDisplay()}</p>
            </div>
            <button 
              onClick={() => {
                setFormData(prev => ({ ...prev, file: null, fileType: '' }));
                setError(null);
              }}
              className="text-xs font-bold text-red-500 mt-4 hover:underline flex items-center gap-1 mx-auto"
            >
              <Trash2 className="w-3 h-3" /> Remove and try another file
            </button>
          </div>
        ) : (
          <>
            <p className="text-lg font-bold text-slate-800 mb-2">Drag and drop your file here</p>
            <p className="text-sm text-slate-400 max-w-xs mb-8">
              Supported types: .skp (max 3GB), .skm (max 250MB)
            </p>
            {error && (
              <div className="mb-6 flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-xl text-xs font-bold border border-red-100">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            <input 
              type="file" 
              id="model-upload" 
              className="hidden" 
              onChange={(e) => e.target.files?.[0] && handleFileSelection(e.target.files[0])}
              accept=".skp,.skm"
            />
            <label 
              htmlFor="model-upload"
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
          disabled={!formData.file || !!error}
          className="bg-[#7fb3d5] text-white px-8 py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-8 animate-in fade-in duration-500 slide-in-from-right-4">
      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800">Edit Model Details</h2>
        <button onClick={onBack} className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

        <div className="space-y-8">
        {/* Model Info Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-800">Model Info</h3>
            <p className="text-xs text-slate-500">Help the world find your model.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-center h-48 relative overflow-hidden">
                {initialData?.previewUrl ? (
                  <img 
                    src={initialData.previewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-300">
                    <Package className="w-12 h-12" />
                    <span className="text-[10px] font-black uppercase tracking-widest">No Preview</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700">Title <span className="text-red-500">*</span></label>
                  <span className="text-[10px] font-bold text-slate-400">{formData.title.length}/100</span>
                </div>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value.slice(0, 100) }))}
                  placeholder="Enter model title"
                  className="w-full h-12 px-4 bg-white border border-slate-300 rounded-lg outline-none focus:border-trimble-blue text-sm text-slate-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full h-12 px-4 bg-white border border-slate-300 rounded-lg outline-none focus:border-trimble-blue text-sm text-slate-800"
                >
                  <option>None</option>
                  {categories.map(cat => <option key={cat}>{cat}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Subcategory</label>
                <select 
                  value={formData.subcategory}
                  disabled={formData.category === 'None'}
                  onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                  className="w-full h-12 px-4 bg-white border border-slate-300 rounded-lg outline-none focus:border-trimble-blue text-sm text-slate-800 disabled:bg-slate-50 disabled:text-slate-400"
                >
                  <option>Requires a category to be selected</option>
                  <option>General</option>
                  <option>Detailed</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 flex flex-col">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-700">Description</label>
                <span className="text-[10px] font-bold text-slate-400">{formData.description.length}/1000</span>
              </div>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value.slice(0, 1000) }))}
                placeholder="Describe your model..."
                className="flex-1 min-h-[220px] w-full px-4 py-3 bg-white border border-slate-300 rounded-lg outline-none focus:border-trimble-blue text-sm text-slate-800 resize-none"
              />
            </div>
          </div>
        </section>

        <div className="h-px bg-slate-100" />

        {/* Additional Attributes Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-800">Additional Attributes</h3>
            <p className="text-xs text-slate-500">Personalize your model page.</p>
          </div>

          <div className="flex gap-12">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                formData.disableComments ? 'bg-trimble-blue border-trimble-blue' : 'bg-white border-slate-300 group-hover:border-trimble-blue'
              }`}>
                {formData.disableComments && <Check className="w-3.5 h-3.5 text-white stroke-[4]" />}
              </div>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={formData.disableComments}
                onChange={(e) => setFormData(prev => ({ ...prev, disableComments: e.target.checked }))}
              />
              <span className="text-sm text-slate-600 font-medium">Disable Comments</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                formData.productModel ? 'bg-trimble-blue border-trimble-blue' : 'bg-white border-slate-300 group-hover:border-trimble-blue'
              }`}>
                {formData.productModel && <Check className="w-3.5 h-3.5 text-white stroke-[4]" />}
              </div>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={formData.productModel}
                onChange={(e) => setFormData(prev => ({ ...prev, productModel: e.target.checked }))}
              />
              <span className="text-sm text-slate-600 font-medium">Product Model</span>
            </label>
          </div>
        </section>
      </div>

      <div className="flex justify-between items-center pt-8 border-t border-slate-100">
        <div className="flex-1 max-w-xs space-y-2">
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 transition-all duration-700" 
              style={{ width: `${Math.min(100, (formData.title.length > 0 ? 30 : 0) + (formData.description.length > 0 ? 40 : 0) + (formData.category !== 'None' ? 30 : 0))}%` }} 
            />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Discoverability of Model</p>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => setStep(0)} 
            className="px-8 py-3 bg-[#F0F4F7] text-[#005F9E] rounded-lg font-bold text-sm hover:bg-slate-200 transition-all border border-[#DCE4EA]"
          >
            Back
          </button>
          <button 
            onClick={handleContinue}
            disabled={!formData.title}
            className="px-10 py-3 bg-[#005F9E] text-white rounded-lg font-bold text-sm hover:bg-[#004A7C] transition-all shadow-lg shadow-blue-900/10"
          >
            Publish Model
          </button>
        </div>
      </div>
    </div>
  );

  // For brevity and focus, I'll borrow the remaining UI structure from ExtensionUploadFlow
  // but tailored for models. 
  
  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-6xl mx-auto py-2 px-4 text-left">
        <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden text-left">
          {/* Progress Header */}
          <div className="bg-slate-50 border-b border-slate-100 px-12 py-6">
            <div className="flex justify-between items-center max-w-4xl mx-auto">
              {[
                { id: 0, label: 'Upload Content' },
                { id: 1, label: 'Details' },
                { id: 2, label: 'Review & Submit' }
              ].map((s) => (
                <div key={s.id} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                    step === s.id ? 'bg-trimble-blue text-white ring-4 ring-blue-100' : 
                    step > s.id ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-400'
                  }`}>
                    {step > s.id ? <Check className="w-4 h-4" /> : s.id + 1}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${
                    step === s.id ? 'text-slate-800' : 'text-slate-400'
                  }`}>{s.label}</span>
                  {s.id < 2 && <div className="w-12 h-px bg-slate-200 mx-2" />}
                </div>
              ))}
            </div>
          </div>

          <div className="p-12">
            {step === 0 && renderStep0()}
            {step === 1 && renderStep1()}
            
            {step === 2 && (
              <div className="space-y-8 animate-in fade-in duration-500 slide-in-from-right-4">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                  <div className="lg:col-span-2 bg-slate-50 rounded-[32px] p-8 border border-slate-100 h-full">
                    <div className="flex flex-col md:flex-row lg:flex-col xl:flex-row gap-8">
                      <div className="w-full md:w-48 lg:w-full xl:w-48 aspect-square bg-white border border-slate-200 rounded-2xl flex items-center justify-center p-4 shadow-sm overflow-hidden shrink-0">
                        {initialData?.previewUrl ? (
                          <img 
                            src={initialData.previewUrl} 
                            alt="Preview" 
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Package className="w-12 h-12 text-slate-200" />
                        )}
                      </div>
                      <div className="flex-1 space-y-6">
                        <div className="space-y-2">
                          <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-none">{formData.title}</h3>
                          <p className="text-sm text-slate-500 line-clamp-4 leading-relaxed font-medium">{formData.description || 'No description provided.'}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-2">
                          <span className="text-[10px] font-black bg-blue-50 text-trimble-blue border border-blue-100 px-3 py-1 rounded-full uppercase tracking-widest">
                             {formData.category === 'None' ? 'Uncategorized' : formData.category}
                          </span>
                          <span className="text-[10px] font-black bg-slate-100 text-slate-400 border border-slate-200 px-3 py-1 rounded-full uppercase tracking-widest">
                             {formData.fileType} Model
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-3 h-full flex flex-col gap-6">
                    <div className="p-8 bg-blue-50/50 border border-blue-100 rounded-[32px] flex flex-col gap-6 flex-1">
                       <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-trimble-blue shadow-sm border border-blue-100">
                          <Building2 className="w-8 h-8" />
                       </div>
                       <div className="space-y-3">
                          <p className="text-[10px] font-black text-trimble-blue uppercase tracking-widest">Upload Profile & Target</p>
                          <h4 className="text-lg font-black text-slate-800 tracking-tight">Uploading To: {organizationName}</h4>
                          <p className="text-sm text-slate-600 leading-relaxed font-bold">
                            This content is intended for the <span className="text-slate-900">{organizationName}</span> organization you are currently working in.
                          </p>
                          <p className="text-xs text-slate-400 leading-relaxed font-medium">
                            Once submitted, your content will undergo automated geometry validation and texture optimization before appearing in search results.
                          </p>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-8">
                  <button onClick={() => setStep(1)} className="text-xs font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-all">Back to details</button>
                  <button 
                    onClick={handleContinue}
                    className="bg-trimble-blue text-white px-12 py-4 rounded-xl font-black text-xs hover:bg-trimble-blue-dark transition-all uppercase tracking-widest shadow-xl shadow-blue-200"
                  >
                    Submit Content
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
