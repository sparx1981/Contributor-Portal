/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAuth } from './lib/AuthContext';
import Login from './components/Login';
import Layout from './components/Layout';
import DashboardOverview from './components/DashboardOverview';
import ListingsView, { initialListings } from './components/ListingsView';
import VendorOnboarding from './components/VendorOnboarding';
import ExtensionUploadFlow from './components/ExtensionUploadFlow';
import ThreeDModelUploadFlow from './components/ThreeDModelUploadFlow';
import ThreeDContentView from './components/ThreeDContentView';
import CollectionsView from './components/CollectionsView';
import { Users, Box, Plus, UserPlus, Shield, User, BarChart as Analyst, CheckCircle2, Puzzle, ArrowRight, AlertTriangle, Clock, Package, DollarSign, Trash2 } from 'lucide-react';

export interface Activity {
  id: string;
  accountId: string;
  type: 'submission' | 'publish' | 'delete' | 'member' | 'update' | 'draft' | 'approval' | 'sales' | 'account' | 'review';
  text: string;
  time: string;
  icon: 'Package' | 'Clock' | 'DollarSign' | 'Users' | 'Trash2';
  color: string;
}

export default function App() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeAccount, setActiveAccount] = useState({ id: 'personal', name: 'Individual Account', type: 'Personal' });
  const [isUploadingExtension, setIsUploadingExtension] = useState(false);
  const [editingListing, setEditingListing] = useState<any>(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [listings, setListings] = useState(initialListings);
  
  // Activity state
  const [activities, setActivities] = useState<Activity[]>([
    { id: '1', accountId: 'org1', type: 'submission', text: 'FloorPlan Pro v1.2.0 submitted', time: '2 hours ago', icon: 'Package', color: 'bg-blue-100 text-blue-600' },
    { id: '2', accountId: 'personal', type: 'review', text: 'RenderBot approved with conditions', time: '5 hours ago', icon: 'Clock', color: 'bg-amber-100 text-amber-600' },
    { id: '3', accountId: 'org2', type: 'sales', text: 'New Perpetual License: SuiteTools', time: '8 hours ago', icon: 'DollarSign', color: 'bg-green-100 text-green-600' },
    { id: '4', accountId: 'personal', type: 'account', text: 'Team member added: Maria S.', time: '1 day ago', icon: 'Users', color: 'bg-purple-100 text-purple-600' },
  ]);

  const addActivity = (activity: Omit<Activity, 'id' | 'time' | 'accountId'>, accountId?: string) => {
    const newActivity: Activity = {
      ...activity,
      id: Date.now().toString(),
      accountId: accountId || activeAccount.id,
      time: 'Just now'
    };
    setActivities(prev => [newActivity, ...prev].slice(0, 50));
  };
  
  // Collections state
  const [collections, setCollections] = useState<any[]>([
    { id: 'col-1', accountId: 'personal', name: 'Living Room Essentials', description: 'Premium lamps and furniture for modern living spaces.', modelIds: ['ext-8-1', 'ext-1-1', 'ext-2-1'] },
    { id: 'col-2', accountId: 'personal', name: 'Outdoor Lighting', description: 'Weather-resistant lighting solutions.', modelIds: ['ext-5-1', 'ext-6-1'] },
  ]);
  
  // Mock team state
  const [teamMembers, setTeamMembers] = useState([
    { id: '1', name: 'Jordan Lee', email: 'jordan.lee@buildsoft.com', role: 'Admin' },
    { id: '2', name: 'Maria Santos', email: 'm.santos@buildsoft.com', role: 'Member' },
  ]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Member');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin text-trimble-blue">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberEmail) return;
    setTeamMembers([...teamMembers, { 
      id: Date.now().toString(), 
      name: newMemberEmail.split('@')[0], 
      email: newMemberEmail, 
      role: newMemberRole 
    }]);
    addActivity({
      type: 'member',
      text: `Team member invited: ${newMemberEmail.split('@')[0]}`,
      icon: 'Users',
      color: 'bg-purple-100 text-purple-600'
    });
    setNewMemberEmail('');
  };

  const handleSaveListing = (data: any) => {
    const today = new Date().toISOString().split('T')[0];
    const contentType = data.type || (editingListing?.type) || 'extension';
    const isDraft = data.status === 'draft';
    
    setListings(prev => {
      if (isUpdateMode && editingListing) {
        // Creating a new version for an existing extension/model
        addActivity({
          type: isDraft ? 'draft' : 'submission',
          text: `${contentType === 'model' ? 'Model' : 'Extension'} update: ${data.title} v${data.version} ${isDraft ? 'saved as draft' : 'submitted'}`,
          icon: 'Package',
          color: isDraft ? 'bg-slate-100 text-slate-600' : 'bg-blue-100 text-blue-600'
        });
        const newVersion = {
          id: `ext-${editingListing.extensionId}-${data.version}-${Date.now()}`,
          extensionId: editingListing.extensionId,
          accountId: activeAccount.id,
          title: data.title,
          status: data.status || 'draft',
          platform: data.fileType === 'RBZ' ? 'SketchUp' : (data.fileType === 'SKP' ? 'SketchUp' : 'Tekla'),
          product: editingListing.product || (data.fileType === 'SKP' ? 'SketchUp Desktop' : 'SketchUp Desktop'),
          type: contentType,
          version: data.version,
          pricing: editingListing.pricing || 'Free',
          fileSize: '0 KB', // Default for now
          downloads: 0,
          std: 0,
          updatedAt: today,
          isPromoted: editingListing.isPromoted || false,
          author: editingListing.author || { name: activeAccount.name },
          previewUrl: editingListing.previewUrl,
          productTag: editingListing.productTag
        };
        return [newVersion, ...prev];
      } else if (editingListing && editingListing.id) {
        // Updating an existing version
        addActivity({
          type: 'update',
          text: `Listing updated: ${data.title}`,
          icon: 'Package',
          color: 'bg-blue-100 text-blue-600'
        });
        return prev.map(item => item.id === editingListing.id ? {
          ...item,
          title: data.title,
          version: data.version,
          status: data.status || item.status,
          updatedAt: today
        } : item);
      } else {
        // Creating a brand new extension or model
        addActivity({
          type: isDraft ? 'draft' : 'publish',
          text: `New ${contentType === 'model' ? 'model' : 'extension'} ${isDraft ? 'draft created' : 'published'}: ${data.title}`,
          icon: 'Package',
          color: isDraft ? 'bg-slate-100 text-slate-600' : 'bg-green-100 text-green-600'
        });
        const newExtId = `ext-${Date.now()}`;
        const newListing = {
          id: `${newExtId}-1`,
          extensionId: newExtId,
          accountId: activeAccount.id,
          title: data.title,
          status: data.status || 'draft',
          platform: (data.fileType === 'RBZ' || data.fileType === 'SKP') ? 'SketchUp' : 'Tekla',
          product: data.fileType === 'SKP' ? 'SketchUp Desktop' : (data.fileType === 'RBZ' ? 'SketchUp Desktop' : 'Tekla Structures'),
          type: contentType,
          version: data.version,
          pricing: 'Free',
          fileSize: '0 KB',
          downloads: 0,
          std: 0,
          updatedAt: today,
          isPromoted: false,
          author: { name: activeAccount.name }
        };
        return [newListing, ...prev];
      }
    });

    setIsUploadingExtension(false);
    setEditingListing(null);
    setIsUpdateMode(false);
    setActiveTab(contentType === 'model' ? '3d-content-models' : 'listings');
  };

  const renderContent = () => {
    const accountListings = listings.filter(l => l.accountId === activeAccount.id);

    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview activeAccount={activeAccount} activities={activities.filter(a => a.accountId === activeAccount.id)} />;
      case 'listings':
        return <ListingsView 
          listings={accountListings.filter(l => l.type === 'extension')}
          setListings={setListings}
          onEdit={(listing) => {
            setEditingListing(listing);
            setActiveTab('submit');
            setIsUploadingExtension(true);
            setIsUpdateMode(false);
          }} 
          onCreateUpdate={(listing: any) => {
            setEditingListing(listing);
            setActiveTab('submit');
            setIsUploadingExtension(true);
            setIsUpdateMode(true);
          }}
          onDelete={(id) => {
            const listing = listings.find(l => l.id === id);
            if (listing) {
              addActivity({
                type: 'delete',
                text: `${listing.type === 'model' ? 'Model' : 'Extension'} deleted: ${listing.title}`,
                icon: 'Trash2',
                color: 'bg-red-100 text-red-600'
              });
            }
            setListings(prev => prev.filter(l => l.id !== id));
          }}
          addActivity={addActivity}
        />;
      case '3d-content-models': {
        const modelListings = accountListings.filter(l => l.type === 'model');
        const accountCollections = collections.filter(c => c.accountId === activeAccount.id);
        return <ThreeDContentView 
          models={modelListings}
          collections={accountCollections}
          onEdit={(model: any) => {
            setEditingListing(model);
            setActiveTab('submit');
            setIsUploadingExtension(true);
            setIsUpdateMode(false);
          }}
          onDelete={(id) => {
            const model = listings.find(l => l.id === id);
            if (model) {
              addActivity({
                type: 'delete',
                text: `3D Model deleted: ${model.title}`,
                icon: 'Trash2',
                color: 'bg-red-100 text-red-600'
              });
            }
            setListings(prev => prev.filter(l => l.id !== id));
          }}
          onUpload={() => {
            setActiveTab('submit');
          }}
          onAddToCollection={(colId, modelIds) => {
            const collection = collections.find(c => c.id === colId);
            if (collection) {
              addActivity({
                type: 'update',
                text: `${modelIds.length} models added to collection: ${collection.name}`,
                icon: 'Package',
                color: 'bg-blue-100 text-blue-600'
              });
            }
            setCollections(prev => prev.map(c => 
              c.id === colId ? { ...c, modelIds: Array.from(new Set([...c.modelIds, ...modelIds])) } : c
            ));
          }}
          onCreateCollection={(name, description) => {
            addActivity({
              type: 'publish',
              text: `New collection created: ${name}`,
              icon: 'Package',
              color: 'bg-green-100 text-green-600'
            });
            const newCol = { id: `col-${Date.now()}`, accountId: activeAccount.id, name, description, modelIds: [] };
            setCollections(prev => [...prev, newCol]);
          }}
        />;
      }
      case '3d-content-collections': {
        const modelListings = accountListings.filter(l => l.type === 'model');
        const accountCollections = collections.filter(c => c.accountId === activeAccount.id);
        return <CollectionsView 
          models={modelListings}
          collections={accountCollections}
          onCreateCollection={(name, description) => {
            addActivity({
              type: 'publish',
              text: `New collection created: ${name}`,
              icon: 'Package',
              color: 'bg-green-100 text-green-600'
            });
            const newCol = { id: `col-${Date.now()}`, accountId: activeAccount.id, name, description, modelIds: [] };
            setCollections(prev => [...prev, newCol]);
          }}
          onDeleteCollection={(id) => {
            const collection = collections.find(c => c.id === id);
            if (collection) {
              addActivity({
                type: 'delete',
                text: `Collection deleted: ${collection.name}`,
                icon: 'Trash2',
                color: 'bg-red-100 text-red-600'
              });
            }
            setCollections(prev => prev.filter(c => c.id !== id));
          }}
          onEditModel={(model: any) => {
            setEditingListing(model);
            setActiveTab('submit');
            setIsUploadingExtension(true);
            setIsUpdateMode(false);
          }}
          onDeleteModel={(id) => {
            const model = listings.find(l => l.id === id);
            if (model) {
              addActivity({
                type: 'delete',
                text: `3D Model deleted: ${model.title}`,
                icon: 'Trash2',
                color: 'bg-red-100 text-red-600'
              });
            }
            setListings(prev => prev.filter(l => l.id !== id));
          }}
        />;
      }
      case 'vendor-onboarding':
        return <VendorOnboarding />;
      case 'submit':
        if (isUploadingExtension) {
          if (editingListing?.type === 'model') {
            return (
              <ThreeDModelUploadFlow 
                onBack={() => {
                  setIsUploadingExtension(false);
                  setEditingListing(null);
                  setIsUpdateMode(false);
                }} 
                organizationName={activeAccount.name}
                initialData={editingListing}
                isUpdate={isUpdateMode}
                onSave={handleSaveListing}
                onComplete={() => {
                  setIsUploadingExtension(false);
                  setEditingListing(null);
                  setIsUpdateMode(false);
                  setActiveTab('3d-content-models');
                }} 
              />
            );
          }
          return (
            <ExtensionUploadFlow 
              onBack={() => {
                setIsUploadingExtension(false);
                setEditingListing(null);
                setIsUpdateMode(false);
              }} 
              organizationName={activeAccount.name}
              initialData={editingListing}
              isUpdate={isUpdateMode}
              onSave={handleSaveListing}
              onComplete={() => {
                setIsUploadingExtension(false);
                setEditingListing(null);
                setIsUpdateMode(false);
                setActiveTab('listings');
              }} 
            />
          );
        }
        return (
          <div className="space-y-12 max-w-7xl mx-auto py-8">
            <div className="text-center">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-4">Submit Content</h2>
              <p className="text-slate-500 font-medium">Select the type of content you wish to distribute through our Global Marketplaces.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <button 
                onClick={() => {
                  setIsUploadingExtension(true);
                  setEditingListing({ type: 'model' });
                }}
                className="flex flex-col items-center text-center p-12 bg-white rounded-3xl border-2 border-slate-100 hover:border-trimble-blue group transition-all hover:shadow-2xl hover:-translate-y-1"
              >
                <div className="p-6 bg-blue-50 text-trimble-blue rounded-2xl mb-6 group-hover:bg-trimble-blue group-hover:text-white transition-colors">
                  <Box className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">3D Model Content</h3>
                <p className="text-sm text-slate-500 leading-relaxed">Publish SketchUp models, components, and premium collections to the 3D Warehouse.</p>
                <div className="mt-8 flex items-center gap-2 text-trimble-blue font-bold text-sm">
                  Upload Content <ArrowRight className="w-4 h-4" />
                </div>
              </button>

              <button 
                onClick={() => {
                  setIsUploadingExtension(true);
                  setEditingListing(null);
                }}
                className="flex flex-col items-center text-center p-12 bg-white rounded-3xl border-2 border-slate-100 hover:border-trimble-blue group transition-all hover:shadow-2xl hover:-translate-y-1"
              >
                <div className="p-6 bg-purple-50 text-purple-600 rounded-2xl mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Puzzle className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Extension</h3>
                <p className="text-sm text-slate-500 leading-relaxed">Distribute Ruby extensions, plugins, and custom toolsets through the Extension Warehouse.</p>
                <div className="mt-8 flex items-center gap-2 text-purple-600 font-bold text-sm">
                  Upload Content <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>

            <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl flex items-start gap-4">
              <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-amber-900">Current Distribution Context: <span className="font-black underline">{activeAccount.name}</span></p>
                <p className="text-xs text-amber-700 mt-1 font-medium leading-relaxed">
                  You are currently uploading content to your <strong>{activeAccount.type}</strong> account. Please note that commercial sales and monetization are strictly limited to <strong>Organisation</strong> accounts. To sell content, ensure you have switched to an organization account in the account switcher.
                </p>
              </div>
            </div>
          </div>
        );
      case 'team':
        return (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
               <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                 <UserPlus className="w-5 h-5 text-trimble-blue" />
                 Add New Team Member
                 <span className="text-[10px] font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded ml-2 uppercase">Admin Rights</span>
               </h3>
               <form onSubmit={handleAddMember} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                 <div className="space-y-1">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                   <input 
                    type="email" 
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    placeholder="colleague@company.com" 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-trimble-blue text-sm" 
                   />
                 </div>
                 <div className="space-y-1">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Assigned Role</label>
                   <select 
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-trimble-blue text-sm font-bold text-slate-600 appearance-none bg-no-repeat bg-[right_12px_center] cursor-pointer"
                   >
                     <option value="Admin">Admin</option>
                     <option value="Member">Member</option>
                     <option value="Analyst">Analyst</option>
                   </select>
                 </div>
                 <button type="submit" className="bg-trimble-blue text-white px-6 py-2 rounded-lg font-bold text-sm h-[38px] hover:bg-trimble-blue-dark transition-colors">
                   Invite Member
                 </button>
               </form>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Name</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Email</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Role</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teamMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 text-sm font-bold text-slate-800">{member.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{member.email}</td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          member.role === 'Admin' ? 'bg-purple-50 text-purple-700' : 
                          member.role === 'Analyst' ? 'bg-blue-50 text-blue-700' : 'bg-slate-50 text-slate-700'
                        }`}>
                          {member.role === 'Admin' ? <Shield className="w-3 h-3" /> : 
                           member.role === 'Analyst' ? <Analyst className="w-3 h-3" /> : <User className="w-3 h-3" />}
                          {member.role}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-xs font-bold text-red-600 hover:underline">Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="max-w-2xl mx-auto space-y-8 pb-12">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Public Profile</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-trimble-blue rounded-full flex items-center justify-center text-2xl text-white font-bold border border-slate-200">
                    {user.displayName?.[0] || 'U'}
                  </div>
                  <button className="text-[10px] font-bold text-trimble-blue uppercase tracking-widest hover:underline">Change Photo</button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Display Name</label>
                    <input type="text" defaultValue={user.displayName || ''} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-trimble-blue text-sm font-medium" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                    <input type="text" defaultValue={user.email || ''} readOnly className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-400 cursor-not-allowed text-sm" />
                  </div>
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Biography</label>
                    <textarea rows={4} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-trimble-blue text-sm" placeholder="Professional bio for your contributor profile..."></textarea>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-2">Communication Preferences</h3>
              <p className="text-xs text-slate-500 mb-6 font-medium">Opt in or out of specific communication topics related to your contributor activities.</p>
              
              <div className="space-y-4">
                {[
                  { id: '3dw', label: '3D Warehouse', desc: 'Models, feature updates, and community highlights.' },
                  { id: 'ew', label: 'Extension Warehouse', desc: 'API updates, review guidelines, and developer alerts.' },
                  { id: 'ue', label: 'User Events', desc: 'Workshops, webinars, and regional user group announcements.' },
                  { id: 'ce', label: 'Contributor Events', desc: 'Exclusive developer sessions, beta programs, and Dimensions conference news.' }
                ].map(({ id, label, desc }) => (
                  <div key={id} className="flex items-start gap-4 p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer">
                    <div className="flex items-center h-5 pt-1">
                      <input id={id} type="checkbox" defaultChecked className="w-4 h-4 text-trimble-blue rounded border-slate-300 focus:ring-trimble-blue" />
                    </div>
                    <label htmlFor={id} className="flex-1 cursor-pointer">
                       <p className="text-sm font-bold text-slate-800">{label}</p>
                       <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                    </label>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end pt-8">
                <button className="bg-trimble-blue text-white px-8 py-2.5 rounded-lg font-bold text-sm hover:bg-trimble-blue-dark transition-colors flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return <DashboardOverview activeAccount={activeAccount} activities={activities.filter(a => a.accountId === activeAccount.id)} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={(tab) => {
        setActiveTab(tab);
        if (tab === 'submit') {
          setIsUploadingExtension(false);
        }
      }} 
      activeAccount={activeAccount} 
      setActiveAccount={setActiveAccount}
      isUploadingExtension={isUploadingExtension}
    >
      {renderContent()}
    </Layout>
  );
}
