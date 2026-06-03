# 📚 CSI App - Project Library & Documentation

## 🚀 Overview
A professional-grade Customer Satisfaction Index (CSI) Survey Application. It features a React-based frontend integrated with Google Sheets as a real-time database via Google Apps Script (GAS).

---

## 🛠 Tech Stack
- **Frontend**: React 18, Vite, React Router 7.
- **Backend**: Google Apps Script (GAS).
- **Database**: Google Sheets (3 sheets: `users`, `instruments`, `responses`).
- **Styling**: Pure CSS with Glassmorphism design system.
- **Deployment**: Vercel (Frontend), Google Web App (Backend).

---

## 🏗 System Architecture

### 1. Database Schema (Google Sheets)
- **`users`**: Master profil (ID, Password, Nama, Program, Role, Gender, Angkatan, Wilayah, Asal Sekolah).
- **`instruments`**: Master pertanyaan (Program, Tipe [Skala 0-4, Select, Esai], Kode, Dimensi, Atribut, Pernyataan, Opsi/Skala [JSON]).
- **`responses`**: Data input (Timestamp, ID, Program, Jawaban_Kenyataan [JSON], Jawaban_Harapan [JSON], Jawaban_Esai [JSON]).

### 2. Backend Logic (Google Apps Script)
- **`handleLogin`**: Authenticates users and checks for duplicate submissions in `responses`.
- **`handleGetInstruments`**: Fetches dynamic questions filtered by user's program.
- **`handleSubmitSurvey`**: Saves all survey answers into a single row per user in JSON format.
- **`handleGetDashboardSummary`**: Provides lightweight real-time metrics for the Landing Page.
- **`handleGetFullDashboardData`**: Processes complex analytics (CSI, IPA, Grouped Qualitative) with cascading filters for the Superadmin.

---

## 📁 File Structure & Functions

### `/src/screens/`
- **`landing.jsx`**: Public home page with real-time stats and context-aware CTAs.
- **`login.jsx`**: Secure authentication gateway with role-based routing.
- **`survey.jsx`**: Dynamic survey engine. Handles Scale 0-4 (unified card), Select, and Esai. Features auto-save progress and auto-next.
- **`dashboard.jsx`**: Superadmin analytics hub. Features cascading filters, IPA charts, and grouped qualitative feedback.

### `/src/utils/`
- **`api.js`**: Centralized service for all GAS API communication. Uses `VITE_API_URL` environment variable.
- **`calculator.js`**: Logic for CSI categorization and performance interpretation (0-4 scale).
- **`confetti.js`**: Visual celebration effects.

### `/src/layout/`
- **`index.jsx`**: Contains `MeshBackground` and `MobileNav`. Shared navigation with responsive logout button.

---

## 🔐 Security & Rules
- **Access Control**: `/dashboard` route is restricted to `superadmin` role.
- **Anti-Duplicate**: Backend prevents users from submitting the survey more than once per session.
- **Session Wipe**: `sessionStorage.clear()` is called on logout for a complete state reset.
- **Environment**: Sensitive API URLs are managed via Vercel Environment Variables.

---

## 📈 Methodology Standards
- **Scale**: Likert 0-4.
- **Thresholds**: 
  - Satisfaction Categories: Sangat Puas (>=3.2), Puas (>=2.4), Cukup (>=1.6), Kurang (>=0.8), Tidak Puas (<0.8).
  - Diagnostic Status: 'Memenuhi' if score >= 2.8.
