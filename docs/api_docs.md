# API Documentation

Base URL: `http://localhost:3000/api`

## Authentication

### Register
- **URL**: `/auth/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "username": "user1",
    "password": "password",
    "role": "user" // or "admin"
  }
  ```
- **Response**: `201 Created` with Token

### Login
- **URL**: `/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "username": "user1",
    "password": "password"
  }
  ```
- **Response**: `200 OK` with Token

## Books

### Get All Books
- **URL**: `/books`
- **Method**: `GET`
- **Response**: `200 OK` List of books

### Create Book (Admin)
- **URL**: `/books`
- **Method**: `POST`
- **Header**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "title": "Book Title",
    "author": "Author Name"
  }
  ```

### Update Book (Admin)
- **URL**: `/books/:id`
- **Method**: `PUT`
- **Header**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "title": "Updated Title",
    "author": "Updated Author"
  }
  ```

### Delete Book (Admin)
- **URL**: `/books/:id`
- **Method**: `DELETE`
- **Header**: `Authorization: Bearer <token>`


## Transactions

### Borrow Book
- **URL**: `/transactions/borrow`
- **Method**: `POST`
- **Header**: `Authorization: Bearer <token>`
- **Body**: `{"bookId": "..."}`

### Return Book
- **URL**: `/transactions/return`
- **Method**: `POST`
- **Header**: `Authorization: Bearer <token>`
- **Body**: `{"bookId": "..."}`

### History
- **URL**: `/transactions/history`
- **Method**: `GET`
- **Header**: `Authorization: Bearer <token>`
