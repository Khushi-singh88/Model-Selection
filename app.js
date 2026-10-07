/* ================================================
   AgentPro – Application JavaScript
   Data Alcott Systems - Insurance Agent Management
   ================================================ */

// ===== INITIAL DATA STORE =====
let state = {
  currentUser: null,
  activePage: 'dashboard',
  theme: localStorage.getItem('agentpro_theme') || 'light',
  agents: JSON.parse(localStorage.getItem('agentpro_agents')) || [
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul.sharma@company.com",
      phone: "9876543210",
      location: "Delhi",
      status: "Top Performer",
      performance: "Gold",
      joinDate: "2024-01-15",
      target: 100000,
      achieved: 125000,
      policiesSold: 25,
      commissions: [
        { id: 101, type: "First Year", amount: 5000, date: "2026-09-10", status: "Paid" },
        { id: 102, type: "Renewal", amount: 2000, date: "2026-09-25", status: "Paid" },
        { id: 103, type: "Performance Bonus", amount: 8000, date: "2026-10-01", status: "Paid" }
      ]
    },
    {
      id: 2,
      name: "Priya Patel",
      email: "priya.p@company.com",
      phone: "9812345678",
      location: "Mumbai",
      status: "Active",
      performance: "Platinum",
      joinDate: "2023-06-10",
      target: 150000,
      achieved: 180000,
      policiesSold: 42,
      commissions: [
        { id: 104, type: "First Year", amount: 12000, date: "2026-09-14", status: "Paid" },
        { id: 105, type: "Team", amount: 4500, date: "2026-09-28", status: "Paid" },
        { id: 106, type: "Bonus", amount: 10000, date: "2026-10-02", status: "Paid" }
      ]
    },
    {
      id: 3,
      name: "Amit Verma",
      email: "amit.v@company.com",
      phone: "9765432109",
      location: "Bangalore",
      status: "In Training",
      performance: "Rising Star",
      joinDate: "2026-08-01",
      target: 30000,
      achieved: 15000,
      policiesSold: 5,
      commissions: [
        { id: 107, type: "First Year", amount: 1500, date: "2026-09-20", status: "Paid" }
      ]
    },
    {
      id: 4,
      name: "Sneha Reddy",
      email: "sneha.r@company.com",
      phone: "9654321098",
      location: "Hyderabad",
      status: "Active",
      performance: "Silver",
      joinDate: "2024-11-20",
      target: 75000,
      achieved: 68000,
      policiesSold: 18,
      commissions: [
        { id: 108, type: "First Year", amount: 4000, date: "2026-09-15", status: "Paid" },
        { id: 109, type: "Renewal", amount: 1800, date: "2026-09-30", status: "Paid" }
      ]
    },
    {
      id: 5,
      name: "Vikram Singh",
      email: "vikram.s@company.com",
      phone: "9543210987",
      location: "Jaipur",
      status: "On Leave",
      performance: "Bronze",
      joinDate: "2025-03-05",
      target: 50000,
      achieved: 32000,
      policiesSold: 11,
      commissions: [
        { id: 110, type: "First Year", amount: 3000, date: "2026-08-12", status: "Paid" }
      ]
    },
    {
      id: 6,
      name: "Ananya Roy",
      email: "ananya.r@company.com",
      phone: "9432109876",
      location: "Kolkata",
      status: "Inactive",
      performance: "Bronze",
      joinDate: "2025-01-10",
      target: 40000,
      achieved: 12000,
      policiesSold: 4,
      commissions: [
        { id: 111, type: "First Year", amount: 1000, date: "2026-05-10", status: "Paid" }
      ]
    }
  ],
  trainings: JSON.parse(localStorage.getItem('agentpro_trainings')) || [
    { id: 1, name: "Life Insurance Fundamentals", category: "Life Insurance", duration: 15, agentId: 3, progress: 80 },
    { id: 2, name: "Health Policy Underwriting", category: "Health Insurance", duration: 10, agentId: 4, progress: 100 },
    { id: 3, name: "High Net-Worth Sales Pitch", category: "Sales Techniques", duration: 8, agentId: 1, progress: 100 },
    { id: 4, name: "IRDAI Compliance & Ethics 2026", category: "Compliance", duration: 12, agentId: 2, progress: 60 }
  ],
  activities: [
    { type: "register", text: "New agent Registered: Amit Verma", time: "2 hours ago" },
    { type: "commission", text: "Commission of ₹8,000 paid to Rahul Sharma", time: "5 hours ago" },
    { type: "training", text: "Sneha Reddy completed 'Health Policy Underwriting'", time: "1 day ago" },
    { type: "performance", text: "Priya Patel achieved Platinum Performance Level", time: "2 days ago" }
  ]
};

