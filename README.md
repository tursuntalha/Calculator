# Advanced Scientific Calculator

![Status](https://img.shields.io/badge/Status-In%20Development-yellow?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

A feature-rich scientific calculator built with React and TypeScript. Goes beyond basic arithmetic — expression parsing, calculation history, unit conversion, and a polished dark/light UI.

---

## Planned Features

- **Expression parser** — full operator precedence, parentheses grouping
- **Scientific functions** — sin, cos, tan, log, ln, sqrt, factorial, power
- **Calculation history** — review and re-use past expressions, undo support
- **Unit converter** — length, weight, temperature, currency (live rates)
- **Keyboard support** — full keyboard input mapping
- **Theme toggle** — dark/light mode with system preference detection
- **Responsive design** — mobile-first layout, works on any screen size

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | CSS Modules |
| State | React Context / useReducer |
| Persistence | LocalStorage (history) |
| Deploy | GitHub Pages |

---

## Roadmap

| Phase | Task | Status |
|-------|------|--------|
| Phase 1 | Basic arithmetic engine with expression parser | [ ] |
| Phase 2 | Scientific functions module (trig, log, sqrt, factorial) | [ ] |
| Phase 3 | History panel with LocalStorage persistence | [ ] |
| Phase 4 | Unit conversion module | [ ] |
| Phase 5 | Keyboard shortcuts & accessibility (ARIA) | [ ] |
| Phase 6 | Theme system + UI polish | [ ] |
| Phase 7 | Deploy to GitHub Pages | [ ] |

---

## Getting Started (planned)

```bash
git clone https://github.com/tursuntalha/Calculator.git
cd Calculator
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Project Structure (planned)

```
Calculator/
├── src/
│   ├── components/
│   │   ├── Display/        # Expression display & result
│   │   ├── Keypad/         # Button grid
│   │   ├── History/        # Calculation history panel
│   │   └── Converter/      # Unit conversion panel
│   ├── engine/
│   │   ├── parser.ts       # Expression tokenizer & parser
│   │   └── evaluator.ts    # AST evaluator
│   ├── hooks/
│   │   └── useCalculator.ts
│   └── App.tsx
├── public/
└── vite.config.ts
```
