### Update User Information API

#### **Endpoint:**

`PATCH /api/user/updateUserInfo`

#### **Description:**

Updates user information such as email and phone number.

#### **Request Headers:**

| Header        | Type   | Required | Description                           |
| ------------- | ------ | -------- | ------------------------------------- |
| Authorization | String | Yes      | Bearer token or Cookie authentication |

#### **Request Body:**

| Parameter | Type   | Required | Description                              |
| --------- | ------ | -------- | ---------------------------------------- |
| email     | String | No       | New email address (must be valid format) |
| phone     | String | No       | New phone number (minimum 10 digits)     |

#### **Request Example:**

```json
{
  "email": "newemail@example.com",
  "phone": "1234567890"
}
```

#### **Response:**

**Success Response (200 OK):**

```json
{
  "message": "User information updated successfully",
  "user": {
    "_id": "60f8a8b8b3e8f4a5a8a4c6e5",
    "email": "newemail@example.com",
    "phoneNo": "1234567890"
  }
}
```

**Error Responses:**

- **400 Bad Request:** Invalid input.

```json
{
  "message": "Invalid email format"
}
```

- **404 Not Found:** User not found.

```json
{
  "message": "User not found"
}
```

- **400 Bad Request:** Server error.

```json
{
  "message": "Something went wrong"
}
```

#### **Notes:**

- Ensure the request includes a valid `Bearer token` or `Cookie` authentication.
- Only the provided fields (`email`, `phone`) will be updated.
- The `email` must be a valid email format.
- The `phone` must be at least 10 digits long.
