# MERN Stack Project Setup Guide

This guide will help you set up and run the **MERN (MongoDB, Express.js, React.js, Node.js)** project on your local system.

---

## 🧩 Project Structure
project-root/
│
├── backend/ # Node.js + Express.js + MongoDB server
│ ├── server.js
│ ├── models/
│ ├── routes/
│ ├── controllers/
│ └── .env
│
└── frontend/ # React.js client (Vite or CRA)
├── src/
├── public/
└── package.json

---

## ⚙️ Prerequisites

Before running the project, ensure that the following are installed on your system:

- [Node.js](https://nodejs.org/en/download/) (v16 or above)
- [npm](https://www.npmjs.com/)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community)

---

## 🗄️ Setting up MongoDB (Localhost)

1. Download and install **MongoDB Community Server**.
2. Start the MongoDB service.
3. Default connection URL:  mongodb://127.0.0.1:27017/your-database-name PORT=5000




Install all dependencies
Run the development server
Your frontend will now be running on: ➜ Local: http://localhost:5173/

⚡ Setting up the Backend

Open a new terminal and navigate to the backend directory:

cd backend


Install all dependencies:

npm install


Start the backend server:

npm run dev


You should see logs like this:

[nodemon] starting `node server.js`
[dotenv@17.2.3] injecting env (5) from .env
MongoDB connected
Server running on port 5000


Shubham Mirashi
Full Stack Developer | MERN Enthusiast
📧 shubhammirashi303@gmail.com


screenshots

<img width="1911" height="782" alt="image" src="https://github.com/user-attachments/assets/bd283130-b0e9-4ba3-8c11-6a65e03c57c0" />
<img width="746" height="649" alt="image" src="https://github.com/user-attachments/assets/5f5642ab-1087-4dab-bd96-ba3847c13665" />
<img width="1877" height="486" alt="image" src="https://github.com/user-attachments/assets/b00100cb-3eab-4eb3-81b0-a9f536b6c6ca" />



