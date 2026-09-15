// ============================================
// BloodNet — Database Visualizer
// Complete interactive schema & data explorer
// ============================================

// ---- Schema Definition ----
const SCHEMA = {
    donors: {
        color: '#ef4444',
        icon: 'fa-user',
        fields: [
            { name: 'donor_id',           type: 'INT',          pk: true,  fk: false, nn: true,  ai: true },
            { name: 'full_name',          type: 'VARCHAR(100)',  pk: false, fk: false, nn: true  },
            { name: 'email',              type: 'VARCHAR(100)',  pk: false, fk: false, nn: true,  unique: true },
            { name: 'phone',              type: 'VARCHAR(20)',   pk: false, fk: false, nn: true  },
            { name: 'password_hash',      type: 'VARCHAR(255)',  pk: false, fk: false, nn: true  },
            { name: 'blood_group',        type: 'ENUM',          pk: false, fk: false, nn: true  },
            { name: 'date_of_birth',      type: 'DATE',          pk: false, fk: false, nn: true  },
            { name: 'gender',             type: 'ENUM',          pk: false, fk: false, nn: false },
            { name: 'weight',             type: 'DECIMAL(5,2)',  pk: false, fk: false, nn: false },
            { name: 'city',               type: 'VARCHAR(50)',   pk: false, fk: false, nn: false },
            { name: 'state',              type: 'VARCHAR(50)',   pk: false, fk: false, nn: false },
            { name: 'availability_status',type: 'ENUM',          pk: false, fk: false, nn: false },
            { name: 'last_donation_date', type: 'DATE',          pk: false, fk: false, nn: false },
            { name: 'created_at',         type: 'TIMESTAMP',     pk: false, fk: false, nn: false },
        ]
    },
    blood_banks: {
        color: '#f97316',
        icon: 'fa-hospital',
        fields: [
            { name: 'bank_id',      type: 'INT',         pk: true,  fk: false, nn: true, ai: true },
            { name: 'bank_name',    type: 'VARCHAR(100)', pk: false, fk: false, nn: true  },
            { name: 'email',        type: 'VARCHAR(100)', pk: false, fk: false, nn: true  },
            { name: 'phone',        type: 'VARCHAR(20)',  pk: false, fk: false, nn: true  },
            { name: 'password_hash',type: 'VARCHAR(255)', pk: false, fk: false, nn: true  },
            { name: 'address',      type: 'TEXT',         pk: false, fk: false, nn: true  },
            { name: 'city',         type: 'VARCHAR(50)',  pk: false, fk: false, nn: true  },
            { name: 'state',        type: 'VARCHAR(50)',  pk: false, fk: false, nn: true  },
            { name: 'license_number',type: 'VARCHAR(50)', pk: false, fk: false, nn: false },
            { name: 'created_at',   type: 'TIMESTAMP',    pk: false, fk: false, nn: false },
        ]
    },
    blood_inventory: {
        color: '#8b5cf6',
        icon: 'fa-vials',
        fields: [
            { name: 'inventory_id',   type: 'INT',        pk: true,  fk: false, nn: true, ai: true },
            { name: 'bank_id',        type: 'INT',        pk: false, fk: true,  nn: true,  ref: 'blood_banks.bank_id' },
            { name: 'donor_id',       type: 'INT',        pk: false, fk: true,  nn: false, ref: 'donors.donor_id' },
            { name: 'blood_group',    type: 'ENUM',       pk: false, fk: false, nn: true  },
            { name: 'component_type', type: 'ENUM',       pk: false, fk: false, nn: false },
            { name: 'quantity_ml',    type: 'INT',        pk: false, fk: false, nn: true  },
            { name: 'collection_date',type: 'DATE',       pk: false, fk: false, nn: true  },
            { name: 'expiry_date',    type: 'DATE',       pk: false, fk: false, nn: true  },
            { name: 'status',         type: 'ENUM',       pk: false, fk: false, nn: false },
            { name: 'batch_number',   type: 'VARCHAR(50)',pk: false, fk: false, nn: false },
        ]
    },
    blood_requests: {
        color: '#06b6d4',
        icon: 'fa-hand-holding-heart',
        fields: [
            { name: 'request_id',       type: 'INT',         pk: true,  fk: false, nn: true, ai: true },
            { name: 'patient_name',     type: 'VARCHAR(100)', pk: false, fk: false, nn: true  },
            { name: 'blood_group',      type: 'ENUM',         pk: false, fk: false, nn: true  },
            { name: 'component_type',   type: 'ENUM',         pk: false, fk: false, nn: false },
            { name: 'quantity_required',type: 'INT',          pk: false, fk: false, nn: true  },
            { name: 'hospital_name',    type: 'VARCHAR(100)', pk: false, fk: false, nn: true  },
            { name: 'urgency_level',    type: 'ENUM',         pk: false, fk: false, nn: false },
            { name: 'required_date',    type: 'DATE',         pk: false, fk: false, nn: true  },
            { name: 'request_status',   type: 'ENUM',         pk: false, fk: false, nn: false },
            { name: 'fulfilled_by_bank',type: 'INT',          pk: false, fk: true,  nn: false, ref: 'blood_banks.bank_id' },
            { name: 'request_date',     type: 'TIMESTAMP',    pk: false, fk: false, nn: false },
        ]
    },
    donation_drives: {
        color: '#16a34a',
        icon: 'fa-calendar-heart',
        fields: [
            { name: 'drive_id',      type: 'INT',         pk: true,  fk: false, nn: true, ai: true },
            { name: 'bank_id',       type: 'INT',         pk: false, fk: true,  nn: true,  ref: 'blood_banks.bank_id' },
            { name: 'name',          type: 'VARCHAR(100)', pk: false, fk: false, nn: true  },
            { name: 'date',          type: 'DATE',         pk: false, fk: false, nn: true  },
            { name: 'start_time',    type: 'TIME',         pk: false, fk: false, nn: true  },
            { name: 'end_time',      type: 'TIME',         pk: false, fk: false, nn: true  },
            { name: 'location',      type: 'VARCHAR(255)', pk: false, fk: false, nn: true  },
            { name: 'status',        type: 'ENUM',         pk: false, fk: false, nn: false },
        ]
    },
    appointments: {
        color: '#d97706',
        icon: 'fa-calendar-check',
        fields: [
            { name: 'appointment_id',  type: 'INT',   pk: true,  fk: false, nn: true, ai: true },
            { name: 'donor_id',        type: 'INT',   pk: false, fk: true,  nn: true,  ref: 'donors.donor_id' },
            { name: 'bank_id',         type: 'INT',   pk: false, fk: true,  nn: false, ref: 'blood_banks.bank_id' },
            { name: 'drive_id',        type: 'INT',   pk: false, fk: true,  nn: false, ref: 'donation_drives.drive_id' },
            { name: 'appointment_date',type: 'DATE',  pk: false, fk: false, nn: true  },
            { name: 'appointment_time',type: 'TIME',  pk: false, fk: false, nn: true  },
            { name: 'status',          type: 'ENUM',  pk: false, fk: false, nn: false },
            { name: 'created_at',      type: 'TIMESTAMP', pk: false, fk: false, nn: false },
        ]
    }
};

