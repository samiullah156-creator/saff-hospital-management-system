<!-- styled:v2 -->
<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:1d1726,50:167dfe,100:9533fa&height=180&section=header&text=SAFF%20Hospital%20Management%20System&fontSize=31&fontColor=ffffff&fontAlignY=36&desc=React%20%E2%80%A2%20TypeScript%20%E2%80%A2%20Gemini&descAlignY=58&descSize=16&animation=fadeIn" width="100%" alt="SAFF Hospital Management System" />

**A hospital web app for patients, doctors and admins: appointment booking, doctor profiles, online reports, live consultation and a Gemini-powered health assistant.**

<p>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Gemini%20API-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white" alt="Gemini" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
</p>

<p>
  <a href="#overview">Overview</a> ·
  <a href="#how-it-works">How it works</a> ·
  <a href="#features">Features</a> ·
  <a href="#tech-stack">Tech stack</a> ·
  <a href="#getting-started">Getting started</a>
</p>

</div>

---

## Overview

Built for a private hospital in Rahim Yar Khan, Pakistan. Patients can find a doctor, book an appointment, download reports and ask an AI assistant general health questions, while staff manage everything from an admin dashboard.

## Features

| Area | Pages |
|:--|:--|
| 🩺 **Patients** | Appointment booking, doctor profiles, online reports, patient dashboard, edit profile, feedback |
| 🤖 **AI** | Health assistant (Gemini 2.5 Flash), video studio (Veo) |
| 📹 **Care** | Live consultation with PDF summary export (jsPDF + html2canvas), ambulance service, international patients |
| 🏥 **Hospital** | Services, doctors, gallery, blog, careers, about and contact |
| 🛡️ **Admin** | Admin dashboard and login |

## How it works

```mermaid
flowchart LR
    P([Patient]) --> D[Find a doctor]
    D --> B[Book appointment]
    B --> S[(dbService<br/>browser storage)]
    P --> A[AI health<br/>assistant]
    A --> G([Gemini answer])
    S --> M([Admin dashboard])

    classDef box fill:#1d1726,stroke:#167dfe,color:#e5e7eb
    classDef ends fill:#2e1065,stroke:#9533fa,color:#ffffff
    class D,B,A box
    class P,S,G,M ends
```

Data is stored in the browser through `services/dbService.ts`, so the app runs as a front-end demo without a backend.

## Tech stack

| Area | Tools |
|:--|:--|
| UI | React, TypeScript, React Router |
| AI | Google Gen AI SDK (`gemini-2.5-flash`, Veo) |
| Documents | jsPDF, html2canvas |
| Build | Vite |

## Getting started

```bash
npm install
echo "GEMINI_API_KEY=your_key" > .env.local
npm run dev
```

> The AI assistant gives general information only and does not replace a doctor.

---

<div align="center">

**Built by [Ch Muhammad Samiullah](https://github.com/samiullah156-creator)** · AI Automation Engineer and Full-Stack Developer at [Lexvaxa](https://lexvaxa.com)

<a href="https://github.com/samiullah156-creator"><img src="https://img.shields.io/badge/More%20projects-181717?style=for-the-badge&logo=github&logoColor=white" alt="More projects" /></a>
<a href="https://lexvaxa.com/contact"><img src="https://img.shields.io/badge/Work%20with%20me-167dfe?style=for-the-badge&logo=googlecalendar&logoColor=white" alt="Work with me" /></a>
<a href="https://www.linkedin.com/in/sami-lexvaxa/"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>

<sub>⭐ Star this repo if you found it useful</sub>

</div>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:9533fa,50:167dfe,100:1d1726&height=110&section=footer" width="100%" alt="" />
