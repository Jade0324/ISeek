import React, { useState } from 'react';
import { 
  Search, 
  ChevronRight, 
  Shield, 
  X, 
  User,
  ArrowRight,
  Info,
  Clock,
  CheckCircle2,
  FileText,
  Building2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ACTIVE_PROGRAMS_2026, Program } from '../constants/programs';
import { ProgramDetailsModal } from './ProgramDetailsModal';

interface HomeTabProps {
  hasActivity: boolean;
  recentActivities: any[];
  isVerified: boolean;
  onVerify: () => void;
  userName?: string;
}

export const HomeTab: React.FC<HomeTabProps> = ({ isVerified, onVerify, userName }) => {
  const [query, setQuery] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const handleProgramClick = (program: Program) => {
    setSelectedProgram(program);
  };

  return (
    <div className="flex-grow overflow-y-auto bg-[#abb5be] pb-32 no-scrollbar relative min-h-full font-sans">
      {/* Hero Carousel Area */}
      <div className="px-6 pt-12 mb-8">
         <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="w-full aspect-[16/10] bg-white rounded-[2.5rem] shadow-xl p-10 relative overflow-hidden flex items-center justify-between group"
         >
            {/* Simulation of the PhilHealth Yakap Illustration */}
            <div className="relative z-10 w-1/2">
               <h2 className="text-3xl font-black italic uppercase leading-[0.9] text-slate-800 tracking-tighter">
                 Philhealth <br /> Yakap
               </h2>
               <div className="mt-4 w-16 h-1.5 bg-blue-600 rounded-full" />
            </div>
            
            <div className="relative z-10 w-1/2 flex flex-col items-end">
               <div className="text-right">
                  <p className="text-[12px] font-black text-blue-600 uppercase tracking-widest mb-1 italic">PhilHealth</p>
                  <p className="text-4xl font-black text-orange-400 italic uppercase leading-none tracking-tighter">YAKAP</p>
               </div>
               <div className="mt-6 flex flex-col items-center">
                  <div className="relative">
                    <div className="w-32 h-20 border-4 border-yellow-400 rounded-full flex items-center justify-center opacity-30 rotate-12 -mr-6" />
                    <div className="absolute inset-0 flex flex-col justify-center items-center gap-1 opacity-40">
                       <div className="w-24 h-2 bg-yellow-400 rounded-full rotate-[15deg]"></div>
                       <div className="w-20 h-2 bg-yellow-400 rounded-full rotate-[-15deg]"></div>
                    </div>
                  </div>
               </div>
            </div>

            {/* Background elements */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-100/50 rounded-full -mr-24 -mt-24 blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-100/50 rounded-full -ml-24 -mb-24 blur-3xl opacity-50"></div>
         </motion.div>
      </div>

      {/* Dark Content Section - Match Figma navy background */}
      <div className="bg-[#051121] min-h-screen rounded-t-[3.5rem] p-8 pb-32 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.3)]">
        {/* Search Bar - Figma Style */}
        <div className="relative mb-12">
           <div className="absolute left-6 top-1/2 -translate-y-1/2">
             <Search className="w-8 h-8 text-slate-600" />
           </div>
           <input 
             type="text"
             value={query}
             onChange={(e) => setQuery(e.target.value)}
             placeholder="Search for Programs..."
             className="w-full bg-white border-none rounded-2xl py-6 pl-16 pr-6 text-[14px] font-black uppercase tracking-widest placeholder:text-slate-400 text-slate-900 focus:ring-0 transition-all shadow-inner"
           />
        </div>

        {/* Recommended Opportunities Title */}
        <div className="flex items-center justify-between mb-8 px-2">
           <h2 className="text-[14px] font-black italic uppercase tracking-[0.25em] text-slate-100">Recommended Opportunities</h2>
        </div>

        {/* Programs List */}
        <div className="space-y-6">
           {ACTIVE_PROGRAMS_2026.filter(p => !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.agency?.toLowerCase().includes(query.toLowerCase())).map((program, idx) => (
             <motion.div 
               key={program.id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1 }}
               onClick={() => handleProgramClick(program)}
               className="bg-white rounded-3xl p-8 shadow-xl relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all border border-transparent hover:border-blue-500/30"
             >
                <div className="flex flex-col sm:flex-row gap-6">
                   {/* Logo / Illustration Placeholder */}
                   <div className="w-24 h-24 bg-slate-50 rounded-2xl flex-shrink-0 flex items-center justify-center border border-slate-100 overflow-hidden">
                      {program.id === 'yakap' ? (
                        <div className="flex flex-col items-center opacity-80 scale-110">
                           <p className="text-[6px] font-black text-blue-600 uppercase">PhilHealth</p>
                           <p className="text-[12px] font-black text-orange-400 italic leading-none">YAKAP</p>
                           <div className="flex flex-col gap-1 mt-2 opacity-30">
                              <div className="w-8 h-1 bg-yellow-400 rounded-full rotate-[10deg]"></div>
                              <div className="w-8 h-1 bg-yellow-400 rounded-full rotate-[-10deg]"></div>
                           </div>
                        </div>
                      ) : (
                        <Building2 className="w-10 h-10 text-slate-300" />
                      )}
                   </div>

                   {/* Info Area */}
                   <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-black italic uppercase text-slate-900 tracking-tight leading-none">{program.name}</h3>
                      </div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-4">{program.agency}</p>
                      
                      {/* JobStreet style badges */}
                      <div className="flex flex-wrap gap-2 mb-6">
                         {program.regions?.map(r => (
                           <span key={r} className="bg-slate-100 text-slate-600 text-[9px] font-black px-3 py-1.5 rounded-md uppercase tracking-tight">{r}</span>
                         ))}
                         <span className="bg-slate-100 text-slate-500 text-[9px] font-black px-3 py-1.5 rounded-md uppercase tracking-tight">{program.postedTime}</span>
                         <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-3 py-1.5 rounded-md uppercase tracking-tight">{program.coverage}</span>
                         <span className="bg-slate-200 text-slate-600 text-[9px] font-black px-3 py-1.5 rounded-md uppercase tracking-tight">UNIVERSAL COVERAGE</span>
                         <span className="bg-orange-100 text-orange-700 text-[9px] font-black px-3 py-1.5 rounded-md uppercase tracking-tight">GOV</span>
                      </div>

                      {/* Details Link */}
                      <div className="flex justify-end pt-2 border-t border-slate-50">
                        <button className="flex items-center gap-2 text-blue-600 font-black italic uppercase tracking-[0.25em] text-[11px] hover:gap-3 transition-all">
                           DETAILS <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                   </div>
                </div>
             </motion.div>
           ))}
        </div>

        {/* Verification Alert */}
        {!isVerified && (
          <motion.div 
            whileHover={{ y: -5 }}
            onClick={onVerify}
            className="mt-12 bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-[2.5rem] text-white shadow-2xl cursor-pointer relative overflow-hidden"
          >
             <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
             <div className="relative z-10">
               <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                     <Shield className="w-6 h-6" />
                  </div>
                  <div>
                     <h4 className="text-sm font-black uppercase italic tracking-widest">Verify PhilSys</h4>
                     <p className="text-[10px] text-blue-100 uppercase font-bold tracking-tighter">Unlock Full Benefits</p>
                  </div>
               </div>
               <p className="text-xs font-bold italic text-blue-50/90 leading-relaxed mb-6">
                 Government health grants require verified identity. Secure your Juan Wallet status now.
               </p>
               <div className="flex justify-end">
                  <div className="w-10 h-10 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                     <ChevronRight className="w-5 h-5" />
                  </div>
               </div>
             </div>
          </motion.div>
        )}
      </div>

      {/* Program Details Modal */}
      <ProgramDetailsModal 
        program={selectedProgram} 
        onClose={() => setSelectedProgram(null)} 
      />
    </div>
  );
};
