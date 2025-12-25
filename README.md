# Student Notes & Reminders Web App

A simple CRUD-based web application that allows students to write notes, set reminders, mark tasks as completed, and stay productive.

---

## Project Description

This project is a **Student Notes and Reminders Web App** built using **Node.js**, **Express.js**, and basic **HTML/CSS/JavaScript**. It demonstrates frontend–backend communication using the Fetch API and uses JSON files as a simple database.

The app is designed to be student-friendly, visually engaging, and easy to understand for beginners.

---

## Core Features

- Add, edit, and delete notes
- Mark reminders as completed
- Category filtering (School / Personal)
- Search notes by title 
- Light & Dark mode
- Simple local notification (browser-based)

---

## Tech Stack

### Frontend
- HTML
- CSS
- Vanilla JavaScript

### Backend
- Node.js
- Express.js

### Storage
- JSON file-based storage
  - `notes.json`
    
---

## Project Structure

```
student-notes-and-reminder-web-app/
│
├── public/
│   ├── index.html        # Frontend UI
│   ├── style.css         # Pixel RPG theme styles
│   └── app.js            # Frontend logic (Fetch API)
│
├── notes.json            # Notes database (JSON)
├── users.json            # Users database (JSON)
├── server.js             # Backend server (Express)
├── package.json          # Project dependencies
├── .gitignore            # Git ignore file
└── README.md             # Project documentation
```

---

## Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)
- npm (comes with Node.js)

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd student-notes-and-reminder-web-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   node server.js
   ```

4. **Open your browser and navigate to:**
   ```
   http://localhost:3000
   ```

---


## Credits

**© 2025 Alzaga • Arevalo • Letada**

---

##  Notes

This project is intended for **educational purposes** and demonstrates:

- CRUD operations
- Fetch API usage
- Backend integration
- UI/UX design for students

---

