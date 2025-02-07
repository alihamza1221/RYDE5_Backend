#url : `/admin`

## Authentication

All authenticated routes require a JWT token in:

- Cookie named "token" OR
- Authorization header: `Bearer <token>`

## Endpoints

# Admin Registration API

## Register New Admin

Create a new admin account.

### Endpoint

- **URL**: `/api/admin/register`
- **Method**: `POST`
- **Auth Required**: No

### Request Body

```json
{
  "password": "admin123"
}
```

### 1. Login Admin

Authenticate an admin user.

**Endpoint:** `/login`
**Method:** `POST`
**Auth Required:** No

**Request Body:**

```json
{
  "password": "admin123"
}
```

# Success Response

```json
{
  "token": "jwt_token_here",
  "admin": {
    "email": "admin@example.com",
    "fullname": "Admin User"
  }
}
```

# Error Responses

```json
{
  "errors": [
    {
      "msg": "Password is required",
      "param": "password"
    }
  ]
}
```

# Status: 401 Unauthorized

```json
{
  "message": "Invalid password"
}
```

## 2. Get Admin Profile

`admin/profile`

- Method: GET Auth Required: Yes

## 3. Logout Admin

`admin/logout`

- `Authorization: Bearer <token>`

# response

```json
{
  "message": "Logged out"
}
```
