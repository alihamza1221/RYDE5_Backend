# Verify Driver Documents API

## Endpoint Details

- **URL**: `/api/admin/verify-driver-docs`
- **Method**: `POST`
- **Auth**: Admin only (JWT required)

### Headers

````json
{
  "Authorization": "Bearer <admin_jwt_token>",
  "Content-Type": "application/json"
}

Body


```json
{
  "email": "string",        // Required
  "docType": "string",      // Required, enum: ["driverLicense", "carInsurance"]
  "status": "boolean"       // Required, true or false
}

````

Response Formats
Success (200 OK)

```json
{
  "message": "driverLicense verification status updated successfully",
  "driver": {
    "_id": "string",
    "email": "string",
    "docs": {
      "driverLicense": {
        "isVerified": true
      }
    }
  }
}
```

Error Responses
Invalid Input (400 Bad Request)

```json
{
  "message": "email, docType, and status are required"
}
```

Invalid Document Type (400 Bad Request)

```json
{
  "message": "Invalid document type"
}
```

Driver Not Found (404)

```json
{
  "message": "Driver not found"
}
```

```javascript
const verifyDriverDocs = async (email, docType, status) => {
  try {
    const response = await axios.post(
      "/api/admin/verifyDriverDocs",
      {
        email,
        docType,
        status,
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Usage Example
await verifyDriverDocs("driver@example.com", "driverLicense", true);
```
