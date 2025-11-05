# 🚀 Backend Quick Start Guide

## ⚡ Fastest Way to Start (Just Double-Click!)

### Windows:
1. **Double-click** `start-backend.bat`
2. Wait for it to start
3. Done! ✅

### Mac/Linux:
1. Open terminal in the `backend` folder
2. Run: `chmod +x start-backend.sh`
3. Run: `./start-backend.sh`
4. Done! ✅

---

## 📋 What Happens Automatically:

✅ Installs all dependencies (if needed)  
✅ Creates `.env` file with default settings  
✅ Starts the server on port 5000  
✅ Everything configured and ready!

---

## 🌐 Once Started:

The backend will be running at: **http://localhost:5000**

You can test it by opening: **http://localhost:5000/api/health**

You should see:
```json
{
  "status": "OK",
  "message": "Street 10 API is running"
}
```

---

## 🛑 How to Stop:

Press **Ctrl + C** in the terminal/command prompt

---

## ⚙️ What You Need:

- **Node.js** installed (version 16 or higher)
  - Download from: https://nodejs.org/
  - If you're not sure, open terminal and type: `node --version`

---

## 📁 Backend Structure:

```
backend/
├── start-backend.bat    ← Double-click this (Windows)
├── start-backend.sh     ← Run this (Mac/Linux)
├── server.js            ← Main server file
├── routes/              ← API endpoints
│   ├── dashboard.js
│   ├── orders.js
│   ├── products.js
│   ├── subadmin.js     ← Sub Admin endpoints
│   └── ...
└── .env                 ← Auto-created (don't edit unless needed)
```

---

## 🔌 API Endpoints:

Once running, these endpoints are available:

- `GET /api/health` - Check if server is running
- `GET /api/dashboard/data` - Vendor dashboard data
- `GET /api/dashboard/sub-admin/data` - Sub Admin dashboard
- `GET /api/sub-admin/users` - Get all users
- `POST /api/sub-admin/users` - Create user
- And many more...

---

## ❓ Common Questions:

**Q: Do I need MongoDB?**  
A: No! The backend works without MongoDB. It uses mock data.

**Q: Port 5000 is already in use?**  
A: Edit `.env` file and change `PORT=5000` to `PORT=5001` (or any other number)

**Q: How do I know it's working?**  
A: Open http://localhost:5000/api/health in your browser

**Q: Can I run it in the background?**  
A: Yes, but for development, just keep the terminal open.

---

## 🎯 That's It!

The backend is now ready. Your frontend can connect to it automatically!

**No coding knowledge needed** - just double-click and go! 🎉

