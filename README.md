# Fleet Lifecycle & Logistics Management System API

This is the backend for the Fleet Logistics System, built with Node.js, Express, and PostgreSQL (Neon).

## Environment Variables (.env)

Create a `.env` file in the root directory:
```env
PORT=3000
DATABASE_URL=postgresql://neondb_owner:npg_S9Rove4CYxwd@ep-round-dawn-ai0cq6t4-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=your_super_secret_jwt_key
```

## Running the Schema in Neon
1. Log into your Neon account and go to the **SQL Editor**.
2. Copy the entire contents of `schema.sql` from this repository.
3. Paste it into the SQL Editor and click **Run**. This will create all necessary tables with their foreign keys and constraints.

## Render Deployment Steps
1. Go to [Render](https://render.com/) and click **New+** -> **Web Service**.
2. Connect your GitHub repository containing this project.
3. Use the following settings:
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Under **Environment Variables**, add:
   - `DATABASE_URL` (Same as connection string above)
   - `JWT_SECRET` (A secure random string)
5. Click **Create Web Service**. 
6. Render will build and deploy your application. You can use the provided Render `.onrender.com` URL as your base API URL.

## API Usage (Brief)
1. **POST** `/api/auth/signup` - Create a user (Role: Manager, Dispatcher, SafetyOfficer, FinancialAnalyst)
2. **POST** `/api/auth/login` - Get JWT Token
3. Treat the JWT token as a Bearer token in the `Authorization` header for all other endpoints: `Authorization: Bearer <token>`
4. **GET/POST/PUT/DELETE** `/api/vehicles`, `/api/drivers`
5. **POST** `/api/trips` - Create a trip (Validates vehicle capacity, driver license, and status)
6. **PATCH** `/api/trips/:id/status` - Update trip to `Dispatched` or `Completed` (Cascades statuses)
7. **POST** `/api/logs/maintenance`, `/api/logs/fuel` - Create logs (Maintenance cascades vehicle into `InShop`)
8. **GET** `/api/analytics/vehicle/:id` - Fetch total fuel & maintenance costs alongside fuel efficiency.