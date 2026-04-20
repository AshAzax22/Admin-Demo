# Admin Demo System

A full-stack administrative dashboard system built with React (Vite) and Node.js (Express).

## Project Structure

- **/backend**: Express API server with MongoDB integration.
- **/frontend**: React frontend built with Vite and Tailwind CSS (or Vanilla CSS).

## Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB](https://www.mongodb.com/) (Local instance or Atlas connection string)

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder and add your configuration:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```
4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Key Technologies

- **Frontend**: React, Vite, Lucide React, Recharts, Axios.
- **Backend**: Node.js, Express, Mongoose, JWT, Multer (for file uploads).

## Features

- User Authentication (JWT)
- Product Management
- Order Tracking
- Inventory Management
- Analytics Dashboard
- Responsive Design
