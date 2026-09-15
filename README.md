# 🩸 BloodNet — Enhanced DBMS Project

A Blood Donor Network web application demonstrating full-stack PHP + MySQL DBMS concepts, built with a clean, modular architecture and an interactive database visualizer for demonstration.

---

## 📁 Project Structure

```
blood_donor_enhanced/
├── index.html                  ← Landing page
├── dashboard.html              ← Donor dashboard
├── database.sql                ← Full schema + sample data
├── setup.sh                    ← One-command installer
│
├── css/
│   ├── variables.css           ← Design tokens (colours, fonts, spacing)
│   ├── base.css                ← Reset + typography
│   ├── components.css          ← Reusable UI (buttons, forms, cards, nav)
│   ├── home.css                ← Landing page styles
│   └── dashboard.css           ← Dashboard layout styles
│
├── js/
│   ├── main.js                 ← Core utilities (API, auth, toast, counters)
│   └── components/
│       └── blood-availability.js
│
├── pages/
│   ├── find-donors.html
│   ├── request-blood.html
│   ├── drives.html
│   └── donor/
│       ├── login.html
│       ├── register.html       ← Multi-step form
│       └── auth.css
│
├── db-visualizer/              ★ NEW — For invigilator demo
│   ├── index.html
│   ├── visualizer.css
│   └── visualizer.js           ← ER diagram, query sim, data flow, charts
│
├── api/
│   ├── config/database.php     ← DB connection
│   ├── donor/
│   │   ├── login.php
│   │   ├── register.php
│   │   └── respond-request.php
│   ├── bloodbank/
│   │   ├── inventory.php
│   │   ├── requests.php
│   │   └── drives.php
│   └── common/
│       ├── search.php
│       └── stats.php
│
└── models/
    └── donor.php               ← Donor model (PDO)
```

---

## 🚀 Quick Start

### Option A — Automated Setup (Linux/macOS)

```bash
chmod +x setup.sh
./setup.sh
```

The script installs PHP 8+, MySQL, sets up the database, and starts a dev server.

### Option B — Manual Setup

**Requirements:**
- PHP 8.0+
- MySQL 5.7+ or MariaDB 10.4+
- A web server (Apache / Nginx) or PHP's built-in server

**Steps:**

1. Import the database:
```sql
mysql -u root -p < database.sql
```

2. Update DB credentials in `api/config/database.php`:
```php
private $host     = "localhost";
private $db_name  = "blood_donor_network";
private $username = "root";
private $password = "YOUR_PASSWORD";
```

3. Start server:
```bash
php -S localhost:8080
```

4. Open browser: `http://localhost:8080`

---

## 🗄️ Database Visualizer (for Invigilator Demo)

Navigate to: **`http://localhost:8080/db-visualizer/`**

### Features:
| Tab | What it shows |
|-----|--------------|
| **ER Diagram** | All 6 tables with fields, PK/FK indicators, colour-coded by table |
| **Table Browser** | Schema + sample data for every table |
| **Data Flow** | Step-by-step diagram: Registration → Drive → Donation → Request |
| **Query Simulator** | 7 real SQL queries with syntax highlighting, explanation, and result set |
| **Live Stats** | Bar chart of inventory, donut chart of request status, activity feed |

---

## 🗃️ Database Schema

| Table | Description |
|-------|-------------|
| `donors` | Registered blood donors with profile + availability |
| `blood_banks` | Blood bank organisations (accounts) |
| `blood_inventory` | Individual blood units (linked to bank + optional donor) |
| `blood_requests` | Requests from hospitals for specific blood |
| `donation_drives` | Donation camp events organised by banks |
| `appointments` | Donor bookings for a bank visit or drive |

### Key Relationships
- `blood_inventory.bank_id` → `blood_banks.bank_id`
- `blood_inventory.donor_id` → `donors.donor_id` *(optional)*
- `blood_requests.fulfilled_by_bank` → `blood_banks.bank_id`
- `donation_drives.bank_id` → `blood_banks.bank_id`
- `appointments.donor_id` → `donors.donor_id`
- `appointments.bank_id` → `blood_banks.bank_id` *(nullable)*
- `appointments.drive_id` → `donation_drives.drive_id` *(nullable)*

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Donor | john@example.com | password |
| Blood Bank | citybank@example.com | password |

---

## 🛠️ Key DBMS Concepts Demonstrated

- **DDL**: `CREATE TABLE`, `ALTER`, foreign key constraints, indexes
- **DML**: `INSERT`, `UPDATE`, `DELETE` via PHP PDO
- **DQL**: `SELECT` with `WHERE`, `JOIN`, `GROUP BY`, `ORDER BY`, `HAVING`
- **Aggregate Functions**: `COUNT`, `SUM`, `MIN`, `MAX`
- **Normalization**: Tables in 3NF
- **Referential Integrity**: `ON DELETE CASCADE` / `ON DELETE SET NULL`
- **Transactions**: Used in fulfillment flow
- **Indexing**: Blood group, city, status columns indexed for performance
- **Stored ENUMs**: blood_group, status, urgency_level, component_type
