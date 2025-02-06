# Driver Profile Image Upload API

## Endpoint Details

- **URL**: `/api/driver/uploadImage`
- **Method**: `POST`
- **Auth**: Required (JWT Token)
- **Content-Type**: multipart/form-data

## Request Format

### Headers

{
"Authorization": "Bearer <your_jwt_token>" or cookie
}

### Body Parameters

| Parameter | Type   | Required | Description                   |
| --------- | ------ | -------- | ----------------------------- |
| image     | File   | Yes      | Image file (JPG/PNG/JPEG)     |
| driverId  | String | No       | Admin only - target driver ID |

## Response Formats

### Success Response (200 OK)

```json
{
  "message": "Profile image uploaded successfully",
  "driver": {
    "_id": "string",
    "fullname": "string",
    "email": "string",
    "image": "/upload/filename.jpg",
    "status": "string",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

### Error Responses

#### No Image (400 Bad Request)

```json
{
  "message": "Profile image is required"
}
```

#### Not Found (404)

```json
{
  "message": "Driver not found"
}
```

#### Unauthorized (401)

```json
{
  "message": "Access denied. No token provided"
}
```

## Example Usage

### Using Axios

```javascript
const uploadImage = async (imageFile, driverId = null) => {
  const formData = new FormData();
  formData.append("image", imageFile);
  if (driverId) formData.append("driverId", driverId);

  try {
    const response = await axios.post(
      "http://localhost:3001/api/driver/uploadImage",
      formData,
      {
        headers: {
          Authorization: `Bearer ${yourJWTToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
```
