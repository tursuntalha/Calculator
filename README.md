# 🧮 FinCalc AI — Natural Language Financial Calculator

![Status](https://img.shields.io/badge/Status-In%20Development-yellow?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama-000000?style=for-the-badge&logoColor=white)

> **"Hesap makinesi değil, finansal danışman."**

---

## The Problem

Normal calculators are dumb. You type `500000 * 1.45 ^ 3` and get a number — but you have no idea if that's what you actually needed. Meanwhile, you're thinking in plain language: *"Bu parayı bankaya koyarsam ne olur?"* or *"Maaşımdan vergi gidince ne kalır?"*

Existing financial tools are either too complex (Excel models) or too generic (basic interest calculators). None of them understand context, speak Turkish, or explain what they're doing.

## The Solution

**FinCalc AI** is a web app where you ask financial questions in **plain Turkish or English** — by typing or speaking — and get a visual, explained answer powered by a local LLM (Ollama) + a precision formula engine.

No external APIs for the AI. No data leaving your machine. No subscriptions.

---

## Example Interactions

```
You: "500.000 TL'yi yıllık %45 faizle 3 yıla vurursam ne kadar kazanırım?"

FinCalc AI:
  Intent detected: Compound Interest
  Principal: 500,000 TL | Rate: 45% | Period: 3 years

  Year 1: 725,000 TL  (+225,000 TL)
  Year 2: 1,051,250 TL  (+326,250 TL)
  Year 3: 1,524,312 TL  (+473,062 TL)

  Net gain: 1,024,312 TL
  [Bar chart rendered]
```

```
You: "Aylık 30.000 TL brüt maaşımdan elimde ne kalır?"

FinCalc AI:
  Intent detected: Turkish Salary Tax Calculation (2024 brackets)
  Gross: 30,000 TL
  SGK (14%): -4,200 TL
  Income Tax (15% bracket): -3,870 TL
  Stamp Tax (0.759%): -227 TL

  Net take-home: 21,703 TL / month
  Annual net: 260,436 TL
```

---

## Features

| Feature | Description |
|---------|-------------|
| 🗣️ Natural Language Input | Type or speak your question in Turkish or English |
| 🧠 LLM Intent Parser | Ollama (qwen2.5:7b) extracts numbers, intent, and formula type |
| 📐 Formula Engine | Compound interest, mortgage, Turkish income tax, currency, retirement |
| 📊 Visual Output | Recharts bar/line charts for every calculation |
| 🔊 Voice Input | Web Speech API — ask out loud |
| 💱 Live Rates | ExchangeRate API for real-time USD/EUR/TL conversions |
| 📋 History Panel | All past calculations saved in LocalStorage |
| 🌙 Dark/Light Theme | Toggle with system preference detection |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    User Interface                    │
│         Chat Input + Voice (Web Speech API)         │
└──────────────────────┬──────────────────────────────┘
                       │ natural language query
                       ▼
┌─────────────────────────────────────────────────────┐
│              Ollama — qwen2.5:7b                    │
│   Intent Classification + Parameter Extraction      │
│   Output: { type: "compound_interest",              │
│             principal: 500000, rate: 0.45, n: 3 }   │
└──────────────────────┬──────────────────────────────┘
                       │ structured JSON
                       ▼
┌─────────────────────────────────────────────────────┐
│                 Formula Engine (math.js)             │
│   compound_interest() | mortgage() | tax_tr()        │
│   currency_convert() | retirement() | loan_cmp()     │
└──────────────────────┬──────────────────────────────┘
                       │ calculation result + steps
                       ▼
┌─────────────────────────────────────────────────────┐
│              Visualization (Recharts)                │
│   Bar chart | Line chart | Pie chart | Table         │
│   + Plain language explanation                       │
└─────────────────────────────────────────────────────┘
```

---

## Formula Modules Planned

| Module | Calculations |
|--------|-------------|
| `interest.ts` | Compound interest, simple interest, effective annual rate |
| `mortgage.ts` | Monthly payment, amortization schedule, total cost |
| `tax_tr.ts` | 2024 Turkish income tax brackets, SGK, stamp duty |
| `currency.ts` | Live conversion (USD, EUR, GBP, TRY) via ExchangeRate API |
| `retirement.ts` | Target corpus, monthly savings needed, FIRE number |
| `loan.ts` | Side-by-side loan comparison |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + shadcn/ui |
| LLM | Ollama (qwen2.5:7b — local, no API key needed) |
| Math | math.js |
| Charts | Recharts |
| Voice | Web Speech API (browser native) |
| Currency | ExchangeRate-API (free tier) |
| Storage | LocalStorage (history) |

---

## Implementation Roadmap

### Phase 1 — Formula Engine Core
- [x] Set up Vite + React + TypeScript + Tailwind project
- [x] Implement `compound_interest()` with step-by-step output
- [x] Implement `mortgage()` with amortization table
- [x] Implement `tax_tr()` with 2024 brackets (SGK + income tax + stamp)
- [x] Unit tests for all formula functions
- [x] Formula result → structured JSON schema

### Phase 2 — Ollama Integration
- [x] Set up Ollama locally (pull qwen2.5:7b)
- [x] Build intent classification prompt (few-shot, 10 examples per formula type)
- [x] Parameter extraction: parse Turkish number formats (500.000 TL, %45, 3 yıl)
- [x] Error handling for ambiguous queries
- [x] Fallback: if intent unclear, ask clarifying question

### Phase 3 — React Chat UI
- [x] Chat interface component (message history, input bar)
- [x] Message bubbles: user query | AI response | calculation result card
- [x] Loading state while Ollama processes
- [x] Keyboard shortcuts (Enter to send, Ctrl+L to clear)

### Phase 4 — Voice Input
- [x] Web Speech API integration (SpeechRecognition)
- [x] Microphone button with recording indicator
- [x] Turkish language recognition (`lang: 'tr-TR'`)
- [x] Transcript → chat input auto-fill

### Phase 5 — Live Currency Rates
- [x] ExchangeRate-API integration (free, 1500 req/month)
- [x] Cache rates in LocalStorage (refresh every 1 hour)
- [x] `currency.ts` module: convert between any pair
- [x] Rate display in UI header (USD/TRY, EUR/TRY live)

### Phase 6 — Charts + History Panel
- [x] Recharts integration: bar, line, area, pie charts
- [x] Auto-select chart type based on formula (compound → line, comparison → bar)
- [x] History panel (sidebar): all past calculations
- [x] Click history item → re-run with same parameters
- [x] Export calculation as PNG (html-to-image)
- [x] Dark/light theme toggle

---

## Getting Started (once Phase 1 is complete)

```bash
# Prerequisites: Node.js 18+, Ollama installed
ollama pull qwen2.5:7b

git clone https://github.com/tursuntalha/Calculator.git
cd Calculator
npm install
npm run dev
```

Open `http://localhost:5173` and start asking financial questions.

---

> Built with the belief that financial literacy should be accessible to everyone — no Excel required.
