import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Star, Zap, ShieldCheck, Clock, Award, Megaphone, BadgePercent } from 'lucide-react';

interface UpgradeInterestModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: { id: string, name: string, type: string }[];
}

export default function UpgradeInterestModal({ isOpen, onClose, accounts }: UpgradeInterestModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const [selectedAccount, setSelectedAccount] = useState(accounts[0]?.name || 'Individual Account');

  const benefits = [
    {
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      title: "Streamlined Reviews",
      description: "Get your extensions and models reviewed in 3 days."
    },
    {
      icon: <Award className="w-5 h-5 text-amber-500" />,
      title: "Featured Badging",
      description: "Premium Contributor badge to boost trust and visibility."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-amber-500" />,
      title: "Developer NFR Licenses",
      description: "Get access to Not-For-Resale licenses for Trimble products to aid your development."
    },
    {
      icon: <Megaphone className="w-5 h-5 text-amber-500" />,
      title: "Paid Promotion",
      description: "Ability to boost your content visibility through paid placements in our global marketplaces."
    },
    {
      icon: <BadgePercent className="w-5 h-5 text-amber-500" />,
      title: "Reduced Transaction Fees",
      description: "Enjoy lower platform fees on all your sales through the Trimble Marketplace."
    },
    {
      icon: <Star className="w-5 h-5 text-amber-500" />,
      title: "Advanced Market Insights",
      description: "Gain deeper insights into user behavior and market trends to optimize your content performance."
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // In a real app, this would send data to a backend
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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl relative z-10 overflow-hidden"
          >
            <div className="absolute top-6 right-6 z-20">
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col md:flex-row">
              {/* Left Side: Benefits */}
              <div className="w-full md:w-2/3 p-8 md:p-12 bg-slate-50">
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                    Premium Tier
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900">Upgrade Your Experience</h2>
                </div>

                <div className="space-y-6">
                  {benefits.map((benefit, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="shrink-0 w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center">
                        {benefit.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">{benefit.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side: Action/Success */}
              <div className="w-full md:w-1/3 p-8 md:p-12 flex flex-col justify-center">
                {!isSubmitted ? (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Register Interest</h3>
                    <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                      We're currently rolling out our premium program to selected contributors. Join the waitlist to be among the first to get access.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Account to Upgrade</label>
                        <select 
                          value={selectedAccount}
                          onChange={(e) => setSelectedAccount(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-500 transition-all text-slate-800 appearance-none cursor-pointer"
                        >
                          {accounts.map(acc => (
                            <option key={acc.id} value={acc.name}>{acc.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                        <input 
                          required
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="craig@example.com"
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-500 transition-all text-slate-800"
                        />
                      </div>
                      <button 
                        type="submit"
                        className="w-full py-4 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98]"
                      >
                        Join the Waitlist
                      </button>
                    </form>
                    <p className="text-[10px] text-slate-400 text-center mt-6">
                      No obligation to subscribe. We'll notified you when applications open.
                    </p>
                  </div>
                ) : (
                  <div className="text-center animate-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check className="w-10 h-10 stroke-[3]" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">You're on the list!</h3>
                    <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                      Thanks for your interest, <strong>{email}</strong>. We'll be in touch soon with more details about the Premium Contributor program.
                    </p>
                    <button 
                      onClick={onClose}
                      className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
                    >
                      Back to Dashboard
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
