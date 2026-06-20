# Flowlytics

## User Analytics & Session Tracking Platform

Flowlytics is a lightweight user analytics platform designed to capture and visualize user interactions across web pages. The platform tracks page views and click events, stores behavioral data in MongoDB, and provides an analytics dashboard for exploring user journeys and click heatmaps.

The project demonstrates end-to-end full-stack engineering practices, including event tracking, RESTful API design, database modeling, analytics processing, and interactive data visualization.

---

## Live Deployments

* **Live Dashboard:** https://flowlytics-user-analytics.vercel.app/
* **Live API Backend:** https://flowlytics-casualfunnel-backend.onrender.com/

---

## Key Features

* Session tracking using persistent browser identifiers
* Page view event tracking
* Click event tracking with coordinate capture
* User journey visualization
* Session-level analytics dashboard
* Click heatmap visualization
* MongoDB-based event storage
* Modular and scalable backend architecture
* Responsive React-based analytics dashboard

## Production-Ready Enhancements
* **Event Batching:** The tracking script batches events and flushes them every 3 seconds or on page exit to prevent server overload.
* **True Session Expiry:** Implemented 30-minute inactivity timeouts for sessions using `localStorage` timestamp checks.
* **Database Aggregation:** Heatmap coordinates and session statistics are grouped and calculated directly within MongoDB using the Aggregation Pipeline, preventing Node.js memory exhaustion.
* **Dashboard Pagination:** The dashboard handles thousands of sessions cleanly with backend-driven pagination.

---

## Architecture Overview

Flowlytics follows a modular architecture composed of three core layers:

### 1. Tracker Script

A lightweight JavaScript tracking script served by the backend.

Responsibilities:

* Generate and persist a unique session identifier
* Track page views
* Track click interactions
* Capture click coordinates
* Send events asynchronously to the backend API

### 2. Backend API

Built using Node.js, Express.js, and MongoDB.

Responsibilities:

* Receive analytics events
* Validate incoming payloads
* Persist event data
* Generate session analytics
* Aggregate heatmap data

Architecture Pattern:

```text
Request
   ↓
Route
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
MongoDB
```

### 3. Analytics Dashboard

Built using React, Vite, and Tailwind CSS.

Responsibilities:

* Display session analytics
* Visualize user journeys
* Render click heatmaps
* Provide high-level analytics metrics

---

## Project Structure

```text
Flowlytics/
│
├── backend/
│   ├── public/
│   │   └── tracker.js
│   │
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── server.js
│   │
│   ├── .env.example
│   └── package.json
│
├── dashboard/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── services/
│   │
│   └── package.json
│
└── README.md
```

---

## Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* React Router
* Lucide React

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### Tracking Layer

* Vanilla JavaScript
* Navigator Beacon API

### Development Tools

* Git
* GitHub
* npm

---

## Setup Steps

### Prerequisites

Ensure the following are installed:

* Node.js (v18 or higher)
* npm
* MongoDB (Local or Atlas)

---

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/flowlytics
ALLOWED_ORIGINS=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

Backend URL:

```text
http://localhost:5000
```

---

### Frontend Setup

```bash
cd dashboard
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

### Tracker Integration

To enable event tracking on any webpage, include the following script before the closing body tag:

```html
<script src="http://localhost:5000/tracker.js"></script>
```

The tracker will automatically:

* Create a session identifier
* Capture page views
* Capture click interactions
* Send analytics events to the backend

---

## API Endpoints

### POST /api/events

Stores analytics events.

### GET /api/sessions

Returns all tracked sessions with event counts and duration metrics.

### GET /api/sessions/

Returns the chronological sequence of events for a specific session.

### GET /api/heatmap?pageUrl=

Returns aggregated click coordinates used for heatmap rendering.

---

## Assumptions and Trade-offs

### Assumptions

* Session identifiers are stored in browser localStorage.
* A session persists until browser storage is cleared.
* Event timestamps are generated on the client side.
* Analytics data is stored in a single MongoDB collection.

### Trade-offs

#### Open CORS Policy

The application currently accepts requests from any origin to simplify development and testing.

Production systems should restrict requests to approved domains.

#### Simplified Heatmap Rendering

The heatmap visualization uses lightweight coordinate-based rendering rather than a dedicated heatmap engine.

This approach reduces implementation complexity while satisfying assignment requirements.

#### Single Events Collection

All analytics events are stored within a unified collection.

This simplifies querying and supports future event types without schema redesign.

#### No Authentication Layer

Authentication and authorization were intentionally excluded to keep the scope focused on analytics functionality.

#### Missing User Metadata
Currently, the tracker does not capture user-agent, referrers, or detailed location data, keeping the focus strictly on on-page behavior and clicks.

---

## Future Enhancements

* Event batching and queue processing
* Dashboard authentication and role-based access control
* Advanced heatmap rendering
* Date-range filtering
* Session replay capabilities
* Real-time analytics updates
* Dashboard charts and trend analysis
* Rate limiting and enhanced validation

---

## Author

Harish Kandi

Full Stack & AI Engineering Enthusiast