// Charts holder
let perfChart = null;
let commChart = null;

// ===== DOM LOAD INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  setupEventListeners();
  checkAuth();
});

// ===== SAVE STATE HELPER =====
function saveState() {
  localStorage.setItem('agentpro_agents', JSON.stringify(state.agents));
  localStorage.setItem('agentpro_trainings', JSON.stringify(state.trainings));
}

// ===== THEME MANAGEMENT =====
function initTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
  updateThemeIcon();
}

function toggleTheme() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  localStorage.setItem('agentpro_theme', state.theme);
  document.documentElement.setAttribute('data-theme', state.theme);
  updateThemeIcon();
  if (state.activePage === 'dashboard') {
    renderCharts();
  }
}

function updateThemeIcon() {
  const btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.innerHTML = state.theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  }
}

// ===== AUTHENTICATION =====
function checkAuth() {
  const savedUser = sessionStorage.getItem('agentpro_user');
  if (savedUser) {
    state.currentUser = JSON.parse(savedUser);
    showApp();
  } else {
    showAuth();
  }
}

function showAuth() {
  document.getElementById('auth-screen').classList.remove('hidden');
  document.getElementById('app').classList.add('hidden');
}

function showApp() {
  document.getElementById('auth-screen').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  
  if (state.currentUser) {
    document.getElementById('topbar-username').textContent = state.currentUser.name;
    document.getElementById('topbar-avatar').textContent = state.currentUser.name.charAt(0).toUpperCase();
  }
  
  navigateTo(state.activePage);
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
  // Theme Toggle
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

  // Auth form switching
  document.getElementById('show-register').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('login-form').classList.remove('active');
    document.getElementById('register-form').classList.add('active');
  });

  document.getElementById('show-login').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('register-form').classList.remove('active');
    document.getElementById('login-form').classList.add('active');
  });

  // Login Form
  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const name = email.split('@')[0];
    state.currentUser = { name: name.charAt(0).toUpperCase() + name.slice(1), email: email, role: 'Admin' };
    sessionStorage.setItem('agentpro_user', JSON.stringify(state.currentUser));
    showToast(`Welcome back, ${state.currentUser.name}!`, 'success');
    showApp();
  });

  // Register Form
  document.getElementById('register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const role = document.getElementById('reg-role').value;
    state.currentUser = { name, email, role };
    sessionStorage.setItem('agentpro_user', JSON.stringify(state.currentUser));
    showToast(`Account created for ${name}!`, 'success');
    showApp();
  });

  // Logout
  document.getElementById('logout-btn').addEventListener('click', () => {
    sessionStorage.removeItem('agentpro_user');
    state.currentUser = null;
    showToast('Logged out successfully', 'info');
    showAuth();
  });

  // Navigation Links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.getAttribute('data-page');
      navigateTo(page);
      if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('open');
      }
    });
  });

  // Sidebar Toggle (Mobile)
  document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('sidebar').classList.add('open');
  });
  document.getElementById('sidebar-close').addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('open');
  });

  // Agent Registration Form
  document.getElementById('agent-registration-form').addEventListener('submit', handleAgentRegistration);

  // Agent Listing Search & Filters
  document.getElementById('agent-search').addEventListener('input', renderAgentListing);
  document.getElementById('filter-status').addEventListener('change', renderAgentListing);
  document.getElementById('filter-performance').addEventListener('change', renderAgentListing);

  // Close Modals
  document.getElementById('close-agent-modal').addEventListener('click', () => {
    document.getElementById('agent-detail-modal').classList.add('hidden');
  });
  document.getElementById('close-commission-modal').addEventListener('click', () => {
    document.getElementById('commission-modal').classList.add('hidden');
  });
  document.getElementById('close-training-modal').addEventListener('click', () => {
    document.getElementById('training-modal').classList.add('hidden');
  });

  // Add Commission Button & Form
  document.getElementById('add-commission-btn').addEventListener('click', openCommissionModal);
  document.getElementById('commission-form').addEventListener('submit', handleAddCommission);

  // Add Training Button & Form
  document.getElementById('add-training-btn').addEventListener('click', openTrainingModal);
  document.getElementById('training-form').addEventListener('submit', handleAddTraining);

  // Reports
  document.getElementById('report-type').addEventListener('change', renderReports);
  document.getElementById('export-csv-btn').addEventListener('click', exportCSV);
  document.getElementById('export-pdf-btn').addEventListener('click', exportPDF);
}

