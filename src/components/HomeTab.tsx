import React, { useState } from 'react';
import { 
  Search, 
  ChevronRight, 
  X, 
  User,
  ArrowRight,
  Building2
} from 'lucide-react';
import { motion } from 'motion/react';
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
    <div className="flex-grow overflow-y-auto bg-[#0a1121] no-scrollbar relative min-h-full font-sans">
      {/* Top Header Section (Slate Header) */}
      <div className="bg-[#abb5be] px-6 pt-8 pb-6">
        {/* Hero Card */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-white rounded-[2rem] p-8 shadow-lg relative overflow-hidden"
        >
           <div className="flex justify-between items-center">
              <div className="w-1/2">
                 <p className="text-[#0f172a] font-black italic uppercase leading-[0.8] text-2xl tracking-tighter">
                   PHILHEALTH<br/>YAKAP
                 </p>
              </div>
              <div className="w-1/2 relative h-24">
                 <div className="absolute inset-0 flex flex-col items-center justify-center scale-125">
                    <p className="text-[6px] font-black text-blue-600 uppercase">PhilHealth</p>
                    <p className="text-[14px] font-black text-orange-400 italic leading-none mb-1">YAKAP</p>
                    <div className="flex flex-col gap-1 mt-2 opacity-60">
                       <div className="w-16 h-2 bg-yellow-300 rounded-full rotate-[15deg]"></div>
                       <div className="w-14 h-2 bg-yellow-300 rounded-full rotate-[-15deg] -mt-1"></div>
                    </div>
                 </div>
              </div>
           </div>
        </motion.div>
      </div>

      {/* Dark Content Section - Match Figma navy background */}
      <div className="bg-[#051121] min-h-screen px-6 pt-6 pb-24">
        {/* Search Bar - Figma Style */}
        <div className="relative mb-10">
           <div className="absolute left-6 top-1/2 -translate-y-1/2">
             <Search className="w-7 h-7 text-slate-500" />
           </div>
           <input 
             type="text"
             value={query}
             onChange={(e) => setQuery(e.target.value)}
             placeholder="Search for Programs..."
             className="w-full bg-[#cbd5e1] border-none rounded-2xl py-5 pl-16 pr-6 text-[12px] font-black uppercase tracking-widest placeholder:text-slate-500 text-slate-900 focus:ring-0 transition-all shadow-inner"
           />
        </div>

        {/* Recommended Opportunities Title */}
        <div className="flex items-center justify-between mb-6 px-1">
           <h2 className="text-[12px] font-black italic uppercase tracking-[0.2em] text-slate-100 opacity-90">Recommended Opportunities</h2>
        </div>

        {/* Programs List */}
        <div className="space-y-4">
           {ACTIVE_PROGRAMS_2026.filter(p => !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.agency?.toLowerCase().includes(query.toLowerCase())).map((program, idx) => (
             <motion.div 
               key={`home-program-${program.id}`}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1 }}
               onClick={() => handleProgramClick(program)}
               className="bg-white rounded-[2rem] p-5 shadow-xl relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all"
             >
                <div className="flex gap-4 items-start">
                   {/* Logo / Illustration Placeholder */}
                   <div className="w-16 h-16 bg-white rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-50">
                      {program.id === 'yakap' ? (
                        <div className="flex flex-col items-center scale-[0.65]">
                           <p className="text-[6px] font-black text-blue-600 uppercase">PhilHealth</p>
                           <p className="text-[12px] font-black text-orange-400 italic leading-none mb-1">YAKAP</p>
                           <div className="flex flex-col gap-0.5 mt-2 opacity-50">
                              <div className="w-10 h-1 bg-yellow-400 rounded-full rotate-[15deg]"></div>
                              <div className="w-8 h-1 bg-yellow-400 rounded-full rotate-[-15deg] -mt-1"></div>
                           </div>
                        </div>
                      ) : (
                        <Building2 className="w-8 h-8 text-slate-200" />
                      )}
                   </div>

                   {/* Info Area */}
                   <div className="flex-grow flex flex-col pt-0.5">
                      <div className="mb-3">
                        <h3 className="text-sm font-black uppercase text-slate-900 tracking-tighter leading-tight mb-0.5">{program.name}</h3>
                        <p className="text-[8px] font-medium text-slate-400 uppercase italic tracking-tight">{program.agency}</p>
                      </div>
                      
                      {/* Structured Badges */}
                      <div className="flex flex-col gap-2">
                         {/* Row 1: Location and Time */}
                         <div className="flex gap-1.5 flex-wrap">
                           <span className="bg-slate-100 border border-slate-200 text-slate-500 text-[7px] font-black px-2.5 py-1 rounded-full uppercase italic tracking-tighter">{program.regions?.[0] || 'NATIONAL'}</span>
                           <span className="bg-slate-100 border border-slate-200 text-slate-500 text-[7px] font-black px-2.5 py-1 rounded-full uppercase italic tracking-tighter">{program.postedTime}</span>
                         </div>

                         {/* Row 2: Coverage and Tags */}
                         <div className="flex gap-1.5 flex-wrap">
                           <span className="bg-[#86efac] text-emerald-900 text-[8px] font-black px-3.5 py-1.5 rounded-[0.5rem] uppercase tracking-tighter">{program.coverage}</span>
                           <span className="bg-slate-200 text-slate-700 text-[8px] font-black px-3.5 py-1.5 rounded-[0.5rem] uppercase tracking-tighter">{program.tags?.[0] || 'UNIVERSAL'}</span>
                         </div>

                         {/* Row 3: Short Agency Tag & Details Link */}
                         <div className="flex items-center justify-between mt-1 pt-2 border-t border-slate-50">
                           <span className="bg-[#fb923c] text-white text-[8px] font-black px-3.5 py-1.5 rounded-[0.5rem] uppercase tracking-tighter">
                             {program.agency?.includes('DOH') ? 'DOH' : (program.agency?.includes('DSWD') ? 'DSWD' : 'GOV')}
                           </span>
                           <button className="flex items-center gap-1 text-blue-500 font-bold italic uppercase tracking-wider text-[11px] hover:gap-2 transition-all">
                              DETAILS <ArrowRight className="w-3.5 h-3.5" />
                           </button>
                         </div>
                      </div>
                   </div>
                </div>
             </motion.div>
           ))}
        </div>
      </div>

      {/* Program Details Modal */}
      <ProgramDetailsModal 
        program={selectedProgram} 
        onClose={() => setSelectedProgram(null)} 
      />
    </div>
  );
};
