// ============================================
// BloodNet — Main JS Module
// ============================================

// ---- Intersection Observer for animations ----
const animObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.classList.add('in-view');
            }, parseInt(delay));
            animObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('[data-animate]').forEach(el => animObserver.observe(el));

// ---- Navbar scroll effect ----
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.style.boxShadow = window.scrollY > 10
            ? '0 4px 20px rgba(0,0,0,0.08)'
            : '';
    });
}

// ---- Hamburger menu ----
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });
}

// ---- Counter animation ----
export function animateCounter(el, target, duration = 1500) {
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
        start += step;
        if (start >= target) { el.textContent = target.toLocaleString(); clearInterval(timer); }
        else { el.textContent = start.toLocaleString(); }
    }, 16);
}

// Start counters when visible
document.querySelectorAll('.stat-number[data-target]').forEach(el => {
    const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
            animateCounter(el, parseInt(el.dataset.target));
            obs.disconnect();
        }
    }, { threshold: 0.5 });
    obs.observe(el);
});

// ---- Toast notifications ----
export function showToast(message, type = 'info', duration = 4000) {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const icons = { success: 'fa-check-circle', error: 'fa-circle-xmark', info: 'fa-circle-info', warning: 'fa-triangle-exclamation' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${icons[type] || icons.info}" style="color: var(--${type === 'error' ? 'danger' : type})"></i>
        <span>${message}</span>
        <button class="toast-close" onclick="this.closest('.toast').remove()">&times;</button>
    `;
    container.appendChild(toast);
    setTimeout(() => toast.style.opacity = '0', duration);
    setTimeout(() => toast.remove(), duration + 300);
    return toast;
}

// ---- API helper ----
const API_BASE = '../api';

export async function apiCall(endpoint, options = {}) {
    try {
        const res = await fetch(`${API_BASE}/${endpoint}`, {
            headers: { 'Content-Type': 'application/json', ...options.headers },
            ...options,
            body: options.body ? JSON.stringify(options.body) : undefined
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'API error');
        return data;
    } catch (err) {
        console.error('API Error:', endpoint, err);
        throw err;
    }
}

// ---- Local auth helpers ----
export const auth = {
    getToken: () => localStorage.getItem('bn_token'),
    getDonor: () => JSON.parse(localStorage.getItem('bn_donor') || 'null'),
    isLoggedIn: () => !!localStorage.getItem('bn_token'),
    logout() {
        localStorage.removeItem('bn_token');
        localStorage.removeItem('bn_donor');
        window.location.href = '/pages/donor/login.html';
    },
    setSession(token, donor) {
        localStorage.setItem('bn_token', token);
        localStorage.setItem('bn_donor', JSON.stringify(donor));
    }
};

// ---- Blood group utilities ----
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export function bloodGroupColor(group) {
    const map = { 'O+': '#ef4444', 'O-': '#dc2626', 'A+': '#f97316', 'A-': '#ea580c', 'B+': '#8b5cf6', 'B-': '#7c3aed', 'AB+': '#06b6d4', 'AB-': '#0891b2' };
    return map[group] || '#ef4444';
}

export function availabilityLevel(units) {
    if (units >= 10) return 'high';
    if (units >= 4)  return 'medium';
    if (units > 0)   return 'low';
    return 'critical';
}

// ---- Date helpers ----
export function formatDate(d) {
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function daysSince(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    return Math.floor(diff / 86400000);
}

// Mock blood availability data (replace with real API call)
export function getMockAvailability() {
    return {
        'A+':  { units: 18, level: 'high' },
        'A-':  { units: 5,  level: 'medium' },
        'B+':  { units: 12, level: 'high' },
        'B-':  { units: 2,  level: 'low' },
        'O+':  { units: 20, level: 'high' },
        'O-':  { units: 3,  level: 'low' },
        'AB+': { units: 8,  level: 'medium' },
        'AB-': { units: 1,  level: 'low' },
    };
}
