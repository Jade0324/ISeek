import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, ArrowRight, ShieldCheck, Fingerprint } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (phone: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = () => {
    if (phoneNumber.length < 10) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsOtpSent(true);
      setIsLoading(false);
    }, 1500);
  };

  const handleVerify = () => {
    if (otp.length < 4) return;
    setIsLoading(true);
    setTimeout(() => {
      onLogin(phoneNumber);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-6 text-white overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 italic">ISeek</h1>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">UHC Navigator</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
          {!isOtpSent ? (
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500">+63</span>
                  <input 
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="9XX XXX XXXX"
                    className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-14 pr-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono text-lg"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-3 italic leading-relaxed">
                  * A 6-digit OTP will be sent to verify your identity under the Anti-Fraud Protocol (EO 170).
                </p>
              </div>

              <button 
                onClick={handleSendOtp}
                disabled={isLoading || phoneNumber.length < 10}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2 transition-all uppercase tracking-widest text-sm"
              >
                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Get Verification Code'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Verification Code</label>
                <input 
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000 000"
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-4 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono text-center text-3xl tracking-[1em]"
                />
                <button 
                  onClick={() => setIsOtpSent(false)}
                  className="text-[10px] font-bold text-blue-400 uppercase mt-4 hover:underline"
                >
                  Edit phone number
                </button>
              </div>

              <button 
                onClick={handleVerify}
                disabled={isLoading || otp.length < 4}
                className="w-full bg-white text-[#0f172a] font-bold py-4 rounded-xl shadow-lg shadow-white/10 flex items-center justify-center gap-2 transition-all uppercase tracking-widest text-sm"
              >
                {isLoading ? <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" /> : 'Sign In'}
              </button>
            </div>
          )}
        </div>

        <div className="mt-12 flex justify-center gap-8 text-slate-500">
           <div className="flex flex-col items-center gap-2">
             <ShieldCheck className="w-5 h-5" />
             <span className="text-[9px] font-bold uppercase tracking-widest">Secured</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
};
