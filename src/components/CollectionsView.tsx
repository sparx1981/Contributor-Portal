import React, { useState } from 'react';
import { Search, Folder, Plus, ChevronLeft, LayoutGrid, List, Filter, ChevronDown, MoreVertical, Trash2, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ThreeDContentView from './ThreeDContentView';

interface Collection {
  id: string;
  name: string;
  description: string;
  modelIds: string[];
}

interface CollectionsViewProps {
  collections: Collection[];
  models: any[];
  onCreateCollection: (name: string, description: string) => void;
  onDeleteCollection: (id: string) => void;
  onEditModel: (model: any) => void;
  onDeleteModel: (id: string) => void;
}

export default function CollectionsView({ collections, models, onCreateCollection, onDeleteCollection, onEditModel, onDeleteModel }: CollectionsViewProps) {
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState<Collection | null>(null);
  const [newCollection, setNewCollection] = useState({ name: '', description: '' });

  const selectedCollection = collections.find(c => c.id === selectedCollectionId);
  const collectionModels = selectedCollection ? models.filter(m => selectedCollection.modelIds.includes(m.id)) : [];

  const filteredCollections = collections.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCollection.name) {
      onCreateCollection(newCollection.name, newCollection.description);
      setNewCollection({ name: '', description: '' });
      setIsCreateModalOpen(false);
    }
  };

  if (selectedCollection) {
    return (
      <div className="space-y-6">
        <button 
          onClick={() => setSelectedCollectionId(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-trimble-blue transition-colors font-bold text-xs uppercase tracking-widest"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Collections
        </button>
        
        <div className="bg-white p-8 rounded-3xl border-2 border-slate-100 shadow-sm">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight mb-2">{selectedCollection.name}</h1>
          <p className="text-slate-500 font-medium">{selectedCollection.description}</p>
        </div>

        <ThreeDContentView 
          models={collectionModels}
          onEdit={onEditModel}
          onDelete={onDeleteModel}
          onUpload={() => {}} // Not really applicable in this filtered view
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6 border-b border-slate-200 pb-4 h-14">
        <div className="relative flex-1">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search collections"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-12 py-2 bg-transparent outline-none text-slate-600 font-medium placeholder:text-slate-400 border-b-2 border-transparent focus:border-trimble-blue transition-all"
          />
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-trimble-blue text-white rounded-lg text-xs font-bold hover:bg-trimble-blue-dark transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Collection
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCollections.map(collection => (
          <motion.div
            key={collection.id}
            whileHover={{ y: -4 }}
            className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:border-trimble-blue transition-all cursor-pointer flex flex-col h-[280px]"
            onClick={() => setSelectedCollectionId(collection.id)}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-16 h-16 bg-blue-50 text-trimble-blue rounded-2xl flex items-center justify-center group-hover:bg-trimble-blue group-hover:text-white transition-colors">
                <Folder className="w-8 h-8" />
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setCollectionToDelete(collection);
                }}
                className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 mb-2 truncate">{collection.name}</h3>
            <p className="text-sm text-slate-500 font-medium line-clamp-2 mb-6">{collection.description}</p>
            
            <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{collection.modelIds.length} Models</span>
              <div className="flex -space-x-2">
                {collection.modelIds.slice(0, 3).map((id, i) => (
                  <div 
                    key={id} 
                    className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white overflow-hidden"
                    style={{ zIndex: 3 - i }}
                  >
                    <div className="w-full h-full bg-slate-100" />
                  </div>
                ))}
                {collection.modelIds.length > 3 && (
                  <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-500" style={{ zIndex: 0 }}>
                    +{collection.modelIds.length - 3}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {filteredCollections.length === 0 && (
          <div className="col-span-full py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-300 mb-6">
              <Folder className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No collections found</h3>
            <p className="text-slate-500 max-w-sm">Create your first collection to start organizing your 3D assets.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {collectionToDelete && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCollectionToDelete(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-md rounded-[32px] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-8">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Delete Collection?</h3>
                <p className="text-slate-500 font-medium mb-8">
                  Are you sure you want to delete <span className="font-bold text-slate-700">"{collectionToDelete.name}"</span>? 
                  The models inside will not be deleted and will remain available in your models library.
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setCollectionToDelete(null)}
                    className="flex-1 py-4 font-bold text-slate-400 hover:bg-slate-50 rounded-2xl transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      onDeleteCollection(collectionToDelete.id);
                      setCollectionToDelete(null);
                    }}
                    className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-200"
                  >
                    Delete Folder
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-8">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-8">Create Collection</h3>
                <form onSubmit={handleCreate} className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Collection Name</label>
                    <input 
                      autoFocus
                      type="text" 
                      value={newCollection.name}
                      onChange={(e) => setNewCollection(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Summer 2024 Project Assets"
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-trimble-blue font-bold text-slate-700 transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Description</label>
                    <textarea 
                      rows={4}
                      value={newCollection.description}
                      onChange={(e) => setNewCollection(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="What is this collection for?"
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-trimble-blue font-medium text-slate-700 transition-all resize-none"
                    />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button 
                      type="button"
                      onClick={() => setIsCreateModalOpen(false)}
                      className="flex-1 py-3 font-bold text-slate-400 hover:bg-slate-50 rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      disabled={!newCollection.name}
                      type="submit"
                      className="flex-1 py-3 bg-trimble-blue text-white rounded-xl font-bold hover:bg-trimble-blue-dark transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
