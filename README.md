# Nhom18_Admin

Ứng dụng **Admin Panel** cho dự án của Nhóm 18 — hỗ trợ quản lý toàn bộ hệ thống bao gồm người dùng, bài viết, bình luận, báo cáo và thống kê.

---

## 🚀 Tính năng chính

- Đăng nhập/đăng xuất với quyền Admin
- Dashboard: xem thống kê chung (người dùng, hoạt động, bài viết,...)
- Quản lý người dùng: xem danh sách, khóa/mở khóa
- Quản lý bài viết: tìm kiểm, ẩn, hiện bài viết
- Quản lý bình luận: tìm kiểm, ẩn, hiện bình luận
- Quản lý báo cáo: xem danh sách, xử lí báo cáo người dùng, bình luận, bài viết

---

## 🛠️ Công nghệ sử dụng

| Phần          | Công nghệ                    |
| ------------- | ---------------------------- |
| Frontend      | Next.js, Tailwind CSS, Axios |
| Backend       | Nest.js, MongoDB             |
| Giao tiếp API | RESTful API, xác thực JWT    |

---

## 📂 Cấu trúc thư mục

```
/
├─ backend/      ← mã nguồn phía server
└─ frontend/     ← mã nguồn phía client
```

## 🧑‍💻 Hướng dẫn chạy dự án (Local)

### 1. Clone repository

```bash
git clone https://github.com/daithien2004/Nhom18_Admin.git
cd Nhom18_Admin
```

### 2. Cài đặt và chạy backend

```bash
cd backend
npm install
# cấu hình file env (.env) với thông số kết nối PORT, MONGO_URI, EMAIL_USER, EMAIL_PASS, JWT_ACCESS_SECRET, ACCESS_TOKEN_EXPIRES_IN, FRONTEND_URL
npm run start:dev
```

### 3. Cài đặt và chạy frontend

```bash
cd ../frontend
npm install
# cấu hình file env (.env) với thông số kết nối NEST_API_URL, NEXTAUTH_SECRET
npm run dev
```

### 4. Truy cập ứng dụng

Mở trình duyệt và truy cập `http://localhost:3000` (ví dụ)

---

## ✅ Hướng tiếp theo / nâng cấp

- Thêm xác thực 2 lớp (2FA) cho tài khoản quản trị
- Ghi nhật ký (audit log) – lưu lịch sử hoạt động admin
- Hệ thống phân quyền chi tiết (RBAC) – nhiều mức quyền hơn
- Dashboard realtime – biểu đồ cập nhật ngay khi người dùng tương tác
- Triển khai production: Docker Compose, SSL, domain riêng, auto-backup database
- Viết kiểm thử tự động (UnitTest + IntegrationTest) cho backend & frontend

---

## 👥 Nhóm phát triển

- Thành viên: [Quảng Đại Thiện]
- Thành viên: [Nguyễn Tuấn Thành]
- Thành viên: [Huỳnh Thái Toàn]

---
