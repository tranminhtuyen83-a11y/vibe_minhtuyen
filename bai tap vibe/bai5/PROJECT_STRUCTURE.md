# Cấu Trúc Thư Mục Dự Án TravelViet (TravelViet Project Structure)

Tài liệu mô tả chi tiết sơ đồ cây thư mục và chức năng từng thành phần trong dự án **TravelViet (Du Lịch Việt)**.

---

## 📂 Sơ Đồ Cây Thư Mục (Directory Tree)

```text
travelviet/
├── index.html                  # Trang chủ (Hero search bay/tour, 8 tour nổi bật, đối tác hàng không)
├── flights.html                # Trang danh sách & bộ lọc tìm kiếm chuyến bay
├── flight-detail.html          # Trang chi tiết chuyến bay & chọn hạng ghế (Economy / Business)
├── tours.html                  # Trang danh sách & bộ lọc tìm kiếm tour du lịch
├── tour-detail.html            # Trang chi tiết tour & lịch trình chuyến đi (Timeline Accordion)
├── cart.html                   # Trang giỏ hàng, đặt chỗ & xác nhận email tự động
├── login.html                  # Trang đăng nhập (Hỗ trợ tài khoản Admin & User)
├── register.html               # Trang đăng ký thành viên (Validation đầy đủ các trường)
├── forgot-password.html        # Trang khôi phục mật khẩu
├── profile.html                # Trang hồ sơ cá nhân & lịch sử đặt chỗ khách hàng
│
├── admin/                      # Khu vực Quản trị viên (Phân quyền Admin Guard)
│   ├── dashboard.html          # Admin Dashboard (4 thẻ KPI clickable, 2 biểu đồ Chart.js, Top 10 nước)
│   ├── tours.html              # Quản lý CRUD Tour (Phân trang chuẩn 20 tour/trang)
│   ├── flights.html            # Quản lý CRUD Chuyến bay (Phân trang chuẩn 20 chuyến/trang)
│   └── profile.html            # Hồ sơ cá nhân & đổi mật khẩu Admin
│
├── css/                        # Hệ thống Stylesheet CSS
│   ├── main.css                # CSS dùng chung, khai báo CSS Variables, Typography, Header, Footer, Toast, Modal
│   ├── components.css          # CSS UI Components: Hero Search Box, Tour Card 600x400, Flight Card, Filter Sidebar
│   └── admin.css               # CSS Admin Layout: Sidebar cố định, Topbar, KPI Cards hover, Table, Pagination
│
├── js/                         # Hệ thống JavaScript Modules (ES6+)
│   ├── db.js                   # Cơ sở dữ liệu SQLite in-browser (sql.js WebAssembly + LocalStorage Bridge & Seed Data)
│   ├── auth.js                 # Xử lý Đăng nhập, Đăng ký (Validation Username/Pass/Email/SĐT/Địa chỉ), Session & Route Guards
│   ├── cart.js                 # Engine Giỏ hàng, Đặt chỗ (Yêu cầu đăng nhập), Lưu Booking & Email Dispatcher mock
│   ├── main.js                 # Render Navbar Auth, Toast Notifications, Format Tiền tệ VNĐ, Utility Helpers
│   └── admin.js                # Logic Dashboard (Chart.js Bar & Doughnut), CRUD Tours & Flights (Phân trang 20/trang)
│
├── PRD.md                      # Tài liệu yêu cầu sản phẩm (Product Requirement Document)
├── ARCHITECTURE.md             # Tài liệu kiến trúc dự án & chỉ dẫn hệ thống
├── DATABASE.md                 # Đặc tả Schema cơ sở dữ liệu SQLite & Seed Data
├── UI_SPEC.md                  # Đặc tả chi tiết từng trang & giao diện UI
└── PROJECT_STRUCTURE.md        # File cấu trúc thư mục dự án (Tài liệu này)
```

---

## 🛠️ Mổ Tả Chi Tiết Chức Năng Các Thành Phần