// ---- Sample Data ----
const SAMPLE_DATA = {
    donors: {
        columns: ['donor_id', 'full_name', 'blood_group', 'city', 'availability_status', 'last_donation_date'],
        rows: [
            [1, 'John Doe',      'O+',  'Chennai',   'Available',   '2024-10-15'],
            [2, 'Jane Smith',    'A-',  'Mumbai',    'Available',   '2024-11-02'],
            [3, 'Ravi Kumar',    'B+',  'Delhi',     'Unavailable', '2025-01-20'],
            [4, 'Priya Nair',    'AB+', 'Bangalore', 'Available',   null],
            [5, 'Arjun Sharma',  'O-',  'Chennai',   'Available',   '2024-09-10'],
            [6, 'Meena Pillai',  'A+',  'Hyderabad', 'Available',   '2024-12-01'],
        ]
    },
    blood_banks: {
        columns: ['bank_id', 'bank_name', 'city', 'state', 'phone'],
        rows: [
            [1, 'City Blood Bank',       'Chennai',   'TN', '044-555-0101'],
            [2, 'General Hospital Bank', 'Chennai',   'TN', '044-555-0102'],
        ]
    },
    blood_inventory: {
        columns: ['inventory_id', 'bank_id', 'blood_group', 'quantity_ml', 'status', 'expiry_date'],
        rows: [
            [1, 1, 'O+',  450, 'Available', '2025-08-01'],
            [2, 1, 'A+',  450, 'Available', '2025-08-05'],
            [3, 1, 'AB-', 450, 'Available', '2025-07-20'],
            [4, 2, 'B+',  450, 'Reserved',  '2025-07-30'],
            [5, 2, 'O-',  450, 'Available', '2025-08-10'],
            [6, 1, 'A-',  450, 'Expired',   '2025-06-01'],
            [7, 2, 'AB+', 450, 'Available', '2025-08-15'],
            [8, 1, 'B-',  450, 'Available', '2025-07-28'],
        ]
    },
    blood_requests: {
        columns: ['request_id', 'patient_name', 'blood_group', 'hospital_name', 'urgency_level', 'request_status'],
        rows: [
            [1, 'Anbu Raja',    'O+',  'Apollo Hospital',   'Critical', 'Pending'],
            [2, 'Selvi K',      'A-',  'Govt General Hosp', 'High',     'Approved'],
            [3, 'Mani S',       'B+',  'Fortis Hospital',   'Medium',   'Fulfilled'],
            [4, 'Devi P',       'AB+', 'MIOT Hospital',     'Low',      'Pending'],
            [5, 'Suresh T',     'O-',  'Stanley Hospital',  'Critical', 'Rejected'],
        ]
    },
    donation_drives: {
        columns: ['drive_id', 'bank_id', 'name', 'date', 'location', 'status'],
        rows: [
            [1, 1, 'World Blood Donor Day Drive', '2025-06-14', 'Marina Beach, Chennai',    'Upcoming'],
            [2, 2, 'Campus Blood Drive – IIT',    '2025-07-01', 'IIT Madras, Chennai',       'Upcoming'],
            [3, 1, 'Summer Save Lives Drive',     '2025-05-10', 'Anna Nagar Community Hall', 'Completed'],
            [4, 2, 'Hospital Anniversary Drive',  '2025-04-15', 'General Hospital, Egmore',  'Completed'],
        ]
    },
    appointments: {
        columns: ['appointment_id', 'donor_id', 'bank_id', 'drive_id', 'appointment_date', 'status'],
        rows: [
            [1, 1, 1,    null, '2025-06-14', 'Scheduled'],
            [2, 2, null, 2,    '2025-07-01', 'Scheduled'],
            [3, 5, 2,    null, '2025-06-20', 'Completed'],
        ]
    }
};

