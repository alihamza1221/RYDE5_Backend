# Request OTP API Documentation

## Endpoint Details

- **URL**: `/api/driver/request-otp`
- **Method**: `POST`
- **Auth**: Required (JWT Token)

## Request Format

### Headers

{
"Authorization": "Bearer <your_jwt_token>"
}

### Body

{
"driverId": "string" // Optional: Admin only - to request OTP for specific driver
}

## Response Formats

### Success (200 OK)

{
"message": "otp successfully sent to your email"
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
  "message": "Error message" // Various error messages
  }

## Example Usage with Axios

```json
const requestOTP = async (driverId = null) => {
try {
const response = await axios.post(
'http://localhost:3000/driver/request-otp',
{ driverId },
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
// Request OTP for self
await requestOTP();

// Request OTP for specific driver (Admin only)
await requestOTP("driver123");
```

## Notes

- JWT token required in Authorization header
- Driver receives OTP on registered email
- OTP is valid for limited time
- Previous OTP becomes invalid when new one is requested
- Admin can request OTP for any driver using driverId
