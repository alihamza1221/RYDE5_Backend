# Set User Status API Documentation

## Endpoint Details

- **URL**: `/api/admin/set-user-status`
- **Method**: `POST`
- **Auth**: Admin Only

## Request Format

### Headers

```json
{
  "Authorization": "Bearer <admin_jwt_token>" | cookies
}
```

```json
{
  "userId": "string", // Required: User/Driver ID
  "identity": "user|driver", // Required: Type of user
  "status": "active|inactive" // Required: New status
}
```

### response

```json
{
  "message": "user/driver status updated successfully",
  "user": {
    "_id": "string",
    "fullname": "string",
    "email": "string",
    "status": "active|inactive",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```
