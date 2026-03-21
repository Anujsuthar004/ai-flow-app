# AI Flow App

A MERN stack app with React Flow that lets you type a prompt, get an AI response, and save it to MongoDB — all visualized as a connected node graph.

## Tech Stack

- **Frontend**: React + Vite + React Flow (`@xyflow/react`)
- **Backend**: Node.js + Express
- **Database**: MongoDB (via Mongoose)
- **AI**: OpenRouter API (`google/gemini-2.0-flash-lite-preview-02-05:free`)

## Project Structure

```
ai-flow-app/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── nodes/
│   │   │   ├── InputNode.jsx
│   │   │   └── ResultNode.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
└── README.md
```

## Prerequisites

- Node.js v18+
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account (free tier works)
- An [OpenRouter](https://openrouter.ai/) API key (free)

## Setup & Running Locally

### 1. Clone the repo

```bash
git clone https://github.com/Anujsuthar004/ai-flow-app.git
cd ai-flow-app
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/aiflowapp
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PORT=5000
APP_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev   # development (nodemon)
# or
npm start     # production
```

The server runs on `http://localhost:5000`.

### 3. Frontend setup

```bash
cd ../frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

The app opens at `http://localhost:5173`. The Vite dev server proxies `/api` calls to the backend automatically.

## How to Use

1. **Type a prompt** in the left (purple) node — e.g., *"What is the capital of France?"*
2. Click **▶ Run Flow** — the AI response appears in the right (green) node.
3. Click **💾 Save** — saves the prompt + response to MongoDB.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/ask-ai` | Send prompt, get AI response |
| POST | `/api/save` | Save prompt + response to MongoDB |
| GET | `/api/history` | Fetch last 20 saved records |

## Deployment

### Backend (Render.com)

1. Create a new **Web Service** on Render
2. Connect your GitHub repo, set root directory to `backend/`
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add environment variables: `MONGO_URI`, `OPENROUTER_API_KEY`, `APP_URL`

### Frontend (Vercel / Render Static Site)

1. Create a new **Static Site** or use Vercel
2. Set root directory to `frontend/`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add env variable: `VITE_BACKEND_URL=https://your-backend.onrender.com`

> **Important**: After deploying the backend, set `VITE_BACKEND_URL` to your backend's public URL in the frontend's environment variables.
