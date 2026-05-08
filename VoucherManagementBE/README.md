# Voucher Management System - Backend

Hệ thống quản lý Voucher khuyến mãi được xây dựng trên Spring Boot, áp dụng Clean Architecture kết hợp Domain-Driven Design (DDD).

## Tech Stack

- **Java** 17+
- **Spring Boot** 4.x
- **Spring Data JPA** (Hibernate)
- **MySQL** 8.x
- **Lombok**
- **Jakarta Validation**

## Kiến trúc (Clean Architecture + DDD)

```
src/main/java/com/example/vouchermanagementbe/
├── core/                          # Core chung
│   ├── ApiResponse.java           # Response chuẩn hóa
│   ├── PageResponse.java          # Phân trang
│   └── exception/
│       └── GlobalExceptionHandler.java
│
├── module/
│   ├── user/                      # Module User
│   │   ├── domain/
│   │   │   ├── entity/User.java
│   │   │   └── repository/UserRepositoryPort.java
│   │   ├── application/
│   │   │   ├── dto/
│   │   │   ├── usecase/UserUseCase.java
│   │   │   └── service/UserService.java
│   │   ├── infrastructure/
│   │   │   ├── entity/UserEntity.java
│   │   │   ├── repository/UserJpaRepository.java
│   │   │   └── adapter/UserRepositoryAdapter.java
│   │   └── presentation/
│   │       └── UserController.java
│   │
│   └── voucher/                   # Module Voucher
│       ├── domain/
│       │   ├── entity/
│       │   │   ├── Voucher.java
│       │   │   ├── VoucherStatus.java
│       │   │   └── VoucherUsage.java
│       │   └── repository/
│       │       ├── IVoucherRepository.java
│       │       └── IVoucherUsageRepository.java
│       ├── application/
│       │   ├── dto/
│       │   ├── usecase/
│       │   └── service/
│       │       ├── VoucherService.java
│       │       └── VoucherUsageService.java
│       ├── infrastructure/
│       │   ├── entity/
│       │   ├── repository/
│       │   └── adapter/
│       └── presentation/
│           ├── VoucherController.java
│           └── VoucherUsageController.java
```

## Yêu cầu hệ thống

- JDK 17 trở lên
- MySQL 8.x
- Maven 3.8+

## Hướng dẫn cài đặt & chạy

### 1. Tạo Database MySQL

```sql
CREATE DATABASE voucher_system;
```

### 2. Cấu hình kết nối

Mở file `src/main/resources/application.properties` và chỉnh sửa thông tin kết nối:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/voucher_system?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_password
```

### 3. Chạy ứng dụng

```bash
# Chạy bằng Maven
mvn spring-boot:run

# Hoặc build JAR rồi chạy
mvn clean package
java -jar target/VoucherManagementBE-0.0.1-SNAPSHOT.jar
```

Ứng dụng sẽ chạy tại: `http://localhost:8080`

## Danh sách API

### User API

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| `GET` | `/users?pageNo=0&pageSize=10` | Lấy danh sách user (phân trang) |
| `POST` | `/users` | Tạo user mới |

**POST /users** - Body:
```json
{
  "fullName": "Nguyễn Văn A",
  "email": "nguyenvana@gmail.com",
  "phone": "0901234567"
}
```

### Voucher API

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| `GET` | `/vouchers?pageNo=0&pageSize=10` | Lấy danh sách voucher (phân trang) |
| `GET` | `/vouchers/search?code=ABC` | Tìm voucher theo mã code |
| `POST` | `/vouchers` | Tạo voucher mới |
| `PUT` | `/vouchers/{id}` | Cập nhật voucher |
| `DELETE` | `/vouchers/{id}` | Xóa voucher |

**POST /vouchers** - Body:
```json
{
  "code": "SUMMER2026",
  "discountPercent": 20,
  "quantity": 100,
  "expiredDate": "2026-12-31"
}
```

**PUT /vouchers/{id}** - Body:
```json
{
  "discountPercent": 30,
  "quantity": 50,
  "expiredDate": "2026-12-31",
  "status": "ACTIVE"
}
```

### Voucher Usage API

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| `GET` | `/voucher-usages?pageNo=0&pageSize=10` | Xem lịch sử sử dụng voucher |
| `POST` | `/voucher-usages` | Sử dụng voucher |

**POST /voucher-usages** - Body:
```json
{
  "userId": 1,
  "voucherId": 1
}
```

## Response Format

### Success
```json
{
  "success": true,
  "message": "Success",
  "data": { ... }
}
```

### Error
```json
{
  "success": false,
  "message": "Lý do lỗi...",
  "data": null
}
```

## Business Rules (Voucher Usage)

Khi sử dụng voucher (`POST /voucher-usages`), hệ thống sẽ kiểm tra:

1. **User phải tồn tại** — Trả lỗi `"User not found"`
2. **Voucher phải tồn tại** — Trả lỗi `"Voucher not found"`
3. **Voucher không được INACTIVE** — Trả lỗi `"Voucher is INACTIVE"`
4. **Voucher không được hết hạn** — Trả lỗi `"Voucher is expired"`
5. **Voucher phải còn số lượng** — Trả lỗi `"Voucher is out of stock"`

Nếu tất cả hợp lệ → giảm `quantity` đi 1 và ghi lịch sử vào bảng `voucher_usages` (trong `@Transactional`).

## Logging

Hệ thống sử dụng **SLF4J** (qua Lombok `@Slf4j`) với các mức log:

- `INFO` — Ghi nhận các thao tác chính (tạo, sửa, xóa, sử dụng voucher)
- `WARN` — Ghi nhận lỗi nghiệp vụ (email trùng, voucher hết hạn...)
- `ERROR` — Ghi nhận lỗi hệ thống không mong muốn