// ---- Query Templates ----
const QUERIES = {
    'find-donors': {
        sql: `SELECT donor_id, full_name, blood_group, city, phone,
       last_donation_date, availability_status
FROM   donors
WHERE  blood_group = 'O+'
  AND  availability_status = 'Available'
ORDER  BY last_donation_date DESC;`,
        explain: `🔍 <strong>What this does:</strong> Finds all Available donors with blood group O+, sorted by their most recent donation. This is the core lookup query used when a hospital needs a specific blood type.`,
        result: {
            columns: ['donor_id', 'full_name', 'blood_group', 'city', 'availability_status'],
            rows: [[1, 'John Doe', 'O+', 'Chennai', 'Available']]
        }
    },
    'inventory-check': {
        sql: `SELECT bi.blood_group,
       COUNT(*) AS total_units,
       SUM(CASE WHEN bi.status = 'Available' THEN 1 ELSE 0 END) AS available,
       SUM(CASE WHEN bi.status = 'Reserved'  THEN 1 ELSE 0 END) AS reserved,
       SUM(CASE WHEN bi.status = 'Expired'   THEN 1 ELSE 0 END) AS expired
FROM   blood_inventory bi
WHERE  bi.bank_id = 1
GROUP  BY bi.blood_group
ORDER  BY available DESC;`,
        explain: `📊 <strong>What this does:</strong> Aggregates inventory for a specific blood bank, counting units by blood group and status. Uses GROUP BY with conditional SUM (CASE WHEN) — a common SQL pattern.`,
        result: {
            columns: ['blood_group', 'total_units', 'available', 'reserved', 'expired'],
            rows: [
                ['O+', 2, 2, 0, 0], ['A+', 2, 2, 0, 0], ['AB-', 1, 1, 0, 0],
                ['A-', 1, 0, 0, 1], ['B-', 1, 1, 0, 0]
            ]
        }
    },
    'pending-requests': {
        sql: `SELECT r.request_id, r.patient_name, r.blood_group,
       r.hospital_name, r.urgency_level,
       r.quantity_required, r.required_date
FROM   blood_requests r
WHERE  r.request_status = 'Pending'
ORDER  BY FIELD(r.urgency_level, 'Critical','High','Medium','Low'),
          r.required_date ASC;`,
        explain: `🚨 <strong>What this does:</strong> Fetches all Pending blood requests sorted by urgency (Critical first) then by required date. Uses MySQL's <code>FIELD()</code> function for custom sort ordering.`,
        result: {
            columns: ['request_id', 'patient_name', 'blood_group', 'hospital_name', 'urgency_level'],
            rows: [
                [1, 'Anbu Raja', 'O+', 'Apollo Hospital', 'Critical'],
                [4, 'Devi P',    'AB+', 'MIOT Hospital',  'Low']
            ]
        }
    },
    'upcoming-drives': {
        sql: `SELECT dd.name, dd.date, dd.start_time, dd.end_time,
       dd.location, bb.bank_name, dd.status
FROM   donation_drives dd
JOIN   blood_banks bb ON dd.bank_id = bb.bank_id
WHERE  dd.status = 'Upcoming'
  AND  dd.date >= CURDATE()
ORDER  BY dd.date ASC;`,
        explain: `📅 <strong>What this does:</strong> Lists upcoming drives with their organising blood bank name using an INNER JOIN. Filters to only future dates using CURDATE().`,
        result: {
            columns: ['name', 'date', 'location', 'bank_name'],
            rows: [
                ['World Blood Donor Day Drive', '2025-06-14', 'Marina Beach, Chennai', 'City Blood Bank'],
                ['Campus Blood Drive – IIT',    '2025-07-01', 'IIT Madras, Chennai',   'General Hospital Bank'],
            ]
        }
    },
    'donor-history': {
        sql: `SELECT d.full_name, d.blood_group,
       a.appointment_date, a.status AS appointment_status,
       bb.bank_name, dd.name AS drive_name
FROM   appointments a
JOIN   donors d       ON a.donor_id = d.donor_id
LEFT JOIN blood_banks bb ON a.bank_id  = bb.bank_id
LEFT JOIN donation_drives dd ON a.drive_id = dd.drive_id
WHERE  d.donor_id = 1
ORDER  BY a.appointment_date DESC;`,
        explain: `📋 <strong>What this does:</strong> Shows a donor's full appointment/donation history. Uses LEFT JOINs so it includes appointments at both blood banks and donation drives (either one may be NULL).`,
        result: {
            columns: ['full_name', 'blood_group', 'appointment_date', 'appointment_status', 'bank_name'],
            rows: [['John Doe', 'O+', '2025-06-14', 'Scheduled', 'City Blood Bank']]
        }
    },
    'join-example': {
        sql: `SELECT d.full_name, d.blood_group, d.city,
       COUNT(a.appointment_id) AS total_appointments,
       MAX(a.appointment_date) AS last_appointment
FROM   donors d
LEFT JOIN appointments a ON d.donor_id = a.donor_id
GROUP  BY d.donor_id, d.full_name, d.blood_group, d.city
HAVING COUNT(a.appointment_id) >= 0
ORDER  BY total_appointments DESC;`,
        explain: `🔗 <strong>What this does:</strong> A classic LEFT JOIN + GROUP BY aggregation. Shows every donor alongside their appointment count. LEFT JOIN ensures donors with zero appointments still appear in the result.`,
        result: {
            columns: ['full_name', 'blood_group', 'city', 'total_appointments'],
            rows: [
                ['John Doe',    'O+',  'Chennai',   1],
                ['Jane Smith',  'A-',  'Mumbai',    1],
                ['Arjun Sharma','O-',  'Chennai',   1],
                ['Ravi Kumar',  'B+',  'Delhi',     0],
                ['Priya Nair',  'AB+', 'Bangalore', 0],
            ]
        }
    },
    'aggregate': {
        sql: `SELECT blood_group,
       COUNT(*) AS total_units,
       SUM(quantity_ml) AS total_ml,
       MIN(expiry_date) AS earliest_expiry
FROM   blood_inventory
WHERE  status = 'Available'
GROUP  BY blood_group
ORDER  BY total_units DESC;`,
        explain: `📈 <strong>What this does:</strong> Full aggregate summary of available blood inventory. Demonstrates COUNT, SUM, MIN aggregate functions with GROUP BY — a common DBMS exam topic.`,
        result: {
            columns: ['blood_group', 'total_units', 'total_ml', 'earliest_expiry'],
            rows: [
                ['O+', 2, 900, '2025-08-01'], ['A+', 2, 900, '2025-08-05'],
                ['O-', 1, 450, '2025-08-10'], ['AB+', 1, 450, '2025-08-15'],
                ['AB-', 1, 450, '2025-07-20'], ['B-', 1, 450, '2025-07-28'],
            ]
        }
    }
};

