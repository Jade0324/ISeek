import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Fingerprint, 
  FileText, 
  ChevronRight, 
  QrCode, 
  Smartphone, 
  CheckCircle2, 
  ShieldCheck,
  ArrowLeft,
  Camera,
  UploadCloud,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { verifyUserSession } from '../services/firebase';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import { PHILIPPINE_PERSONAS } from '../constants/personas';

interface VerificationPortalProps {
  onVerify: (data?: any) => void;
  onClose: () => void;
  phoneNumber: string;
  userProfile?: any;
}

type VerificationStep = 'selection' | 'sms' | 'method' | 'manual' | 'qr' | 'success';

export const IdentityVerification: React.FC<VerificationPortalProps> = ({ onVerify, onClose, phoneNumber, userProfile }) => {
  const [step, setStep] = useState<VerificationStep>('selection');
  const [selectedMethod, setSelectedMethod] = useState<'qr' | 'manual' | null>(null);
  const [pin, setPin] = useState(['', '', '', '']);
  const [isScanning, setIsScanning] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  
  const [isProcessingDoc, setIsProcessingDoc] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Manual Form State
  const [formData, setFormData] = useState({
    citizenship: 'FILIPINO',
    firstName: '',
    lastName: '',
    birthdate: '',
    gender: ''
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingDoc(true);
    
    // Pick a random persona for simulation
    const randomPersona = PHILIPPINE_PERSONAS[Math.floor(Math.random() * PHILIPPINE_PERSONAS.length)];
    
    // Simulate OCR processing time
    setTimeout(() => {
      setFormData({
        citizenship: randomPersona.citizenship,
        firstName: randomPersona.firstName,
        lastName: randomPersona.lastName,
        birthdate: randomPersona.birthdate,
        gender: randomPersona.gender
      });
      setIsProcessingDoc(false);
    }, 2500);
  };

  // Camera cleanup on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try {
          if (scannerRef.current.getState() !== Html5QrcodeScannerState.NOT_STARTED) {
            scannerRef.current.stop().catch(() => {});
          }
        } catch (e) {
          // Ignore
        }
      }
    };
  }, []);

  const startScanner = async () => {
    setIsScanning(true);
    setScanError(null);
    try {
      const html5QrCode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5QrCode;
      
      const config = { fps: 10, qrbox: { width: 250, height: 250 } };
      
      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          // Success! Simulate PhilSys Decryption
          handleQrSuccess();
        },
        (errorMessage) => {
          // ignore scan failures
        }
      );
    } catch (err) {
      console.error(err);
      setScanError("Could not access camera. Please check permissions.");
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState();
        if (state !== Html5QrcodeScannerState.NOT_STARTED) {
          await scannerRef.current.stop();
        }
      } catch (err) {
        console.warn("Scanner stop warning:", err);
      }
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleQrSuccess = async () => {
    await stopScanner();
    setIsDecrypting(true);
    
    // Pick a random persona
    const randomPersona = PHILIPPINE_PERSONAS[Math.floor(Math.random() * PHILIPPINE_PERSONAS.length)];
    
    // Simulate complex decryption of encrypted PhilSys QR
    setTimeout(() => {
      setFormData({
        citizenship: randomPersona.citizenship,
        firstName: randomPersona.firstName,
        lastName: randomPersona.lastName,
        birthdate: randomPersona.birthdate,
        gender: randomPersona.gender
      });
      setIsDecrypting(false);
      setStep('manual');
      setSelectedMethod('manual'); // Transition to manual review
    }, 3000);
  };

  const handleSmsSubmit = () => {
    setStep('method');
  };

  const handleComplete = async () => {
    try {
      const profileData = selectedMethod === 'manual' ? {
        name: `${formData.firstName} ${formData.lastName}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthdate: formData.birthdate,
        gender: formData.gender,
        citizenship: formData.citizenship,
        isVerified: true,
        verificationMethod: 'manual'
      } : null;

      await verifyUserSession(selectedMethod || 'unknown', phoneNumber, profileData);
      setStep('success');
      setTimeout(() => {
        onVerify(profileData);
        onClose();
      }, 2500);
    } catch (error) {
      console.error("Verification failed:", error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ y: 50, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 50, scale: 0.95 }}
        className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden relative"
      >
        {/* Header */}
        <div className="p-6 flex justify-between items-center border-b border-slate-100 italic">
          <div className="flex items-center gap-2">
             <Fingerprint className="w-4 h-4 text-blue-600" />
             <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Identity Portal</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {/* Step: SMS Registration Simulation */}
            {step === 'selection' && (
              <motion.div 
                key="selection"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                   <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                      <Smartphone className="w-8 h-8 text-blue-600" />
                   </div>
                   <h3 className="text-xl font-bold text-slate-900">Secure Registration</h3>
                   <p className="text-xs text-slate-500 mt-2 italic leading-relaxed">Enter your mobile number to receive a secure one-time PIN.</p>
                </div>

                <div className="space-y-4">
                   <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-400">+63</span>
                      <input 
                        type="tel" 
                        placeholder="9XX XXX XXXX" 
                        className="bg-transparent border-none outline-none text-sm font-bold w-full"
                        defaultValue={phoneNumber.length >= 10 ? phoneNumber.slice(-10).replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3') : phoneNumber}
                        readOnly
                      />
                   </div>
                   <button 
                     onClick={() => setStep('sms')}
                     className="w-full bg-[#0f172a] text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-blue-900/10 active:scale-95 transition-all"
                   >
                     Get SMS PIN
                   </button>
                </div>
              </motion.div>
            )}

            {/* Step: PIN Input */}
            {step === 'sms' && (
              <motion.div 
                key="sms"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-8"
              >
                <div className="text-center">
                   <h3 className="text-xl font-bold text-slate-900">Enter OTP</h3>
                   <p className="text-xs text-slate-500 mt-2 italic leading-relaxed">We sent a 4-digit code to <span className="font-bold text-slate-900">+63 {phoneNumber.length >= 10 ? phoneNumber.slice(-10).replace(/(\d{3})(\d{3})(\d{4})/, '$1 *** $3') : phoneNumber}</span></p>
                </div>

                <div className="flex justify-center gap-3">
                   {pin.map((digit, i) => (
                     <input 
                       key={`pin-digit-${i}`}
                       type="text" 
                       maxLength={1}
                       className="w-14 h-16 bg-slate-50 border-2 border-slate-200 rounded-2xl text-center text-xl font-bold focus:border-blue-500 outline-none transition-colors"
                       value={digit}
                       onChange={(e) => {
                         const newPin = [...pin];
                         newPin[i] = e.target.value;
                         setPin(newPin);
                       }}
                       autoFocus={i === 0}
                     />
                   ))}
                </div>

                <button 
                  onClick={handleSmsSubmit}
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-blue-200"
                >
                  Verify Device
                </button>
                <button className="w-full text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">Resend Code in 00:54</button>
              </motion.div>
            )}

            {/* Step: Choose Method */}
            {step === 'method' && (
              <motion.div 
                key="method"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                   <h3 className="text-xl font-bold text-slate-900">Identity Source</h3>
                   <p className="text-xs text-slate-500 mt-2 italic leading-relaxed">Choose how you want to verify your citizenship.</p>
                </div>

                <div className="space-y-3">
                   <button 
                     onClick={() => {
                       setSelectedMethod('qr');
                       setStep('qr');
                     }}
                     className="w-full p-6 bg-slate-50 border border-slate-200 rounded-3xl flex items-center gap-4 hover:border-blue-500 transition-all text-left group"
                   >
                     <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600 group-hover:scale-110 transition-transform">
                        <QrCode className="w-6 h-6" />
                     </div>
                     <div className="flex-grow">
                        <h4 className="text-sm font-bold text-slate-900">PhilSys National QR</h4>
                        <p className="text-[10px] text-slate-500 italic uppercase tracking-wider font-bold mt-1 text-emerald-600">Recommended • Instant</p>
                     </div>
                     <ChevronRight className="w-4 h-4 text-slate-300" />
                   </button>

                   <button 
                     onClick={() => {
                       setSelectedMethod('manual');
                       setStep('manual');
                     }}
                     className="w-full p-6 bg-slate-50 border border-slate-200 rounded-3xl flex items-center gap-4 hover:border-blue-500 transition-all text-left group"
                   >
                     <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-400 group-hover:scale-110 transition-transform">
                        <FileText className="w-6 h-6" />
                     </div>
                     <div className="flex-grow">
                        <h4 className="text-sm font-bold text-slate-900">Birth Certificate / Manual</h4>
                        <p className="text-[10px] text-slate-500 italic uppercase tracking-wider font-bold mt-1">Alternative Method</p>
                     </div>
                     <ChevronRight className="w-4 h-4 text-slate-300" />
                   </button>
                </div>
              </motion.div>
            )}

            {/* Step: PhilSys QR Scan Simulation */}
            {step === 'qr' && (
              <motion.div 
                key="qr"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-8"
              >
                <div className="text-center">
                   <h3 className="text-xl font-bold text-slate-900">Scan QR Code</h3>
                   <p className="text-xs text-slate-500 mt-2 italic leading-relaxed">Present your PhilID or ePhilID QR code to the camera.</p>
                </div>

                <div className="relative aspect-square max-w-[240px] mx-auto bg-slate-100 rounded-[3rem] overflow-hidden border-8 border-slate-50 flex items-center justify-center">
                   <div id="qr-reader" className="absolute inset-0 w-full h-full"></div>
                   
                   <AnimatePresence>
                    {!isScanning && !isDecrypting && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/5 backdrop-blur-[2px]"
                      >
                         <QrCode className="w-24 h-24 text-slate-300" />
                         {scanError && (
                           <div className="mt-4 px-4 py-2 bg-red-50 text-red-500 text-[10px] font-bold uppercase tracking-wider rounded-full border border-red-100 flex items-center gap-2">
                              <AlertCircle className="w-3 h-3" /> {scanError}
                           </div>
                         )}
                      </motion.div>
                    )}

                    {isDecrypting && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0f172a] text-white p-6 text-center"
                      >
                         <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                         <ShieldCheck className="w-8 h-8 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[44px]" />
                         <h4 className="text-[10px] font-black uppercase tracking-[0.2em] italic">Decrypting Secure QR</h4>
                         <p className="text-[9px] text-slate-400 mt-2 font-mono">NODEVERIFY_AES_256_ACTIVE...</p>
                         <div className="w-full h-1 bg-slate-800 rounded-full mt-6 overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '100%' }}
                              transition={{ duration: 3 }}
                              className="h-full bg-blue-500"
                            />
                         </div>
                      </motion.div>
                    )}
                   </AnimatePresence>

                   <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-0.5 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-pulse z-10 pointer-events-none"></div>
                </div>

                <div className="space-y-4">
                  {!isScanning ? (
                    <button 
                      onClick={startScanner}
                      className="w-full bg-[#0f172a] text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <Camera className="w-4 h-4" /> Start Camera
                    </button>
                  ) : (
                    <button 
                      onClick={stopScanner}
                      className="w-full bg-red-500 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" /> Stop Camera
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      stopScanner();
                      setStep('method');
                    }}
                    className="w-full text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-3 h-3" /> Back to methods
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step: Manual Form with Birth Cert */}
            {step === 'manual' && (
              <motion.div 
                key="manual"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6 max-h-[500px] overflow-y-auto pr-2 no-scrollbar"
              >
                <div className="text-center mb-6">
                   <h3 className="text-xl font-bold text-slate-900 italic">Form Submission</h3>
                   <p className="text-xs text-slate-500 mt-2 italic leading-relaxed">Fill out your details exactly as they appear on your Birth Certificate.</p>
                </div>

                <div className="space-y-6">
                   <div>
                     <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Photo Identity (Birth Cert)</label>
                     <input 
                       type="file" 
                       ref={fileInputRef}
                       onChange={handleFileUpload}
                       accept="image/*,.pdf"
                       className="hidden" 
                     />
                     <button 
                       onClick={() => fileInputRef.current?.click()}
                       disabled={isProcessingDoc}
                       className="w-full aspect-[16/6] rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center gap-2 group hover:bg-white hover:border-blue-200 transition-all relative overflow-hidden"
                     >
                       <AnimatePresence>
                         {isProcessingDoc ? (
                           <motion.div 
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             className="absolute inset-0 bg-[#0f172a] text-white flex flex-col items-center justify-center z-10"
                           >
                             <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
                             <span className="text-[9px] font-black uppercase tracking-widest italic">Scanning Document...</span>
                             <div className="w-1/2 h-0.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: '100%' }}
                                  transition={{ duration: 2.5 }}
                                  className="h-full bg-blue-500"
                                />
                             </div>
                           </motion.div>
                         ) : (
                           <>
                             <UploadCloud className="w-10 h-10 text-slate-300 group-hover:text-blue-400 transition-colors" />
                             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600">Tap to upload photo or PDF</span>
                           </>
                         )}
                       </AnimatePresence>
                     </button>
                   </div>

                   <div className="grid grid-cols-1 gap-3">
                      {[
                        { label: 'Citizenship', key: 'citizenship', holder: 'FILIPINO' },
                        { label: 'First Name', key: 'firstName', holder: 'e.g. JUAN' },
                        { label: 'Last Name', key: 'lastName', holder: 'e.g. DELA CRUZ' },
                        { label: 'Birthdate', key: 'birthdate', holder: 'MM/DD/YYYY' },
                        { label: 'Gender', key: 'gender', holder: 'MALE/FEMALE' }
                      ].map((field) => (
                        <div key={`id-field-${field.key}`} className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                           <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{field.label}</label>
                           <input 
                             type="text" 
                             placeholder={field.holder}
                             value={(formData as any)[field.key]}
                             onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                             className="bg-transparent border-none outline-none text-xs font-bold w-full uppercase"
                           />
                        </div>
                      ))}
                   </div>

                   <button 
                     onClick={handleComplete}
                     className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-blue-200 sticky bottom-0"
                   >
                     Submit for Review
                   </button>
                </div>
              </motion.div>
            )}

            {/* Step: Success */}
            {step === 'success' && (
              <motion.div 
                key="success"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="py-12 flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-8 relative">
                   <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                   <motion.div 
                     initial={{ scale: 0 }}
                     animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0] }}
                     transition={{ repeat: Infinity, duration: 2 }}
                     className="absolute inset-0 bg-emerald-500 rounded-full"
                   />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight italic">Success!</h3>
                <p className="text-sm text-slate-500 mt-3 max-w-[240px] italic leading-relaxed">
                  Your identity has been verified through <span className="text-blue-600 font-bold uppercase text-[10px] tracking-widest">UHC Registry</span>
                </p>
                <div className="mt-8 flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                   <ShieldCheck className="w-4 h-4 text-emerald-600" />
                   <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Full Access Unlocked</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 p-4 flex justify-center items-center gap-2 border-t border-slate-100">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">Encrypted Identity Node • 2048-BIT</span>
        </div>
      </motion.div>
    </motion.div>
  );
};
