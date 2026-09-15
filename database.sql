-- ============================================================
-- BloodNet — Database Schema (Enhanced)
-- DBMS Project | blood_donor_network
-- ============================================================

CREATE DATABASE IF NOT EXISTS blood_donor_network
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE blood_donor_network;

-- ============================================================
-- TABLE: donors
-- Stores all registered blood donors
-- ============================================================
CREATE TABLE IF NOT EXISTS donors (
    donor_id            INT AUTO_INCREMENT PRIMARY KEY,
    full_name           VARCHAR(100)                                              NOT NULL,
    email               VARCHAR(100)  UNIQUE                                      NOT NULL,
    phone               VARCHAR(20)                                               NOT NULL,
    password_hash       VARCHAR(255)                                              NOT NULL,
    blood_group         ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-')          NOT NULL,
    date_of_birth       DATE                                                      NOT NULL,
    gender              ENUM('Male','Female','Other'),
    weight              DECIMAL(5,2),
    address             TEXT,
    city                VARCHAR(50),
    state               VARCHAR(50),
    health_conditions   TEXT,
    last_donation_date  DATE,
    availability_status ENUM('Available','Unavailable')  DEFAULT 'Available',
    created_at          TIMESTAMP                         DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP                         DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_blood_group (blood_group),
    INDEX idx_city        (city),
    INDEX idx_availability(availability_status)
);

-- ============================================================
-- TABLE: blood_banks
-- Blood bank organisation accounts
-- ============================================================
CREATE TABLE IF NOT EXISTS blood_banks (
    bank_id        INT AUTO_INCREMENT PRIMARY KEY,
    bank_name      VARCHAR(100)  NOT NULL,
    email          VARCHAR(100)  UNIQUE NOT NULL,
    phone          VARCHAR(20)   NOT NULL,
    password_hash  VARCHAR(255)  NOT NULL,
    address        TEXT          NOT NULL,
    city           VARCHAR(50)   NOT NULL,
    state          VARCHAR(50)   NOT NULL,
    latitude       DECIMAL(10,8),
    longitude      DECIMAL(11,8),
    license_number VARCHAR(50),
    is_verified    TINYINT(1)    DEFAULT 0,
    created_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_city (city)
);

-- ============================================================
-- TABLE: blood_inventory
-- Tracks every blood unit in each bank
-- ============================================================
CREATE TABLE IF NOT EXISTS blood_inventory (
    inventory_id   INT AUTO_INCREMENT PRIMARY KEY,
    bank_id        INT   NOT NULL,
    donor_id       INT,
    blood_group    ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-') NOT NULL,
    component_type ENUM('Whole Blood','Plasma','Platelets','Red Cells') DEFAULT 'Whole Blood',
    quantity_ml    INT   NOT NULL DEFAULT 450,
    collection_date DATE NOT NULL,
    expiry_date    DATE  NOT NULL,
    status         ENUM('Available','Reserved','Expired','Discarded') DEFAULT 'Available',
    batch_number   VARCHAR(50),
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bank_id)  REFERENCES blood_banks(bank_id) ON DELETE CASCADE,
    FOREIGN KEY (donor_id) REFERENCES donors(donor_id)     ON DELETE SET NULL,
    INDEX idx_blood_group (blood_group),
    INDEX idx_status      (status),
    INDEX idx_expiry      (expiry_date)
);

-- ============================================================
-- TABLE: blood_requests
-- Requests for blood from hospitals / individuals
-- ============================================================
CREATE TABLE IF NOT EXISTS blood_requests (
    request_id        INT AUTO_INCREMENT PRIMARY KEY,
    patient_name      VARCHAR(100) NOT NULL,
    patient_age       INT,
    blood_group       ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-') NOT NULL,
    component_type    ENUM('Whole Blood','Plasma','Platelets','Red Cells') DEFAULT 'Whole Blood',
    quantity_required INT          NOT NULL,
    hospital_name     VARCHAR(100) NOT NULL,
    hospital_address  TEXT         NOT NULL,
    urgency_level     ENUM('Critical','High','Medium','Low') DEFAULT 'Medium',
    required_date     DATE         NOT NULL,
    contact_person    VARCHAR(100) NOT NULL,
    contact_number    VARCHAR(20)  NOT NULL,
    email             VARCHAR(100),
    notes             TEXT,
    request_status    ENUM('Pending','Approved','Fulfilled','Rejected') DEFAULT 'Pending',
    fulfilled_by_bank INT,
    fulfilled_date    DATE,
    request_date      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fulfilled_by_bank) REFERENCES blood_banks(bank_id) ON DELETE SET NULL,
    INDEX idx_blood_group    (blood_group),
    INDEX idx_request_status (request_status),
    INDEX idx_urgency        (urgency_level)
);