// ============================
// ER Diagram Renderer
// ============================
function renderER() {
    const canvas = document.getElementById('erCanvas');
    const tables = Object.entries(SCHEMA);
    canvas.innerHTML = `<div class="er-tables-grid" id="erGrid"></div>`;
    const grid = document.getElementById('erGrid');

    tables.forEach(([name, def]) => {
        const fields = def.fields.slice(0, 8); // show top 8
        const el = document.createElement('div');
        el.className = 'er-table';
        el.id = `er-${name}`;
        el.innerHTML = `
            <div class="er-table-header" style="background:${def.color}">
                <i class="fas ${def.icon}"></i> ${name}
            </div>
            <div class="er-table-fields">
                ${fields.map(f => `
                    <div class="er-field ${f.pk ? 'pk' : f.fk ? 'fk' : ''}">
                        <div class="field-key ${f.pk ? 'pk' : f.fk ? 'fk' : 'none'}">${f.pk ? 'PK' : f.fk ? 'FK' : ''}</div>
                        <div class="field-name">${f.name}</div>
                        <div class="field-type">${f.type}</div>
                    </div>
                `).join('')}
                ${def.fields.length > 8 ? `<div class="er-field" style="color:var(--text-muted);font-style:italic"><div class="field-key none"></div><div>+ ${def.fields.length - 8} more fields</div></div>` : ''}
            </div>
        `;
        el.addEventListener('mouseenter', () => el.style.borderColor = def.color);
        el.addEventListener('mouseleave', () => el.style.borderColor = '');
        grid.appendChild(el);
    });
}

