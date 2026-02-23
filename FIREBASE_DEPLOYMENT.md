# 🚀 Firebase Hosting Deployment Guide

## ✅ Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Create a project"**
3. Name it: `saipooja-warehouse`
4. Enable Google Analytics (optional)
5. Click **Create Project**

## ✅ Step 2: Get Firebase Credentials
1. In Firebase Console, click **⚙️ Settings** → **Project Settings**
2. Go to **Service Accounts** tab
3. Click **Generate New Private Key**
4. Save the JSON file safely

## ✅ Step 3: Install Firebase CLI
```bash
npm install -g firebase-tools
```

## ✅ Step 4: Login to Firebase
```bash
firebase login
```
- Browser will open → Sign in with your Google account
- Authorize Firebase CLI

## ✅ Step 5: Initialize Firebase in Your Project
```bash
cd "C:\Users\SPL2\Desktop\Warehouse-frontend-"
firebase init hosting
```

When prompted:
- **Select project**: `saipooja-warehouse`
- **Public directory**: `frontend`
- **Configure SPA**: Type `y` (Yes, rewrite all URLs)
- **Overwrite public/index.html**: Type `n` (No)

## ✅ Step 6: Deploy to Firebase
```bash
firebase deploy
```

**Output will show:**
```
✔ Deploy complete!
Your app is live at: https://saipooja-warehouse.web.app
```

## 🎯 Your Firebase Hosting URL
```
🌐 https://saipooja-warehouse.web.app
```

## 📝 Update Firebase Config
In `frontend/firebase-config.js`, replace:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "saipooja-warehouse.firebaseapp.com",
  projectId: "saipooja-warehouse",
  storageBucket: "saipooja-warehouse.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

Get these values from Firebase Console → **Project Settings** → **General** tab.

## 🔄 Deploy Updates
After making changes:
```bash
git add -A
git commit -m "Update description"
git push origin main
cd C:\Users\SPL2\Desktop\Warehouse-frontend-
firebase deploy
```

## 🌍 SSL/HTTPS
✅ Automatically enabled on Firebase Hosting!

---

**Your project is ready for Firebase deployment!** 🚀