-- ============================================================
-- TABLE: donation_drives
-- Donation camp events organised by blood banks
-- ============================================================
CREATE TABLE IF NOT EXISTS donation_drives (
    drive_id       INT AUTO_INCREMENT PRIMARY KEY,
    bank_id        INT          NOT NULL,
    name           VARCHAR(100) NOT NULL,
    date           DATE         NOT NULL,
    start_time     TIME         NOT NULL,
    end_time       TIME         NOT NULL,
    location       VARCHAR(255) NOT NULL,
    city           VARCHAR(50),
    description    TEXT,
    organizer      VARCHAR(100),
    contact_number VARCHAR(20),
    target_units   INT          DEFAULT 50,
    status         ENUM('Upcoming','Active','Completed','Cancelled') DEFAULT 'Upcoming',
    created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bank_id) REFERENCES blood_banks(bank_id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_date   (date)
);

-- ============================================================
-- TABLE: appointments
-- Donor booking for a bank or a drive
-- CHECK: must link to bank OR drive (or both)
-- ============================================================
CREATE TABLE IF NOT EXISTS appointments (
    appointment_id   INT AUTO_INCREMENT PRIMARY KEY,
    donor_id         INT NOT NULL,
    bank_id          INT,
    drive_id         INT,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status           ENUM('Scheduled','Completed','Cancelled','No-Show') DEFAULT 'Scheduled',
    notes            TEXT,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donor_id) REFERENCES donors(donor_id)          ON DELETE CASCADE,
    FOREIGN KEY (bank_id)  REFERENCES blood_banks(bank_id)      ON DELETE SET NULL,
    FOREIGN KEY (drive_id) REFERENCES donation_drives(drive_id) ON DELETE SET NULL,
    CONSTRAINT chk_appointment CHECK (bank_id IS NOT NULL OR drive_id IS NOT NULL)
);

-- ============================================================
-- SAMPLE DATA
-- ============================================================

-- Blood banks (password: "password" bcrypt hashed)
INSERT INTO blood_banks (bank_name, email, phone, password_hash, address, city, state, is_verified) VALUES
('City Blood Bank',          'citybank@example.com', '044-555-0101', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '123 Main Street', 'Chennai',    'Tamil Nadu',  1),
('General Hospital Bank',    'gh@example.com',       '044-555-0102', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '456 Healthcare Blvd', 'Chennai', 'Tamil Nadu',  1);

-- Donors
INSERT INTO donors (full_name, email, phone, password_hash, blood_group, date_of_birth, gender, weight, city, state, availability_status, last_donation_date) VALUES
('John Doe',      'john@example.com',   '9876543201', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'O+',  '1990-05-15', 'Male',   72.5, 'Chennai',   'Tamil Nadu',  'Available',   '2024-10-15'),
('Jane Smith',    'jane@example.com',   '9876543202', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'A-',  '1985-08-22', 'Female', 58.0, 'Mumbai',    'Maharashtra', 'Available',   '2024-11-02'),
('Ravi Kumar',    'ravi@example.com',   '9876543203', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'B+',  '1992-03-10', 'Male',   80.0, 'Delhi',     'Delhi',       'Unavailable', '2025-01-20'),
('Priya Nair',    'priya@example.com',  '9876543204', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'AB+', '1995-12-01', 'Female', 55.0, 'Bangalore', 'Karnataka',   'Available',   NULL),
('Arjun Sharma',  'arjun@example.com',  '9876543205', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'O-',  '1988-07-18', 'Male',   75.0, 'Chennai',   'Tamil Nadu',  'Available',   '2024-09-10'),
('Meena Pillai',  'meena@example.com',  '9876543206', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'A+',  '1993-02-28', 'Female', 62.0, 'Hyderabad', 'Telangana',   'Available',   '2024-12-01');

