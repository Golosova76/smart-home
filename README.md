# 🏠 Smart Home UI

**Smart Home UI** is an application for monitoring and controlling smart devices in a home environment.  
It provides a modern, adaptive interface that allows users to:

- Monitor temperature, humidity, weather conditions, electricity consumption, and other sensor data
- Control lighting, outlets, relays, and switches
- View a unified dashboard with device and sensor cards grouped by rooms or functional zones

The interface adapts to different room configurations and device combinations, providing a flexible and user-friendly experience.

---

## 🚀 Technologies and Stack

The project is built with **Angular 20+** using modern tools and best practices:

- **TypeScript**, **RxJS**, **Angular Signals**
- **NgRx Store / Effects** — state management
- **SCSS** — modular styling and responsive layout
- **ESLint**, **Prettier**, **Stylelint** — static code analysis and auto-formatting
- **Commitlint**, **Husky**, **lint-staged** — commit quality control
- **Jest** — testing
- Custom **SCSS variables** for UI theming

---

## 🧩 Component Structure

### Sidebar
- Static and always visible on desktop
- Collapsible on tablets and mobile devices
- Consists of three independent parts:
  - **Sidebar header** — contains the menu icon
  - **Sidebar menu** — the main navigation (includes the *Dashboard* section)
  - **Sidebar footer** — displays login info or user avatar

### Dashboard
- Main content area
- Contains a **tab switcher** and **card list**
- Tabs allow switching between dashboard sections (e.g., *Overview*, *Lights*)

### Cards
- Each card displays a group of devices and/or sensors
- Includes a title, list of items, and (optionally) a **group toggle**
- Supports three layout types:
  - **Single-device card** — one item (device or sensor)
  - **Multi-device (horizontal)** — horizontal list
  - **Multi-device (vertical)** — vertical list

---

## 💡 Group Toggle Logic

If a card contains two or more controllable devices:

- A **group toggle** is displayed
- The toggle state:
  - **ON** — at least one device is turned on
  - **OFF** — all devices are turned off
- Changing the toggle state updates all devices in the card accordingly

---

## 🔧 Device and Sensor Components

### Device
- Reusable component for controllable devices
- Displays an icon, label, and state
- The icon itself acts as a toggle (no separate switch element)

### Sensor
- Read-only reusable component
- Displays an icon, label, and current value
- Formats data from an object `{ amount, unit }` using a custom pipe

---

## 🧠 State Management (NgRx)

- The selected dashboard, tabs, and cards are managed via **NgRx Store**
- All updates are performed through actions and effects
- Separate actions handle device toggling and card updates
- Dashboard state is correctly restored when changes are discarded

---

## ⚙️ Core Application Logic

- **Authentication** — login form, API request, token storage, and profile loading
- **HTTP Interceptor**:
  - attaches a token to all outgoing requests
  - clears the token and redirects to `/login` on `401`
  - adds `/api` prefix to relative URLs
- **Routing**:
  - supports parameters `:dashboardId` and `:tabId`
  - when missing or invalid, falls back to the first available dashboard and tab
  - includes a `404` route for unknown URLs

---

## 🌐 Backend and Data

The application uses a simple **JSON Server** as a backend.  
The server is hosted on **Render.com** (free plan).

> ⚠️ Since the server runs on a free plan, **the first request may take 20–30 seconds** while Render “wakes up” from inactivity.  
> Once active, response time returns to normal.

All data (dashboards, tabs, cards, devices, and sensors) are stored in memory and **not persisted permanently**.  
This means **any added or modified data only exist during runtime** — after the server restarts or goes idle, the data resets to its initial mock state.

---

## 🚀 Deploy

The project is deployed on **Netlify** and available at:  
🔗 [smart-home-2025.netlify.app](https://smart-home-2025.netlify.app)

Deployment is configured automatically — each new commit to the main branch triggers a build and deploy on Netlify.

---

## 🧩 Husky and Commitlint

The project uses **Husky** and **Commitlint** to automatically validate commits and enforce code quality before pushing to the repository.

- **Husky** adds pre-commit and commit-msg hooks
- **Commitlint** checks that commit messages follow the [Conventional Commits](https://www.conventionalcommits.org/) standard
- **Lint-staged** runs `ESLint`, `Stylelint`, and `Prettier` only on staged files
- All checks run automatically before each commit

---

## 🧰 Project Setup

### Install dependencies
```
npm install
```


### Run the dev server

```
npm start
```

### Lint and format

```
npm run lint
npm run stylelint
npm run format
```

### Run tests

```
npm test
