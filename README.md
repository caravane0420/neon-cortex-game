# Neon Cortex - Local Run Guide

Follow these steps to run the game on your computer.

## 1. Prerequisites
- Install [Node.js](https://nodejs.org/) (Version 18 or higher recommended).

## 2. Setup (First Time Only)
You need to install dependencies for both the frontend (client) and backend (server).

Open your terminal in the project folder and run:

**Server Setup:**
```bash
cd server
npm install
cd ..
```

**Client Setup:**
```bash
cd client
npm install
cd ..
```

## 3. Starting the Game
You need to open **Two Terminal Windows**.

**Terminal 1 (Server):**
```bash
cd server
npm run dev
```
*You should see: "Server running on http://localhost:3000"*

**Terminal 2 (Client):**
```bash
cd client
npm run dev
```
*You should see: "Local: http://localhost:5173"*

## 4. Playing
Open your browser and visit: **http://localhost:5173**
