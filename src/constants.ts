import { PhilHealthCaseRate } from './types';

export const PHILHEALTH_CASE_RATES_2026: Record<string, PhilHealthCaseRate> = {
  'A00': { id: 'A00', description: 'Acute Gastroenteritis', rate: 6000 },
  'J18': { id: 'J18', description: 'Pneumonia (Moderate Risk)', rate: 15000 },
  'I10': { id: 'I10', description: 'Essential Hypertension', rate: 9000 },
  'E11': { id: 'E11', description: 'Type 2 Diabetes Mellitus', rate: 12000 },
  'N18': { id: 'N18', description: 'Chronic Kidney Disease', rate: 25000 },
  'O80': { id: 'O80', description: 'Normal Spontaneous Delivery', rate: 8000 },
  'C50': { id: 'C50', description: 'Breast Cancer (Chemotherapy)', rate: 50000 },
};

export const MALASAKIT_RULES = {
  governmentHospitalDiscount: 1.0, // Up to 100% after PhilHealth
  indigentPriority: true,
};

export const REQUIRED_DOCS_LOCALE: Record<string, string> = {
  'BrgyIndigency': 'Barangay Indigency Certificate',
  'ValidID': 'Valid Government ID (National ID/PhilHealth ID)',
  'MedCert': 'Medical Certificate / Clinical Abstract',
  'SOA': 'Statement of Account (Validated)',
  'SocialCaseStudy': 'DSWD Social Case Study Report',
};