// ============================
// Table Browser
// ============================
function renderTableSchema(tableName) {
    const def = SCHEMA[tableName];
    const container = document.getElementById('tableSchemaView');
    container.innerHTML = `
        <div class="schema-table-card">
            <div class="schema-table-head">
                <span>Column Name</span><span>Data Type</span><span>Key</span><span>Null?</span><span>Notes</span>
            </div>
            ${def.fields.map(f => `
                <div class="schema-row">
                    <span><strong>${f.name}</strong></span>
                    <span style="color:var(--info)">${f.type}${f.ai ? ' AUTO_INCREMENT' : ''}</span>
                    <span>
                        ${f.pk ? '<span class="pk-badge">PK</span>' : ''}
                        ${f.fk ? '<span class="fk-badge">FK</span>' : ''}
                    </span>
                    <span>${f.nn ? '<span class="nn-badge">NOT NULL</span>' : '<span style="color:var(--text-muted)">NULL</span>'}</span>
                    <span style="color:var(--text-muted);font-size:11px">${f.ref ? `→ ${f.ref}` : f.unique ? 'UNIQUE' : ''}</span>
                </div>
            `).join('')}
        </div>
    `;
}

function renderTableData(tableName) {
    const data = SAMPLE_DATA[tableName];
    const container = document.getElementById('tableDataView');
    container.innerHTML = `
        <div class="table-wrapper">
            <table class="data-table">
                <thead>
                    <tr>${data.columns.map(c => `<th>${c}</th>`).join('')}</tr>
                </thead>
                <tbody>
                    ${data.rows.map(row => `
                        <tr>${row.map(v => `<td>${v === null ? '<span style="color:var(--text-muted)">NULL</span>' : v}</td>`).join('')}</tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        <p style="font-size:var(--text-xs);color:var(--text-muted);padding:var(--space-3)">Showing demo data (not connected to live database)</p>
    `;
}

// ============================
// Data Flow Diagram
// ============================
function renderFlow() {
    const container = document.getElementById('flowDiagram');
    const stages = [
        {
            title: 'Registration',
            nodes: [
                { icon: '🩸', name: 'Donor Signs Up', table: 'donors', color: '#fef2f2', border: '#fca5a5' },
                { icon: '🏥', name: 'Blood Bank Created', table: 'blood_banks', color: '#fff7ed', border: '#fdba74' },
            ]
        },
        { arrow: true },
        {
            title: 'Drive / Booking',
            nodes: [
                { icon: '📅', name: 'Drive Organised', table: 'donation_drives', color: '#f0fdf4', border: '#86efac' },
                { icon: '✅', name: 'Appointment Made', table: 'appointments', color: '#fffbeb', border: '#fde68a' },
            ]
        },
        { arrow: true },
        {
            title: 'Donation',
            nodes: [
                { icon: '💉', name: 'Blood Collected', table: 'blood_inventory', color: '#faf5ff', border: '#c4b5fd' },
            ]
        },
        { arrow: true },
        {
            title: 'Request & Fulfil',
            nodes: [
                { icon: '🆘', name: 'Request Raised', table: 'blood_requests', color: '#eff6ff', border: '#93c5fd' },
                { icon: '🎯', name: 'Request Fulfilled', table: 'blood_inventory → blood_requests', color: '#f0fdf4', border: '#86efac' },
            ]
        }
    ];

    const row = document.createElement('div');
    row.className = 'flow-stages';

    stages.forEach(stage => {
        if (stage.arrow) {
            const arrowEl = document.createElement('div');
            arrowEl.className = 'flow-arrow';
            arrowEl.innerHTML = '<i class="fas fa-arrow-right"></i>';
            row.appendChild(arrowEl);
            return;
        }

        const stageEl = document.createElement('div');
        stageEl.className = 'flow-stage';
        stageEl.innerHTML = `
            <div class="flow-stage-title">${stage.title}</div>
            ${stage.nodes.map(n => `
                <div class="flow-node" style="border-color:${n.border};background:${n.color}">
                    <div class="flow-node-icon" style="background:${n.color}">${n.icon}</div>
                    <div class="flow-node-name">${n.name}</div>
                    <div class="flow-node-table">${n.table}</div>
                </div>
            `).join('')}
        `;
        row.appendChild(stageEl);
    });

    container.appendChild(row);
}

// ============================
// Query Simulator
// ============================
function renderQuery(key) {
    const q = QUERIES[key];
    if (!q) return;

    document.getElementById('sqlCode').innerHTML = syntaxHighlight(q.sql);

    const exp = document.getElementById('queryExplain');
    exp.innerHTML = q.explain;
    exp.classList.add('visible');

    document.getElementById('queryResult').innerHTML = `
        <div class="table-wrapper">
            <table class="data-table">
                <thead><tr>${q.result.columns.map(c => `<th>${c}</th>`).join('')}</tr></thead>
                <tbody>
                    ${q.result.rows.map(r => `<tr>${r.map(v => `<td>${v ?? '<span style="color:var(--text-muted)">NULL</span>'}</td>`).join('')}</tr>`).join('')}
                </tbody>
            </table>
        </div>
        <p style="font-size:11px;color:var(--text-muted);padding:var(--space-2) var(--space-4)">${q.result.rows.length} row(s) returned (demo data)</p>
    `;
}

function syntaxHighlight(sql) {
    const keywords = ['SELECT','FROM','WHERE','JOIN','LEFT JOIN','INNER JOIN','ON','GROUP BY','ORDER BY','HAVING','AND','OR','NOT','AS','COUNT','SUM','MIN','MAX','CASE','WHEN','THEN','ELSE','END','FIELD','CURDATE','ASC','DESC','BY'];
    let h = sql;
    keywords.forEach(kw => {
        h = h.replace(new RegExp(`\\b${kw}\\b`, 'g'), `<span class="sql-keyword">${kw}</span>`);
    });
    h = h.replace(/'([^']*)'/g, `<span class="sql-string">'$1'</span>`);
    h = h.replace(/\b(\d+)\b/g, `<span class="sql-number">$1</span>`);
    // Table names
    const tables = Object.keys(SCHEMA);
    tables.forEach(t => {
        h = h.replace(new RegExp(`\\b${t}\\b`, 'g'), `<span class="sql-table">${t}</span>`);
    });
    return h;
}

// ============================
// Stats Charts (pure CSS/JS, no lib)
// ============================
function renderStats() {
    const container = document.getElementById('statsVizGrid');

    const bloodData = [
        { group: 'O+',  units: 18, color: '#ef4444' },
        { group: 'A+',  units: 14, color: '#f97316' },
        { group: 'B+',  units: 10, color: '#8b5cf6' },
        { group: 'AB+', units: 8,  color: '#06b6d4' },
        { group: 'O-',  units: 5,  color: '#dc2626' },
        { group: 'A-',  units: 5,  color: '#ea580c' },
        { group: 'B-',  units: 3,  color: '#7c3aed' },
        { group: 'AB-', units: 2,  color: '#0891b2' },
    ];
    const maxUnits = 20;

    const requestStatus = { Pending: 2, Approved: 1, Fulfilled: 1, Rejected: 1 };
    const statusColors  = { Pending:'#f97316', Approved:'#06b6d4', Fulfilled:'#16a34a', Rejected:'#ef4444' };
    const total = Object.values(requestStatus).reduce((a,b)=>a+b,0);

    const activities = [
        { type: 'donation',  text: 'John Doe donated O+',             time: '2h ago',  color: '#ef4444' },
        { type: 'request',   text: 'Critical O+ request from Apollo',  time: '4h ago',  color: '#f97316' },
        { type: 'drive',     text: 'New drive added: Marina Beach',    time: '1d ago',  color: '#16a34a' },
        { type: 'inventory', text: 'A- unit expired — Bank 1',         time: '2d ago',  color: '#d97706' },
        { type: 'register',  text: 'New donor Priya Nair registered',  time: '3d ago',  color: '#8b5cf6' },
    ];

    container.innerHTML = `
        <!-- Blood Inventory Bar Chart -->
        <div class="stat-viz-card">
            <div class="stat-viz-card-header"><i class="fas fa-vials" style="color:#8b5cf6"></i> Blood Inventory by Group</div>
            <div class="stat-viz-card-body">
                ${bloodData.map(d => `
                    <div class="bar-chart-row">
                        <div class="bar-label" style="color:${d.color}">${d.group}</div>
                        <div class="bar-track">
                            <div class="bar-fill" style="width:0%;background:${d.color}" data-width="${(d.units/maxUnits)*100}">
                                ${d.units >= 4 ? d.units + ' u' : ''}
                            </div>
                        </div>
                        <div class="bar-count">${d.units}</div>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Request Status Donut -->
        <div class="stat-viz-card">
            <div class="stat-viz-card-header"><i class="fas fa-chart-pie" style="color:#06b6d4"></i> Request Status Breakdown</div>
            <div class="stat-viz-card-body">
                <div class="donut-chart-wrap">
                    <canvas class="donut-canvas" id="donutCanvas" width="180" height="180"></canvas>
                    <div class="pie-legend">
                        ${Object.entries(requestStatus).map(([status, count]) => `
                            <div class="pie-legend-item">
                                <div class="pie-legend-dot" style="background:${statusColors[status]}"></div>
                                <span style="flex:1">${status}</span>
                                <strong>${count}</strong>
                                <span style="color:var(--text-muted)"> (${Math.round(count/total*100)}%)</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>

        <!-- DB Summary -->
        <div class="stat-viz-card">
            <div class="stat-viz-card-header"><i class="fas fa-database" style="color:#16a34a"></i> Database Summary</div>
            <div class="stat-viz-card-body">
                ${[
                    { label: 'Total Tables',    value: '6',  icon: '🗃️' },
                    { label: 'Total Records',   value: '28', icon: '📝' },
                    { label: 'Foreign Keys',    value: '7',  icon: '🔗' },
                    { label: 'Enum Columns',    value: '12', icon: '📋' },
                    { label: 'Indexed Columns', value: '8',  icon: '⚡' },
                    { label: 'Avg fields/table',value: '11', icon: '📊' },
                ].map(r => `
                    <div style="display:flex;align-items:center;justify-content:space-between;padding:var(--space-2) 0;border-bottom:1px solid var(--border);font-size:var(--text-sm)">
                        <span>${r.icon} ${r.label}</span>
                        <strong>${r.value}</strong>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Recent Activity Feed -->
        <div class="stat-viz-card">
            <div class="stat-viz-card-header"><i class="fas fa-clock" style="color:#d97706"></i> Recent Activity Feed</div>
            <div class="stat-viz-card-body">
                <div class="activity-feed">
                    ${activities.map(a => `
                        <div class="activity-item">
                            <div class="activity-dot" style="background:${a.color}"></div>
                            <span>${a.text}</span>
                            <span class="time">${a.time}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    // Animate bars
    setTimeout(() => {
        document.querySelectorAll('.bar-fill[data-width]').forEach(bar => {
            bar.style.width = bar.dataset.width + '%';
        });
    }, 100);

    // Draw donut chart
    drawDonut(requestStatus, statusColors);
}

function drawDonut(data, colors) {
    const canvas = document.getElementById('donutCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const total = Object.values(data).reduce((a,b)=>a+b,0);
    const cx = 90, cy = 90, r = 70, innerR = 45;
    let angle = -Math.PI / 2;

    Object.entries(data).forEach(([key, val]) => {
        const slice = (val / total) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, angle, angle + slice);
        ctx.closePath();
        ctx.fillStyle = colors[key];
        ctx.fill();
        angle += slice;
    });

    // Inner hole
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();

    // Center text
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 22px Playfair Display, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(total, cx, cy - 8);
    ctx.font = '11px DM Sans, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('requests', cx, cy + 12);
}

// ============================
// Event Wiring
// ============================
document.querySelectorAll('.viz-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.viz-nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const view = btn.dataset.view;
        document.querySelectorAll('.viz-view').forEach(v => v.classList.remove('active'));
        document.getElementById(`view-${view}`)?.classList.add('active');

        if (view === 'flow') renderFlow();
        if (view === 'stats') renderStats();
    });
});

// Table browser
document.getElementById('tableSelect')?.addEventListener('change', e => {
    const t = e.target.value;
    renderTableSchema(t);
    renderTableData(t);
    // update active in sidebar
    document.querySelectorAll('.viz-table-item').forEach(it => it.classList.toggle('active', it.dataset.table === t));
});

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.dataset.tab;
        document.getElementById('tableSchemaView').style.display = tab === 'schema' ? 'block' : 'none';
        document.getElementById('tableDataView').style.display   = tab === 'data'   ? 'block' : 'none';
    });
});

document.querySelectorAll('.viz-table-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.viz-table-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const t = item.dataset.table;
        const sel = document.getElementById('tableSelect');
        if (sel) sel.value = t;
        renderTableSchema(t);
        renderTableData(t);
        // Switch to table view
        document.querySelectorAll('.viz-nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('[data-view="tables"]').classList.add('active');
        document.querySelectorAll('.viz-view').forEach(v => v.classList.remove('active'));
        document.getElementById('view-tables').classList.add('active');
    });
});

// Query presets
document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderQuery(btn.dataset.query);
    });
});

document.getElementById('runQuery')?.addEventListener('click', () => {
    const active = document.querySelector('.preset-btn.active');
    if (active) renderQuery(active.dataset.query);
});

// ============================
// Initial Render
// ============================
renderER();
renderTableSchema('donors');
renderTableData('donors');
renderQuery('find-donors');
