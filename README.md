# Hệ thống Quản lý Voucher (Fullstack)

Đây là một dự án full-stack bao gồm Backend xây dựng bằng Java Spring Boot và Frontend bằng Next.js (React).

## Cấu trúc thư mục

- `/VoucherManagementBE`: Mã nguồn cho Backend (Java Spring Boot).
- `/VoucherManagementFE`: Mã nguồn cho Frontend (Next.js).
- `voucher_system.sql`: File SQL để khởi tạo cơ sở dữ liệu.

## Yêu cầu hệ thống

Trước khi bắt đầu, hãy đảm bảo bạn đã cài đặt các công cụ sau:

- **Backend:**
  - JDK 17 hoặc mới hơn
  - Maven 3.8+
  - IDE: IntelliJ IDEA (Khuyên dùng) hoặc Eclipse

- **Frontend:**
  - Node.js 18.x hoặc mới hơn
  - `npm`, `yarn`, hoặc `pnpm`

- **Database:**
  - MySQL 8.x

---

## 🚀 Hướng dẫn cài đặt và chạy

### 1. Cài đặt Cơ sở dữ liệu (Database)

1. **Tạo Database:**
   Mở MySQL và chạy câu lệnh sau để tạo database:
   ```sql
   CREATE DATABASE voucher_system;
   ```

2. **Import dữ liệu:**
   Sử dụng một công cụ quản lý MySQL (như DBeaver, DataGrip, hoặc phpMyAdmin) để import dữ liệu từ file `voucher_system.sql` vào database `voucher_system` vừa tạo. File này chứa cấu trúc bảng và dữ liệu mẫu.

---

### 2. Cài đặt và chạy Backend (Spring Boot)

Đầu tiên, bạn cần cấu hình kết nối Database. Mở file `VoucherManagementBE/src/main/resources/application.properties` và cập nhật thông tin kết nối tới MySQL của bạn:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/voucher_system?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_password  # <-- Thay bằng mật khẩu MySQL của bạn
```

#### ▶ Cách 1: Chạy bằng IntelliJ IDEA (Khuyên dùng khi mới pull code)

1. Mở IntelliJ IDEA.
2. Chọn **File → Open...** và trỏ đến thư mục `VoucherManagementBE` (hoặc trực tiếp file `pom.xml` bên trong thư mục đó) → Chọn **Open as Project**.
3. Chờ một lát để IntelliJ IDEA tự động nhận diện project Maven và tải các thư viện (dependencies) về máy. Bạn có thể theo dõi tiến trình ở góc dưới cùng bên phải màn hình.
4. Kiểm tra cấu hình Java: Vào **File → Project Structure → Project**, đảm bảo `SDK` đang được chọn là **Java 17**.
5. Trong cây thư mục bên trái, tìm đến class main của ứng dụng (thường nằm ở `src/main/java/.../VoucherManagementBeApplication.java`).
6. Click chuột phải vào file này và chọn **Run 'VoucherManagementBeApplication'** (hoặc nhấn nút ▶ Play màu xanh lá ở thanh toolbar trên cùng).

> Backend sẽ khởi động và chạy tại: `http://localhost:8080`

#### ▶ Cách 2: Chạy bằng Command Line (Terminal)

1. Di chuyển vào thư mục Backend:
   ```bash
   cd VoucherManagementBE
   ```

2. Sử dụng Maven để chạy ứng dụng:
   ```bash
   mvn spring-boot:run
   ```

> Backend sẽ khởi động và chạy tại: `http://localhost:8080`

---

### 3. Cài đặt và chạy Frontend (Next.js)
1. **Di chuyển vào thư mục Frontend:**
   Mở một cửa sổ terminal mới và di chuyển vào thư mục `VoucherManagementFE`:
   ```bash
   cd VoucherManagementFE
   ```

2. **Cài đặt dependencies (Bắt buộc khi mới pull code):**
   Chạy một trong các lệnh sau (tùy thuộc vào package manager bạn dùng) để tải các gói thư viện cần thiết:
   ```bash
   npm install
   # hoặc: yarn install
   # hoặc: pnpm install
   ```

3. **Chạy ứng dụng Frontend:**
   Sau khi cài đặt xong thư viện, tiến hành khởi động server development:
   ```bash
   npm run dev
   # hoặc: yarn dev
   # hoặc: pnpm dev
   ```

> Frontend sẽ chạy tại: `http://localhost:3000`

---

## 🎉 Hoàn tất!

Bây giờ bạn có thể mở trình duyệt và truy cập `http://localhost:3000` để sử dụng ứng dụng.

| Service  | URL                    |
|----------|------------------------|
| Frontend | http://localhost:3000  |
| Backend  | http://localhost:8080  |