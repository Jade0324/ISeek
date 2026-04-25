import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { extractMedicalData } from '../services/geminiService';
import { MedicalExtraction } from '../types';

interface DocumentScannerProps {
  onDataExtracted: (data: MedicalExtraction) => void;
}

export const DocumentScanner: React.FC<DocumentScannerProps> = ({ onDataExtracted }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const fullDataUrl = reader.result as string;
        const base64 = fullDataUrl.split(',')[1];
        const data = await extractMedicalData(base64);
        onDataExtracted({ ...data, scanned_image: fullDataUrl });
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Failed to process document. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="panel border border-slate-200 rounded-xl overflow-hidden">
      <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
        <Camera className="w-5 h-5 text-blue-600" />
        Source Document Analysis
      </h2>
      
      <div 
        className="border-2 border-dashed border-slate-200 bg-slate-50 rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-blue-600 transition-all hover:bg-white"
        onClick={() => fileInputRef.current?.click()}
      >
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <RefreshCw className="w-10 h-10 animate-spin text-blue-600" />
            <span className="font-mono text-sm text-slate-500 animate-pulse">Gemini OCR • Processing...</span>
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 text-slate-300 mb-4" />
            <div className="text-center">
              <span className="text-slate-900 font-semibold block">Click to capture or upload photo</span>
              <span className="text-slate-400 text-xs mt-1 block italic">Clinical Abstract or Statement of Account</span>
            </div>
          </>
        )}
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        capture="environment"
        className="hidden"
      />
      
      <div className="mt-8 flex gap-3">
        <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded font-mono text-[10px] text-slate-600 font-bold uppercase">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> ICD-10 Extraction
        </div>
        <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded font-mono text-[10px] text-slate-600 font-bold uppercase">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> 2026 UHC Sync
        </div>
      </div>
    </div>
  );
};
