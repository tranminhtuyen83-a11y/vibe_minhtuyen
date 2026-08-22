/* ==========================================================================
   TravelViet - Shopping Cart & Order Booking Engine
   ========================================================================== */

const CART_STORAGE_KEY = 'travelviet_shopping_cart';

// Get Cart Items
function getCartItems() {
  const cartStr = localStorage.getItem(CART_STORAGE_KEY);
  if (!cartStr) return [];
  try {
    return JSON.parse(cartStr);
  } catch (e) {
    return [];
  }
}

// Save Cart Items
function saveCartItems(items) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  updateCartBadge();
}

// Add Item to Cart
function addToCart(item) {
  const items = getCartItems();
  
  // Check if item already exists
  const existingIdx = items.findIndex(i => i.id === item.id && i.type === item.type && i.class === item.class);
  if (existingIdx > -1) {
    items[existingIdx].quantity += item.quantity || 1;
  } else {
    items.push({
      id: item.id,
      type: item.type, // 'flight' or 'tour'
      title: item.title,
      code: item.code,
      subInfo: item.subInfo || '',
      class: item.class || 'Standard',
      price: item.price,
      quantity: item.quantity || 1,
      image: item.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&auto=format&fit=crop&q=80'
    });
  }

  saveCartItems(items);
  showToast(`Đã thêm "${item.title}" vào giỏ hàng!`, 'success');
}

// Remove Single Item
function removeFromCart(index) {
  const items = getCartItems();
  if (index >= 0 && index < items.length) {
    items.splice(index, 1);
    saveCartItems(items);
    showToast(`Đã xóa món khỏi giỏ hàng.`, 'info');
  }
}

// Clear Entire Cart
function clearCart() {
  localStorage.removeItem(CART_STORAGE_KEY);
  updateCartBadge();
}

// Calculate Total Amount
function calculateCartTotal() {
  const items = getCartItems();
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Update Cart Badge on Header
function updateCartBadge() {
  const badges = document.querySelectorAll('.cart-badge');
  const items = getCartItems();
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  badges.forEach(b => {
    b.textContent = totalCount;
    b.style.display = totalCount > 0 ? 'flex' : 'none';
  });
}

// Submit Booking Form & Save to SQLite (Enforce User Login Requirement)
function handleCheckoutBooking(customerName, email, phone, address, notes = '') {
  // 1. Enforce Authentication Requirement
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return {
      success: false,
      requireLogin: true,
      message: 'Yêu cầu đăng nhập: Bạn phải đăng nhập tài khoản trước khi đặt chỗ!'
    };
  }

  const items = getCartItems();
  if (items.length === 0) {
    return { success: false, message: 'Giỏ hàng của bạn đang trống!' };
  }

  if (!customerName || !email || !phone) {
    return { success: false, message: 'Vui lòng điền đầy đủ Họ tên, Email và Số điện thoại.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, message: 'Định dạng Email không hợp lệ.' };
  }

  const bookingCode = 'TV' + Math.floor(100000 + Math.random() * 900000);
  const totalAmount = calculateCartTotal();
  const bookingType = items.every(i => i.type === 'flight') ? 'flight' : (items.every(i => i.type === 'tour') ? 'tour' : 'both');

  const newBooking = {
    booking_code: bookingCode,
    user_id: currentUser.id,
    customer_name: customerName,
    customer_email: email,
    customer_phone: phone,
    customer_address: address || '',
    booking_type: bookingType,
    item_details: JSON.stringify(items),
    total_amount: totalAmount,
    sender_email: 'nvhai061993@gmail.com'
  };

  const inserted = dbInsert('bookings', newBooking);
  if (inserted) {
    // Save/Sync customer info to current user profile in SQLite
    dbUpdate('users', currentUser.id, {
      full_name: customerName,
      phone: phone
    });
    currentUser.full_name = customerName;
    currentUser.phone = phone;
    setActiveUserSession(currentUser);

    // Clear cart after successful booking
    clearCart();
    
    // Simulate Email Dispatcher
    console.log(`[EMAIL DISPATCHER] Simulated email sent from nvhai061993@gmail.com to ${email} for Booking ${bookingCode}`);

    return {
      success: true,
      bookingCode: bookingCode,
      totalAmount: totalAmount,
      senderEmail: 'nvhai061993@gmail.com',
      recipientEmail: email,
      message: 'Đặt chỗ thành công! Mã đơn hàng: ' + bookingCode
    };
  } else {
    return { success: false, message: 'Lỗi khi lưu thông tin đặt chỗ vào cơ sở dữ liệu.' };
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
});
