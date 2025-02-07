### Upload Admin Document API

#### **Endpoint:**

`POST /api/admin/upload-document`

#### **Description:**

Uploads a document for an admin user. The document file must be included in the request.

#### **Request Headers:**

| Header        | Type   | Required | Description                           |
| ------------- | ------ | -------- | ------------------------------------- |
| Authorization | String | Yes      | Bearer token for admin authentication |

#### **Request Body:**

| Field    | Type   | Required | Description                                      |
| -------- | ------ | -------- | ------------------------------------------------ |
| category | String | Yes      | Category of the document                         |
| status   | String | Yes      | Status of the document (e.g., pending, approved) |
| file     | File   | Yes      | Document file to be uploaded                     |

#### **Request Example:**

```
POST /api/admin/upload-document
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "category": "Legal",
  "status": "pending",
  "file": "document.pdf"
}
```

#### **Response:**

**Success Response (200 OK):**

```json
{
  "message": "Document uploaded successfully",
  "document": {
    "category": "Legal",
    "fileType": "pdf",
    "fileName": "document.pdf",
    "filePath": "/uploads/document.pdf",
    "uploadedBy": "60f8a8b8b3e8f4a5a8a4c6e5",
    "status": "pending"
  }
}
```

**Error Responses:**

- **400 Bad Request:** Missing required fields or file.

```json
{
  "message": "Document file is required"
}
```

- **400 Bad Request:** Validation error.

```json
{
  "errors": [
    {
      "msg": "Category is required",
      "param": "category",
      "location": "body"
    }
  ]
}
```

- **400 Bad Request:** Server error or invalid admin ID.

```json
{
  "message": "Something went wrong"
}
```

#### **Notes:**

- Ensure the request includes a valid `Bearer token`.
- The document file must be sent as `multipart/form-data`.
- The `filePath` returned in the response should be used to access the uploaded file.
