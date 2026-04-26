import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, CheckCircle2, Lock, ArrowRight } from 'lucide-react';

interface ConsentGatewayProps {
  onAgree: () => void;
  onDecline: () => void;
}

export const ConsentGateway: React.FC<ConsentGatewayProps> = ({ onAgree, onDecline }) => {
  return (
    <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-6 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200"
      >
        <div className="bg-blue-600 p-8 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold uppercase tracking-tight leading-none">Privacy & Security</h2>
              <p className="text-[10px] uppercase font-bold tracking-widest text-blue-100 mt-1">UHC Compliance Protocol</p>
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-12">
          <div className="mb-10">
            <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase italic tracking-tighter">Explicit Data Privacy Consent</h3>
            
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-8 text-slate-600 text-sm leading-relaxed">
              <p className="mb-4">
                In compliance with the <span className="font-bold text-slate-900">Republic Act No. 10173 (Data Privacy Act of 2012)</span>, "ISeek" is committed to protecting your personal and health information.
              </p>
              <p>
                By proceeding, you authorize this application to:
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  title: 'Medical Data for Matching',
                  desc: 'We only use your uploaded bills to calculate PhilHealth, YAKAP, and NGO eligibility.'
                },
                {
                  title: 'Encrypted Storage',
                  desc: 'Your documents are AES-256 encrypted and never shared with commercial third parties.'
                },
                {
                  title: 'National Identity Link',
                  desc: 'We securely verify your identity with the National ID system to prevent fraud and bypass manual forms.'
                }
              ].map((item) => (
                <div key={`consent-point-${item.title.replace(/\s+/g, '-').toLowerCase()}`} className="flex gap-4 group">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-1 transition-colors group-hover:bg-emerald-500 group-hover:border-emerald-500">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onAgree}
              className="flex-grow bg-blue-600 text-white font-bold py-5 rounded-2xl text-center uppercase tracking-widest text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2"
            >
              I Agree & Continue
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={onDecline}
              className="px-8 py-5 text-slate-400 font-bold border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all uppercase tracking-widest text-[10px]"
            >
              Exit
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
