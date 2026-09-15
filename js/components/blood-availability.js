// ============================================
// BloodNet — Blood Availability Component
// ============================================
import { BLOOD_GROUPS, availabilityLevel, getMockAvailability } from '../main.js';

const data = getMockAvailability();

// Main blood-grid on homepage
const grid = document.getElementById('bloodAvailability');
if (grid) {
    grid.innerHTML = BLOOD_GROUPS.map(bg => {
        const d = data[bg] || { units: 0, level: 'critical' };
        const lvl = d.level;
        const labels = { high: 'High', medium: 'Medium', low: 'Low', critical: 'None' };
        return `
            <div class="blood-group-card ${lvl}">
                <div class="blood-type">${bg}</div>
                <div class="availability-label ${lvl}">
                    <span class="avail-dot ${lvl}"></span>
                    ${labels[lvl]}
                </div>
                <div class="units-count">${d.units} units</div>
            </div>
        `;
    }).join('');
}

// Mini hero card
const heroGrid = document.getElementById('heroBloodGrid');
if (heroGrid) {
    heroGrid.innerHTML = BLOOD_GROUPS.map(bg => {
        const d = data[bg] || { units: 0, level: 'critical' };
        const pct = Math.min(100, (d.units / 20) * 100);
        return `
            <div class="blood-mini-item">
                <div class="type">${bg}</div>
                <div class="level"><div class="level-bar ${d.level}" style="width: ${pct}%"></div></div>
                <div class="units">${d.units}u</div>
            </div>
        `;
    }).join('');
}
