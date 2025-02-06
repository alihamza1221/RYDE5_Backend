# Set Two-Factor Authentication API

## Endpoint Details

- **URL**: `/api/user/2fa/toggle`
- **Method**: `POST`
- **Auth**: Required (JWT Token)

## Request Format

### Headers

{
"Authorization": "Bearer <your_jwt_token>" or cookie
}

### Body

```json
{
"status": boolean, // true to enable, false to disable 2FA
"userId": string // Optional: Admin only - to toggle other user's 2FA
}
```

## Response Formats

### Success (200 OK)

{
"message": "2FA setup status changed to true"
}

### Errors

- 401 Unauthorized
  {
  "message": "Access denied. No token provided"
  }

- 404 Not Found
  {
  "message": "Unmatched fields error"
  }

- 400 Bad Request
  {
  "message": "Invalid input" // Various error messages
  }

## Example Usage with Axios

```json
const toggle2FA = async (status, userId = null) => {
try {
const response = await axios.post(
'http://localhost:3001/api/user/2fa/toggle',
{
status,
userId
},
{
headers: {
'Authorization': `Bearer ${yourJWTToken}`,
'Content-Type': 'application/json'
}
}
);
return response.data;
} catch (error) {
throw error.response.data;
}
};

// Usage Examples:
// Enable 2FA for self
await toggle2FA(true);

// Disable 2FA for another user (Admin only)
await toggle2FA(false, "user123");
```

## Notes

- JWT token required in Authorization header
- Admin can toggle any user's 2FA using userId
- Regular users can only toggle their own 2FA
- Status must be boolean
- Changes take effect immediately

```

```
