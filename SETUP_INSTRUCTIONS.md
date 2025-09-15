# 🚀 Quick Setup Instructions

## The Network Error Fix

The "network error" occurs because the backend server isn't running. Here are **3 ways** to fix this:

---

## Option 1: Start Backend Server (Recommended)

### Step 1: Install Node.js
- Download from: https://nodejs.org/
- Install the LTS version

### Step 2: Open Terminal/Command Prompt
- **Windows**: Press `Win + R`, type `cmd`, press Enter
- **Mac**: Press `Cmd + Space`, type `Terminal`, press Enter

### Step 3: Navigate to Project Folder
```bash
cd "C:\Users\aksha\OneDrive\Desktop\website2.0\Tinder"
```

### Step 4: Install Dependencies
```bash
npm install
```

### Step 5: Start Server
```bash
npm start
```

### Step 6: Open Browser
- Go to: `http://localhost:3000`
- Now the "Create Account" button will work!

---

## Option 2: Use Demo Mode (No Backend Needed)

The app now has **automatic demo mode**! 

1. **Just open `index.html` directly in your browser**
2. **Click "Get Started" and complete the signup**
3. **When you click "Create Account", it will automatically use demo mode**
4. **You'll see: "Demo account created! (Backend not running - using demo mode)"**

This works without any server setup!

---

## Option 3: Use the Startup Scripts

### Windows:
- Double-click `start.bat`
- It will automatically install dependencies and start the server

### Mac/Linux:
- Open Terminal in the project folder
- Run: `chmod +x start.sh && ./start.sh`

---

## 🔧 Troubleshooting

### If you get "npm not found":
- Install Node.js from https://nodejs.org/
- Restart your terminal/command prompt

### If you get "port already in use":
- Close other applications using port 3000
- Or change the port in `server.js`

### If you want to use demo mode only:
- Just open `index.html` in your browser
- The app will automatically detect no backend and use demo mode

---

## ✅ What Works in Demo Mode

- ✅ Complete signup process
- ✅ Photo uploads (stored locally)
- ✅ Interest selection
- ✅ Profile creation
- ✅ Sign in/out
- ✅ All UI animations and interactions
- ✅ Data persistence in browser

---

## 🎯 Quick Test

1. **Open `index.html` in your browser**
2. **Click "Get Started"**
3. **Fill out the signup form**
4. **Upload some photos**
5. **Select interests**
6. **Click "Create Account"**
7. **You should see: "Demo account created!"**

That's it! Your college Tinder project is working! 🎉
