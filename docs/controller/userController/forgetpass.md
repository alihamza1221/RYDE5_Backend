# Forgot Password API

## Endpoint Details

- **URL**: `/api/user/forgot-password`
- **Method**: `POST`
- **Auth**: Not required

### Headers

```json
{
  "Content-Type": "application/json"
}
```

body

```json
{
  "email": "string" // Required
}
```

Response Formats
Success (200 OK)

```json
{
  "message": "New password has been sent to your email"
}
```

Invalid Email (400 Bad Request)

{
"message": "Invalid email format"
}
user not found
{
"message": "User not found"
}
