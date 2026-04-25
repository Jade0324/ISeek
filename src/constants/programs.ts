export interface Program {
  id: string;
  name: string;
  status: 'ACTIVE' | 'EXPIRED';
  provider: string;
  agency?: string;
  target?: string;
  type?: 'GOV' | 'CHARITY' | 'NGO';
  regions?: string[];
  postedTime?: string;
  coverage?: string;
  tags?: string[];
  description?: string;
  eligibility?: string[];
  requirements?: string[];
}

export const ACTIVE_PROGRAMS_2026: Program[] = [
  { 
    id: 'yakap', 
    name: 'YAKAP FUND', 
    status: 'ACTIVE', 
    provider: 'Government',
    agency: 'DEPARTMENT OF HEALTH (DOH)',
    target: 'Indigent & Vulnerable Citizens',
    type: 'GOV',
    regions: ['MDR & REGION IV-A'],
    postedTime: '2HRS AGO',
    coverage: 'UP TO 100%',
    tags: ['UNIVERSAL COVERAGE'],
    description: 'The YAKAP Fund is a priority UHC program designed to cover out-of-pocket expenses for indigent patients in accredited government facilities.',
    eligibility: ['Indigent status verified by DSWD', 'Filipino Citizenship', 'Admission in Government Hospital'],
    requirements: ['PhilSys ID / PhilHealth ID', 'Certificate of Indigency', 'Medical Abstract', 'Hospital Bill']
  },
  { 
    id: 'dswd-aics', 
    name: 'AICS MEDICAL SUPPORT', 
    status: 'ACTIVE', 
    provider: 'Government',
    agency: 'DSWD (SOCIAL WELFARE)',
    target: 'Crisis Situations',
    type: 'GOV',
    regions: ['NATIONAL', 'NCR'],
    postedTime: '5HRS AGO',
    coverage: 'VARIABLE',
    tags: ['CRISIS ASSISTANCE'],
    description: 'Assistance to Individuals in Crisis Situations (AICS) serves as a social safety net to support the recovery of individuals from unexpected crisis.',
    eligibility: ['Individuals in crisis', 'Verified through social worker interview'],
    requirements: ['Valid ID', 'Social Case Study Report', 'Medical Abstract']
  },
  { 
    id: 'red-cross', 
    name: 'BLOOD SAMARITAN', 
    status: 'ACTIVE', 
    provider: 'NGO',
    agency: 'PHILIPPINE RED CROSS',
    target: 'Transfusion Patients',
    type: 'NGO',
    regions: ['ALL REGIONS'],
    postedTime: '1DAY AGO',
    coverage: 'BLOOD UNITS',
    tags: ['EMERGENCY BLOOD'],
    description: 'Provides free blood units to indigent patients through a network of donors and volunteers.',
    eligibility: ['Indigent patients', 'Medical request for blood'],
    requirements: ['Blood Request Form', 'Certificate of Indigency']
  }
];
