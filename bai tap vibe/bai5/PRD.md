# PRD - Website Du Lịch Việt (TravelViet)

## 1. Giới thiệu Dự Án
- **Tên dự án:** Du Lịch Việt (TravelViet)
- **Mục tiêu:** Xây dựng nền tảng website đặt vé máy bay và tour du lịch trực tuyến trực quan, hiện đại, tốc độ cao.
- **Mô hình triển khai:** Client-Side Single Page/Multi-Page Application không cần server backend phức tạp, sử dụng SQLite chạy trên trình duyệt (qua `sql.js` / WebAssembly hoặc LocalStorage wrapper), giao diện thuần HTML5, CSS3, JavaScript ES6+.
- **Tông màu chủ đạo:** Tông sáng, nền trắng (#FFFFFF), điểm nhấn xanh dương du lịch (#0284C7, #0369A1) và cam/vàng cam năng động (#F59E0B).

---

## 2. Yêu cầu Công nghệ (Tech Stack)
- **Frontend Core:** HTML5, CSS3 (Flexbox/Grid, CSS Variables), JavaScript (Vanilla ES6+).
- **Thư viện UI/Icon/Chart:** 
  - Font Awesome 6.x / Lucide Icons (CDN)
  - Chart.js (v4.x CDN) cho biểu đồ Dashboard Admin
- **Database:** SQLite in-browser (sử dụng `sql.js` WebAssembly + đồng bộ LocalStorage/IndexedDB để lưu trữ bền vững).
- **Email Service (Client-side):** Tích hợp EmailJS SDK hoặc Mock Email Dispatcher gửi từ `nvhai061993@gmail.com` đến email khách hàng khi đặt đơn thành công.

---

## 3. Kiến trúc Phân Quyền & Người dùng
1. **Khách vãng lai (Guest):**
   - Tìm kiếm chuyến bay, tìm tour du lịch.
   - Xem chi tiết chuyến bay, chi tiết tour.
   - Thêm vào giỏ hàng, điền thông tin và đặt chỗ.
   - Đăng ký / Đăng nhập / Quên mật khẩu.
2. **Khách hàng (User):**
   - Quản lý lịch sử đặt chỗ cá nhân, cập nhật profile.
3. **Quản trị viên (Admin):**
   - Xem thống kê Dashboard: 4 thẻ KPI, Biểu đồ cột top 10 hãng bay, Biểu đồ tròn tỷ lệ tour theo quốc gia, Bảng top 10 quốc gia.
   - Quản lý CRUD Tour (Phân trang 20 tour/trang).
   - Quản lý CRUD Chuyến bay (Phân trang 20 chuyến/trang).
   - Quản lý Profile Admin.

---

## 4. Tài khoản Mặc Định (Seed Users)
| Vai trò | Email | Mật khẩu | Ghi chú |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@travel.com` | `Admin123!` | Quyền truy cập toàn bộ trang Admin |
| **User** | `user@travel.com` | `User123!` | Quyền tài khoản thành viên thông thường |
