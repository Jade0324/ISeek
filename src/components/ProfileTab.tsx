import React from 'react';
import { User, Settings, ShieldCheck, FileText, Lock, ChevronRight, LogOut, Package, Database, Fingerprint, X, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BenefitRoadmap } from './BenefitRoadmap';

interface ProfileTabProps {
  isVerified: boolean;
  onVerify: () => void;
  phoneNumber: string;
  userProfile?: any;
  onLogout: () => void;
  onResetAll: () => void;
  recentActivities?: any[];
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ 
  isVerified, 
  onVerify, 
  phoneNumber, 
  userProfile, 
  onLogout, 
  onResetAll,
  recentActivities = []
}) => {
  const [showDocuments, setShowDocuments] = React.useState(false);
  const [viewingExtraction, setViewingExtraction] = React.useState<any | null>(null);

  const patientData = userProfile || { name: 'Unverified User', category: 'General', isVerified: false, age: 0 };

  return (
    <div className="flex-grow overflow-y-auto bg-[#0a1121] no-scrollbar relative min-h-full font-sans pb-24">
      {/* Profile Header (Slate Header) */}
      <div className="bg-[#abb5be] px-6 py-8 pb-12 flex flex-col items-center">
        <div className="relative mb-6">
          <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center text-[#0f172a] text-3xl font-black italic shadow-2xl transition-all border-4 border-white/20 ${isVerified ? 'bg-white shadow-blue-500/20' : 'bg-white/40 shadow-slate-100 text-[#0f172a]/40'}`}>
              {isVerified ? (userProfile?.fullName?.charAt(0) || 'I') : <User className="w-12 h-12" />}
          </div>
          {isVerified && (
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2.5 rounded-2xl shadow-xl border-4 border-white">
                <ShieldCheck className="w-5 h-5" />
            </div>
          )}
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-black italic uppercase text-[#0f172a] tracking-tighter leading-none mb-3">
            {isVerified ? (userProfile?.fullName || 'John David') : 'Guest User'}
          </h2>
          <div className="flex flex-col items-center gap-2">
            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-sm border ${isVerified ? 'bg-white/20 text-[#0f172a] border-white/30' : 'bg-black/5 text-[#0f172a]/50 border-black/10'}`}>
              {isVerified ? 'Verified Citizen' : 'Unverified Status'}
            </span>
            <p className="text-[11px] font-mono text-[#0f172a] font-bold tracking-[0.15em] mt-1 bg-white/20 px-3 py-1 rounded-lg">
              +63 {phoneNumber.slice(-10).replace(/(\d{3})(\d{3})(\d{4})/, '$1 *** $3')}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 -mt-8">
        {/* Verification Progress */}
        <div className="bg-white rounded-[2rem] p-6 shadow-xl">
           <div className="flex justify-between items-center mb-4">
              <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Citizen Readiness</h3>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{isVerified ? '100%' : '15%'}</span>
           </div>
           <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: isVerified ? '100%' : '15%' }} />
           </div>
           <p className="text-[10px] text-slate-500 leading-relaxed italic font-medium">
             {isVerified 
               ? "Full access to catastrophic coverage and zero-bill roadmaps unlocked."
               : "Verify PhilSys identity to unlock personalized healthcare estimates."
             }
           </p>
        </div>

        {/* Verification CTA if not verified */}
        {!isVerified && (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={onVerify}
            className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-[2rem] p-6 text-white shadow-2xl relative overflow-hidden cursor-pointer active:scale-95 transition-all"
          >
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                   <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Fingerprint className="w-5 h-5 text-white" />
                   </div>
                   <h3 className="text-sm font-black uppercase tracking-widest leading-none">Start PhilSys Link</h3>
                </div>
                <p className="text-[10px] text-blue-100 leading-relaxed mb-4 italic font-medium">
                  Connect your health wallet to the PhilHealth master database for instant assistance.
                </p>
                <div className="flex justify-end">
                   <div className="w-10 h-10 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <ChevronRight className="w-5 h-5" />
                   </div>
                </div>
             </div>
          </motion.div>
        )}

        {/* Action List Section */}
        <div className="bg-white rounded-[2rem] overflow-hidden shadow-xl border border-slate-100">
           {[
             { 
               icon: FileText, 
               label: 'Document Vault', 
               count: recentActivities.length,
               onClick: () => setShowDocuments(true)
             },
             { icon: Package, label: 'PhilHealth Credits', count: 'Active' },
             { icon: Lock, label: 'Privacy Settings' },
             { icon: Settings, label: 'Vault Security' }
           ].map((item, i) => (
             <button 
               key={`profile-action-${i}`} 
               onClick={item.onClick as any}
               className={`w-full flex items-center justify-between p-5 bg-white hover:bg-slate-50 transition-colors text-left ${i !== 0 ? 'border-t border-slate-50' : ''}`}
             >
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-[#abb5be]/20 rounded-xl flex items-center justify-center text-[#abb5be]">
                      <item.icon className="w-5 h-5" />
                   </div>
                   <span className="text-xs font-black text-slate-900 uppercase tracking-tighter">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                   {(item.count !== null && item.count !== undefined) && (
                     <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-md">
                       {item.count}
                     </span>
                   )}
                   <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
             </button>
           ))}
        </div>

        {/* Logout */}
        <button 
          onClick={onLogout}
          className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center gap-2 text-white font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-white/20 transition-all mb-4"
        >
          <LogOut className="w-4 h-4" /> Sign Out Session
        </button>
      </div>

       {/* Documents Overlay */}
       <AnimatePresence>
          {showDocuments && (
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 bg-[#0a1121] z-[60] flex flex-col"
            >
               <header className="bg-[#abb5be] p-6 flex items-center justify-between sticky top-0 z-10 shadow-lg">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center border border-white/20">
                        <FileText className="w-5 h-5 text-[#0f172a]" />
                     </div>
                     <h2 className="text-sm font-black uppercase italic tracking-widest text-[#0f172a]">Document Vault</h2>
                  </div>
                  <button 
                    onClick={() => setShowDocuments(false)}
                    className="p-2 bg-black/5 rounded-xl text-[#0f172a]/60"
                  >
                    <X className="w-6 h-6" />
                  </button>
               </header>

               <div className="flex-grow overflow-y-auto p-6 space-y-4 pt-8">
                  {recentActivities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-12">
                       <Database className="w-12 h-12 text-slate-800 mb-4" />
                       <p className="text-xs font-black text-slate-700 uppercase tracking-widest">No documents found</p>
                       <p className="text-[10px] text-slate-600 mt-2 font-medium">Scan health records to build your vault.</p>
                    </div>
                  ) : (
                    recentActivities.map((activity, idx) => (
                      <div key={`activity-${activity.id || idx}`} className="bg-white p-5 rounded-[2rem] shadow-xl">
                         <div className="flex justify-between items-start mb-3">
                            <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded">
                               {activity.type === 'extraction' ? 'AI Analysis' : 'Status Update'}
                            </span>
                            <span className="text-[8px] font-mono text-slate-400">
                               {activity.timestamp ? (
                                 activity.timestamp.seconds 
                                   ? new Date(activity.timestamp.seconds * 1000).toLocaleDateString() 
                                   : new Date(activity.timestamp).toLocaleDateString()
                               ) : 'Recent'}
                            </span>
                         </div>
                         <h4 className="text-[11px] font-black uppercase tracking-tight text-slate-900 mb-1">
                            {activity.data?.document_analysis?.diagnosis || activity.data?.diagnosis || activity.data?.type || 'Record Analysis'}
                         </h4>
                         <p className="text-[9px] text-slate-500 italic mb-4 font-medium">
                            {activity.data?.document_analysis?.hospital_name || activity.data?.hospital || activity.data?.institution || 'General Hospital'}
                         </p>
                         <div className="flex justify-between items-center pt-3 border-t border-dashed border-slate-100">
                            <button 
                              onClick={() => setViewingExtraction(activity.data)}
                              className="text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all"
                            >
                               View Details <ChevronRight className="w-3 h-3" />
                            </button>
                         </div>
                      </div>
                    ))
                  )}
               </div>
               
               {/* Extraction Results Overlay */}
               <AnimatePresence>
                 {viewingExtraction && (
                   <motion.div 
                     initial={{ x: '100%' }}
                     animate={{ x: 0 }}
                     exit={{ x: '100%' }}
                     className="absolute inset-0 bg-[#0a1121] z-[70] flex flex-col"
                   >
                     <header className="bg-[#abb5be] p-6 flex items-center gap-4 sticky top-0 z-10 shadow-lg" style={{ marginTop: '0px' }}>
                        <button 
                          onClick={() => setViewingExtraction(null)}
                          className="p-2 bg-black/5 rounded-xl text-[#0f172a]/60"
                        >
                          <ArrowLeft className="w-6 h-6" />
                        </button>
                        <h2 className="text-sm font-black uppercase italic tracking-widest text-[#0f172a]">Analysis Report</h2>
                     </header>
                     <div className="flex-grow overflow-hidden flex flex-col">
                        <BenefitRoadmap 
                          extraction={viewingExtraction}
                          patient={patientData}
                          onReset={() => setViewingExtraction(null)}
                        />
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
            </motion.div>
          )}
       </AnimatePresence>
    </div>
  );
};
