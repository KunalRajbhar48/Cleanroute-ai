# CleanRoute AI

A waste management app that helps figure out where garbage needs to be picked up and the best way to get there. It uses the Gemini API for insights and shows everything on a dashboard.

## What it does

- Tracks waste collection and shows location data on a map
- Suggests collection routes so trucks cover less ground
- Uses Google Gemini to generate insights from the waste data
- Has a dashboard with charts for spotting trends

## Built with

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Leaflet
- Recharts
- Lucide React
- Motion

### Backend
- Node.js
- Express.js
- dotenv

### AI
- Google Gemini API

### Development Tools
- npm
- TypeScript
- PostCSS
- Autoprefixer

## Project structure

```text
cleanroute-ai-smart-waste-management-system/
├── src/
│   ├── components/    # reusable UI pieces
│   ├── pages/         # one file per screen
│   └── services/      # API calls, Gemini integration
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .env.example       # copy to .env and add your keys
├── .gitignore
└── README.md
```