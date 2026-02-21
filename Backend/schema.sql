CREATE TABLE IF NOT EXISTS Users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Manager', 'Dispatcher', 'SafetyOfficer', 'FinancialAnalyst')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Vehicles (
    id SERIAL PRIMARY KEY,
    model_name VARCHAR(255) NOT NULL,
    license_plate VARCHAR(50) UNIQUE NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL CHECK (vehicle_type IN ('Truck', 'Van', 'Bike')),
    max_capacity_kg NUMERIC(10, 2) NOT NULL,
    odometer NUMERIC(10, 2) DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'OnTrip', 'InShop', 'Retired')),
    acquisition_cost NUMERIC(15, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Drivers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    license_expiry_date DATE NOT NULL,
    safety_score INT DEFAULT 100 CHECK (safety_score BETWEEN 0 AND 100),
    status VARCHAR(50) NOT NULL DEFAULT 'OffDuty' CHECK (status IN ('OnDuty', 'OffDuty', 'Suspended')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Trips (
    id SERIAL PRIMARY KEY,
    vehicle_id INT NOT NULL,
    driver_id INT NOT NULL,
    cargo_weight NUMERIC(10, 2) NOT NULL,
    start_location TEXT NOT NULL,
    end_location TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Dispatched', 'Completed', 'Cancelled')),
    start_odometer NUMERIC(10, 2),
    end_odometer NUMERIC(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_trips_vehicle FOREIGN KEY (vehicle_id) REFERENCES Vehicles(id) ON DELETE CASCADE,
    CONSTRAINT fk_trips_driver FOREIGN KEY (driver_id) REFERENCES Drivers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS MaintenanceLogs (
    id SERIAL PRIMARY KEY,
    vehicle_id INT NOT NULL,
    description TEXT NOT NULL,
    cost NUMERIC(10, 2) NOT NULL,
    service_date DATE NOT NULL DEFAULT CURRENT_DATE,
    CONSTRAINT fk_maint_vehicle FOREIGN KEY (vehicle_id) REFERENCES Vehicles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS FuelLogs (
    id SERIAL PRIMARY KEY,
    vehicle_id INT NOT NULL,
    trip_id INT,
    liters NUMERIC(10, 2) NOT NULL,
    cost NUMERIC(10, 2) NOT NULL,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    CONSTRAINT fk_fuel_vehicle FOREIGN KEY (vehicle_id) REFERENCES Vehicles(id) ON DELETE CASCADE,
    CONSTRAINT fk_fuel_trip FOREIGN KEY (trip_id) REFERENCES Trips(id) ON DELETE SET NULL
);
