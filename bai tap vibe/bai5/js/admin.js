/* ==========================================================================
   TravelViet - Admin Panel Logic & Data Management
   ========================================================================== */

let currentToursPage = 1;
let currentFlightsPage = 1;
const PAGE_SIZE = 20;

// Initialize Admin Dashboard Page
function initAdminDashboard() {
  if (!db) {
    setTimeout(initAdminDashboard, 300);
    return;
  }

  // 1. Calculate 4 KPI Cards
  const toursCountRes = dbQuery(`SELECT COUNT(*) as count FROM tours`);
  const flightsCountRes = dbQuery(`SELECT COUNT(*) as count FROM flights`);
  const tourBookingsRes = dbQuery(`SELECT COUNT(*) as count FROM bookings WHERE booking_type = 'tour' OR booking_type = 'both'`);
  const flightBookingsRes = dbQuery(`SELECT COUNT(*) as count FROM bookings WHERE booking_type = 'flight' OR booking_type = 'both'`);

  const kpiTourEl = document.getElementById('kpiTourCount');
  const kpiFlightEl = document.getElementById('kpiFlightCount');
  const kpiTourCustomerEl = document.getElementById('kpiTourCustomerCount');
  const kpiFlightCustomerEl = document.getElementById('kpiFlightCustomerCount');

  if (kpiTourEl) kpiTourEl.textContent = toursCountRes[0]?.count || 0;
  if (kpiFlightEl) kpiFlightEl.textContent = flightsCountRes[0]?.count || 0;
  if (kpiTourCustomerEl) kpiTourCustomerEl.textContent = tourBookingsRes[0]?.count || 0;
  if (kpiFlightCustomerEl) kpiFlightCustomerEl.textContent = flightBookingsRes[0]?.count || 0;

  // 2. Initialize Bar Chart - Top 10 Airlines
  const barCanvas = document.getElementById('topAirlinesChart');
  if (barCanvas && typeof Chart !== 'undefined') {
    const airlinesData = [
      { name: 'Vietnam Airlines', count: 48 },
      { name: 'VietJet Air', count: 42 },
      { name: 'Singapore Airlines', count: 35 },
      { name: 'Emirates', count: 28 },
      { name: 'Thai Airways', count: 24 },
      { name: 'Bamboo Airways', count: 22 },
      { name: 'Korean Air', count: 18 },
      { name: 'Japan Airlines', count: 15 },
      { name: 'AirAsia', count: 12 },
      { name: 'Pacific Airlines', count: 10 }
    ];

    new Chart(barCanvas, {
      type: 'bar',
      data: {
        labels: airlinesData.map(a => a.name),
        datasets: [{
          label: 'Số vé đã đặt',
          data: airlinesData.map(a => a.count),
          backgroundColor: '#0284c7',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  // 3. Initialize Pie/Doughnut Chart - Tour Country Distribution
  const pieCanvas = document.getElementById('countryPieChart');
  if (pieCanvas && typeof Chart !== 'undefined') {
    const countryData = [
      { name: 'Việt Nam', count: 45 },
      { name: 'Thái Lan', count: 25 },
      { name: 'Nhật Bản', count: 18 },
      { name: 'Hàn Quốc', count: 15 },
      { name: 'Singapore', count: 12 },
      { name: 'Pháp', count: 8 },
      { name: 'Ý', count: 6 },
      { name: 'UAE', count: 5 }
    ];

    new Chart(pieCanvas, {
      type: 'doughnut',
      data: {
        labels: countryData.map(c => c.name),
        datasets: [{
          data: countryData.map(c => c.count),
          backgroundColor: [
            '#0284c7', '#f59e0b', '#22c55e', '#ec4899', '#8b5cf6', '#06b6d4', '#f97316', '#64748b'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }

  // 4. Render Top 10 Countries Data Table
  const topCountryTable = document.getElementById('topCountryTableBody');
  if (topCountryTable) {
    const topCountries = [
      { country: 'Việt Nam', tours: 32, bookings: 145 },
      { country: 'Thái Lan', tours: 18, bookings: 88 },
      { country: 'Nhật Bản', tours: 14, bookings: 64 },
      { country: 'Hàn Quốc', tours: 12, bookings: 52 },
      { country: 'Singapore', tours: 10, bookings: 45 },
      { country: 'Trung Quốc', tours: 8, bookings: 38 },
      { country: 'Pháp', tours: 6, bookings: 29 },
      { country: 'Ý', tours: 5, bookings: 22 },
      { country: 'Úc', tours: 4, bookings: 19 },
      { country: 'UAE - Dubai', tours: 3, bookings: 15 }
    ];

    topCountryTable.innerHTML = topCountries.map((c, i) => `
      <tr>
        <td><strong>#${i + 1}</strong></td>
        <td>${c.country}</td>
        <td><span class="badge badge-primary">${c.tours} Tours</span></td>
        <td><strong>${c.bookings}</strong> lượt đặt</td>
      </tr>
    `).join('');
  }
}

// KPI Modal Helpers for Customer Bookings
window.showKpiTourCustomers = function() {
  const bookings = dbQuery(`SELECT * FROM bookings WHERE booking_type = 'tour' OR booking_type = 'both' ORDER BY id DESC`);
  const titleEl = document.getElementById('kpiCustomerModalTitle');
  if (titleEl) titleEl.textContent = 'Danh Sách Khách Đặt Tour';
  renderKpiCustomerModalTable(bookings);
  openModal('kpiCustomerModal');
};

window.showKpiFlightCustomers = function() {
  const bookings = dbQuery(`SELECT * FROM bookings WHERE booking_type = 'flight' OR booking_type = 'both' ORDER BY id DESC`);
  const titleEl = document.getElementById('kpiCustomerModalTitle');
  if (titleEl) titleEl.textContent = 'Danh Sách Khách Đặt Chuyến Bay';
  renderKpiCustomerModalTable(bookings);
  openModal('kpiCustomerModal');
};

function renderKpiCustomerModalTable(bookings) {
  const tbody = document.getElementById('kpiCustomerModalBody');
  if (!tbody) return;

  if (bookings.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center" style="padding:1.5rem; color:var(--text-muted);">Chưa có lượt đặt nào trong danh sách.</td></tr>`;
    return;
  }

  tbody.innerHTML = bookings.map(b => {
    let itemsStr = '';
    try {
      const items = JSON.parse(b.item_details);
      const itemList = Array.isArray(items) ? items : [items];
      itemsStr = itemList.map(i => `${i.title || i.itemTitle || ''} (${i.subInfo || i.class || ''})`).join(', ');
    } catch(e) {
      itemsStr = b.item_details;
    }

    return `
      <tr>
        <td><strong>${b.booking_code}</strong></td>
        <td><strong>${b.customer_name}</strong></td>
        <td>
          <div>${b.customer_email}</div>
          <small style="color:var(--text-muted);">${b.customer_phone}</small>
        </td>
        <td style="max-width:240px; font-size:0.85rem;">${itemsStr}</td>
        <td><strong style="color:var(--accent);">${formatVND(b.total_amount)}</strong></td>
      </tr>
    `;
  }).join('');
}

// Admin Tours Management Page (20/page pagination)
function renderAdminTours(page = 1, searchQuery = '') {
  if (!db) {
    setTimeout(() => renderAdminTours(page, searchQuery), 300);
    return;
  }

  currentToursPage = page;
  let whereClause = '';
  let params = [];
  if (searchQuery) {
    whereClause = 'WHERE title LIKE ? OR tour_code LIKE ? OR country LIKE ?';
    params = [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`];
  }

  // Total count
  const countRes = dbQuery(`SELECT COUNT(*) as count FROM tours ${whereClause}`, params);
  const totalItems = countRes[0]?.count || 0;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE) || 1;

  const offset = (page - 1) * PAGE_SIZE;
  const tours = dbQuery(`SELECT * FROM tours ${whereClause} ORDER BY id DESC LIMIT ? OFFSET ?`, [...params, PAGE_SIZE, offset]);

  const tbody = document.getElementById('adminToursTableBody');
  if (tbody) {
    if (tours.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center">Không tìm thấy tour nào.</td></tr>`;
    } else {
      tbody.innerHTML = tours.map(t => `
        <tr>
          <td><strong>${t.tour_code}</strong></td>
          <td>
            <div style="display:flex; align-items:center; gap:0.8rem;">
              <img src="${t.thumbnail_url || ''}" style="width:48px; height:36px; object-fit:cover; border-radius:4px;">
              <div>
                <strong>${t.title}</strong>
                <div style="font-size:0.78rem; color:var(--text-muted);">${t.country}</div>
              </div>
            </div>
          </td>
          <td>${t.departure_city} → ${t.destination_city}</td>
          <td>${t.duration_days}N${t.duration_nights}Đ</td>
          <td><strong style="color:var(--accent);">${formatVND(t.price)}</strong></td>
          <td>${t.travel_agency}</td>
          <td>
            <button class="btn btn-sm btn-outline" onclick="editTour(${t.id})"><i class="fa-solid fa-pen"></i></button>
            <button class="btn btn-sm btn-danger" onclick="deleteTour(${t.id})"><i class="fa-solid fa-trash"></i></button>
          </td>
        </tr>
      `).join('');
    }
  }

  renderPagination('toursPagination', page, totalPages, totalItems, (p) => renderAdminTours(p, searchQuery));
}

// Admin Flights Management Page (20/page pagination)
function renderAdminFlights(page = 1, searchQuery = '') {
  if (!db) {
    setTimeout(() => renderAdminFlights(page, searchQuery), 300);
    return;
  }

  currentFlightsPage = page;
  let whereClause = '';
  let params = [];
  if (searchQuery) {
    whereClause = 'WHERE flight_code LIKE ? OR departure_city LIKE ? OR arrival_city LIKE ?';
    params = [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`];
  }

  const countRes = dbQuery(`SELECT COUNT(*) as count FROM flights ${whereClause}`, params);
  const totalItems = countRes[0]?.count || 0;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE) || 1;

  const offset = (page - 1) * PAGE_SIZE;
  const flights = dbQuery(`
    SELECT f.*, a.name as airline_name, a.logo_url
    FROM flights f
    LEFT JOIN airlines a ON f.airline_id = a.id
    ${whereClause}
    ORDER BY f.id DESC LIMIT ? OFFSET ?
  `, [...params, PAGE_SIZE, offset]);

  const tbody = document.getElementById('adminFlightsTableBody');
  if (tbody) {
    if (flights.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center">Không tìm thấy chuyến bay nào.</td></tr>`;
    } else {
      tbody.innerHTML = flights.map(f => `
        <tr>
          <td><strong>${f.flight_code}</strong></td>
          <td>
            <div style="display:flex; align-items:center; gap:0.6rem;">
              <img src="${f.logo_url || ''}" style="width:28px; height:28px; border-radius:50%; object-fit:cover;">
              <span>${f.airline_name || 'Hãng bay'}</span>
            </div>
          </td>
          <td>${f.departure_city} → ${f.arrival_city}</td>
          <td>${f.departure_time}</td>
          <td><span class="badge ${f.flight_type === 'direct' ? 'badge-success' : 'badge-warning'}">${f.flight_type === 'direct' ? 'Bay thẳng' : 'Transit'}</span></td>
          <td>
            Eco: <strong style="color:var(--primary);">${formatVND(f.price_economy)}</strong><br>
            Bus: <strong style="color:var(--accent);">${formatVND(f.price_business)}</strong>
          </td>
          <td>
            <button class="btn btn-sm btn-outline" onclick="editFlight(${f.id})"><i class="fa-solid fa-pen"></i></button>
            <button class="btn btn-sm btn-danger" onclick="deleteFlight(${f.id})"><i class="fa-solid fa-trash"></i></button>
          </td>
        </tr>
      `).join('');
    }
  }

  renderPagination('flightsPagination', page, totalPages, totalItems, (p) => renderAdminFlights(p, searchQuery));
}

// Render Generic Pagination Bar
function renderPagination(containerId, currentPage, totalPages, totalItems, onPageClick) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const startItem = totalItems > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const endItem = Math.min(currentPage * PAGE_SIZE, totalItems);

  let html = `
    <div class="pagination-info">
      Hiển thị <strong>${startItem} - ${endItem}</strong> trên tổng số <strong>${totalItems}</strong> mục (20 mục/trang)
    </div>
    <div class="pagination">
      <button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} id="btnPrevPage">
        <i class="fa-solid fa-chevron-left"></i> Trước
      </button>
  `;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
      html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    } else if (i === currentPage - 3 || i === currentPage + 3) {
      html += `<span style="padding: 0 4px;">...</span>`;
    }
  }

  html += `
      <button class="page-btn" ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''} id="btnNextPage">
        Sau <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  `;

  container.innerHTML = html;

  // Bind click events
  container.querySelectorAll('.page-btn[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      onPageClick(parseInt(btn.getAttribute('data-page')));
    });
  });

  const prevBtn = container.querySelector('#btnPrevPage');
  if (prevBtn && !prevBtn.disabled) {
    prevBtn.addEventListener('click', () => onPageClick(currentPage - 1));
  }

  const nextBtn = container.querySelector('#btnNextPage');
  if (nextBtn && !nextBtn.disabled) {
    nextBtn.addEventListener('click', () => onPageClick(currentPage + 1));
  }
}

// Delete Tour
function deleteTour(id) {
  if (confirm('Bạn có chắc chắn muốn xóa Tour này không?')) {
    dbDelete('tours', id);
    showToast('Đã xóa Tour thành công.', 'success');
    renderAdminTours(currentToursPage);
  }
}

// Delete Flight
function deleteFlight(id) {
  if (confirm('Bạn có chắc chắn muốn xóa chuyến bay này không?')) {
    dbDelete('flights', id);
    showToast('Đã xóa chuyến bay thành công.', 'success');
    renderAdminFlights(currentFlightsPage);
  }
}
