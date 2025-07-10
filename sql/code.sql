CREATE DATABASE IF NOT EXISTS dairy_management;
USE dairy_management;

CREATE TABLE farmers (
  id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  address TEXT NOT NULL,
  cattle_count INT NOT NULL,
  bank_account VARCHAR(20) NOT NULL,
  ifsc_code VARCHAR(15) NOT NULL,
  status ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active',
  join_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

USE dairy_management;

CREATE TABLE suppliers (
  id VARCHAR(20) PRIMARY KEY,
  company_name VARCHAR(150) NOT NULL,
  contact_person VARCHAR(100) NOT NULL,
  phone VARCHAR(15) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  address TEXT NOT NULL,
  supplier_type ENUM('Feed Supplier', 'Equipment Supplier', 'Packaging Supplier', 'Chemical Supplier', 'Testing Services', 'Logistics') NOT NULL,
  status ENUM('Active', 'Inactive', 'Pending Approval') DEFAULT 'Active',
  join_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

 USE dairy_management;

CREATE TABLE milk_entries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  farmer_id VARCHAR(20) NOT NULL,
  farmer_name VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  shift ENUM('Morning', 'Evening') NOT NULL,
  quality ENUM('A+', 'A', 'B', 'C', 'D') NOT NULL,
  fat_content DECIMAL(5,2),
  snf_content DECIMAL(5,2),
  temperature DECIMAL(4,1),
  ph_level DECIMAL(3,1),
  collection_center VARCHAR(100),
  collected_by VARCHAR(100),
  vehicle_number VARCHAR(20),
  remarks TEXT,
  payment_amount DECIMAL(10,2),
  payment_status ENUM('Pending', 'Paid', 'Partial') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE,
  INDEX idx_farmer_date (farmer_id, date),
  INDEX idx_date (date),
  INDEX idx_shift (shift)
);
USE dairy_management;

CREATE TABLE fleet_management (
  id VARCHAR(20) PRIMARY KEY,
  vehicle_number VARCHAR(20) UNIQUE NOT NULL,
  vehicle_type VARCHAR(50) NOT NULL,
  driver_name VARCHAR(100) NOT NULL,
  driver_phone VARCHAR(15) NOT NULL,
  capacity INT NOT NULL,
  status ENUM('Available', 'In Use', 'Under Maintenance', 'Out of Service') DEFAULT 'Available',
  last_maintenance_date DATE,
  next_maintenance_date DATE,
  location VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE deliveries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  delivery_date DATE NOT NULL,
  vehicle_id VARCHAR(20),
  driver_name VARCHAR(100),
  destination VARCHAR(255) NOT NULL,
  status ENUM('pending', 'in_transit', 'delivered', 'cancelled') DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (vehicle_id) REFERENCES fleet_management(id)
);
CREATE TABLE quality_control_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  batch_id VARCHAR(20) NOT NULL,
  unit_id VARCHAR(20) NOT NULL,
  test_date DATE NOT NULL,
  fat DECIMAL(5,2),
  protein DECIMAL(5,2),
  moisture DECIMAL(5,2),
  ph DECIMAL(5,2),
  result ENUM('Pass', 'Fail', 'Pending') DEFAULT 'Pending',
  inspector VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE maintenance_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  unit_id VARCHAR(20) NOT NULL,
  date DATE NOT NULL,
  type ENUM('Preventive', 'Corrective', 'Emergency', 'Scheduled') DEFAULT 'Preventive',
  description TEXT NOT NULL,
  cost DECIMAL(10,2) NOT NULL,
  technician VARCHAR(100) NOT NULL,
  status ENUM('Scheduled', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- Retailers table
CREATE TABLE retailers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  location VARCHAR(100) NOT NULL,
  contact VARCHAR(15) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sales table
CREATE TABLE sales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL,
  retailer VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_retailer (retailer),
  INDEX idx_date (date)
);
ALTER TABLE retailers 
ADD COLUMN total_sales DECIMAL(10,2) DEFAULT 0.00 AFTER contact;

-- Create inventory records table with all required fields
CREATE TABLE inventory_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_code VARCHAR(20) NOT NULL UNIQUE,
  item_name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  current_stock_level DECIMAL(10,2) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  minimum_stock_level DECIMAL(10,2) NOT NULL,    -- Minimum stock level
  maximum_stock_level DECIMAL(10,2) NOT NULL,    -- Maximum stock level
  location VARCHAR(100),
  status ENUM('In Stock', 'Low Stock', 'Out of Stock') DEFAULT 'In Stock',
  last_updated DATE,
  supplier VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  position VARCHAR(100) NOT NULL,
  department VARCHAR(50) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  email VARCHAR(100) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  join_date DATE NOT NULL,
  status ENUM('Active', 'Inactive') DEFAULT 'Active',
  address TEXT,
  emergency_contact VARCHAR(15),
  experience INT,
  qualification VARCHAR(100),
  blood_group VARCHAR(5),
  date_of_birth DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
 -- Payments table
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  farmer_id VARCHAR(20) NOT NULL,
  payment_date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_mode ENUM('Bank Transfer', 'Cash', 'Check', 'UPI', 'Digital Wallet') NOT NULL,
  remarks TEXT,
  status ENUM('Completed', 'Pending', 'Failed', 'Processing') DEFAULT 'Pending',
  transaction_id VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bills table
CREATE TABLE bills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bill_id VARCHAR(20) NOT NULL UNIQUE,
  farmer_id VARCHAR(20) NOT NULL,
  bill_date DATE NOT NULL,
  due_date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  status ENUM('Paid', 'Unpaid', 'Overdue', 'Partially Paid') DEFAULT 'Unpaid',
  category ENUM('Milk Purchase', 'Equipment', 'Maintenance', 'Transport', 'Utilities', 'Other') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE lab_quality_tests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  batch_id VARCHAR(32) NOT NULL,
  sample_id VARCHAR(32) NOT NULL,
  farmer_id VARCHAR(32) NOT NULL,
  test_date DATE NOT NULL,
  test_type VARCHAR(32) NOT NULL,
  fat_content DECIMAL(4,2),
  protein_content DECIMAL(4,2),
  lactose_content DECIMAL(4,2),
  snf_content DECIMAL(4,2),
  ph_level DECIMAL(4,2),
  bacteria_count INT,
  adulteration VARCHAR(32),
  overall_grade VARCHAR(8),
  status VARCHAR(16),
  remarks TEXT,
  tested_by VARCHAR(64),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
  id VARCHAR(10) PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  rating INT NOT NULL,
  subject VARCHAR(200) NOT NULL,
  comment TEXT NOT NULL,
  date DATE NOT NULL,
  status VARCHAR(20) NOT NULL,
  response TEXT,
  response_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
