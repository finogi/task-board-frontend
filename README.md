# Task Board Frontend Application

A **Task Board** frontend application built using **React** as part of a **Frontend Internship Assignment**.  
The project focuses on frontend engineering quality, clean state management, usability, and reliability — without using any backend.

---

##  Features Overview

###  Authentication (Static Login)
- Login page with hardcoded credentials
- Proper error messages for invalid login
- “Remember Me” functionality using browser storage
- Logout functionality
- Protected routes (unauthorized users cannot access the board)

**Login Credentials**
- Email: `intern@demo.com`
- Password: `intern123`

---

###  Task Board (Kanban)
- Fixed columns:
  - Todo
  - Doing
  - Done
- Create, Edit, Delete tasks
- Drag & Drop tasks across columns
- Board state persists across page refresh



---

###  Persistence & Reliability
- All data stored using `localStorage` / `sessionStorage`
- Safe handling of empty or missing storage
- Reset Board option with confirmation

---

##  Tech Stack
- React (Vite)
- React Router
- Context API for state management
- @hello-pangea/dnd for drag & drop
- localStorage / sessionStorage
- Vitest & React Testing Library for testing

---

## ▶ How to Run the Project Locally

### Prerequisites
Ensure you have the following installed:
- Node.js (v16 or above)
- npm
- Git

### Run the project by 
### installing the dependencies and start development 
npm install
npm run dev

### to run tests
npx vitest --run