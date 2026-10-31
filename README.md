# Cynbit Architecture Studio — Interactive Full-Stack Project & Cost Estimator

[![Next.js](https://img.shields.io/badge/Next.js-15.1-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-3.2-6E9F18.svg)](https://vitest.dev/)

> **Full Stack Developer Intern Technical Challenge Deliverable for Cynbit Technologies**  
> **Applicant**: Naman Kalia (`namankalia1904@gmail.com`)  
> **Task**: *Improve Cynbit's Website*  

---

## 📑 Deliverables Matrix

This repository fulfills all three required deliverables for the **Cynbit Full Stack Developer Intern Technical Challenge**:

| Deliverable | Repository Asset | Description |
| :--- | :--- | :--- |
| **1. GitHub Repository** | [**`NamTheGreat/cynbit-website-improvement`**](https://github.com/NamTheGreat/cynbit-website-improvement) | Production-ready full-stack Next.js source code with clean commits, strict TypeScript typing, and automated tests. |
| **2. Working Improvement / Prototype** | [**Live Deployed Application (GitHub Pages)**](https://namthegreat.github.io/cynbit-website-improvement/) | Fully interactive web application allowing visitors to configure tech stacks, view real-time architecture topologies, calculate budgets ($ & ₹), and consult with the embedded Aria AI Architect. |
| **3. Technical Report** | [**`TECHNICAL_REPORT.md`**](./TECHNICAL_REPORT.md) | Comprehensive engineering report detailing problem analysis (user vs. developer perspectives on `cynbit.in`), technical stack choices, implementation architecture, and projected conversion results. |

---

## 🌟 Key Features of the Working Improvement

1. **Interactive Tech Stack Configurator**:
   * Choose between Autonomous AI Agents, Enterprise SaaS, Full Stack Web/Mobile, or Cloud Modernization.
   * Toggle scalable client, compute, database, vector, and security components in real time.
   * Direct integration with Cynbit's proprietary software suite (**Cynbit Studio**, **TenantEase**, **Revio**).

2. **Real-Time Algorithmic Estimator**:
   * Algorithmic calculation of development timeline (Weeks) and investment range in both **USD (\$)** and **INR (₹ Lakhs)**.
   * Real-time monthly cloud infrastructure OPEX estimation.
   * System complexity scoring (0–100) and automated feasibility classification.

3. **Dynamic Architecture Topology Visualizer**:
   * Dynamically renders a multi-tier visual map showing how selected components connect across the Presentation, Edge/Gateway, Compute, and Data/AI layers.

4. **Aria AI Solution Architect Assistant**:
   * Embedded conversational agent providing instant technical consultations regarding token budgeting, asynchronous outbox patterns, and security best practices.

5. **Instant Architecture Blueprint Export**:
   * One-click copying and exporting of complete Markdown/JSON architectural specifications for immediate client and stakeholder sharing.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph Client Layer
        UI["Next.js / React 19 Client UI"]
        ConfigState["Interactive Stack Configurator State"]
        TopologyMap["Dynamic Topology Map Visualizer"]
        AriaChat["Aria AI Architect Chat Drawer"]
    end

    subgraph Server & API Layer
        NextServer["Next.js 15 App Router Server"]
        EstimateAPI["POST /api/estimate (Zod Validated)"]
        ScopingAPI["POST /api/scoping-agent (AI Assistant)"]
    end

    subgraph Logic & Engine Layer
        Calculator["Algorithmic Estimation Engine (src/lib/calculator.ts)"]
        ZodSchema["Zod ArchitectureConfigSchema"]
    end

    UI --> ConfigState
    ConfigState --> Calculator
    Calculator --> TopologyMap
    Calculator --> UI
    AriaChat --> ScopingAPI
    ConfigState -.->|API Validation| EstimateAPI
    EstimateAPI --> ZodSchema
```

---

## 🚀 Quickstart & Verification

### 1. Prerequisites
* Node.js >= 20.0.0 (Tested on Node v24.18.0)
* npm >= 10.0.0

### 2. Installation
```bash
npm install
```

### 3. Run Automated Tests
```bash
npm test
```
*Executes all Vitest suites verifying calculation bounds, scaling multipliers, and schema validation with a **100% pass rate**.*

### 4. Build for Production
```bash
npm run build
```
*Compiles the complete Next.js 15 App Router application in under 2 seconds with zero type errors.*

### 5. Launch Development Server
```bash
npm run dev
```
*Open [http://localhost:3000](http://localhost:3000) in your browser.*

---

## 🌐 Live Deployment Guide

This project is built using standard Next.js 15 and is zero-config ready for instant 1-click deployment on **Vercel** or **Netlify**:

1. Push this repository to your GitHub account (`NamTheGreat/cynbit-website-improvement`).
2. Go to [Vercel](https://vercel.com/new) and click **"Import"** next to `cynbit-website-improvement`.
3. Click **"Deploy"** (no environment variables required for standard operation).
4. Vercel will output your live URL (e.g. `https://cynbit-architecture-studio.vercel.app`), which fulfills **Deliverable #2**.