// ===== NAVIGATION =====
function navigateTo(pageId) {
  state.activePage = pageId;
  
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));

  const targetPage = document.getElementById(`page-${pageId}`);
  const targetLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);

  if (targetPage) targetPage.classList.add('active');
  if (targetLink) targetLink.classList.add('active');

  const titles = {
    'dashboard': 'Dashboard',
    'register-agent': 'Agent Registration',
    'agents': 'Agent Listing & Profiles',
    'commissions': 'Commission Management',
    'performance': 'Performance Tracking',
    'training': 'Training Programs',
    'incentives': 'Incentives & Rewards',
    'reports': 'Reports & Analytics'
  };
  document.getElementById('page-title').textContent = titles[pageId] || 'Dashboard';

  // Render content based on page
  switch(pageId) {
    case 'dashboard':
      renderDashboard();
      break;
    case 'agents':
      renderAgentListing();
      break;
    case 'commissions':
      renderCommissions();
      break;
    case 'performance':
      renderPerformance();
      break;
    case 'training':
      renderTraining();
      break;
    case 'incentives':
      renderIncentives();
      break;
    case 'reports':
      renderReports();
      break;
  }
}

// ===== DASHBOARD MODULE =====
function renderDashboard() {
  // Compute KPIs
  const totalAgents = state.agents.length;
  const activeAgents = state.agents.filter(a => a.status === 'Active' || a.status === 'Top Performer').length;
  const totalPolicies = state.agents.reduce((sum, a) => sum + (a.policiesSold || 0), 0);
  
  let totalCommissions = 0;
  state.agents.forEach(a => {
    if (a.commissions) {
      totalCommissions += a.commissions.reduce((s, c) => s + c.amount, 0);
    }
  });

  document.getElementById('kpi-total-agents').textContent = totalAgents;
  document.getElementById('kpi-active-agents').textContent = activeAgents;
  document.getElementById('kpi-policies-sold').textContent = totalPolicies;
  document.getElementById('kpi-total-commissions').textContent = `₹${totalCommissions.toLocaleString('en-IN')}`;

  renderLeaderboard();
  renderActivities();
  renderCharts();
}

function renderLeaderboard() {
  const container = document.getElementById('leaderboard-list');
  const sorted = [...state.agents].sort((a, b) => (b.achieved || 0) - (a.achieved || 0)).slice(0, 5);
  
  container.innerHTML = sorted.map((agent, index) => {
    const rankClass = index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : 'rank-other';
    return `
      <li>
        <div class="lb-rank ${rankClass}">${index + 1}</div>
        <div class="lb-info">
          <span class="lb-name">${escapeHtml(agent.name)}</span>
          <span class="lb-detail">${escapeHtml(agent.location)} • Level: ${escapeHtml(agent.performance)}</span>
        </div>
        <div class="lb-value">₹${(agent.achieved || 0).toLocaleString('en-IN')}</div>
      </li>
    `;
  }).join('');
}

