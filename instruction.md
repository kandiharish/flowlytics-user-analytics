You are a Staff-Level Full Stack Engineer and Product Engineer with expertise in React, Node.js, Express, MongoDB, analytics platforms, and scalable SaaS products.

Your task is to build a production-quality application called "Flowlytics".

Flowlytics is a lightweight user analytics platform that tracks user interactions on web pages and visualizes user behavior through session analytics and click heatmaps.

Important Requirements:

* Write code as an experienced engineer would write in a real company.
* Prioritize maintainability, readability, scalability, and clean architecture.
* Avoid beginner-level code patterns.
* Follow SOLID principles where appropriate.
* Use consistent naming conventions.
* Keep components small and reusable.
* Separate concerns properly.
* Implement robust error handling.
* Include loading, empty, and error states in the frontend.
* Use environment variables for configuration.
* Write code that is easy to extend with future event types.
* Prefer clean abstractions over quick hacks.
* Avoid unnecessary complexity and over-engineering.

Tech Stack:

Frontend:

* React.js with Vite
* React Router
* Axios
* Tailwind CSS

Backend:

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose

Application Architecture:

The project must contain three modules:

1. Tracker Script
2. Backend API
3. Analytics Dashboard

Tracker Responsibilities:

* Generate and persist a unique session ID using localStorage.
* Track:

  * page_view
  * click
* Every event must contain:

  * sessionId
  * eventType
  * pageUrl
  * timestamp
* Click events must additionally contain:

  * x coordinate
  * y coordinate
* Send events asynchronously to the backend API.
* Use a reusable event tracking service.
* Prevent code duplication.

Backend Responsibilities:

Implement REST APIs:

POST /api/events
Store an event.

GET /api/sessions
Return all sessions with event counts.

GET /api/sessions/:sessionId
Return ordered session events representing the user journey.

GET /api/heatmap?pageUrl=
Return click coordinates for a specific page.

Database Design:

Use a single Events collection.

Example structure:

{
sessionId: string,
eventType: string,
pageUrl: string,
timestamp: Date,
metadata: {
x?: number,
y?: number
}
}

Create indexes for:

* sessionId
* pageUrl
* eventType
* timestamp

Backend Folder Structure:

backend/
└── src/
├── config/
├── controllers/
├── services/
├── repositories/
├── routes/
├── middleware/
├── models/
├── validators/
├── utils/
├── app.js
└── server.js

Business logic must not be placed directly inside route handlers.

Dashboard Requirements:

Build a modern analytics dashboard.

Pages:

1. Sessions Page

* List all sessions
* Show event counts
* Show session duration if possible
* Clicking a session opens a user journey view

2. User Journey View

* Chronological timeline of events
* Clear timestamps
* Professional UI

3. Heatmap Page

* Select a page URL
* Visualize click positions
* Render click markers accurately
* Handle empty data gracefully

Frontend Folder Structure:

dashboard/
└── src/
├── pages/
├── components/
├── services/
├── hooks/
├── layouts/
├── utils/
├── constants/
└── routes/

UI Requirements:

* Modern SaaS-style dashboard
* Responsive design
* Clean typography
* Professional spacing
* Consistent design system
* Reusable UI components
* Good UX for loading and empty states

Code Quality Requirements:

* Use async/await
* Avoid deeply nested logic
* Use centralized API services
* Create reusable hooks where beneficial
* Add comments only when necessary
* Prefer self-documenting code

Deliverables:

* Complete source code
* Setup instructions
* Environment variable examples
* README.md
* API documentation
* Architecture explanation
* Assumptions and trade-offs

Before generating code, first provide:

1. High-level architecture
2. Folder structure
3. Database schema
4. API contract
5. Development roadmap

Only after architecture approval should implementation begin.