### 1. Giao Diện Người Dùng Public (Client Pages)
- **`index.html`**: Trang chủ giới thiệu giải pháp đặt vé & tour. Có Hero Search Box hỗ trợ toggle Vé máy bay / Tour du lịch, chọn Khứ hồi / Một chiều; hiển thị Grid 8 Tour du lịch nổi bật và danh sách các logo đối tác hàng không.
- **`flights.html`**: Trang tìm kiếm chuyến bay với bộ lọc 2 cột (Giá tăng/giảm, Loại bay thẳng/transit, Khung giờ cất cánh, Chọn nhiều hãng bay).
- **`flight-detail.html`**: Xem chi tiết thông tin tàu bay, giờ cất/hạ cánh và chọn mua giữa hạng ghế **Economy (Phổ thông)** hoặc **Business (Thương gia)**.
- **`tours.html`**: Trang danh sách tour với bộ lọc theo Giá, Quốc gia/Điểm đến, Đơn vị lữ hành.
- **`tour-detail.html`**: Xem thông tin tổng quan tour, accordion phân tab lịch trình từng ngày (Day-by-day Itinerary Timeline) và chính sách dịch vụ bao gồm.
- **`cart.html`**: Giỏ hàng hiển thị các món đã chọn. Yêu cầu bắt buộc **Đăng nhập** trước khi nhấn **Xác Nhận Đặt Chỗ**. Tự động gửi email xác nhận từ `nvhai061993@gmail.com` và bật Modal thông báo thành công.
- **`login.html` & `register.html`**: Đăng nhập/Đăng ký với validation chặt chẽ: Username (5-15 ký tự, không ký tự đặc biệt), Password (5-15 ký tự), Email hợp lệ, SĐT (đúng 10 số), Địa chỉ (tối đa 100 ký tự). Tải khoản mới mặc định role `USER`.
- **`profile.html`**: Xem/Cập nhật thông tin thành viên và theo dõi **Lịch Sử Đặt Chỗ Cá Nhân**.

### 2. Khu Vực Quản Trị Admin (`admin/`)
- **`admin/dashboard.html`**: Giao diện Dashboard quản trị tích hợp 4 thẻ KPI tương tác (Click icon/thẻ để chuyển trang hoặc bật Modal chi tiết khách đặt vé/tour), 2 Biểu đồ `Chart.js` (Top 10 Hãng bay đặt nhiều nhất & Tỷ lệ khách đặt tour theo nước) và bảng Top 10 Quốc gia.
- **`admin/tours.html`**: Quản lý toàn bộ danh sách Tour du lịch với tính năng Tìm kiếm, Thêm/Sửa/Xóa và **Phân trang chính xác 20 tour/trang**.
- **`admin/flights.html`**: Quản lý danh sách Chuyến bay với tính năng Tìm kiếm, Thêm/Sửa/Xóa và **Phân trang chính xác 20 chuyến/trang**.
- **`admin/profile.html`**: Quản lý thông tin tài khoản và đổi mật khẩu Admin.

### 3. Tầng Dữ Liệu & Xử Lý Core (`js/`)
- **`js/db.js`**: Trái tim của ứng dụng, nạp WebAssembly `sql.js` để chạy SQLite ngay trên trình duyệt. Tự động lưu vết dữ liệu vào `localStorage` và nạp sẵn dữ liệu mẫu (100+ flights, 100+ tours, 10 airlines, 2 seed users).
- **`js/auth.js`**: Quản lý phiên làm việc (`sessionStorage` & `localStorage`), thực thi Route Guard bảo vệ các trang `/admin/*`, xử lý đăng ký/đăng nhập.
- **`js/cart.js`**: Quản lý trạng thái giỏ hàng, tính tổng tiền, xử lý đơn đặt chỗ và kết nối lưu vào SQLite.
- **`js/main.js`**: Khởi tạo UI chung (Header, Footer, Toast notifications, định dạng tiền tệ VNĐ).
- **`js/admin.js`**: Chứa toàn bộ logic render Dashboard charts và xử lý CRUD + phân trang 20 mục/trang cho Tour & Flight.

---

## 🔑 Tài Khoản Thử Nghiệm

| Vai trò | Email | Mật khẩu | Quyền truy cập |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@travel.com` | `Admin123!` | Quyền Quản trị viên toàn bộ khu vực `/admin/*` |
| **User** | `user@travel.com` | `User123!` | Quyền Thành viên đặt vé, xem hồ sơ & lịch sử |
