# วิธีการใช้งาน Postman เรียก API (API Testing Guide)

เนื่องจาก Backend ของคุณรันอยู่ที่ `localhost:3000` คุณสามารถใช้ Postman ในเครื่องเรียกใช้งานได้ทันทีตามขั้นตอนดังนี้ครับ:

## 1. วิธีเข้าสู่ระบบ (Login) เพื่อรับ Token
ต้องเริ่มที่นี่ก่อน เพราะ API ส่วนใหญ่ต้องมีรหัสยืนยัน (Token) ถึงจะเรียกได้ครับ

*   **Method:** `POST`
*   **URL:** `http://localhost:3000/api/auth/login`
*   **Body (JSON):**
    ```json
    {
        "username": "admin",
        "password": "password123"
    }
    ```
*   **ผลลัพธ์:** คุณจะได้ `"token": "xxxxxxx..."` กลับมา ให้ก๊อปปี้เก็บไว้ครับ

---

## 2. วิธีใส่ Token ใน Postman (สำคัญมาก)
สำหรับ API ที่ต้องการสิทธิ์ (เช่น การเพิ่มหนังสือ หรือการยืม) ให้ไปที่แท็บ **Authorization** ใน Postman:
1.  เลือก Type เป็น **Bearer Token**
2.  วาง **Token** ที่ก๊อปปี้มาจากขั้นตอนที่ 1 ลงในช่อง Token

---

## 3. รายการ API ที่น่าสนใจสำหรับทดสอบ

| ลำดับ | การทำงาน | Method | URL | ตัวอย่าง Body (ถ้ามี) |
| :--- | :--- | :--- | :--- | :--- |
| 1 | ดูรายชื่อสมาชิกทั้งหมด | `GET` | `http://localhost:3000/api/auth/users` | - |
| 2 | ดูรายชื่อหนังสือทั้งหมด | `GET` | `http://localhost:3000/api/books` | - |
| 3 | เพิ่มหนังสือใหม่ (Admin) | `POST` | `http://localhost:3000/api/books` | `{"title": "Test Book", "author": "Antigravity"}` |
| 4 | ยืมหนังสือ | `POST` | `http://localhost:3000/api/transactions/borrow` | `{"bookId": "ไอดีของหนังสือที่ต้องการยืม"}` |
| 5 | คืนหนังสือ | `POST` | `http://localhost:3000/api/transactions/return` | `{"bookId": "ไอดีของหนังสือที่ต้องการคืน"}` |
| 6 | ดูประวัติของตัวเอง | `GET` | `http://localhost:3000/api/transactions/history` | - |

---

## 4. ตัวอย่างการดึงรายชื่อสมาชิก (GET Users)
1.  เลือก Method: **GET**
2.  URL: `http://localhost:3000/api/auth/users`
3.  แท็บ Authorization: เลือก **Bearer Token** แล้วใส่ Token ของ Admin
4.  กด **Send** จะเห็นรายชื่อสมาชิกทั้งหมดที่เป็น JSON ครับ
