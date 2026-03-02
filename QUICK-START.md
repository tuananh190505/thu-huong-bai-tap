# 🎮 Hướng Dẫn Nhanh - Lucky Draw Lì Xì

## 🚀 Bắt Đầu Nhanh

### 1. Mở Project
```
Mở file: index.html trong trình duyệt
Hoặc: Double-click run.bat (Windows)
```

### 2. Load Sample Data (Optional)
Nếu muốn test nhanh mà không cần thêm câu hỏi:
- Mở Developer Console (F12 hoặc Ctrl+Shift+I)
- Dán lệnh này: `loadSampleData()`
- Nhấn Enter
- Reload trang (F5)

### 3. Thêm Câu Hỏi Của Bạn

#### Các bước:
1. Chọn tab **"⚙️ Quản Lý Câu Hỏi"**
2. Điền form như sau:

**Ô "Câu Hỏi":**
```
Ví dụ: Con gái Tết được bao nhiêu cái lì xì?
```

**4 Ô "Đáp Án":**
```
Đáp Án 1: Tùy người tặng
Đáp Án 2: Bao nhiêu tùy ý
Đáp Án 3: Bao nhiêu tùy người nhận
Đáp Án 4: Tất cả đều đúng
```

**Dropdown "Đáp Án Đúng":**
```
Chọn: Tất cả đều đúng
```

**Ô "Lời Chúc":**
```
Chúc bạn may mắn, năm mới xinh đẹp!
```

**Click:** ➕ Thêm Câu Hỏi

### 4. Chơi Game

1. Chọn tab **"🎮 Chơi Game"**
2. Nhìn cây đào 🌳 với các phong bao 🧧
3. Bấm vào phong bao (số 1, 2, 3...)
4. Trả lời câu hỏi hiện ra
5. Chọn 1 đáp án
6. Click "Nộp Câu Trả Lời"
7. Xem kết quả - nếu đúng có lời chúc + confetti ✨

---

## 🎨 Các Tính Năng Chi Tiết

| Tính Năng | Mô Tả |
|-----------|-------|
| 📋 Quản Lý Câu Hỏi | Thêm/xóa câu hỏi dễ dàng |
| 🧧 Phong Bao | Bấm để bốc thăm câu hỏi |
| 🌸 Hoa Đào Rơi | Hiệu ứng hoa nở rơi liên tục |
| ✨ Confetti | Hiệu ứng pháo nếu trả lời đúng |
| 💾 Lưu Dữ Liệu | Tự động lưu trong trình duyệt |
| 📊 Thống Kê | Xem số câu trúng/sai |
| 📱 Mobile Ready | Chạy tốt trên phone |

---

## 🔧 Khắc Phục Sự Cố

### ❌ Không thấy câu hỏi nào
**Giải pháp:**
- Chuyển sang tab "Quản Lý" và thêm câu hỏi
- Hoặc gọi `loadSampleData()` trong console

### ❌ Dữ liệu bị mất
**Giải pháp:**
- Dữ liệu lưu trong localStorage trình duyệt
- Nếu xóa cache/history sẽ mất
- Lưu lại với `loadSampleData()`

### ❌ Phong bao không clickable
**Giải pháp:**
- Tất cả phong bao phải clickable
- Nếu có vấn đề, reload trang F5

### ❌ Font/Hiệu ứng lỗi
**Giải pháp:**
- Xóa cache: Ctrl+Shift+Delete
- Reload: Ctrl+F5 (hard refresh)

---

## 💡 Tips Pro

### 🎯 Mẹo Quản Lý Câu Hỏi
```
✓ Viết câu hỏi rõ ràng, dễ hiểu
✓ Đáp án phải khác nhau tránh nhầm
✓ Lời chúc nên vui vẻ, thân thiện
✓ Test một câu trước khi thêm nhiều
```

### 🎮 Mẹo Chơi Game
```
✓ Bấm phong bao từ trên xuống dưới
✓ Không hối hận, phong bao mở không quay lại
✓ Chơi hết toàn bộ phong bao để biết điểm
✓ Nếu muốn lại, xóa dữ liệu và chơi lại
```

### 🎨 Mẹo Tùy Chỉnh
```
✓ Muốn thêm phong bao: Sửa số trong game.js
✓ Muốn đổi màu: Sửa CSS trong styles.css
✓ Muốn thêm nhạc: Dùng HTML5 audio
```

---

## 📞 Hỗ Trợ

Nếu gặp lỗi:
1. Mở DevTools (F12)
2. Xem Console có error không
3. Reload trang (Ctrl+F5)
4. Xóa localStorage nếu cần

---

**Chúc bạn thành công! 🎉🧧🌸**

Năm mới, cuộc sống mới, may mắn mới! 🎆
