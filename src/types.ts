export type AppTab = 'home' | 'scan' | 'profile';

export interface PatientData {
  id: string;
  name: string;
  category: 'Senior' | 'PWD' | 'Indigent' | 'Regular';
  isVerified: boolean;
  age?: number;
  isPhilSysVerified?: boolean;
  isListahananMatch?: boolean;
}

export interface RecommendedProgram {
  agency_name: string;
  coverage_type: string;
}

export interface MedicalExtraction {
  document_analysis: {
    hospital_name: string;
    hospital_type: 'Public' | 'Private';
    diagnosis: string;
    total_bill: number;
  };
  financial_summary: {
    philhealth_coverage: number;
    yakap_coverage: number;
    ngo_dswd_coverage: number;
    net_payable: number;
  };
  recommended_programs: RecommendedProgram[];
  anti_red_tape_guide: string[];
  scanned_image?: string;
}

export interface BenefitRoadmap {
  diagnosisSummary: string;
  estimatedCoverage: number;
  malasakitEligible: boolean;
  requiredDocuments: string[];
  nextSteps: string[];
  qrCodeData: string;
}

export interface PhilHealthCaseRate {
  id: string;
  description: string;
  rate: number;
}
