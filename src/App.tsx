/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Heart, 
  Users, 
  Search, 
  ShieldCheck,
  X,
  AlertCircle,
  Plus,
  Smartphone,
  Lock,
  User,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DocumentScanner } from './components/DocumentScanner';
import { BenefitRoadmap } from './components/BenefitRoadmap';
import { LoginScreen } from './components/LoginScreen';
import { ConsentGateway } from './components/ConsentGateway';
import { HomeTab } from './components/HomeTab';
import { ProfileTab } from './components/ProfileTab';
import { IdentityVerification } from './components/IdentityVerification';
import { PatientData, MedicalExtraction, AppTab } from './types';
import { checkUserSession, loadUserActivities, saveUserActivity, clearAllLocalSessions, getUserProfile, trackLoginAttempt } from './services/firebase';

export default function App() {
  const [step, setStep] = useState<'login' | 'consent' | 'app' | 'roadmap' | 'emergency'>('login');
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [isVerified, setIsVerified] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

  const handleLogin = async (phone: string) => {
    setCurrentUser(phone);
    setStep('consent');
    try {
      await trackLoginAttempt(phone);
    } catch (error) {
      console.error("Failed to track login:", error);
    }
  };

  const handleLogout = () => {
    setStep('login');
    setCurrentUser(null);
    setUserProfile(null);
    setIsVerified(false);
    setActiveTab('home');
    setExtraction(null);
    setCachedBenefits([]);
    setRecentActivities([]);
  };

  const handleReset = () => {
    clearAllLocalSessions();
    handleLogout();
  };
  const [loadingSession, setLoadingSession] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);
  const [extraction, setExtraction] = useState<MedicalExtraction | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [cachedBenefits, setCachedBenefits] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  // Session Restoration
  useEffect(() => {
    if (!currentUser || step !== 'app') return;

    async function restoreSession() {
      setLoadingSession(true);
      try {
        const profile = await getUserProfile(currentUser!) as any;
        if (profile) {
          setUserProfile(profile);
          setIsVerified(profile.isVerified || false);
        }

        // Load persisted activities
        const activities = await loadUserActivities(currentUser!) as any[];
        setRecentActivities(activities);
        
        const extractions = activities.filter((a: any) => a.type === 'extraction');
        const benefits = activities.filter((a: any) => a.type === 'benefit');

        if (extractions.length > 0) {
          setExtraction(extractions[0].data);
        }
        if (benefits.length > 0) {
          setCachedBenefits(benefits.map((b: any) => b.data));
        }
      } catch (error) {
        console.error("Session restoration failed:", error);
      } finally {
        setTimeout(() => setLoadingSession(false), 800);
      }
    }
    restoreSession();
  }, [currentUser, step]);

  // Simulate Offline Persistence
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const saved = localStorage.getItem('avengers_cache_2026');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCachedBenefits(parsed);
      } catch (e) {
        console.error("Failed to parse cache", e);
        setCachedBenefits([]);
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleExtraction = async (data: MedicalExtraction) => {
    setExtraction(data);
    
    // Persist to Firestore
    if (currentUser) {
      await saveUserActivity(currentUser, 'extraction', data);
      // Refresh local activities
      const updated = await loadUserActivities(currentUser);
      setRecentActivities(updated);
    }
    
    // Auto-save to local cache for offline
    const newCache = [{ patient: userProfile, data, timestamp: new Date().toISOString() }, ...cachedBenefits];
    setCachedBenefits(newCache);
    localStorage.setItem('avengers_cache_2026', JSON.stringify(newCache.slice(0, 5)));
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-[#0f172a] font-sans flex flex-col selection:bg-blue-100 italic tracking-tight">
      <AnimatePresence>
        {loadingSession && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#0f172a] flex flex-col items-center justify-center text-white p-6"
          >
            <div className="relative">
               <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
               <ShieldCheck className="w-6 h-6 text-white absolute inset-0 m-auto" />
            </div>
            <h2 className="mt-8 text-xs font-black uppercase tracking-[0.3em] text-slate-400">Restoring Secure Session</h2>
            <div className="mt-4 flex gap-1">
               {[0, 1, 2].map(i => (
                 <motion.div 
                   key={`loading-dot-${i}`}
                   animate={{ opacity: [0.3, 1, 0.3] }}
                   transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                   className="w-1 h-1 bg-blue-500 rounded-full"
                 />
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {step === 'login' && (
          <LoginScreen key="login" onLogin={handleLogin} />
        )}
        
        {step === 'consent' && (
          <ConsentGateway 
            key="consent" 
            onAgree={() => setStep('app')} 
            onDecline={() => setStep('login')} 
          />
        )}

        {/* AUTHENTICATED APP SHELL */}
        {['app', 'roadmap', 'emergency'].includes(step) && (
          <motion.div 
            key="app-shell"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex flex-col relative bg-[#0a1121]"
          >
            {/* Conditional Header for Roadmap or Main tabs */}
            {activeTab !== 'home' && (
              <header className="bg-[#abb5be] text-[#0f172a] p-4 h-20 flex justify-between items-center shrink-0 z-40">
                <div 
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => {
                    setStep('app');
                    setActiveTab('home');
                    setExtraction(null);
                  }}
                >
                  <div className="w-10 h-10 bg-white/40 rounded-full flex items-center justify-center border border-white/20">
                    <User className="w-6 h-6 text-[#0f172a]" />
                  </div>
                  <div>
                    <h1 className="text-lg font-black leading-none tracking-tight uppercase italic">{activeTab === 'profile' ? 'My Profile' : 'AI Scanner'}</h1>
                    <p className="text-[9px] text-[#0f172a]/60 mt-1 uppercase tracking-widest font-mono">UHC Navigator 2026</p>
                  </div>
                </div>
                
                <div className="flex gap-1">
                  <button className="p-2 hover:bg-black/5 rounded transition-colors" onClick={() => setStep('emergency')}><AlertCircle className="w-5 h-5 text-red-600" /></button>
                  {step !== 'app' && (
                    <button 
                      onClick={() => {
                        setStep('app');
                        setExtraction(null);
                      }}
                      className="p-2 hover:bg-black/5 rounded transition-colors"
                    >
                      <X className="w-5 h-5 text-slate-700" />
                    </button>
                  )}
                </div>
              </header>
            )}

            <main className="flex-grow flex flex-col overflow-hidden relative">
              <AnimatePresence mode="wait">
                {step === 'app' && (
                  <motion.div 
                    key="tab-container" 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-grow flex flex-col h-full overflow-hidden"
                  >
                     {activeTab === 'home' && (
                       <HomeTab 
                         hasActivity={recentActivities.length > 0} 
                         recentActivities={recentActivities}
                         isVerified={isVerified}
                         onVerify={() => setShowVerification(true)}
                         userName={userProfile?.fullName}
                       />
                     )}
                     
                      {activeTab === 'scan' && (
                        extraction ? (
                          <div className="flex-grow overflow-hidden flex flex-col">
                            <BenefitRoadmap 
                              extraction={extraction} 
                              patient={userProfile || { name: 'Unverified User', category: 'General', isVerified: false, age: 0 }} 
                              onReset={() => {
                                setExtraction(null);
                              }}
                            />
                          </div>
                        ) : (
                          <div className="flex-grow overflow-y-auto p-6 md:p-12 bg-slate-50 pb-24">
                             <div className="max-w-3xl mx-auto space-y-8">
                                <div className="text-center mb-8">
                                   <div className="w-16 h-16 bg-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                      <Search className="w-8 h-8 text-blue-600" />
                                   </div>
                                   <h2 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 mb-2">AI Scan Engine</h2>
                                   <p className="text-sm text-slate-500 max-w-sm mx-auto italic">Our AI extracts bill details to identify programs you may qualify for. Complete verification to unlock exact coverage estimates.</p>
                                </div>
                                <DocumentScanner onDataExtracted={handleExtraction} />
                             </div>
                          </div>
                        )
                      )}
                     
                     {activeTab === 'profile' && (
                       <ProfileTab 
                         isVerified={isVerified} 
                         phoneNumber={currentUser || ''}
                         userProfile={userProfile}
                         recentActivities={recentActivities}
                         onLogout={handleLogout}
                         onResetAll={handleReset}
                         onVerify={() => setShowVerification(true)} 
                       />
                     )}
                     
                     <AnimatePresence>
                        {showVerification && (
                          <IdentityVerification 
                            phoneNumber={currentUser || ''}
                            onClose={() => setShowVerification(false)}
                            onVerify={async () => {
                              setIsVerified(true);
                              const profile = await getUserProfile(currentUser!);
                              setUserProfile(profile);
                            }}
                          />
                        )}
                     </AnimatePresence>
                     
                     {/* System Navigation - Slim & Aesthetic */}
                     <nav className="fixed bottom-6 left-6 right-6 h-12 bg-[#abb5be]/80 backdrop-blur-md flex justify-around items-center z-50 rounded-[1.5rem] shadow-xl border border-white/20">
                        {/* Floating Action Button - Integrated & Slimmer */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-[#0a1121] rounded-full flex items-center justify-center shadow-lg border-4 border-[#0a1121]">
                           <button 
                             onClick={() => {
                               if (isVerified) setActiveTab('scan');
                               else setShowVerification(true);
                             }}
                             className={`w-10 h-10 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-95 ${
                               activeTab === 'scan' ? 'bg-blue-500 text-white' : 'bg-[#0a1121] text-white border border-white/10'
                             }`}
                           >
                             <Smartphone className="w-5 h-5" />
                           </button>
                        </div>

                        <button 
                          onClick={() => setActiveTab('home')}
                          className={`flex flex-col items-center justify-center w-1/3 transition-all ${activeTab === 'home' ? 'text-[#0a1121]' : 'text-[#0a1121]/40'}`}
                        >
                           <Users className="w-4 h-4 mb-0.5" />
                           <span className="text-[7px] font-black uppercase tracking-widest leading-none">HOME</span>
                        </button>

                        <div className="w-12" /> {/* Spacer for FAB */}

                        <button 
                          onClick={() => setActiveTab('profile')}
                          className={`flex flex-col items-center justify-center w-1/3 transition-all ${activeTab === 'profile' ? 'text-[#0a1121]' : 'text-[#0a1121]/40'}`}
                        >
                           <User className="w-4 h-4 mb-0.5" />
                           <span className="text-[7px] font-black uppercase tracking-widest leading-none">PROFILE</span>
                        </button>
                     </nav>
                  </motion.div>
                )}

                {step === 'emergency' && (
                  <motion.div 
                    key="emergency"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="max-w-2xl mx-auto w-full px-6 py-12"
                  >
                    <div className="bg-red-600 rounded-[2.5rem] p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                          <ShieldCheck className="w-10 h-10 text-red-200" />
                          <h2 className="text-3xl font-black uppercase tracking-tighter">Emergency Protocol</h2>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-8">
                          <p className="text-lg leading-relaxed mb-6 font-medium italic">"RA 8344: Hospitals cannot demand advance payment for serious cases."</p>
                          <button 
                             onClick={() => setStep('app')}
                             className="w-full bg-white text-red-600 font-bold py-4 rounded-xl uppercase tracking-widest text-sm"
                          >
                             I Understand, Go Back
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
