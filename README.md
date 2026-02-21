# Fleet Logistics Management System

A comprehensive fleet management platform built to streamline operations, track expenses, manage drivers, and optimize vehicle dispatching. This system features role-based access control, allowing different stakeholders (Fleet Managers, Dispatchers, Financial Analysts, and Safety Officers) to access specific tools and analytics pertinent to their duties.

## Tech Stack
* **Frontend:** React, React Router, Vite, Axios, Lucide-React
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL (hosted on Neon)

## Features Included
* **Dashboard:** Centralized KPIs for active fleet, maintenance alerts, and utilization rates.
* **Vehicle Registry:** Track vehicle details, monitor status, and register new vehicles.
* **Trip Dispatcher:** Dispatch vehicles, assign drivers, calculate route distances, and update trip status.
* **Expense Management:** Log fuel transactions and monitor operational costs per trip/vehicle.
* **Driver Performance:** Register new drivers and evaluate safety scores and completion metrics.
* **Financial Analytics:** Gain insights into total revenues, operating costs, and overall profitability.

---

## Access & Login Credentials (For Judges)

The system enforces role-based access. Please use the following test credentials to log in and explore the various dashboards and functionalities tailored to each role.

### 1. Fleet Manager 
*Has full access to the comprehensive overview dashboard and management tools.*
* **Email:** `admin@fleet.com`
* **Password:** `password123`

### 2. Dispatcher
*Focuses on the Trip Dispatcher and Vehicle Registry to manage logistics.*
* **Email:** `dave@fleet.com`
* **Password:** `password123`

### 3. Financial Analyst
*Focuses on fuel logs, trip expenses, and the Financial Analytics dashboard.*
* **Email:** `fiona@fleet.com`
* **Password:** `password123`

### 4. Safety Officer
*Focuses on the Driver Performance index, safety scores, and maintenance alerts.*
* **Email:** `sam@fleet.com`
* **Password:** `password123`

---

## Local Development Setup

To run this project locally, follow these steps:

### 1. Backend Setup
1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `Backend` root and add your database and JWT secrets.
4. Start the backend server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the `Frontend` directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the localhost URL provided by Vite (typically `http://localhost:5173`).
