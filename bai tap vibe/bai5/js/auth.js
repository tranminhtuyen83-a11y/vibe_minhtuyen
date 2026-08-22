/* ==========================================================================
   TravelViet - Authentication & Authorization Manager
   ========================================================================== */

const AUTH_SESSION_KEY = 'travelviet_active_user';

// Get Current Logged-in User
function getCurrentUser() {
  const sessionStr = sessionStorage.getItem(AUTH_SESSION_KEY) || localStorage.getItem(AUTH_SESSION_KEY);
  if (!sessionStr) return null;
  try {
    return JSON.parse(sessionStr);
  } catch (e) {
    return null;
  }
}

// Set Active Session
function setActiveUserSession(user, remember = true) {
  const userJson = JSON.stringify(user);
  sessionStorage.setItem(AUTH_SESSION_KEY, userJson);
  if (remember) {
    localStorage.setItem(AUTH_SESSION_KEY, userJson);
  }
}

// Clear Session / Logout
function logoutUser() {
  sessionStorage.removeItem(AUTH_SESSION_KEY);
  localStorage.removeItem(AUTH_SESSION_KEY);
  showToast('Đã đăng xuất thành công.', 'info');
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 600);
}

// User Registration Validation & Handling
function handleRegister(username, email, password, confirmPassword, fullName, phone, address = '') {
  // 1. Username (bắt buộc): 5 đến 15 ký tự, không có ký tự đặc biệt
  if (!username) {
    return { success: false, message: 'Tên đăng nhập là bắt buộc.' };
  }
  const usernameRegex = /^[a-zA-Z0-9_]{5,15}$/;
  if (!usernameRegex.test(username)) {
    return { success: false, message: 'Tên đăng nhập phải từ 5 đến 15 ký tự và không chứa ký tự đặc biệt.' };
  }

  // 2. Password (bắt buộc): 5 đến 15 ký tự, xác nhận mật khẩu
  if (!password) {
    return { success: false, message: 'Mật khẩu là bắt buộc.' };
  }
  if (password.length < 5 || password.length > 15) {
    return { success: false, message: 'Mật khẩu phải từ 5 đến 15 ký tự.' };
  }
  if (password !== confirmPassword) {
    return { success: false, message: 'Xác nhận mật khẩu không trùng khớp.' };
  }

  // 3. Email (bắt buộc): hợp lệ
  if (!email) {
    return { success: false, message: 'Địa chỉ Email là bắt buộc.' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, message: 'Định dạng Email không hợp lệ.' };
  }

  // 4. SĐT (bắt buộc): 10 số
  if (!phone) {
    return { success: false, message: 'Số điện thoại là bắt buộc.' };
  }
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone)) {
    return { success: false, message: 'Số điện thoại phải bao gồm đúng 10 chữ số.' };
  }

  // 5. Địa chỉ: tối đa 100 ký tự
  if (address && address.length > 100) {
    return { success: false, message: 'Địa chỉ không được vượt quá 100 ký tự.' };
  }

  // Check if username or email already exists in SQLite
  const existingUser = dbQuery(`SELECT * FROM users WHERE username = ? OR email = ?`, [username, email]);
  if (existingUser && existingUser.length > 0) {
    return { success: false, message: 'Tên đăng nhập hoặc Email đã được sử dụng.' };
  }

  // 6. Tài khoản mới tạo, role là 'user' (USER)
  const newUser = {
    username,
    email,
    password,
    full_name: fullName || username,
    phone: phone,
    address: address || '',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    role: 'user'
  };

  const inserted = dbInsert('users', newUser);
  if (inserted) {
    const users = dbQuery(`SELECT * FROM users WHERE username = ?`, [username]);
    if (users && users.length > 0) {
      setActiveUserSession(users[0]);
    }
    return { success: true, message: 'Tạo tài khoản thành công! Đang chuyển hướng...' };
  } else {
    return { success: false, message: 'Đã có lỗi xảy ra khi tạo tài khoản.' };
  }
}

// User Login Handling
function handleLogin(emailOrUsername, password) {
  if (!emailOrUsername || !password) {
    return { success: false, message: 'Vui lòng nhập đầy đủ Tên đăng nhập/Email và Mật khẩu.' };
  }

  const users = dbQuery(
    `SELECT * FROM users WHERE (username = ? OR email = ?) AND password = ?`,
    [emailOrUsername, emailOrUsername, password]
  );

  if (!users || users.length === 0) {
    return { success: false, message: 'Tài khoản hoặc mật khẩu không chính xác.' };
  }

  const user = users[0];
  setActiveUserSession(user);

  return {
    success: true,
    user,
    message: `Đăng nhập thành công! Xin chào ${user.full_name || user.username}.`
  };
}

// Authorization Guard for Admin Pages (/admin/*)
function requireAdminGuard() {
  const user = getCurrentUser();
  if (!user || user.role !== 'admin') {
    alert('Truy cập bị từ chối. Bạn phải đăng nhập bằng tài khoản Quản trị viên (Admin).');
    window.location.href = '../login.html';
    return false;
  }
  return true;
}

// Authorization Guard for Protected User Pages
function requireUserGuard() {
  const user = getCurrentUser();
  if (!user) {
    alert('Vui lòng đăng nhập để thực hiện thao tác này.');
    window.location.href = 'login.html';
    return false;
  }
  return true;
}
