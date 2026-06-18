# Flowlytics

Flowlytics is a lightweight user analytics platform that tracks user interactions on web pages and visualizes user behavior through session analytics and click heatmaps.

## Architecture Explanation

Flowlytics is built as a monorepo consisting of:
1. **Tracker Script**: A vanilla JavaScript snippet (`tracker.js`) hosted by the backend. It generates a persistent session ID and tracks page views and clicks.
2. **Backend API**: A Node.js/Express REST API. It uses MongoDB (Mongoose) to store and retrieve events. It is architected with clear boundaries separating route definitions, controllers, services, and repositories.
3. **Analytics Dashboard**: A modern React Single Page Application built with Vite and Tailwind CSS. It communicates with the backend to visualize the data.

## Folder Structure
```text
Flowlytics/
├── backend/
│   ├── public/         # Serves tracker.js
│   ├── src/            # Controllers, Models, Routes, Services, Repositories
│   ├── package.json
│   └── .env.example
├── dashboard/
│   ├── src/            # React components, pages, services
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Local instance or MongoDB Atlas URL)

### 1. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory (see `.env.example` below).
```bash
npm run dev
```
The backend will run on `http://localhost:5000`.

### 2. Dashboard Setup
```bash
cd dashboard
npm install
npm run dev
```
The dashboard will run on `http://localhost:5173`.

### 3. Integrating the Tracker
To track events on any webpage, include the following script tag right before the closing `</body>` tag:
```html
<script src="http://localhost:5000/tracker.js"></script>
```

## Environment Variable Examples

**backend/.env**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/flowlytics
```

**dashboard/.env**
```env
VITE_API_URL=http://localhost:5000/api
```

## API Documentation

### POST `/api/events`
Stores one or multiple tracking events.
**Body:**
```json
{
  "sessionId": "sess_123abc_16900000",
  "eventType": "click",
  "pageUrl": "/about",
  "timestamp": "2023-10-25T12:00:00.000Z",
  "metadata": { "x": 450, "y": 300 }
}
```

### GET `/api/sessions`
Returns a list of all sessions with event counts and durations.

### GET `/api/sessions/:sessionId`
Returns chronologically ordered events for a specific user journey.

### GET `/api/heatmap?pageUrl=/path`
Returns aggregated click coordinates for the specified URL.

## Assumptions and Trade-offs
- **CORS:** The backend accepts events from any origin (`*`) for easy integration. In production, this should be restricted to known domains.
- **Data Model:** A single `Events` collection is used. While this is simple and effective for a lightweight tool, a highly active platform might require separating sessions and events into two collections or using a time-series database.
- **Heatmap Visualization:** The current heatmap generates red blur points over a generic layout using exact coordinates. For a production heatmap, tools like `heatmap.js` alongside an iframe snapshot of the target page are recommended.
- **Authentication:** No authentication is currently required for the dashboard API, simplifying setup but limiting production security.
