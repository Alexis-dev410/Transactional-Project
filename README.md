# AirBnb Listing Explorer & Review Platform

## Project Overview
This project is a full-stack MERN-style application for browsing property listings, submitting reviews with optional photos, and managing a user profile. It includes:

- React frontend (`client/`)
- Express/Node backend (`server/`)
- MongoDB database with a dataset import script
- JWT authentication and protected routes
- Image upload support via `multer`

## Folder Structure

- `client/` — React application with pages for register, login, browse, listing details, and profile.
- `server/` — Express API, Mongoose models, auth middleware, image upload config, and data import script.
- `server/data/listings.json` — dataset file used by the import script.

## Prerequisites

- Node.js (recommended v18+)
- npm
- Local MongoDB server running

## Setup Instructions

### 1. Backend Setup

1. Open a terminal and go to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `server/` with the following values:
   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/airbnb
   JWT_SECRET=your_jwt_secret_here
   ```
   Replace `your_jwt_secret_here` with a secure secret string.

### 2. Import the Dataset

Run the dataset import script once to populate MongoDB:

```bash
cd server
node importData.js
```

This will read `server/data/listings.json`, clean the records, and insert them into the `listings` collection.

### 3. Frontend Setup

Open another terminal and go to the client folder:

```bash
cd client
npm install
```

## Running the App

### Start the backend server

From the `server/` folder:

```bash
npm start
```

The API will run on `http://localhost:3000`.

### Start the frontend app

From the `client/` folder:

```bash
npm run dev
```

Open the Vite URL shown in the terminal (usually `http://localhost:5173`).

## Available API Endpoints

- `POST /api/auth/register` — register a new user
- `POST /api/auth/login` — login and receive a JWT token
- `GET /api/auth/me` — get authenticated user info
- `GET /api/users/me` — get profile data
- `PUT /api/users/me` — update first/last name
- `GET /api/listings` — list listings with optional filters
- `GET /api/listings/:id` — listing detail
- `GET /api/reviews` — get all reviews
- `POST /api/reviews` — create a review with optional photo
- `PUT /api/reviews/:id` — update own review
- `DELETE /api/reviews/:id` — delete own review

## Notes

- Uploaded review photos are served from `http://localhost:3000/uploads/`
- Protected pages require a valid JWT token stored in `localStorage`.
- The app stores `token` and `userId` in `localStorage` after login.

## Common Commands

From `client/`:
- `npm run dev` — start frontend development server
- `npm run build` — create production build

From `server/`:
- `npm start` — start backend API server
- `node importData.js` — import listings dataset into MongoDB

## Troubleshooting

- If the server cannot connect to MongoDB, verify `MONGO_URI` and that MongoDB is running.
- If review images do not display, confirm the backend is running and `uploads/` is accessible.
- If login fails, check the `JWT_SECRET` in `.env` and that the user exists in the database.
