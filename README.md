
## 📌 Project Description

This project simulates a **real-time messaging application similar to Zalo**, focusing on real-time capabilities, user experience, and accurate state management.

---

## ✨ Key Features

### 🔐 Authentication & Account
- Sign in with **Email/Password**
- OAuth authentication (**Google, GitHub**)
- Update personal profile (avatar, display name, etc.)
- Display **real-time online/offline status**


### 💬 Messaging
- **One-to-one** and **group chat**
- **Real-time messaging with Firestore**
- Display **latest message** and **relative time** (x minutes ago, just now, etc.)
- Load more messages on **scroll up (infinite scroll)**


### 🧩 Chat Interactions
- Reply to **specific messages within a conversation**
- Forward messages
- Recall messages
- Delete messages **for myself**
- Send **emoji reactions on each message**
- View **who reacted with emojis**
- Send **custom emojis**
- Send **images** in chat
- Tag / mention users in conversations


### 👥 Friends & Strangers
- Chat with **strangers**
- Send friend requests
- Cancel friend requests
- Accept / reject friend requests
- Add friends to group chats


### 🗂️ Room & Data Management
- Categorize rooms (private, group, cloud, etc.)
- Search users / rooms
- Display **unread message count**
- Delete chat rooms
- Update room information


### ⚡ Realtime & Performance
- Real-time messaging using **Firebase Firestore**
- Optimized data loading
- Accurate online/offline state management
- Works seamlessly with **Firebase Emulator** in development environment

---
## 📦 Technologies Used

| Technology | Purpose |
|------------|---------|
| React | Frontend UI |
| Firebase Auth | Authentication |
| Firestore | Realtime database |
| Firebase Emulator | Local development |
| Firebase Admin | Data migration |
| React Context + Hooks | State management |

---

## 🛠 Install & Run project

### 1. Clone repository

```bash
git clone https://github.com/quangdung861/zalo-app.git
cd zalo-app
```
---

### 2. Install dependencies

~~~bash
npm install
# or
yarn install
~~~

---

### 3. Firebase configuration

Create a .env file in the root directory and add the following environment variables:

```bash
# Firebase Config
REACT_APP_FIREBASE_API=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
REACT_APP_FIREBASE_MEASUREMENT_ID=

# Emulators
REACT_APP_FIREBASE_EMULATOR=

# Cloudinary
REACT_APP_CLOUDINARY_CLOUD_NAME=
REACT_APP_CLOUDINARY_UPLOAD_PRESET=
```

---

### 4. Run the project in development mode (with Firebase Emulator)

#### 4.1 Start Firebase Emulator

Navigate to the emulator configuration directory:

```bash
cd emulator
```
Start Firebase Emulator:
```bash
firebase emulators:start
```

After successful startup:
- Firestore Emulator: http://localhost:4000
- Auth Emulator: http://localhost:9099

---

#### 4.2 Run the React application

Open a **new terminal** (while the Firebase Emulator is still running), then from the project root directory, run:

```bash
npm start
# or
yarn start
```

The application will be available at:
http://localhost:3000


---

### 5. Build for production

```bash
npm run build
# or
yarn build
```
