/* ==========================================================================
   TravelViet - Global UI & Page Controller Script
   ========================================================================== */

// Format Currency to VND
function formatVND(amount) {
  if (amount === undefined || amount === null) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Format Date String
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Format Time String
function formatTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

// Show Toast Message
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = 'fa-info-circle';
  if (type === 'success') icon = 'fa-check-circle';
  if (type === 'error') icon = 'fa-exclamation-circle';
  if (type === 'warning') icon = 'fa-triangle-exclamation';

  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Setup Dynamic Navbar Auth Header
function setupNavbarAuth() {
  const user = getCurrentUser();
  const headerActions = document.querySelector('.header-actions');
  if (!headerActions) return;

  // Remove existing auth container if any
  const oldAuth = headerActions.querySelector('.auth-dynamic-container');
  if (oldAuth) oldAuth.remove();

  const authContainer = document.createElement('div');
  authContainer.className = 'auth-dynamic-container';

  if (user) {
    authContainer.innerHTML = `
      <div class="user-dropdown">
        <button class="user-avatar-btn" id="userDropdownBtn">
          <img src="${user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}" alt="${user.username}">
          <span>${user.full_name || user.username}</span>
          <i class="fa-solid fa-chevron-down" style="font-size: 0.75rem;"></i>
        </button>
        <div class="dropdown-menu" id="userDropdownMenu">
          ${user.role === 'admin' ? '<a href="admin/dashboard.html"><i class="fa-solid fa-gauge"></i> Quản Trị Admin</a>' : ''}
          <a href="profile.html"><i class="fa-solid fa-user"></i> Hồ Sơ Cá Nhân</a>
          <div class="dropdown-divider"></div>
          <button id="logoutBtn"><i class="fa-solid fa-right-from-bracket"></i> Đăng Xuất</button>
        </div>
      </div>
    `;
  } else {
    authContainer.innerHTML = `
      <a href="login.html" class="btn btn-outline btn-sm">Đăng Nhập</a>
      <a href="register.html" class="btn btn-primary btn-sm">Đăng Ký</a>
    `;
  }

  headerActions.appendChild(authContainer);

  // Bind dropdown events
  const dropdownBtn = document.getElementById('userDropdownBtn');
  const dropdownMenu = document.getElementById('userDropdownMenu');
  if (dropdownBtn && dropdownMenu) {
    dropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      dropdownMenu.classList.remove('show');
    });
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logoutUser();
    });
  }
}

// Modal Global Helper
function openModal(modalId) {
  const backdrop = document.getElementById(modalId);
  if (backdrop) backdrop.classList.add('active');
}

function closeModal(modalId) {
  const backdrop = document.getElementById(modalId);
  if (backdrop) backdrop.classList.remove('active');
}

document.addEventListener('DOMContentLoaded', () => {
  setupNavbarAuth();
});