function renderActivities() {
  const container = document.getElementById('recent-activity');
  const iconMap = {
    register: 'fa-user-plus act-register',
    commission: 'fa-coins act-commission',
    training: 'fa-graduation-cap act-training',
    performance: 'fa-trophy act-performance'
  };

  container.innerHTML = state.activities.map(act => `
    <li>
      <div class="activity-icon ${iconMap[act.type] || 'fa-bell act-register'}">
        <i class="fas ${iconMap[act.type] ? iconMap[act.type].split(' ')[0] : 'fa-bell'}"></i>
      </div>
      <div class="activity-text">${escapeHtml(act.text)}</div>
      <div class="activity-time">${escapeHtml(act.time)}</div>
    </li>
  `).join('');
}

function renderCharts() {
  if (typeof Chart === 'undefined') return;

  const isDark = state.theme === 'dark';
  const textColor = isDark ? '#A0A4B0' : '#4B5563';
  const gridColor = isDark ? '#2A2D3A' : '#E5E7EB';

  // Performance Bar Chart
  const perfCtx = document.getElementById('chart-performance').getContext('2d');
  if (perfChart) perfChart.destroy();

  const labels = state.agents.map(a => a.name.split(' ')[0]);
  const targets = state.agents.map(a => a.target || 0);
  const achieved = state.agents.map(a => a.achieved || 0);

  perfChart = new Chart(perfCtx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Target (₹)',
          data: targets,
          backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(209,213,219,0.7)',
          borderRadius: 6
        },
        {
          label: 'Achieved (₹)',
          data: achieved,
          backgroundColor: '#F59E0B',
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: textColor, font: { family: 'Poppins' } } }
      },
      scales: {
        x: { ticks: { color: textColor }, grid: { color: gridColor } },
        y: { ticks: { color: textColor }, grid: { color: gridColor } }
      }
    }
  });

  // Commission Doughnut Chart
  const commCtx = document.getElementById('chart-commission').getContext('2d');
  if (commChart) commChart.destroy();

  const typeTotals = {
    'First Year': 0,
    'Renewal': 0,
    'Bonus': 0,
    'Team': 0,
    'Performance Bonus': 0
  };

  state.agents.forEach(a => {
    if (a.commissions) {
      a.commissions.forEach(c => {
        if (typeTotals[c.type] !== undefined) {
          typeTotals[c.type] += c.amount;
        } else {
          typeTotals['First Year'] += c.amount;
        }
      });
    }
  });

  commChart = new Chart(commCtx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(typeTotals),
      datasets: [{
        data: Object.values(typeTotals),
        backgroundColor: ['#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { color: textColor, font: { family: 'Poppins' } } }
      }
    }
  });
}

// ===== AGENT REGISTRATION MODULE =====
function handleAgentRegistration(e) {
  e.preventDefault();
  
  const name = document.getElementById('agent-name').value.trim();
  const email = document.getElementById('agent-email').value.trim();
  const phone = document.getElementById('agent-phone').value.trim();
  const location = document.getElementById('agent-location').value.trim();
  const status = document.getElementById('agent-status').value;
  const performance = document.getElementById('agent-performance').value;
  const joinDate = document.getElementById('agent-join-date').value || new Date().toISOString().split('T')[0];
  const target = parseFloat(document.getElementById('agent-target').value) || 50000;

  const newAgent = {
    id: Date.now(),
    name,
    email,
    phone,
    location,
    status,
    performance,
    joinDate,
    target,
    achieved: 0,
    policiesSold: 0,
    commissions: []
  };

  state.agents.push(newAgent);
  state.activities.unshift({
    type: 'register',
    text: `New agent registered: ${name}`,
    time: 'Just now'
  });

  saveState();
  showToast(`Agent ${name} registered successfully!`, 'success');
  document.getElementById('agent-registration-form').reset();
  navigateTo('agents');
}

