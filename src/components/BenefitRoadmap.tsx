import React from 'react';
import { CheckCircle2, FileText, ChevronRight, Info, Download, Heart, ArrowLeft, ShieldCheck, Fingerprint, MapPin, AlertCircle, Search, Send, Loader2, Clock, X } from 'lucide-react';
import { MedicalExtraction, PatientData } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { PasigMap } from './PasigMap';
import { QRCodeCanvas } from 'qrcode.react';
import { ACTIVE_PROGRAMS_2026, Program } from '../constants/programs';
import { ProgramDetailsModal } from './ProgramDetailsModal';

interface BenefitRoadmapProps {
  extraction: MedicalExtraction;
  patient: PatientData;
  onReset: () => void;
}

export const BenefitRoadmap: React.FC<BenefitRoadmapProps> = ({ extraction, patient, onReset }) => {
  const [showMap, setShowMap] = React.useState(false);
  const [showSendModal, setShowSendModal] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);
  const [isSent, setIsSent] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [selectedPrograms, setSelectedPrograms] = React.useState<string[]>([]);
  const [viewingFullImage, setViewingFullImage] = React.useState(false);
  const [selectedProgramDetails, setSelectedProgramDetails] = React.useState<Program | null>(null);
  
  const qrRef = React.useRef<HTMLDivElement>(null);

  const { 
    document_analysis, 
    financial_summary, 
    recommended_programs, 
    anti_red_tape_guide,
    scanned_image
  } = extraction;

  // Map recommended programs to full records
  const enrichedPrograms = React.useMemo(() => {
    return recommended_programs.map(rec => {
      const full = ACTIVE_PROGRAMS_2026.find(p => 
        p.name.toLowerCase().includes(rec.agency_name.toLowerCase()) || 
        p.agency?.toLowerCase().includes(rec.agency_name.toLowerCase())
      );
      return { rec, full };
    });
  }, [recommended_programs]);

  React.useEffect(() => {
    if (recommended_programs.length > 0) {
      setSelectedPrograms(recommended_programs.map(p => p.agency_name));
    }
  }, [recommended_programs]);

  const verificationId = React.useMemo(() => 
    `PH-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${new Date().getFullYear()}`, 
  []);

  const handleSavePass = () => {
    setIsSaving(true);
    
    // Actually download the QR code as PNG
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `PatientPass_${patient.name.replace(/\s+/g, '_')}_${verificationId}.png`;
      link.href = url;
      link.click();
    }

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  const handleSendRequests = () => {
    setShowSendModal(true);
  };

  const confirmSend = () => {
    setIsSending(true);
    setShowSendModal(false);
    // Simulate sending data to multiple agencies via PhilSys API
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
    }, 2000);
  };

  // Math logic for strict accuracy
  const totalBill = document_analysis.total_bill;
  const philhealth = financial_summary.philhealth_coverage;
  const yakap = financial_summary.yakap_coverage;
  const other = financial_summary.ngo_dswd_coverage;
  const totalDeductions = philhealth + yakap + other;
  const actualNetPayable = Math.max(0, totalBill - totalDeductions);
  const actualFundingPercentage = Math.round((totalDeductions / totalBill) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full"
    >
      {/* Local Top Nav */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase">ID: {verificationId}</span>
          <div className="status-pill bg-emerald-50 text-emerald-600 border border-emerald-100 italic">Eligible</div>
        </div>
      </div>

      <div className="balance-grid flex-grow overflow-auto">
        {/* LEFT PANEL: Patient Information */}
      <aside className="panel border-r border-slate-200">
        <h2 className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-4">UHC Citizen Health Wallet</h2>
        <div className="mb-8">
          <div className="text-2xl font-bold text-slate-900">{patient.name}</div>
          <p className="text-sm text-slate-500 mt-1 uppercase tracking-tight">
            {patient.category} • {patient.age} years old
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {patient.isVerified && (
              <span className="status-pill bg-blue-600 text-white flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Identity Verified
              </span>
            )}
            <span className="status-pill bg-emerald-100 text-emerald-700">PhilHealth Active</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Hospital Bill Analysis</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase">Facility</label>
                <p className="text-xs font-bold text-slate-700">{document_analysis.hospital_name}</p>
                <span className="text-[9px] uppercase font-bold text-slate-400">{document_analysis.hospital_type} Setting</span>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Diagnosis</label>
                <p className="text-xs font-bold text-slate-700">{document_analysis.diagnosis}</p>
              </div>
              {scanned_image && (
                <div className="pt-2 border-t border-slate-200">
                  <label className="text-[9px] font-bold text-slate-400 uppercase mb-2 block">Attached Document</label>
                  <div 
                    onClick={() => setViewingFullImage(true)}
                    className="relative w-full aspect-video rounded-lg overflow-hidden bg-slate-200 cursor-pointer group"
                  >
                    <img src={scanned_image} alt="Scanned Document" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Search className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card-border p-4 bg-emerald-50 border-emerald-100">
            <h3 className="text-[10px] font-bold text-emerald-800 uppercase mb-3 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Pasig City Health Map
            </h3>
            <p className="text-[10px] text-emerald-700 mb-4 italic uppercase tracking-wider font-bold">Recommended Hospitals, Clinics, and Barangay Centers</p>
            <button 
              onClick={() => setShowMap(true)}
              className="mt-2 w-full py-3 bg-white border border-emerald-200 text-emerald-600 text-[10px] font-bold uppercase rounded hover:bg-emerald-100 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Search className="w-3 h-3" /> View Local Network Map
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN SECTION: Financial Breakdown */}
      <section className="panel space-y-8">
        <div>
          <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Financial Support Breakdown</h2>
          <div className="relative overflow-hidden bg-[#0f172a] text-white rounded-2xl p-8 shadow-2xl border border-white/5">
             <div className="relative z-10">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 sm:gap-4 mb-8">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 opacity-80">Total Hospital Bill</div>
                    <div className="text-2xl sm:text-4xl font-black italic tracking-tighter leading-none">
                      ₱{totalBill.toLocaleString()}
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <div className="text-[10px] text-emerald-400 uppercase tracking-widest mb-1.5 opacity-80">Estimated Net Payable</div>
                    <div className="text-xl sm:text-3xl font-black italic text-emerald-400 leading-none tracking-tighter">
                      {patient.isVerified ? `₱${actualNetPayable.toLocaleString()}.00` : 'Verification Req.'}
                    </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400">
                      <span>UHC Coverage Overview</span>
                      <span>{patient.isVerified ? `${actualFundingPercentage}% Funded` : 'Estimates Hidden'}</span>
                    </div>
                    <div className="h-3 bg-slate-800 rounded-full flex overflow-hidden">
                      {patient.isVerified ? (
                        <>
                          <div className="h-full bg-blue-500" style={{ width: `${(philhealth / totalBill) * 100}%` }} />
                          <div className="h-full bg-emerald-500" style={{ width: `${(yakap / totalBill) * 100}%` }} />
                          <div className="h-full bg-purple-500" style={{ width: `${(other / totalBill) * 100}%` }} />
                        </>
                      ) : (
                        <div className="h-full bg-slate-700 w-full animate-pulse" />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 font-black uppercase tracking-widest">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-slate-500 text-[9px]">PhilHealth Coverage</span>
                      <span className="text-blue-400 text-[10px] italic">{patient.isVerified ? `-₱${philhealth.toLocaleString()}` : '••••••'}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-emerald-500/70 text-[9px]">YAKAP Benefit</span>
                      <span className="text-emerald-400 text-[10px] italic">{patient.isVerified ? `-₱${yakap.toLocaleString()}` : '••••••'}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                       <span className="text-slate-500 text-[9px]">Other Aid (DSWD/NGO)</span>
                       <span className="text-purple-400 text-[10px] italic">{patient.isVerified ? `-₱${other.toLocaleString()}` : '••••••'}</span>
                    </div>
                  </div>
               </div>
               {!patient.isVerified && (
                 <div className="mt-6 p-4 bg-blue-600/20 border border-blue-500/30 rounded-xl flex items-center gap-3">
                   <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
                   <p className="text-[10px] text-blue-100 italic leading-tight uppercase font-bold tracking-wider">
                     Verification Required: Unlock exact coverage estimates and automated billing deductions by verifying your identity in the Profile tab.
                   </p>
                 </div>
               )}
             </div>
             <div className="absolute -right-8 -bottom-8 opacity-5">
               <Heart className="w-56 h-56" />
             </div>
          </div>
        </div>

        {/* Recommended Programs */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Active Partner Programs</h2>
            <div className="flex-grow h-px bg-slate-100" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrichedPrograms.map(({ rec, full }, idx) => (
              <motion.div 
                key={`program-card-${idx}`}
                whileHover={{ y: -2 }}
                onClick={() => full && setSelectedProgramDetails(full)}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:border-blue-500/30 transition-all cursor-pointer group"
              >
                <div className="flex gap-4">
                   {/* Logo / Illustration Placeholder */}
                   <div className="w-14 h-14 bg-slate-50 rounded-xl flex-shrink-0 flex items-center justify-center border border-slate-100 overflow-hidden">
                      {full?.id === 'yakap' ? (
                        <div className="flex flex-col items-center opacity-80 scale-[0.6]">
                           <p className="text-[5px] font-black text-blue-600 uppercase">PhilHealth</p>
                           <p className="text-[10px] font-black text-orange-400 italic leading-none">YAKAP</p>
                        </div>
                      ) : (
                        <Search className="w-6 h-6 text-slate-300" />
                      )}
                   </div>

                   <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start mb-1.5">
                        <h3 className="text-[11px] font-black italic uppercase text-slate-900 tracking-tight leading-tight">{full?.name || rec.agency_name}</h3>
                        <div className="p-1 bg-emerald-50 rounded-lg shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                      </div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.1em] mb-2">{full?.agency || 'Verified Partner'}</p>
                      
                      <div className="flex flex-wrap gap-1.5">
                         <span className="bg-emerald-100 text-emerald-700 text-[7px] font-black px-2 py-0.5 rounded-md uppercase tracking-tight">{rec.coverage_type}</span>
                         {full?.postedTime && <span className="bg-slate-100 text-slate-500 text-[7px] font-black px-2 py-0.5 rounded-md uppercase tracking-tight">{full.postedTime}</span>}
                      </div>

                      <div className="flex justify-end mt-3">
                        <div className="text-[8px] font-black italic uppercase text-blue-600 tracking-widest group-hover:translate-x-1 transition-all flex items-center gap-1.5">
                          View Rules <ChevronRight className="w-3 h-3" />
                        </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RIGHT PANEL: Anti-Red Tape Checklist */}
      <aside className="panel bg-slate-50 border-l border-slate-200">
        <h2 className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-6">Anti-Red Tape (ART) Guide</h2>
        <div className="space-y-6 flex-grow">
          {anti_red_tape_guide.map((step, idx) => (
            <div key={`art-step-${idx}`} className="flex gap-4 group">
              <div className="w-6 h-6 rounded-full border border-slate-300 bg-white flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0">
                {idx + 1}
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                {step}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-slate-200">
          <div className="bg-[#0f172a] p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <ShieldCheck className="w-24 h-24" />
            </div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                   <h3 className="text-xl font-black italic uppercase tracking-tighter mb-1">Patient Pass</h3>
                   <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                       <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400">Auth Token Active</p>
                   </div>
                </div>
              </div>

              <div ref={qrRef} className="w-full bg-white aspect-square rounded-2xl flex items-center justify-center mb-6 relative group overflow-hidden p-4 shadow-xl">
                  <QRCodeCanvas 
                    value={JSON.stringify({
                      id: verificationId,
                      patient: patient.name,
                      bill: document_analysis.total_bill,
                      diagnosis: document_analysis.diagnosis,
                      uhc_eligible: true
                    })} 
                    size={240}
                    level="H"
                    includeMargin={false}
                  />
              </div>

              <div className="space-y-3">
                <button 
                  onClick={handleSavePass}
                  disabled={isSaving}
                  className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg flex items-center justify-center gap-2 ${
                    saveSuccess ? 'bg-emerald-500 text-white' : 'bg-white text-slate-900 group-hover:bg-blue-50'
                  }`}
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : saveSuccess ? <CheckCircle2 className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                  {saveSuccess ? 'Pass Saved' : 'Download Pass'}
                </button>
                
                <button 
                  onClick={handleSendRequests}
                  disabled={isSending || isSent}
                  className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                    isSent ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-blue-600 text-white shadow-blue-500/20'
                  }`}
                >
                  {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : isSent ? <CheckCircle2 className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                  {isSent ? 'Agency Pings Sent' : 'Fast-Track Inquiries'}
                </button>
              </div>

              <p className="text-[8px] text-slate-500 text-center italic mt-4 uppercase font-bold tracking-widest leading-tight">
                Validated for Pasig City General Hospital & UHC Partners
              </p>
            </div>
          </div>
        </div>
      </aside>
      </div>
      <AnimatePresence>
        {showMap && <PasigMap onClose={() => setShowMap(false)} />}
        <ProgramDetailsModal 
          program={selectedProgramDetails} 
          onClose={() => setSelectedProgramDetails(null)} 
        />
        {viewingFullImage && scanned_image && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setViewingFullImage(false)}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-4xl max-h-[90vh] w-full flex items-center justify-center"
            >
              <img 
                src={scanned_image} 
                alt="Scanned Document Full View" 
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            </motion.div>
            <button 
              onClick={() => setViewingFullImage(false)}
              className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white"
            >
              <X className="w-8 h-8" />
            </button>
          </motion.div>
        )}
        {showSendModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 italic">Select Programs to Notify</h3>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Multi-Agency Fast-Track</p>
              </div>
              
              <div className="p-6 space-y-3">
                {recommended_programs.map((program, idx) => (
                  <div 
                    key={`modal-program-${idx}`}
                    onClick={() => {
                      if (selectedPrograms.includes(program.agency_name)) {
                        setSelectedPrograms(prev => prev.filter(p => p !== program.agency_name));
                      } else {
                        setSelectedPrograms(prev => [...prev, program.agency_name]);
                      }
                    }}
                    className={`p-4 border rounded-xl flex justify-between items-center cursor-pointer transition-all ${
                      selectedPrograms.includes(program.agency_name) 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{program.agency_name}</div>
                      <div className="text-[9px] text-slate-500 uppercase font-bold">{program.coverage_type}</div>
                    </div>
                    {selectedPrograms.includes(program.agency_name) && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                ))}
              </div>
              
              <div className="p-6 border-t border-slate-100 flex gap-3">
                <button 
                  onClick={() => setShowSendModal(false)}
                  className="flex-1 py-3 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmSend}
                  disabled={selectedPrograms.length === 0}
                  className="flex-2 bg-blue-600 text-white font-bold py-3 px-8 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-blue-200 disabled:opacity-50"
                >
                  Send to {selectedPrograms.length} Agencies
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

