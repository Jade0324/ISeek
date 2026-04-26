# ISeek: 2026 UHC Digital Navigator
## Current Prototype Status (Beta v1.2)

This documentation tracks the current functional state of the "ISeek" prototype, a mobile-first Philippine Universal Health Care (UHC) assistant.

---

## 1. Functional Features (Implemented)

### A. Authentication & Enrollment
- **Session-Based Early Login:** As requested, the phone number is now tracked in Firestore immediately upon signing in, creating a persistent session.
- **Contextual UI:** The application reflects the login phone number across all identification screens (Secure Registration, OTP, and Manual Review) to ensure consistency.

### B. Identity Verification (PhilSys Logic)
- **Hybrid Enrollment:** 
    - **PhilSys QR Scan:** Real-time camera integration using `html5-qrcode`. It simulates the decryption of PhilSys encrypted QR codes, transitioning to a pre-filled review form using a pool of high-quality Filipino personas.
    - **Document Upload (OCR):** Supports Image/PDF upload for Birth Certificates. Simulates a 2.5s AI scan to extract and populate demographics.
- **Identity Vault:** Stores verified status, blood type, and location. Access to the "Scan" function is locked until verification is complete.

### C. AI Scan Engine (UHC Analysis)
- **Medical Extraction:** Captures hospital bills or abstracts and identifies PhilHealth Case Rates and local government coverages.
- **Financial Benefit Roadmap:** Generates a real-time visualization of coverage vs. out-of-pocket costs.

### D. Security & Compliance
- **Emergency Protocol:** Instant access to RA 8344 (Anti-Hospital Deposit Law) guidelines via the top-right alert button.
- **Privacy First:** All "extractions" are localized with simulated server-side processing delay to replicate edge AI behavior.

---

## 2. Technical Stack
- **Frontend:** React 18, Vite, Tailwind CSS, Motion (framer-motion).
- **Backend:** Firebase (Firestore).
- **Libraries:** Lucide React (Icons), Recharts (Benefit Charts), HTML5-QRCode (Scanner).
- **Simulated Intelligence:** Uses `personas.ts` for probabilistic identity generation during development.

---

## 3. Comparison Improvements (Work in Progress)

Based on the 2026 Technical Doc, the following elements are being integrated into the current prototype:
- [ ] **Localized Health Network (Map):** Integration of a health facility locator (Pasig/Quezon City focused).
- [ ] **Patient Pass Persistence:** Making the benefit QR codes valid for 24 hours with Firestore persistence.
- [ ] **Agency Inquiries:** Interactive status updates (PCGH, DSWD, Red Cross) within the Benefit Roadmap.
- [ ] **Smart Claims History:** Expanding the "Vault" to show a more detailed timeline of historical bill scans.

---
Produced for Google AI Project - April 2026
