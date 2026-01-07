# LXRY Apple CarPlay Configurator

Database-driven Apple CarPlay configurator with an embeddable React frontend and an Express + TypeScript backend powered by Airtable.

## Project structure

```
backend/   # Express + TypeScript API (Airtable integration)
frontend/  # React + Vite UI (embeddable)
```

## Getting started

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Embedding in Phoenix

Build the frontend and serve the compiled assets from Phoenix. Mount the configurator on a DOM element:

```html
<div id="lxry-carplay-configurator"></div>
<script src="/assets/lxry-configurator.js"></script>
<script>
  window.LxryConfigurator.mount('#lxry-carplay-configurator');
</script>
```

Configure `VITE_API_URL` to point to your backend API.
