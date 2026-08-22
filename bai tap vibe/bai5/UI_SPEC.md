# UI & PAGE SPECIFICATIONS - Du Lịch Việt (TravelViet)

## 1. Hệ Thống Trang & Yêu Cầu Giao Diện

### 1.1. Trang Chủ (`index.html`)
- **Header:** Logo Du Lịch Việt, Menu (Trang chủ, Chuyến bay, Tour, Giới thiệu, Liên hệ), Giỏ hàng (Badge đếm số lượng), Nút Đăng nhập/Đăng ký/User Profile.
- **Hero & Search Box:**
  - Tab chọn: Vé Chuyến Bay / Tour Du Lịch.
  - Option: Khứ hồi (Round-trip) / Một chiều (One-way).
  - Trường nhập: Điểm xuất phát (Hà Nội, TP.HCM, Đà Nẵng, v.v.), Điểm đến, Ngày đi, Ngày về, Số lượng khách.
  - Nút **"Tìm Kiếm"** -> Chuyển hướng kèm Query Parameters sang `flights.html`.
- **Khu vực 8 Tour Du Lịch Nổi Bật (Featured Tours):**
  - Grid 4 cột x 2 hàng hoặc responsive 1-2-4 cột.
  - Mỗi Card Tour:
    - Ảnh thumbnail kích thước **600x400**.
    - Badge quốc gia/điểm đến.
    - Hãng du lịch phụ trách (Vietravel, Saigontourist, TravelViet...).
    - Số ngày/đêm (VD: 4 Ngày 3 Đêm).
    - Giá tour niêm yết và giảm giá.
    - Nút "Xem Chi Tiết" -> Điều hướng sang `tour-detail.html?id=...`.
- **Khu vực Hãng Hàng Không Đối Tác:**
  - Hàng logo các hãng bay: VietJet Air, Vietnam Airlines, Bamboo Airways, Singapore Airlines, Emirates, Qatar Airways...
  - Hiệu ứng hover bóng đổ nhẹ, click vào logo hãng -> Chuyển hướng sang `flights.html?airline=VN...`.

---

### 1.2. Trang Chuyến Bay (`flights.html`)
- **Bố cục 2 cột (Sidebar + Main Content):**
  - **Sidebar Bộ Lọc (Bên trái):**
    - Sắp xếp giá: Tăng dần / Giảm dần.
    - Loại vé: Vé khứ hồi, Vé một chiều, Nhiều thành phố.
    - Kiểu bay: Bay thẳng (Direct), 1 điểm dừng (Transit).
    - Hãng hàng không: Checkbox chọn nhiều hãng (Vietnam Airlines, VietJet...).
    - Khung giờ cất cánh: Sáng sớm (00:00 - 06:00), Sáng (06:00 - 12:00), Chiều (12:00 - 18:00), Tối (18:00 - 24:00).
    - Hạng dịch vụ: Phổ thông (Economy), Thương gia (Business).
  - **Danh sách Chuyến bay (Bên phải):**
    - Danh sách các card chuyến bay hiển thị trực quan: Logo hãng, Tên hãng, Mã hiệu chuyến bay, Giờ cất cánh - Giờ hạ cánh, Thời gian bay tổng cộng, Số điểm dừng, Giá tiền theo hạng ghế, Tiện ích dịch vụ (Hành lý, suất ăn).
    - Nút **"Chọn Chuyến Bay"** -> Điều hướng sang `flight-detail.html?id=...`.

---

### 1.3. Trang Chi Tiết Chuyến Bay (`flight-detail.html`)
- **Thông tin tổng quan:** Tuyến bay (Điểm đi -> Điểm đến), Thời gian bay, Hãng hàng không, Loại máy bay (Boeing 787 Dreamliner, Airbus A350, Airbus A321...).
- **Khu vực Chọn Hạng Vé:**
  - Card 1: **Hạng Phổ Thông (Economy)** - Giá vé, quyền lợi (xách tay 7kg, hành lý ký gửi 20kg, suất ăn tiêu chuẩn).
  - Card 2: **Hạng Thương Gia (Business)** - Giá vé, quyền lợi (phòng chờ thương gia, xách tay 14kg, ký gửi 40kg, ghế ngả 180 độ, ưu tiên check-in).
- **Hành động:** Nút **"Thêm Vào Giỏ Hàng"** / **"Đặt Ngay"** -> Lưu item vào Giỏ Hàng (LocalStorage / SQLite) và chuyển đến `cart.html`.

---

### 1.4. Trang Danh Sách Tour (`tours.html`)
- **Sidebar Bộ Lọc (Bên trái):**
  - Giá tour: Tăng dần / Giảm dần, Slider khoảng giá.
  - Hãng hàng không vận chuyển đi kèm.
  - Thời gian khởi hành, thời lượng tour (Dưới 3 ngày, 4-7 ngày, trên 7 ngày).
  - Quốc gia / Điểm đến du lịch (Việt Nam, Thái Lan, Nhật Bản, Hàn Quốc, Châu Âu...).
- **Danh sách Tour (Bên phải):**
  - Card tour: Thumbnail 600x400, Tiêu đề tour, Hãng lữ hành, Hãng bay đồng hành, Ngày khởi hành, Thời lượng, Giá trọn gói, Dịch vụ bao gồm.
  - Nút **"Chi Tiết Tour"** -> Chuyển sang `tour-detail.html?id=...`.

---

