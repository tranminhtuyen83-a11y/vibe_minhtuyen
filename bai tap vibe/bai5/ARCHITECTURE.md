# ARCHITECTURE & ANTIGRAVITY INSTRUCTIONS

## 1. Cấu Trúc Thư Mục Dự Án (Project Structure)

```text
travelviet/
├── index.html                  # Trang chủ (Tìm kiếm, 8 tour nổi bật, đối tác hàng không)
├── flights.html                # Danh sách & Bộ lọc Chuyến bay
├── flight-detail.html          # Chi tiết chuyến bay & chọn hạng ghế
├── tours.html                  # Danh sách & Bộ lọc Tour du lịch
├── tour-detail.html            # Chi tiết tour & lịch trình chuyến đi
├── cart.html                   # Giỏ hàng, Đặt chỗ & Gửi email xác nhận
├── login.html                  # Đăng nhập
├── register.html               # Đăng ký tài khoản
├── forgot-password.html        # Quên mật khẩu
│
├── admin/                      # Khu vực Quản trị viên
│   ├── dashboard.html          # Thống kê KPI, Biểu đồ Cột & Tròn, Top 10 nước
│   ├── tours.html              # Quản lý & Tạo Tour (Phân trang 20/trang)
│   ├── flights.html            # Quản lý & Tạo Chuyến bay (Phân trang 20/trang)
│   └── profile.html            # Thông tin cá nhân Admin
│
├── css/
│   ├── main.css                # CSS dùng chung toàn website (Màu sáng, nền trắng)
│   ├── components.css          # Cards, Buttons, Form controls, Modals, Badges
│   └── admin.css               # Sidebar, KPI Cards, Data Tables
│
├── js/
│   ├── db.js                   # Khởi tạo & thao tác SQLite (sql.js / LocalStorage Bridge)
│   ├── auth.js                 # Xử lý Đăng nhập, Đăng ký, Session, Quyền Admin/User
│   ├── cart.js                 # Quản lý Giỏ hàng, Đặt hàng & Gửi Email (nvhai061993@gmail.com)
│   ├── main.js                 # Xử lý chung giao diện Client
│   └── admin.js                # Xử lý Dashboard Charts, CRUD Tours & Flights, Phân trang 20/trang
│
├── assets/
│   ├── images/                 # Ảnh logo hãng bay, thumbnails 600x400
│   └── icons/
└── README.md
```

---

## 2. Hướng Dẫn Kích Hoạt Trong Antigravity

1. Đặt toàn bộ các file `.md` này (`PRD.md`, `DATABASE.md`, `UI_SPEC.md`, `ARCHITECTURE.md`) vào thư mục gốc của dự án hoặc thư mục `.antigravity/`.
2. Antigravity sẽ quét các chỉ dẫn trên để sinh toàn bộ mã nguồn HTML, CSS, JavaScript và cơ sở dữ liệu SQLite client-side hoàn chỉnh theo đúng yêu cầu nghiệp vụ.
