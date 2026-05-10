import React, { useState, useMemo } from 'react';
import { Search, Grid, List, Plus, Filter, LayoutGrid, Download, Edit3, Trash2, FileText, Activity, ChevronDown, Check, User, Share2, MoreVertical, Maximize2, FolderPlus, Lock, Unlock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ThreeDModel {
  id: string;
  extensionId: string;
  accountId: string;
  title: string;
  status: string;
  type: 'model';
  previewUrl?: string;
  fileSize: string;
  downloads: string;
  author: {
    name: string;
    logoUrl?: string;
  };
  productTag?: boolean;
}

interface ThreeDContentViewProps {
  models: ThreeDModel[];
  collections?: any[];
  onEdit?: (model: ThreeDModel) => void;
  onDelete?: (id: string) => void;
  onUpload?: () => void;
  onAddToCollection?: (collectionId: string, modelIds: string[]) => void;
  onCreateCollection?: (name: string, description: string) => void;
}

export default function ThreeDContentView({ models, collections = [], onEdit, onDelete, onUpload, onAddToCollection, onCreateCollection }: ThreeDContentViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Date Created');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [modelToDelete, setModelToDelete] = useState<string | null>(null);
  const [isAddToCollectionOpen, setIsAddToCollectionOpen] = useState(false);
  const [isNewCollectionOpen, setIsNewCollectionOpen] = useState(false);
  const [newCollectionData, setNewCollectionData] = useState({ name: '', description: '' });

  const [previewingModel, setPreviewingModel] = useState<ThreeDModel | null>(null);

  const sortOptions = ['Date Created', 'Date Modified', 'Popularity', 'Likes', 'Title'];

  const filteredModels = useMemo(() => {
    return models.filter(m => 
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.author.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [models, searchTerm]);

  const toggleSelection = (id: string) => {
    setSelectedModels(prev => 
      prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
    );
  };
  
  const handleAddToCollection = (collectionId: string) => {
    onAddToCollection?.(collectionId, selectedModels);
    setIsAddToCollectionOpen(false);
    setSelectedModels([]);
  };

  const handleCreateAndAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCollectionData.name) {
      onCreateCollection?.(newCollectionData.name, newCollectionData.description);
      setIsNewCollectionOpen(false);
      setIsAddToCollectionOpen(false);
      setNewCollectionData({ name: '', description: '' });
      setSelectedModels([]);
    }
  };

  const handleDeleteClick = (id: string) => {
    setModelToDelete(id);
  };

  const confirmDelete = () => {
    if (modelToDelete) {
      onDelete?.(modelToDelete);
      setModelToDelete(null);
    }
  };

  const selectAll = () => {
    if (selectedModels.length === filteredModels.length) {
      setSelectedModels([]);
    } else {
      setSelectedModels(filteredModels.map(m => m.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Detail Preview Modal */}
      <AnimatePresence>
        {previewingModel && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewingModel(null)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative bg-white w-full max-w-6xl h-[85vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="absolute top-6 right-6 z-10">
                <button 
                  onClick={() => setPreviewingModel(null)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-1 overflow-hidden">
                {/* Left Column: Preview */}
                <div className="flex-[2] bg-slate-50 flex items-center justify-center p-12 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-50" />
                  {previewingModel.previewUrl ? (
                    <img 
                      src={previewingModel.previewUrl} 
                      alt={previewingModel.title}
                      className="max-w-full max-h-full object-contain relative z-10 drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-4 text-slate-200 relative z-10">
                      <div className="w-48 h-48 bg-slate-100 rounded-3xl flex items-center justify-center border border-slate-200">
                        <Box className="w-24 h-24" />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Geometry preview missing</p>
                    </div>
                  )}
                  
                  <div className="absolute bottom-8 left-8 flex items-center gap-4 z-10">
                    <div className="px-4 py-2 bg-white/80 backdrop-blur shadow-sm border border-white rounded-xl flex items-center gap-2">
                       <Maximize2 className="w-4 h-4 text-slate-400" />
                       <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">3D Orbit Enabled</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Data */}
                <div className="flex-1 border-l border-slate-100 flex flex-col bg-white">
                   <div className="p-8 border-b border-slate-50">
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="text-[9px] font-black px-2 py-0.5 bg-blue-50 text-trimble-blue rounded border border-blue-100 uppercase tracking-tight">3D Model</span>
                        {previewingModel.productTag && <span className="text-[9px] font-black px-2 py-0.5 bg-green-50 text-green-700 rounded border border-green-100 uppercase tracking-tight">Certified Product</span>}
                      </div>
                      <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">{previewingModel.title}</h2>
                      <div className="flex items-center gap-2 mt-4">
                        <div className="w-6 h-6 bg-slate-100 rounded-full overflow-hidden">
                           {previewingModel.author.logoUrl ? (
                             <img src={previewingModel.author.logoUrl} className="w-full h-full object-cover" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-400">{previewingModel.author.name[0]}</div>
                           )}
                        </div>
                        <span className="text-xs font-bold text-slate-500">by {previewingModel.author.name}</span>
                      </div>
                   </div>

                   <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                      <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Properties</h3>
                        <div className="grid grid-cols-2 gap-y-6">
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 mb-1">File Size</p>
                              <p className="text-sm font-black text-slate-700">{previewingModel.fileSize}</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 mb-1">Downloads</p>
                              <p className="text-sm font-black text-slate-700">{previewingModel.downloads}</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 mb-1">Status</p>
                              <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter ${
                                previewingModel.status === 'live' || previewingModel.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                              }`}>
                                {previewingModel.status}
                              </span>
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 mb-1">ID</p>
                              <p className="text-[10px] font-mono text-slate-400 truncate">{previewingModel.id}</p>
                           </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Description</h3>
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">
                          No extended description available for this content. Information is pulled from the SketchUp file metadata during the indexing process.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                           {['Architecture', 'Standard', 'Low-Poly'].map(tag => (
                             <span key={tag} className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100 italic">#{tag}</span>
                           ))}
                        </div>
                      </div>
                   </div>

                   <div className="p-8 bg-slate-50 border-t border-slate-100 mt-auto">
                      <div className="flex gap-3">
                         <button 
                           onClick={() => {
                             onEdit?.(previewingModel);
                             setPreviewingModel(null);
                           }}
                           className="flex-1 bg-white border border-slate-200 text-slate-700 py-3 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                         >
                           <Edit3 className="w-4 h-4" />
                           Edit Details
                         </button>
                         <button className="flex-1 bg-trimble-blue text-white py-3 rounded-xl text-xs font-bold hover:bg-trimble-blue-dark transition-all shadow-lg shadow-trimble-blue/20 flex items-center justify-center gap-2">
                           <Download className="w-4 h-4" />
                           Download
                         </button>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header / Search Area */}
      <div className="flex items-center gap-6 border-b border-slate-200 pb-4 h-14">
        <AnimatePresence mode="wait">
          {selectedModels.length > 0 ? (
            <motion.div 
              key="selection-bar"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex items-center justify-between bg-slate-50 -mx-4 px-4 py-2 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div 
                  onClick={selectAll}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all ${
                    selectedModels.length === filteredModels.length ? 'bg-trimble-blue border-trimble-blue' : 'bg-white border-slate-300'
                  }`}
                >
                  {selectedModels.length === filteredModels.length && <Check className="w-3 h-3 text-white" strokeWidth={4} />}
                </div>
                <span className="text-sm font-bold text-slate-700">{selectedModels.length} {selectedModels.length === 1 ? 'Item' : 'Items'} selected</span>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 pr-6 border-r border-slate-200">
                  <button 
                    onClick={() => setIsAddToCollectionOpen(true)}
                    className="p-2 text-slate-500 hover:text-trimble-blue transition-colors rounded-lg hover:bg-white shadow-sm" title="Add To Collection"
                  >
                    <FolderPlus className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-slate-500 hover:text-trimble-blue transition-colors rounded-lg hover:bg-white shadow-sm" title="Set to Private">
                    <Lock className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-slate-500 hover:text-trimble-blue transition-colors rounded-lg hover:bg-white shadow-sm" title="Set To Public">
                    <Unlock className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => {
                      if (selectedModels.length > 1) {
                        if (confirm(`Are you sure you want to delete ${selectedModels.length} models?`)) {
                          selectedModels.forEach(id => onDelete?.(id));
                          setSelectedModels([]);
                        }
                      } else {
                        setModelToDelete(selectedModels[0]);
                      }
                    }}
                    className="p-2 text-slate-500 hover:text-red-500 transition-colors rounded-lg hover:bg-white shadow-sm" title="Delete Items"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <button 
                  onClick={() => setSelectedModels([])}
                  className="bg-trimble-blue text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-trimble-blue-dark transition-all"
                >
                  Done
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="search-bar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex-1 flex items-center gap-6"
            >
              <div className="relative flex-1">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search models"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-12 py-2 bg-transparent outline-none text-slate-600 font-medium placeholder:text-slate-400 border-b-2 border-transparent focus:border-trimble-blue transition-all"
                />
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <h2 className="text-sm font-bold text-slate-800 whitespace-nowrap">{filteredModels.length} Models</h2>
                <button className="text-slate-600 hover:text-slate-800 transition-colors">
                  <Filter className="w-4 h-4 text-slate-400" />
                </button>
                
                <div className="relative">
                  <button 
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:border-slate-300 transition-all whitespace-nowrap"
                  >
                    {sortBy}
                    <ChevronDown className={`w-3 h-3 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {isSortOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-20 overflow-hidden"
                        >
                          {sortOptions.map(option => (
                            <button
                              key={option}
                              onClick={() => {
                                setSortBy(option);
                                setIsSortOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors ${
                                sortBy === option ? 'bg-blue-50 text-trimble-blue' : 'text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center bg-slate-100 p-1 rounded-lg">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400'}`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Grid Content */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredModels.map((model) => (
              <ModelCard 
                key={model.id} 
                model={model} 
                isSelected={selectedModels.includes(model.id)}
                onToggleSelect={() => toggleSelection(model.id)}
                onEdit={() => onEdit?.(model)}
                onDelete={() => handleDeleteClick(model.id)}
                onPreview={() => setPreviewingModel(model)}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 w-12">
                  <div 
                    onClick={selectAll}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all ${
                      selectedModels.length === filteredModels.length && filteredModels.length > 0 ? 'bg-trimble-blue border-trimble-blue' : 'bg-white border-slate-300'
                    }`}
                  >
                    {selectedModels.length === filteredModels.length && filteredModels.length > 0 && <Check className="w-3 h-3 text-white" strokeWidth={4} />}
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Model Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Size</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Downloads</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredModels.map(model => (
                <tr key={model.id} className="hover:bg-slate-50/50 group">
                  <td className="px-6 py-4">
                     <div 
                        onClick={() => toggleSelection(model.id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all ${
                          selectedModels.includes(model.id) ? 'bg-trimble-blue border-trimble-blue' : 'bg-white border-slate-300'
                        }`}
                      >
                        {selectedModels.includes(model.id) && <Check className="w-3 h-3 text-white" strokeWidth={4} />}
                      </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                        {model.previewUrl ? (
                          <img src={model.previewUrl} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <Box className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <span className="font-bold text-slate-800">{model.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-medium text-slate-600">{model.fileSize}</td>
                  <td className="px-6 py-4 text-center text-sm font-medium text-slate-600">{model.downloads}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => onEdit?.(model)} className="p-2 text-slate-400 hover:text-trimble-blue transition-colors">
                         <Edit3 className="w-4 h-4" />
                       </button>
                       <button onClick={() => handleDeleteClick(model.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {modelToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModelToDelete(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl relative z-10 p-8 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Delete 3D Model?</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-8">
                This action cannot be undone. All versions and data associated with this model will be permanently removed.
              </p>
              <div className="w-full space-y-3">
                <button 
                  onClick={confirmDelete}
                  className="w-full py-4 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
                >
                  Yes, delete this model
                </button>
                <button 
                  onClick={() => setModelToDelete(null)}
                  className="w-full py-4 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all font-bold"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add To Collection Modal */}
      <AnimatePresence>
        {isAddToCollectionOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddToCollectionOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Add to Collection</h3>
                <button onClick={() => setIsAddToCollectionOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 overflow-y-auto flex-1">
                <div className="space-y-1 mb-4">
                  <button 
                    onClick={() => setIsNewCollectionOpen(true)}
                    className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 hover:border-trimble-blue hover:text-trimble-blue hover:bg-blue-50 transition-all font-bold text-sm"
                  >
                    <Plus className="w-5 h-5" />
                    Create New Collection
                  </button>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 mb-2">My Collections</p>
                  {collections.map(collection => (
                    <button
                      key={collection.id}
                      onClick={() => handleAddToCollection(collection.id)}
                      className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-slate-50 transition-all group text-left"
                    >
                      <div className="w-10 h-10 bg-blue-50 text-trimble-blue rounded-lg flex items-center justify-center group-hover:bg-trimble-blue group-hover:text-white transition-colors">
                        <FolderPlus className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-700 text-sm">{collection.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{collection.modelIds.length} models</p>
                      </div>
                    </button>
                  ))}
                  {collections.length === 0 && (
                    <p className="text-sm text-slate-400 text-center py-8">No collections created yet.</p>
                  )}
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                 <p className="text-xs text-slate-500 font-medium">{selectedModels.length} items will be added</p>
                 <button 
                  onClick={() => setIsAddToCollectionOpen(false)}
                  className="px-6 py-2 text-sm font-bold text-slate-600 hover:bg-white rounded-lg transition-all"
                 >
                   Cancel
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* New Collection Sub-Modal */}
      <AnimatePresence>
        {isNewCollectionOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewCollectionOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl relative z-20 p-8"
            >
              <h4 className="text-xl font-black text-slate-800 tracking-tight mb-6">New Collection</h4>
              <form onSubmit={handleCreateAndAdd} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Name</label>
                  <input 
                    autoFocus
                    type="text" 
                    value={newCollectionData.name}
                    onChange={(e) => setNewCollectionData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Living Room Project"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-trimble-blue text-sm font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Description</label>
                  <textarea 
                    rows={3}
                    value={newCollectionData.description}
                    onChange={(e) => setNewCollectionData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Collection details..."
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-trimble-blue text-sm resize-none"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsNewCollectionOpen(false)}
                    className="flex-1 py-3 text-sm font-bold text-slate-400 hover:bg-slate-50 rounded-xl transition-all"
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    disabled={!newCollectionData.name}
                    className="flex-1 py-3 bg-trimble-blue text-white rounded-xl font-bold text-sm hover:bg-trimble-blue-dark transition-all shadow-lg disabled:opacity-50"
                  >
                    Create & Add
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ModelCard({ model, isSelected, onToggleSelect, onEdit, onDelete, onPreview }: { 
  key?: React.Key;
  model: ThreeDModel; 
  isSelected: boolean;
  onToggleSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onPreview: () => void;
}) {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div 
      layout
      className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col"
    >
      {/* Preview Image */}
      <div className="relative aspect-square bg-slate-50 overflow-hidden border-b border-slate-100">
        {model.previewUrl && !imageError ? (
          <img 
            src={model.previewUrl} 
            alt={model.title} 
            onError={() => setImageError(true)}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-300 p-8 text-center">
            <Box className="w-16 h-16 mb-2 opacity-20" />
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-4">Preview not available</p>
          </div>
        )}
        
        {model.productTag && (
          <div className="absolute bottom-4 right-4 bg-[#005F9E] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-sm">
            Product
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-slate-800 text-sm mb-2 line-clamp-1">{model.title}</h3>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px]">
            <FileText className="w-3.5 h-3.5" />
            {model.fileSize}
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px]">
            <Activity className="w-3.5 h-3.5 rotate-90" />
            {model.downloads}
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between font-bold">
          <div 
            onClick={onToggleSelect}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all ${
              isSelected ? 'bg-trimble-blue border-trimble-blue' : 'bg-white border-slate-200 group-hover:border-slate-300'
            }`}
          >
            {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={4} />}
          </div>
          <div className="flex items-center gap-0.5">
            <button 
              onClick={onPreview}
              className="p-1 text-slate-400 hover:text-trimble-blue transition-colors border border-transparent rounded-md hover:border-slate-100"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button className="p-1 text-slate-400 hover:text-trimble-blue transition-colors border border-transparent rounded-md hover:border-slate-100">
              <Download className="w-4 h-4" />
            </button>
            <button onClick={onEdit} className="p-1 text-slate-400 hover:text-trimble-blue transition-colors border border-transparent rounded-md hover:border-slate-100">
              <Edit3 className="w-4 h-4" />
            </button>
            <button onClick={onDelete} className="p-1 text-slate-400 hover:text-red-500 transition-colors border border-transparent rounded-md hover:border-slate-100">
              <Trash2 className="w-4 h-4 font-bold" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Box(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    >
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
      <path d="m3.3 7 8.7 5 8.7-5"/>
      <path d="M12 22V12"/>
    </svg>
  );
}
