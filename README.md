# Portfolio Project Backend (2025)

This is the backend for my full-stack portfolio website, built using **Node.js**, **Express**, and **MongoDB Atlas**. It includes admin pages for content management and exposes a REST API for frontend consumption (used in Assignment 2).

---

## What I Did

- Created three MongoDB collections: `about`, `projects` and `contacts`
- Built admin pages using **Pug** to add and delete entries from both collections
- Styled admin dashboard with custom CSS using a lightweight framework (customized Bootstrap)
- Made pages responsive
- Created REST API endpoints to serve collection data as JSON
- Deployed the backend and database online (MongoDB Atlas + Render/Glitch/Other)
- Enabled CORS for frontend integration

---

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Template Engine: **Pug**
- CSS Framework: Bootstrap (with custom colors/fonts)

---

## Collections

1. **About**
   - decription

2. **Projects**
   - title
   - screenshot
   - description
   - technologies used
   - project URL 

3. **Contact**
   - name
   - email
   - message
  

---

## Admin Interface

Admin dashboard includes:
- Pages to add and delete data for both `projects` and `skills`
- Accessible only to admins (not public)
- Responsive and styled UI for ease of use

---

## API Endpoints

| Method | Endpoint           | Description             |
|--------|--------------------|-------------------------|
| GET    | `/api/projects`    | Get all project entries |
| GET    | `/api/skills`      | Get all skill entries   |

---

## Testing & Deployment

- All endpoints tested using Postman
- MongoDB hosted on **MongoDB Atlas**
- CORS enabled for frontend access
- Deployed using render

---

## Future Improvements

- Add update functionality for existing entries
- Add admin authentication
