# 🚀 FinSphere Capital - FinTech Dashboard

A modern, secure, and full-stack FinTech dashboard application built with a focus on seamless UI/UX and DevSecOps practices.

## 🔗 Live Links
- **Live Application:** [fintech-zeta-six.vercel.app]
- **Backend API Docs:** [https://fintech-backend-665x.onrender.com]

## 🛠 Tech Stack
- **Frontend:** React.js, Vite, Tailwind CSS
- **Backend:** FastAPI, Python, PyJWT, Motor (Async)
- **Database:** MongoDB Atlas
- **DevOps:** GitHub Actions (CI/CD pipelines), Vercel (Frontend), Render (Backend)

## ✨ Key Features
- **Secure Authentication:** JWT-based login/signup with hashed passwords (bcrypt).
- **Cloud Database:** Integrated with MongoDB Atlas for scalable data storage.
- **Modern UI:** Clean interface with a functional Dark/Light mode toggle.
- **Automated CI/CD:** GitHub Actions workflow for automated testing and continuous deployment.
- **Production Ready:** Environment variables secured, and debugging info stripped from the frontend.

## 💻 Local Setup
1. Clone the repository: `git clone https://github.com/Adithya-83/fintech-dashboard.git`
2. Setup Backend: Navigate to the backend directory, install requirements (`pip install -r requirements.txt`), and run `uvicorn main:app --reload`.
3. Setup Frontend: Navigate to the frontend directory, install dependencies (`npm install`), and run `npm run dev`.