// ===== AGENT LISTING & DETAIL MODULE =====
function renderAgentListing() {
  const grid = document.getElementById('agents-grid');
  const search = document.getElementById('agent-search').value.toLowerCase();
  const statusFilter = document.getElementById('filter-status').value;
  const perfFilter = document.getElementById('filter-performance').value;

  const filtered = state.agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(search) ||
                          agent.email.toLowerCase().includes(search) ||
                          agent.location.toLowerCase().includes(search);
    const matchesStatus = !statusFilter || agent.status === statusFilter;
    const matchesPerf = !perfFilter || agent.performance === perfFilter;
    return matchesSearch && matchesStatus && matchesPerf;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <i class="fas fa-users-slash"></i>
        <p>No agents found matching your criteria.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(agent => {
    const statusBadgeClass = {
      'Active': 'badge-active',
      'In Training': 'badge-training',
      'Inactive': 'badge-inactive',
      'On Leave': 'badge-leave',
      'Top Performer': 'badge-top'
    }[agent.status] || 'badge-active';

    const perfBadgeClass = {
      'Platinum': 'badge-platinum',
      'Gold': 'badge-gold',
      'Silver': 'badge-silver',
      'Bronze': 'badge-bronze',
      'Rising Star': 'badge-rising'
    }[agent.performance] || 'badge-rising';

    const totalComm = (agent.commissions || []).reduce((sum, c) => sum + c.amount, 0);

    return `
      <div class="agent-card" onclick="openAgentDetail(${agent.id})">
        <div class="agent-card-header">
          <div class="agent-avatar">${escapeHtml(agent.name.charAt(0))}</div>
          <div>
            <div class="agent-name">${escapeHtml(agent.name)}</div>
            <div class="agent-location"><i class="fas fa-location-dot"></i> ${escapeHtml(agent.location)}</div>
          </div>
        </div>
        <div class="agent-badges">
          <span class="badge ${statusBadgeClass}">${escapeHtml(agent.status)}</span>
          <span class="badge ${perfBadgeClass}">${escapeHtml(agent.performance)}</span>
        </div>
        <div class="agent-stats">
          <div class="agent-stat">
            <span class="agent-stat-value">${agent.policiesSold || 0}</span>
            <span class="agent-stat-label">Policies</span>
          </div>
          <div class="agent-stat">
            <span class="agent-stat-value">₹${totalComm.toLocaleString('en-IN')}</span>
            <span class="agent-stat-label">Commission</span>
          </div>
          <div class="agent-stat">
            <span class="agent-stat-value">₹${(agent.achieved || 0).toLocaleString('en-IN')}</span>
            <span class="agent-stat-label">Achieved</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function openAgentDetail(agentId) {
  const agent = state.agents.find(a => a.id === agentId);
  if (!agent) return;

  const totalComm = (agent.commissions || []).reduce((sum, c) => sum + c.amount, 0);
  const modalContent = document.getElementById('agent-detail-content');

  const commHistoryRows = (agent.commissions || []).length > 0
    ? agent.commissions.map(c => `
        <tr>
          <td>${escapeHtml(c.type)}</td>
          <td>₹${c.amount.toLocaleString('en-IN')}</td>
          <td>${c.date}</td>
          <td><span class="status-dot paid">Paid</span></td>
        </tr>
      `).join('')
    : '<tr><td colspan="4" style="text-align:center; color: var(--text-muted);">No commissions logged yet</td></tr>';

  modalContent.innerHTML = `
    <div class="detail-header">
      <div class="detail-avatar">${escapeHtml(agent.name.charAt(0))}</div>
      <div>
        <div class="detail-name">${escapeHtml(agent.name)}</div>
        <div class="detail-meta">
          <i class="fas fa-envelope"></i> ${escapeHtml(agent.email)} | 
          <i class="fas fa-phone"></i> ${escapeHtml(agent.phone)} | 
          <i class="fas fa-location-dot"></i> ${escapeHtml(agent.location)}
        </div>
        <div class="agent-badges" style="margin-top: 0.5rem;">
          <span class="badge badge-active">${escapeHtml(agent.status)}</span>
          <span class="badge badge-gold">${escapeHtml(agent.performance)}</span>
        </div>
      </div>
    </div>
    <div class="detail-section">
      <h4><i class="fas fa-chart-pie"></i> Performance Overview</h4>
      <div class="detail-stats-grid">
        <div class="detail-stat">
          <span class="detail-stat-value">${agent.policiesSold || 0}</span>
          <span class="detail-stat-label">Policies Sold</span>
        </div>
        <div class="detail-stat">
          <span class="detail-stat-value">₹${totalComm.toLocaleString('en-IN')}</span>
          <span class="detail-stat-label">Total Commission</span>
        </div>
        <div class="detail-stat">
          <span class="detail-stat-value">₹${(agent.target || 0).toLocaleString('en-IN')}</span>
          <span class="detail-stat-label">Monthly Target</span>
        </div>
      </div>
    </div>
    <div class="detail-section">
      <h4><i class="fas fa-receipt"></i> Commission History</h4>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${commHistoryRows}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('agent-detail-modal').classList.remove('hidden');
}

// ===== COMMISSIONS MODULE =====
function renderCommissions() {
  const tbody = document.getElementById('commission-tbody');
  const allCommissions = [];

  state.agents.forEach(agent => {
    if (agent.commissions) {
      agent.commissions.forEach(comm => {
        allCommissions.push({
          agentName: agent.name,
          ...comm
        });
      });
    }
  });

  if (allCommissions.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty-state"><p>No commissions found</p></td></tr>`;
    return;
  }

  tbody.innerHTML = allCommissions.map(comm => `
    <tr>
      <td><strong>${escapeHtml(comm.agentName)}</strong></td>
      <td>${escapeHtml(comm.type)} Commission</td>
      <td><strong>₹${comm.amount.toLocaleString('en-IN')}</strong></td>
      <td>${comm.date}</td>
      <td><span class="status-dot paid">Paid</span></td>
    </tr>
  `).join('');
}

function openCommissionModal() {
  const select = document.getElementById('comm-agent');
  select.innerHTML = state.agents.map(a => `<option value="${a.id}">${escapeHtml(a.name)}</option>`).join('');
  document.getElementById('commission-modal').classList.remove('hidden');
}

function handleAddCommission(e) {
  e.preventDefault();
  const agentId = parseInt(document.getElementById('comm-agent').value);
  const type = document.getElementById('comm-type').value;
  const amount = parseFloat(document.getElementById('comm-amount').value);

  const agent = state.agents.find(a => a.id === agentId);
  if (!agent) return;

  if (!agent.commissions) agent.commissions = [];
  
  const newComm = {
    id: Date.now(),
    type,
    amount,
    date: new Date().toISOString().split('T')[0],
    status: 'Paid'
  };

  agent.commissions.push(newComm);
  state.activities.unshift({
    type: 'commission',
    text: `Commission of ₹${amount.toLocaleString('en-IN')} added for ${agent.name}`,
    time: 'Just now'
  });

  saveState();
  showToast(`Commission added for ${agent.name}`, 'success');
  document.getElementById('commission-modal').classList.add('hidden');
  document.getElementById('commission-form').reset();
  renderCommissions();
}

// ===== PERFORMANCE TRACKING MODULE =====
function renderPerformance() {
  const tbody = document.getElementById('performance-tbody');

  tbody.innerHTML = state.agents.map(agent => {
    const target = agent.target || 1;
    const achieved = agent.achieved || 0;
    const percent = Math.min(Math.round((achieved / target) * 100), 100);
    const colorClass = percent >= 80 ? 'high' : percent >= 50 ? 'mid' : 'low';

    return `
      <tr>
        <td><strong>${escapeHtml(agent.name)}</strong></td>
        <td><span class="badge badge-gold">${escapeHtml(agent.performance)}</span></td>
        <td>₹${target.toLocaleString('en-IN')}</td>
        <td>₹${achieved.toLocaleString('en-IN')}</td>
        <td>
          <div class="progress-bar-wrapper">
            <div class="progress-bar-fill ${colorClass}" style="width: ${percent}%"></div>
          </div>
          <div class="progress-label">${percent}% Achieved</div>
        </td>
        <td><strong>${agent.policiesSold || 0}</strong></td>
      </tr>
    `;
  }).join('');
}

// ===== TRAINING MODULE =====
function renderTraining() {
  const grid = document.getElementById('training-grid');

  if (state.trainings.length === 0) {
    grid.innerHTML = `<div class="empty-state"><p>No training programs found</p></div>`;
    return;
  }

  grid.innerHTML = state.trainings.map(t => {
    const agent = state.agents.find(a => a.id === t.agentId);
    const agentName = agent ? agent.name : 'Unassigned';

    return `
      <div class="training-card">
        <div class="training-card-header">
          <h4>${escapeHtml(t.name)}</h4>
          <span class="training-category">${escapeHtml(t.category)}</span>
        </div>
        <div class="training-meta">
          <div><i class="fas fa-user"></i> ${escapeHtml(agentName)}</div>
          <div><i class="fas fa-clock"></i> ${t.duration} Hours</div>
        </div>
        <div class="training-progress">
          <div class="training-progress-label">
            <span>Progress</span>
            <span>${t.progress}%</span>
          </div>
          <div class="progress-bar-wrapper">
            <div class="progress-bar-fill ${t.progress === 100 ? 'high' : 'mid'}" style="width: ${t.progress}%"></div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function openTrainingModal() {
  const select = document.getElementById('train-agent');
  select.innerHTML = state.agents.map(a => `<option value="${a.id}">${escapeHtml(a.name)}</option>`).join('');
  document.getElementById('training-modal').classList.remove('hidden');
}

function handleAddTraining(e) {
  e.preventDefault();
  const name = document.getElementById('train-name').value.trim();
  const category = document.getElementById('train-category').value;
  const duration = parseInt(document.getElementById('train-duration').value);
  const agentId = parseInt(document.getElementById('train-agent').value);

  const newProgram = {
    id: Date.now(),
    name,
    category,
    duration,
    agentId,
    progress: 0
  };

  state.trainings.push(newProgram);
  state.activities.unshift({
    type: 'training',
    text: `New Training Assigned: ${name}`,
    time: 'Just now'
  });

  saveState();
  showToast('Training program created!', 'success');
  document.getElementById('training-modal').classList.add('hidden');
  document.getElementById('training-form').reset();
  renderTraining();
}

// ===== INCENTIVES & REWARDS MODULE =====
function renderIncentives() {
  const rewardsList = document.getElementById('rewards-list');
  const hallOfFame = document.getElementById('hall-of-fame');

  const rewards = [
    { title: "Quarterly High-Flyer", desc: "Achieve ₹2,00,000 in sales within Q3", iconClass: "gold", icon: "fa-crown" },
    { title: "Star Recruit Bonus", desc: "Bring 3 active sub-agents onboard", iconClass: "silver", icon: "fa-user-plus" },
    { title: "Policy Sprint", desc: "Sell 15 Life Policies in 30 days", iconClass: "bronze", icon: "fa-bolt" }
  ];

  rewardsList.innerHTML = rewards.map(r => `
    <div class="reward-item">
      <div class="reward-icon ${r.iconClass}">
        <i class="fas ${r.icon}"></i>
      </div>
      <div class="reward-info">
        <div class="reward-name">${escapeHtml(r.title)}</div>
        <div class="reward-desc">${escapeHtml(r.desc)}</div>
      </div>
    </div>
  `).join('');

  const topPerformers = [...state.agents]
    .sort((a, b) => (b.achieved || 0) - (a.achieved || 0))
    .slice(0, 3);

  hallOfFame.innerHTML = topPerformers.map(agent => `
    <div class="fame-item">
      <div class="fame-avatar">${escapeHtml(agent.name.charAt(0))}</div>
      <div class="fame-info">
        <div class="fame-name">${escapeHtml(agent.name)}</div>
        <div class="fame-achievement">${agent.policiesSold || 0} Policies Sold • Level: ${agent.performance}</div>
      </div>
      <span class="fame-badge">Top Performer</span>
    </div>
  `).join('');
}

// ===== REPORTS MODULE =====
function renderReports() {
  const type = document.getElementById('report-type').value;
  const title = document.getElementById('report-title');
  const thead = document.getElementById('report-thead');
  const tbody = document.getElementById('report-tbody');

  if (type === 'agent') {
    title.innerHTML = `<i class="fas fa-users"></i> Agent Report`;
    thead.innerHTML = `
      <tr>
        <th>Agent Name</th>
        <th>Email</th>
        <th>Location</th>
        <th>Status</th>
        <th>Level</th>
        <th>Join Date</th>
      </tr>
    `;
    tbody.innerHTML = state.agents.map(a => `
      <tr>
        <td><strong>${escapeHtml(a.name)}</strong></td>
        <td>${escapeHtml(a.email)}</td>
        <td>${escapeHtml(a.location)}</td>
        <td><span class="badge badge-active">${escapeHtml(a.status)}</span></td>
        <td>${escapeHtml(a.performance)}</td>
        <td>${a.joinDate || 'N/A'}</td>
      </tr>
    `).join('');
  } else if (type === 'commission') {
    title.innerHTML = `<i class="fas fa-coins"></i> Commission Report`;
    thead.innerHTML = `
      <tr>
        <th>Agent Name</th>
        <th>Commission Type</th>
        <th>Amount (₹)</th>
        <th>Date</th>
      </tr>
    `;
    const rows = [];
    state.agents.forEach(a => {
      if (a.commissions) {
        a.commissions.forEach(c => {
          rows.push(`
            <tr>
              <td><strong>${escapeHtml(a.name)}</strong></td>
              <td>${escapeHtml(c.type)}</td>
              <td>₹${c.amount.toLocaleString('en-IN')}</td>
              <td>${c.date}</td>
            </tr>
          `);
        });
      }
    });
    tbody.innerHTML = rows.join('') || `<tr><td colspan="4" class="empty-state">No data available</td></tr>`;
  } else if (type === 'performance') {
    title.innerHTML = `<i class="fas fa-chart-line"></i> Performance Report`;
    thead.innerHTML = `
      <tr>
        <th>Agent Name</th>
        <th>Target (₹)</th>
        <th>Achieved (₹)</th>
        <th>Completion</th>
        <th>Policies Sold</th>
      </tr>
    `;
    tbody.innerHTML = state.agents.map(a => {
      const pct = Math.min(Math.round(((a.achieved || 0) / (a.target || 1)) * 100), 100);
      return `
        <tr>
          <td><strong>${escapeHtml(a.name)}</strong></td>
          <td>₹${(a.target || 0).toLocaleString('en-IN')}</td>
          <td>₹${(a.achieved || 0).toLocaleString('en-IN')}</td>
          <td>${pct}%</td>
          <td>${a.policiesSold || 0}</td>
        </tr>
      `;
    }).join('');
  }
}

function exportCSV() {
  const type = document.getElementById('report-type').value;
  let csvContent = "data:text/csv;charset=utf-8,";

  if (type === 'agent') {
    csvContent += "Name,Email,Location,Status,Performance,JoinDate\n";
    state.agents.forEach(a => {
      csvContent += `"${a.name}","${a.email}","${a.location}","${a.status}","${a.performance}","${a.joinDate}"\n`;
    });
  } else if (type === 'commission') {
    csvContent += "Agent,Type,Amount,Date\n";
    state.agents.forEach(a => {
      if (a.commissions) {
        a.commissions.forEach(c => {
          csvContent += `"${a.name}","${c.type}",${c.amount},"${c.date}"\n`;
        });
      }
    });
  } else if (type === 'performance') {
    csvContent += "Agent,Target,Achieved,PoliciesSold\n";
    state.agents.forEach(a => {
      csvContent += `"${a.name}",${a.target || 0},${a.achieved || 0},${a.policiesSold || 0}\n`;
    });
  }

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `AgentPro_${type}_report.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('CSV exported successfully', 'success');
}

function exportPDF() {
  window.print();
}

// ===== UTILS =====
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';

  toast.innerHTML = `
    <i class="fas ${icon}"></i>
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 3000);
}
