# Delete User/Driver API Documentation

## Endpoint Details

- **URL**: `/api/admin/delete-user`
- **Method**: `POST`
- **Auth**: Admin Only (JWT Required)

## Request Format

### Headers

```json
{
  "Authorization": "Bearer <admin_jwt_token>"
}
```

## Body

```json
{
  "userId": "string", // Required: ID of user/driver to delete
  "identity": "user|driver" // Required: Type of account
}
```

## res

```json
{
  "message": "user/driver deleted successfully",
  "deletedUser": {
    "_id": "string",
    "fullname": "string",
    "email": "string",
    "status": "string",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```