-- Blood inventory
INSERT INTO blood_inventory (bank_id, donor_id, blood_group, quantity_ml, collection_date, expiry_date, status) VALUES
(1, 1, 'O+',  450, CURDATE() - INTERVAL 5  DAY, CURDATE() + INTERVAL 30 DAY, 'Available'),
(1, 2, 'A-',  450, CURDATE() - INTERVAL 35 DAY, CURDATE() - INTERVAL 5  DAY, 'Expired'),
(1, NULL,'A+', 450, CURDATE() - INTERVAL 2  DAY, CURDATE() + INTERVAL 33 DAY, 'Available'),
(1, NULL,'AB-',450, CURDATE() - INTERVAL 10 DAY, CURDATE() + INTERVAL 25 DAY, 'Available'),
(2, 5, 'O-',  450, CURDATE() - INTERVAL 3  DAY, CURDATE() + INTERVAL 32 DAY, 'Available'),
(2, NULL,'B+', 450, CURDATE() - INTERVAL 1  DAY, CURDATE() + INTERVAL 34 DAY, 'Reserved'),
(2, NULL,'AB+',450, CURDATE() - INTERVAL 7  DAY, CURDATE() + INTERVAL 28 DAY, 'Available'),
(1, NULL,'B-', 450, CURDATE() - INTERVAL 4  DAY, CURDATE() + INTERVAL 31 DAY, 'Available');

-- Blood requests
INSERT INTO blood_requests (patient_name, patient_age, blood_group, quantity_required, hospital_name, hospital_address, urgency_level, required_date, contact_person, contact_number, request_status) VALUES
('Anbu Raja',  45, 'O+',  2, 'Apollo Hospital',        'Greams Road, Chennai',    'Critical', CURDATE() + INTERVAL 1 DAY, 'Dr. Raj',    '9001112223', 'Pending'),
('Selvi K',    32, 'A-',  1, 'Govt General Hospital',  'Park Town, Chennai',      'High',     CURDATE() + INTERVAL 2 DAY, 'Dr. Priya',  '9001112224', 'Approved'),
('Mani S',     60, 'B+',  3, 'Fortis Hospital',        'Arcot Road, Chennai',     'Medium',   CURDATE() - INTERVAL 5 DAY, 'Dr. Kumar',  '9001112225', 'Fulfilled'),
('Devi P',     28, 'AB+', 1, 'MIOT Hospital',          'Mount Poonamallee, Chennai','Low',    CURDATE() + INTERVAL 7 DAY, 'Dr. Nair',   '9001112226', 'Pending'),
('Suresh T',   55, 'O-',  2, 'Stanley Hospital',       'Royapuram, Chennai',      'Critical', CURDATE(),                 'Dr. Sharma', '9001112227', 'Rejected');

-- Donation drives
INSERT INTO donation_drives (bank_id, name, date, start_time, end_time, location, city, organizer, contact_number, target_units, status) VALUES
(1, 'World Blood Donor Day Drive', '2025-06-14', '09:00:00', '17:00:00', 'Marina Beach, Chennai',       'Chennai', 'City Blood Bank',      '044-555-0101', 100, 'Upcoming'),
(2, 'IIT Campus Blood Drive',      '2025-07-01', '10:00:00', '16:00:00', 'IIT Madras, Chennai',          'Chennai', 'NSS IIT Madras',       '044-555-0102', 80,  'Upcoming'),
(1, 'Summer Save Lives Drive',     '2025-05-10', '09:00:00', '14:00:00', 'Anna Nagar Community Hall',    'Chennai', 'Lions Club Chennai',   '044-555-0103', 60,  'Completed'),
(2, 'Hospital Anniversary Drive',  '2025-04-15', '10:00:00', '15:00:00', 'General Hospital, Egmore',     'Chennai', 'General Hospital',     '044-555-0104', 50,  'Completed');

-- Appointments
INSERT INTO appointments (donor_id, bank_id, drive_id, appointment_date, appointment_time, status) VALUES
(1, 1,    NULL, '2025-06-14', '10:00:00', 'Scheduled'),
(2, NULL, 2,    '2025-07-01', '11:00:00', 'Scheduled'),
(5, 2,    NULL, '2025-06-20', '14:30:00', 'Completed');
