import React from 'react';
import { 
  X, 
  Building2, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ArrowRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Program } from '../constants/programs';

interface ProgramDetailsModalProps {
  program: Program | null;
  onClose: () => void;
}

export const ProgramDetailsModal: React.FC<ProgramDetailsModalProps> = ({ program, onClose }) => {
  return (
    <AnimatePresence>
      {program && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100]"
          />
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-slate-50 rounded-t-[3.5rem] z-[101] max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl flex flex-col"
          >
             {/* Modal Handle */}
             <div className="w-16 h-1.5 bg-slate-200 rounded-full mx-auto mt-4" />
             
             <div className="p-8 pt-8 pb-32">
                <div className="flex justify-between items-start mb-8">
                   <div>
                      <h2 className="text-3xl font-black italic uppercase text-slate-900 tracking-tighter leading-tight mb-2">{program.name}</h2>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{program.agency}</p>
                      </div>
                   </div>
                   <button 
                     onClick={onClose}
                     className="p-3 bg-white rounded-2xl text-slate-400 hover:text-slate-900 shadow-sm border border-slate-100"
                   >
                      <X className="w-6 h-6" />
                   </button>
                </div>

                <div className="space-y-6">
                   {/* Summary */}
                   <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                         <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                         <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Eligibility & Scope</h3>
                      </div>
                      <p className="text-[13px] font-bold text-slate-600 leading-relaxed italic">{program.description}</p>
                   </div>

                   {/* Key Info Grid */}
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex flex-col justify-center gap-1">
                         <CheckCircle2 className="w-6 h-6 text-emerald-500 mb-1" />
                         <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest leading-none">Max Coverage</p>
                         <p className="text-xl font-black text-emerald-700 uppercase italic tracking-tighter leading-none">{program.coverage}</p>
                      </div>
                      <div className="p-6 bg-[#051121] rounded-3xl border border-slate-800 flex flex-col justify-center gap-1">
                         <Clock className="w-6 h-6 text-slate-400 mb-1" />
                         <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Response Time</p>
                         <p className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">FAST</p>
                      </div>
                   </div>

                   {/* Detail Sections */}
                   <div className="space-y-4">
                       <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
                          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Qualifications</h3>
                          <ul className="space-y-3">
                             {program.eligibility?.map((item, i) => (
                               <li key={`eligibility-${i}`} className="flex gap-4 items-start">
                                  <div className="w-5 h-5 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                     <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                  </div>
                                  <p className="text-[11px] font-bold text-slate-700 italic leading-tight">{item}</p>
                               </li>
                             ))}
                          </ul>
                       </div>

                       <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
                          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Checklist</h3>
                          <div className="grid grid-cols-1 gap-2">
                             {program.requirements?.map((req, i) => (
                               <div key={`requirement-${i}`} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                  <div className="flex items-center gap-3">
                                     <FileText className="w-4 h-4 text-slate-400" />
                                     <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{req}</span>
                                  </div>
                                  <CheckCircle2 className="w-4 h-4 text-slate-200" />
                               </div>
                             ))}
                          </div>
                       </div>
                   </div>

                   {/* Apply Button */}
                   <button className="w-full bg-[#051121] text-white p-6 rounded-[2.5rem] flex items-center justify-between shadow-2xl group active:scale-[0.98] transition-all">
                      <div className="text-left">
                         <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Process Eligibility</p>
                         <p className="text-lg font-black uppercase italic tracking-widest">Apply for Grant</p>
                      </div>
                      <div className="w-14 h-14 bg-blue-600 rounded-3xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] group-hover:bg-blue-500 transition-colors">
                         <ArrowRight className="w-8 h-8" />
                      </div>
                   </button>

                   <p className="text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest opacity-60">
                     Application routed via PCGH UHC Gateway Node
                   </p>
                </div>
             </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
