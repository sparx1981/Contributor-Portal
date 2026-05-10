import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Download, 
  Upload, 
  AlertCircle, 
  Lock, 
  MessageSquare, 
  ChevronRight,
  FileText,
  CreditCard,
  Building2,
  Calendar,
  Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DocItemProps {
  icon: React.ReactNode;
  label: string;
  status: 'completed' | 'incomplete' | 'pending' | 'locked';
  subtext?: string;
  onUpload?: () => void;
  downloadUrl?: string;
  tooltip?: string;
}

const DocItem = ({ icon, label, status, subtext, onUpload, downloadUrl, tooltip }: DocItemProps) => {
  const statusStyles = {
    completed: { text: 'text-green-600', label: 'COMPLETED', icon: <CheckCircle2 className="w-5 h-5 text-green-500" /> },
    incomplete: { text: 'text-amber-600', label: 'INCOMPLETE', icon: <AlertCircle className="w-5 h-5 text-amber-500" /> },
    pending: { text: 'text-slate-400', label: 'PENDING', icon: <Clock className="w-5 h-5 text-slate-300" /> },
    locked: { text: 'text-slate-300', label: 'LOCKED', icon: <Lock className="w-5 h-5 text-slate-200" /> },
  };

  const style = statusStyles[status];

  const handleDownload = (e: React.MouseEvent) => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    }
  };

  return (
    <div className={`flex items-center gap-6 p-6 rounded-2xl transition-all ${status === 'locked' ? 'opacity-50' : 'hover:bg-slate-50'}`}>
      <div className={`p-3 rounded-xl ${status === 'locked' ? 'bg-slate-100 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-base font-bold text-slate-800">{label}</h4>
        {subtext && <p className={`text-xs font-semibold uppercase tracking-wider mt-0.5 ${style.text}`}>{subtext}</p>}
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
           <span className={`text-[10px] font-bold tracking-widest ${style.text}`}>{style.label}</span>
        </div>
        {status === 'completed' ? (
          <div className="flex items-center gap-2">
            <button 
              onClick={handleDownload}
              className="p-2 text-slate-400 hover:text-trimble-blue transition-colors" 
              title={tooltip || "Download submitted file"}
            >
              <Download className="w-4 h-4" />
            </button>
            {style.icon}
          </div>
        ) : status === 'locked' ? (
          <Lock className="w-5 h-5 text-slate-200" />
        ) : (
          <div className="flex items-center gap-2">
            <div className="relative group/tooltip">
              <button 
                onClick={handleDownload}
                className="p-2 text-slate-400 hover:text-trimble-blue transition-colors" 
                title={tooltip || "Download template"}
              >
                <Download className="w-4 h-4" />
              </button>
              {tooltip && (
                <div className="absolute bottom-full mb-2 right-0 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {tooltip}
                </div>
              )}
            </div>
            <button onClick={onUpload} className="p-2 bg-trimble-blue text-white rounded-lg hover:bg-trimble-blue-dark transition-colors shadow-lg shadow-trimble-blue/20">
              <Upload className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function VendorOnboarding() {
  const [currentStep, setCurrentStep] = useState(2);
  const [isSaving, setIsSaving] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const steps = [
    { id: 1, label: 'Vendor Application', status: 'completed' },
    { id: 2, label: 'Tax Form (W8/W9)', status: 'in-progress' },
    { id: 3, label: 'Banking Information', status: 'pending' },
    { id: 4, label: 'Verification Nominees', status: 'pending' },
    { id: 5, label: 'Scheduling Call', status: 'pending' },
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  const handleSendSupport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    // Mocking email sending
    setTimeout(() => {
      alert(`Message sent to craig_trickett@trimble.com\n\nContent: ${supportMessage}`);
      setIsSending(false);
      setShowSupportModal(false);
      setSupportMessage('');
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 relative">
      {/* Support Modal */}
      <AnimatePresence>
        {showSupportModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSupportModal(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-[70] overflow-hidden"
            >
              <div className="p-8">
                <h3 className="text-xl font-bold text-slate-800 mb-2">Contact Vendor Support</h3>
                <p className="text-xs text-slate-500 mb-6 font-medium">Have a question about your application? Send us a message and our team will get back to you.</p>
                <form onSubmit={handleSendSupport} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Message</label>
                    <textarea 
                      required
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-trimble-blue text-sm font-medium"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-1">
                    <AlertCircle className="w-3 h-3" />
                    Sent to: craig_trickett@trimble.com
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <button 
                      type="button"
                      onClick={() => setShowSupportModal(false)}
                      className="px-6 py-2.5 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={isSending}
                      className="bg-trimble-blue text-white px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-trimble-blue-dark transition-all disabled:opacity-50"
                    >
                      {isSending ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-800 tracking-tight">Vendor Onboarding</h1>
          <p className="text-lg text-slate-500 mt-4 max-w-2xl font-medium leading-relaxed">
            Getting rewarded for your contributions couldn't be easier. Simply complete the forms below and you will soon be able to sell through your own organization on our Marketplaces.
          </p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-white px-8 py-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-4 group hover:shadow-2xl transition-all"
        >
          <div className="text-right">
            <p className="text-sm font-bold text-slate-800">{isSaving ? 'Saving Progress...' : 'Save Application'}</p>
            {!isSaving && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last saved today at 14:32</p>}
          </div>
          <div className={`p-2 rounded-xl transition-colors ${isSaving ? 'bg-green-100 text-green-600' : 'bg-slate-50 text-slate-400 group-hover:text-trimble-blue group-hover:bg-blue-50'}`}>
            {isSaving ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
          </div>
        </button>
      </div>

      {/* Steps Visualizer */}
      <div className="relative pt-8 pb-12">
        <div className="absolute top-12 left-0 right-0 h-0.5 bg-slate-100 -z-10" />
        <div className="grid grid-cols-5 gap-4">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center text-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-md z-10 transition-all ${
                step.status === 'completed' ? 'bg-green-500 text-white' : 
                step.status === 'in-progress' ? 'bg-trimble-blue text-white scale-125' : 
                'bg-slate-100 text-slate-300'
              }`}>
                {step.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-[10px] font-bold">{step.id}</span>}
              </div>
              <div>
                <p className={`text-[9px] font-black uppercase tracking-widest leading-none mb-1 ${
                  step.status === 'completed' ? 'text-green-600' : 
                  step.status === 'in-progress' ? 'text-trimble-blue' : 
                  'text-slate-400'
                }`}>
                  {step.label}
                </p>
                <p className="text-[10px] font-bold text-slate-400 capitalize">{step.status.replace('-', ' ')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Main Doc List */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-8 md:p-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Required Documentation</h2>
              <p className="text-sm text-slate-500 mt-1 font-medium">All items must be fully submitted before your application proceeds to the review committee.</p>
            </div>
          </div>

          <div className="space-y-4">
            <DocItem 
              icon={<FileText />}
              label="Vendor Information Form"
              status="completed"
              subtext="SUBMITTED ON OCT 12, 2023"
              downloadUrl="https://forms.office.com/Pages/ResponsePage.aspx?id=QacWLzq87EKDHv2lJnOIz4QE7SNMSUJOgGjCmv3SxP5UMjIwV1g1VU9aQlhGSjVXUkJSTFVTVjI2TS4u"
            />
            <div className="relative">
              <div className="absolute left-[-12px] top-6 bottom-6 w-1 bg-trimble-blue rounded-full" />
              <DocItem 
                icon={<CreditCard />}
                label="Tax Identification (W8/W9)"
                status="incomplete"
                subtext="MISSING SIGNATURE ON PAGE 3"
                downloadUrl="https://www.irs.gov/pub/irs-pdf/fw8ben.pdf"
                tooltip="The real application will download a zip file containing 3 different tax files."
              />
            </div>
            <DocItem 
              icon={<Building2 />}
              label="Banking Information"
              status="pending"
              subtext="AWAITING PREVIOUS STEPS"
              downloadUrl="/TRIMBLE_ACH_Banking_Information.pdf"
            />
            <DocItem 
              icon={<UsersIcon />}
              label="Verification Nominees"
              status="locked"
            />
             <DocItem 
              icon={<Calendar />}
              label="Scheduling Call"
              status="locked"
            />
          </div>

          <div className="mt-12 flex justify-end">
            <button className="px-8 py-3 bg-slate-100 text-slate-400 rounded-xl font-bold cursor-not-allowed text-sm">
              Submit for Review
            </button>
          </div>
        </div>

        {/* Info Column */}
        <div className="space-y-8">
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8">
            <div className="flex items-center gap-3 text-slate-400 mb-6">
              <AlertCircle className="w-5 h-5" />
              <p className="text-[10px] font-black uppercase tracking-widest">Mandatory Process</p>
            </div>
            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">
              The onboarding process will not proceed until all mandatory items are fully submitted and signed.
            </p>
            <blockquote className="italic text-xs text-slate-400 leading-relaxed border-l-2 border-slate-200 pl-4">
              "Our procurement compliance standards require 100% documentation accuracy to ensure seamless global payments."
            </blockquote>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
             <h3 className="text-lg font-bold text-slate-800 mb-2">Need Assistance?</h3>
             <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
               If you're having trouble with the tax forms or banking verification, our vendor support team is here to help.
             </p>
             <button 
              onClick={() => setShowSupportModal(true)}
              className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors group">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-white rounded-lg text-trimble-blue shadow-sm">
                   <MessageSquare className="w-4 h-4" />
                 </div>
                 <span className="text-sm font-bold text-slate-700">Contact Support</span>
               </div>
               <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-trimble-blue transition-colors" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function UsersIcon({ className }: { className?: string }) { return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
