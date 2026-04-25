import React from 'react';
import { User, Settings, ShieldCheck, FileText, Download, Lock, ChevronRight, LogOut, Package, Database, Fingerprint, X, Search, ArrowLeft } from 'lucide-react';
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
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [viewingExtraction, setViewingExtraction] = React.useState<any | null>(null);

  const patientData = userProfile || { name: 'Unverified User', category: 'General', isVerified: false, age: 0 };

  return (
    <div className="flex-grow overflow-y-auto bg-slate-50 pb-24">
      {/* Profile Header */}
      <div className="bg-white p-8 pt-16 border-b border-slate-100 italic">
        <div className="flex items-center justify-center text-center">
           <div className="flex flex-col items-center">
              <div className="relative mb-6">
                <div className={`w-28 h-28 rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-black italic shadow-2xl transition-all ${isVerified ? 'bg-blue-600 shadow-blue-200' : 'bg-slate-200 shadow-slate-100 text-slate-400'}`}>
                   {isVerified ? (userProfile?.name?.charAt(0) || 'J') : <User className="w-12 h-12" />}
                </div>
                {isVerified && (
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2.5 rounded-2xl shadow-xl border-4 border-white">
                     <ShieldCheck className="w-5 h-5" />
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-3xl font-black italic uppercase text-slate-900 tracking-tighter leading-none mb-3">
                  {isVerified ? (userProfile?.name || 'John David Romero') : 'Unverified User'}
                </h2>
                <div className="flex flex-col items-center gap-2">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-sm border ${isVerified ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                    {isVerified ? 'Verified Citizen (PhilSys)' : 'Awaiting PhilID Verification'}
                  </span>
                  <p className="text-[11px] font-mono text-blue-600/60 font-bold tracking-[0.15em] mt-1 bg-blue-50/50 px-3 py-1 rounded-lg">
                    +63 {phoneNumber.slice(-10).replace(/(\d{3})(\d{3})(\d{4})/, '$1 *** $3')}
                  </p>
                </div>
              </div>
           </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Verification CTA */}
        {!isVerified && (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-[2rem] p-6 text-white shadow-xl shadow-blue-200 relative overflow-hidden"
          >
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                      <Fingerprint className="w-5 h-5 text-white" />
                   </div>
                   <h3 className="text-sm font-black uppercase tracking-widest">Verify Your Identity</h3>
                </div>
                <p className="text-xs text-blue-100 leading-relaxed mb-6 italic">
                  Unlock exact healthcare coverage estimates and automated assistance filing by linking your account to PhilSys or Birth Certificate.
                </p>
                <button 
                  onClick={onVerify}
                  className="w-full bg-white text-blue-600 font-bold py-4 rounded-2xl uppercase tracking-widest text-xs shadow-lg shadow-blue-900/20 active:scale-95 transition-all"
                >
                  Start Verification
                </button>
             </div>
             {/* Decorative element */}
             <div className="absolute -right-8 -bottom-8 opacity-10">
                <ShieldCheck className="w-40 h-40" />
             </div>
          </motion.div>
        )}

        {/* Verification Progress */}
        <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm">
           <div className="flex justify-between items-center mb-4">
              <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Profile Progress</h3>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{isVerified ? '100% Complete' : '15% Complete'}</span>
           </div>
           <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: isVerified ? '100%' : '15%' }} />
           </div>
           <p className="text-[10px] text-slate-500 leading-relaxed italic">
             {isVerified 
               ? "Identity verified via PhilID. You now have full access to automated UHC benefits."
               : "Complete your profile to unlock Personalized Financial Estimates and Auto-Application features."
             }
           </p>
        </div>

        {/* Verification Status */}
        <div className="bg-[#0f172a] rounded-[2rem] p-6 text-white shadow-xl shadow-slate-200 relative overflow-hidden">
           <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                 <Package className="w-4 h-4 text-blue-400" />
                 <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Digital Health Vault</h3>
              </div>
              <span className="text-[9px] font-mono text-slate-500">v10173-04</span>
           </div>
           
           <div className="space-y-4">
              <div className={`flex justify-between items-center p-4 rounded-2xl border transition-all ${isVerified ? 'bg-white/5 border-white/10' : 'bg-slate-800/50 border-slate-700 opacity-50'}`}>
                 <div className="flex items-center gap-3">
                    <Fingerprint className="w-5 h-5 text-blue-400" />
                    <span className="text-xs font-bold uppercase tracking-tight">PhilSys Integrated</span>
                 </div>
                 {isVerified ? <ShieldCheck className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-slate-500" />}
              </div>
              <div className={`flex justify-between items-center p-4 rounded-2xl border transition-all ${isVerified ? 'bg-white/5 border-white/10' : 'bg-slate-800/50 border-slate-700 opacity-50'}`}>
                 <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-blue-400" />
                    <span className="text-xs font-bold uppercase tracking-tight">Offline Sync Mode</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-blue-400 uppercase">{isVerified ? 'Synchronized' : 'Disabled'}</span>
                    {isVerified && <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />}
                 </div>
              </div>
           </div>
           {!isVerified && (
             <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center">
                <div className="bg-slate-800 p-3 rounded-2xl border border-white/10 flex items-center gap-2">
                   <Lock className="w-3 h-3 text-slate-400" />
                   <span className="text-[8px] font-black uppercase tracking-widest text-slate-300">Locked Feature</span>
                </div>
             </div>
           )}
        </div>

        {/* Demo Controls */}
        <section className="bg-orange-50 border border-orange-100 rounded-[2rem] p-6 shadow-sm">
           <h3 className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-4">Development Tools</h3>
           <button 
             onClick={onResetAll}
             className="w-full p-4 bg-white border border-orange-200 rounded-2xl flex items-center justify-between text-orange-600 hover:bg-orange-600 hover:text-white transition-all group mb-4"
           >
              <div className="flex items-center gap-3">
                 <Database className="w-4 h-4" />
                 <span className="text-[11px] font-black italic uppercase tracking-wider">Reset Local Session Mappings</span>
              </div>
              <X className="w-4 h-4 opacity-50 group-hover:opacity-100" />
           </button>
           <p className="text-[9px] text-orange-400 font-bold leading-tight italic uppercase opacity-80">
             Clears your local phone-to-session database so you can demo fresh login states.
           </p>
        </section>

        {/* Action List */}
        <section className="space-y-px bg-slate-200 rounded-3xl overflow-hidden shadow-sm border border-slate-200">
           {[
             { 
               icon: FileText, 
               label: 'My Uploaded Documents', 
               count: recentActivities.length,
               description: 'Stored scans and analytical results for offline review.',
               onClick: () => setShowDocuments(true)
             },
             { icon: Download, label: 'Recent Claims & Passes', count: 4, onClick: () => {} },
             { icon: Lock, label: 'Manage Privacy & Consent', count: null, onClick: () => {} },
             { icon: Settings, label: 'Account Settings', count: null, onClick: () => {} }
           ].map((item, i) => (
             <button 
               key={i} 
               onClick={item.onClick}
               className="w-full flex items-center justify-between p-5 bg-white hover:bg-slate-50 transition-colors text-left"
             >
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                      <item.icon className="w-5 h-5" />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-tight">{item.label}</span>
                      {item.description && <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">{item.description}</span>}
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   {(item.count !== null && item.count !== undefined) && <span className="w-5 h-5 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-[10px] font-bold">{item.count}</span>}
                   <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
             </button>
           ))}
        </section>

        {/* Documents Overlay */}
        <AnimatePresence>
          {showDocuments && (
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 bg-slate-50 z-[60] flex flex-col"
            >
               <header className="bg-white p-6 border-b border-slate-100 flex items-center justify-between sticky top-0">
                  <div className="flex items-center gap-3">
                     <FileText className="w-5 h-5 text-blue-600" />
                     <h2 className="text-sm font-black uppercase italic tracking-widest">Document Vault</h2>
                  </div>
                  <button 
                    onClick={() => setShowDocuments(false)}
                    className="p-2 bg-slate-50 rounded-xl text-slate-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
               </header>

               <div className="flex-grow overflow-y-auto p-6 space-y-4">
                  {recentActivities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-12">
                       <Database className="w-12 h-12 text-slate-200 mb-4" />
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No documents found</p>
                       <p className="text-[10px] text-slate-300 mt-2">Scan records to see them here.</p>
                    </div>
                  ) : (
                    recentActivities.map((activity, idx) => (
                      <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
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
                         <p className="text-[9px] text-slate-500 italic mb-3">
                            {activity.data?.document_analysis?.hospital_name || activity.data?.hospital || activity.data?.institution || 'General Health Institution'}
                         </p>
                         {activity.data?.scanned_image && (
                           <div 
                             onClick={() => setSelectedImage(activity.data.scanned_image)}
                             className="mb-4 relative aspect-video rounded-xl overflow-hidden bg-slate-100 cursor-pointer group"
                           >
                              <img src={activity.data.scanned_image} alt="Scan" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Search className="w-5 h-5 text-white" />
                              </div>
                           </div>
                         )}
                         <div className="flex justify-between items-center pt-3 border-t border-dashed border-slate-100">
                            <button 
                              onClick={() => setViewingExtraction(activity.data)}
                              className="text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1"
                            >
                               View Details <ChevronRight className="w-3 h-3" />
                            </button>
                            {activity.type === 'extraction' && (
                              <span className="text-[8px] font-bold text-emerald-600 uppercase">
                                 HIM-Ready
                              </span>
                            )}
                         </div>
                      </div>
                    ))
                  )}
               </div>
               
               <div className="p-6 bg-blue-50 border-t border-blue-100 italic">
                  <p className="text-[9px] text-blue-600 font-bold leading-relaxed text-center uppercase tracking-wider">
                     Documents are synchronized via local Edge Storage for offline accessibility.
                  </p>
               </div>

               {/* Inner Overlay for Extraction Results (Roadmap) */}
               <AnimatePresence>
                 {viewingExtraction && (
                   <motion.div 
                     initial={{ x: '100%' }}
                     animate={{ x: 0 }}
                     exit={{ x: '100%' }}
                     transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                     className="absolute inset-0 bg-white z-[70] flex flex-col"
                   >
                     <header className="bg-white p-6 border-b border-slate-100 flex items-center gap-4 sticky top-0 z-10">
                        <button 
                          onClick={() => setViewingExtraction(null)}
                          className="p-2 bg-slate-50 rounded-xl text-slate-400"
                        >
                          <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h2 className="text-sm font-black uppercase italic tracking-widest">Analytical Result</h2>
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

          {selectedImage && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="max-w-4xl max-h-[90vh] w-full flex items-center justify-center"
              >
                <img src={selectedImage} alt="Full Document" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
              </motion.div>
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white"
              >
                <X className="w-8 h-8" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Logout */}
        <button 
          onClick={onLogout}
          className="w-full p-5 bg-white border border-red-100 rounded-3xl flex items-center justify-center gap-2 text-red-500 font-bold uppercase tracking-widest text-xs hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" /> {isVerified ? 'Sign Out from PhilSys' : 'Sign Out Account'}
        </button>

        <p className="text-[9px] text-slate-400 text-center uppercase tracking-[0.2em] pt-4">Juan's Health Wallet • V 1.0.2</p>
      </div>
    </div>
  );
};