### 1.5. Trang Chi Tiết Tour (`tour-detail.html`)
- **Thông tin chính:** Tiêu đề tour, Điểm xuất phát & Điểm đến, Thời lượng (Số ngày/đêm), Hãng bay vận chuyển & Loại máy bay (Airbus/Boeing).
- **Lịch trình chuyến đi (Itinerary Timeline):**
  - Phân tab/Accordion chi tiết từng ngày (Ngày 1: Khởi hành & Nhận phòng; Ngày 2: Khám phá danh lam thắng cảnh; Ngày 3: Trải nghiệm ẩm thực & Mua sắm; Ngày 4: Trở về).
- **Chính sách & Dịch vụ bao gồm:** Khách sạn, xe đưa đón, bảo hiểm du lịch, hướng dẫn viên.
- **Hành động:** Nút **"Đặt Tour Này"** -> Lưu vào Giỏ Hàng và điều hướng sang Giỏ Hàng.

---

### 1.6. Trang Giỏ Hàng & Thanh Toán (`cart.html`)
- **Danh sách sản phẩm:** Xem danh sách vé máy bay, tour du lịch đã chọn. Cho phép xóa từng món hoặc xóa toàn bộ giỏ hàng.
- **Form Nhập Thông Tin Cá Nhân:**
  - Họ và tên, Số điện thoại, Email nhận vé, Địa chỉ liên lạc, Ghi chú yêu cầu đặc biệt.
- **Xác nhận đặt đơn (Đăng ký / Đặt chỗ):**
  - Click nút **"Xác Nhận Đặt Chỗ"**.
  - Hệ thống lưu đơn vào bảng `bookings` trong SQLite.
  - Bật modal thông báo **"Đặt chỗ thành công!"** kèm mã đơn hàng.
  - **Tự động gửi email xác nhận** thông tin vé/tour từ người gửi: `nvhai061993@gmail.com` tới địa chỉ email khách hàng nhập trong form.

---

### 1.7. Hệ Thống Auth (`login.html`, `register.html`, `forgot-password.html`)
- **Quy tắc kiểm tra hợp lệ (Validation Rules):**
  - `Username`: Độ dài từ 5 đến 15 ký tự, không chứa ký tự đặc biệt (`/^[a-zA-Z0-9_]{5,15}$/`).
  - `Password`: Độ dài từ 5 đến 15 ký tự.
- **Tài khoản tạo sẵn:**
  - `admin@travel.com` / `Admin123!` (Đăng nhập tự động chuyển sang trang Admin).
  - `user@travel.com` / `User123!` (Đăng nhập chuyển về Trang chủ/Profile).
- **Quên mật khẩu:** Form nhập email, gửi liên kết giả lập đặt lại mật khẩu với thông báo rõ ràng.

---

### 1.8. Trang Quản Trị Admin Panel (`admin/`)
Giao diện Layout chuẩn: Sidebar cố định bên trái, Header trên cùng (Thông tin admin, nút Logout), Content chính bên phải.

#### A. Menu Sidebar Admin:
1. **Dashboard** (`admin/dashboard.html`)
2. **Tours** (`admin/tours.html`) -> Quản lý danh sách & Tạo Tour mới.
3. **Flights** (`admin/flights.html`) -> Quản lý danh sách & Tạo Chuyến Bay mới.
4. **Profile** (`admin/profile.html`) -> Quản lý thông tin cá nhân Admin.

#### B. Chi tiết Dashboard (`admin/dashboard.html`):
- **4 Thẻ Thống Kê (KPI Cards):**
  1. Số tour trong tháng
  2. Số chuyến bay
  3. Số khách đặt tour
  4. Số khách đặt chuyến bay
- **Biểu đồ Cột (Chart.js Bar Chart):** Top 10 hãng bay được đặt nhiều nhất (Vietnam Airlines, VietJet, Singapore Airlines, Emirates, Qatar Airways...).
- **Biểu đồ Tròn (Chart.js Pie/Doughnut Chart):** Tỷ lệ các nước có nhiều khách đặt tour du lịch nhất (Việt Nam, Thái Lan, Nhật Bản, Hàn Quốc, Pháp, Ý...).
- **Bảng Thống Kê Top 10 Nước (Data Table):**
  - Các cột: `Đất Nước`, `Số Tour Đang Mở`, `Số Khách Đặt Vé`.

#### C. Quản lý Tours (`admin/tours.html`):
- Form Tạo Tour Mới (Modal/Accordion): Nhập mã tour, tên tour, quốc gia, giá vé, số ngày/đêm, hãng bay, lịch trình, ảnh thumbnail 600x400.
- Bảng danh sách tour: Hiển thị đầy đủ thông tin, hỗ trợ tìm kiếm, lọc và **Phân trang chính xác 20 tour/trang**.
- Nút Sửa, Xóa tour cập nhật trực tiếp vào SQLite.

#### D. Quản lý Chuyến Bay (`admin/flights.html`):
- Form Tạo Chuyến Bay Mới: Mã chuyến bay, hãng bay, điểm đi, điểm đến, giờ cất cánh/hạ cánh, loại máy bay, giá phổ thông, giá thương gia.
- Bảng danh sách chuyến bay: Tìm kiếm, lọc và **Phân trang chính xác 20 chuyến bay/trang**.
- Nút Sửa, Xóa chuyến bay.

#### E. Profile (`admin/profile.html`):
- Xem và cập nhật: Họ tên, Email (`admin@travel.com`), Số điện thoại, Đổi mật khẩu, Tải ảnh đại diện.
