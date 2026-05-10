import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, AlertCircle } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

interface OrganizationRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrganizationRequestModal({ isOpen, onClose }: OrganizationRequestModalProps) {
  const { user } = useAuth();
  const [website, setWebsite] = useState('');
  const [category, setCategory] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Manufacturer',
    'Retailer',
    'Architectural Firm',
    'Design Studio',
    'Education',
    'Non-Profit',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!website || !category || !confirmed) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    onClose();
    // In a real app we'd probably show a success message or update the state
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-[640px] rounded-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">Application Details</h2>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto">
              <p className="text-slate-600 mb-8 leading-relaxed">
                Please provide the information below to register your application. Some of this information will also be used for your organization's profile.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email (Readonly) */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={user?.email || ''}
                      readOnly
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed focus:outline-none"
                    />
                  </div>
                  <p className="text-xs text-slate-400">Your email is automatically filled and cannot be changed.</p>
                </div>

                {/* Company Website */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Company Website <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://www.yourcompany.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-trimble-blue focus:border-transparent transition-all"
                  />
                </div>

                {/* Organization Category */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Organization Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-trimble-blue focus:border-transparent transition-all bg-white"
                  >
                    <option value="">Select your category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Sample Content Disclosure */}
                <div className="space-y-4 pt-2">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-1">Sample Content</h4>
                    <p className="text-xs text-slate-400 italic">Please read and acknowledge the following message</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 p-5 rounded-lg">
                    <div className="flex gap-3">
                      <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                        <p>
                          Before submitting your application, you must have at least 2 pieces of sample content uploaded to your 3D Warehouse account for review.
                        </p>
                        <p>
                          If you haven't done so already, <a href="https://3dwarehouse.sketchup.com/" target="_blank" rel="noopener noreferrer" className="text-trimble-blue font-bold hover:underline inline-flex items-center gap-1">please open your 3D Warehouse account in a new tab</a> to upload your content. When you are done, check the confirmation box below to confirm.
                        </p>
                      </div>
                    </div>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center mt-0.5">
                      <input
                        type="checkbox"
                        required
                        checked={confirmed}
                        onChange={(e) => setConfirmed(e.target.checked)}
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 transition-all checked:bg-trimble-blue checked:border-trimble-blue shadow-sm bg-white"
                      />
                      <svg
                        className="absolute h-3.5 w-3.5 opacity-0 peer-checked:opacity-100 transition-opacity text-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className="text-xs text-slate-600 leading-tight">
                      I confirm that I have already uploaded at least two pieces of sample content to my 3D Warehouse account. <span className="text-red-500">*</span>
                    </span>
                  </label>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center gap-4 pt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 px-6 border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !website || !category || !confirmed}
                    className={`flex-1 py-3 px-6 font-bold rounded-lg transition-all shadow-sm ${
                      isSubmitting || !website || !category || !confirmed
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-[#7eb0d3] hover:bg-[#6c9cbf] text-white'
                    }`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
