
## 📌 Mô tả dự án

Dự án mô phỏng một **ứng dụng nhắn tin realtime tương tự Zalo**, tập trung vào realtime, trải nghiệm người dùng và quản lý trạng thái chính xác.

---

## ✨ Tính năng chính

### 🔐 Xác thực & tài khoản
- Đăng nhập bằng **Email/Password**
- Đăng nhập bằng **OAuth (Google, GitHub)**
- Cập nhật thông tin cá nhân (avatar, tên hiển thị, …)
- Hiển thị **trạng thái online/offline theo thời gian thực**

---

### 💬 Nhắn tin
- Nhắn tin **1-1** và **chat nhóm**
- Nhắn tin **realtime với Firestore**
- Hiển thị **tin nhắn mới nhất** và **thời gian gửi (x phút trước, vừa xong, …)**
- Load thêm tin nhắn khi **cuộn lên (infinite scroll)**

---

### 🧩 Tương tác trong chat
- Trả lời **tin nhắn cụ thể trong đoạn chat**
- Chuyển tiếp tin nhắn
- Thu hồi tin nhắn
- Xóa tin nhắn **phía tôi**
- Gửi **emoji trên từng tin nhắn**
- Xem **ai đã gửi emoji**
- Gửi emoji **tùy biến**
- Gửi **ảnh** trong tin nhắn
- Tag / mention tên người dùng trong chat

---

### 👥 Bạn bè & người lạ
- Chat với **người lạ**
- Gửi lời mời kết bạn
- Thu hồi lời mời kết bạn
- Đồng ý / từ chối kết bạn
- Thêm bạn vào nhóm chat

---

### 🗂️ Quản lý room & dữ liệu
- Phân loại room (cá nhân, nhóm, cloud, …)
- Tìm kiếm người dùng / room
- Hiển thị **số tin nhắn chưa đọc**
- Xóa room chat
- Cập nhật thông tin room

---

### ⚡ Realtime & hiệu năng
- Realtime messaging với **Firebase Firestore**
- Tối ưu tải dữ liệu
- Quản lý trạng thái online/offline chính xác
- Hoạt động tốt với **Firebase Emulator** trong môi trường development

---



---

## 📦 Công nghệ sử dụng

| Công nghệ | Mục đích |
|---------|----------|
| React | Frontend UI |
| Firebase Auth | Xác thực |
| Firestore | Database realtime |
| Firebase Emulator | Dev local |
| Firebase Admin | Data migration |
| React Context + Hooks | State management |

---

## 🛠 Cài đặt & Chạy project

### 1. Clone repository

```bash
git clone https://github.com/quangdung861/zalo-app.git
cd zalo-app
```
---

### 2. Cài đặt dependencies

~~~bash
npm install
# hoặc
yarn install
~~~

---

### 3. Cấu hình Firebase

Tạo file `.env` ở thư mục gốc và thêm các biến môi trường:

~~~env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
~~~

---


### 4. Chạy dự án ở môi trường development (kèm Firebase Emulator)

#### 4.1 Chạy Firebase Emulator

Di chuyển vào thư mục chứa cấu hình emulator:

~~~bash
cd emulator
~~~


Chạy Firebase Emulator:

~~~bash
firebase emulators:start
~~~

Sau khi chạy thành công:

- 🔥 **Firestore Emulator**: http://localhost:4000  
- 🔐 **Auth Emulator**: http://localhost:9099  

---

#### 4.2 Chạy ứng dụng React

Mở **terminal mới**, tại thư mục gốc project:

~~~bash
npm start
# hoặc
yarn start
~~~

Ứng dụng sẽ chạy tại:  
👉 http://localhost:3000

---



### 5. Build production

~~~bash
npm run build
# hoặc
yarn build
~~~

---
