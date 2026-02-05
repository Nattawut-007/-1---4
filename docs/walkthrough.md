# Book Borrowing System - Walkthrough

## Prerequisites
- Docker & Docker Compose
- Node.js & npm
- Repo setup (completed)

## 1. Start Backend & Database
The backend and MongoDB are containerized.
1. Open a terminal in the root directory.
2. Run:
   ```powershell
   docker-compose up --build
   ```
   Wait until you see "Server is running on port 3000" and "MongoDB connected".

## 2. Start Frontend (Mobile App)
1. Open a new terminal.
2. Navigate to `frontend`:
   ```powershell
   cd frontend
   ```
3. Start Expo:
   ```powershell
   npx expo start
   ```
4. Scan the QR code with your phone (Expo Go app) or press `a` for Android Emulator / `i` for iOS Simulator.

## 3. Verify Features
### Authentication
- **Register**: Create a new user (select 'User' or 'Admin' role).
- **Login**: Log in with the created credentials.

### User Features
- **Home**: View list of books.
- **Borrow**: Click "Borrow" on an available book.
- **History**: Check "History" tab to see your transactions.
- **Return**: Click "Return" in the History tab (if borrowed).

### Admin Features
- **Dashboard**: Use Admin account to view currently borrowed books.
- **Manage Books**: Add new books or delete text.
- **Users**: View user list (placeholder).

## 4. วิธีการอัปโหลดขึ้น GitHub (Git Upload)
หากต้องการส่งงานผ่าน GitHub ให้ใช้คำสั่งดังนี้ครับ:
1. **git init** (สร้างโฟลเดอร์ git)
2. **git add .** (เลือกไฟล์ทั้งหมด)
3. **git commit -m "Finish Project"** (บันทึกการแก้ไข)
4. **git remote add origin [URL ของคุณ]** (เชื่อมกับเว็บ GitHub)
5. **git push -u origin main** (ส่งไฟล์ขึ้นเว็บ)

## 5. การรัน Unit Tests (Backend)
ตรวจสอบระบบหลังบ้านด้วยคำสั่ง:
```powershell
docker-compose exec backend npm test
```

## 6. การทดสอบ API ด้วย Postman (อาจารย์แนะนำ)
คุณสามารถใช้ Postman ทดสอบ API ได้โดยตรงผ่าน URL: `http://localhost:3000/api`

1.  **Login**: ส่ง `POST` ไปที่ `/auth/login` เพื่อรับ Token
2.  **Authorization**: ใน Postman เลือกแท็บ **Authorization** -> **Bearer Token** แล้ววาง Token ที่ได้
3.  **Endpoints สำหรับทดสอบ**:
    - `GET /auth/users` : ดูรายชื่อสมาชิก
    - `GET /books` : ดูรายการหนังสือ
    - `POST /books` : เพิ่มหนังสือ (Admin เท่านั้น)

อ่านคู่มือฉบับเต็มได้ที่: [postman_guide.md](file:///C:/Users/A574/.gemini/antigravity/brain/1571d77b-8704-4c73-a941-44c404502a2d/postman_guide.md)

## 7. การดูข้อมูลในฐานข้อมูล (Database)
ฐานข้อมูลรันอยู่ใน Docker (Port 27018) สามารถดูได้ 3 วิธี:

### วิธีที่ 1: ดูผ่านคำสั่ง Docker (Terminal)
เปิด Terminal แล้วพิมพ์:
```powershell
docker-compose exec mongo mongosh library --eval "db.users.find().pretty()"
```

### วิธีที่ 2: ดูผ่าน MongoDB Compass (GUI)
1. เปิดโปรแกรม MongoDB Compass
2. เชื่อมต่อที่: `mongodb://localhost:27018`
3. เลือก Database ชื่อ `library`

### วิธีที่ 3: ดูผ่าน Browser (Raw JSON)
- รายการหนังสือ: [http://localhost:3000/api/books](http://localhost:3000/api/books)
