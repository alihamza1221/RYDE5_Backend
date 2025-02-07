# Search Admin Documents API

## Endpoint Details

- **URL**: `/api/admin/search-documents`
- **Method**: `GET`
- **Auth**: Admin only (JWT required)

## Request Format

### Headers

```json
{
  "Authorization": "Bearer <admin_jwt_token>" | "cookies"
}
```

### Search Admin Documents API

#### **Endpoint:**

`GET /api/admin/searchDocuments?fileName=<query>`

#### **Description:**

Searches for admin documents by file name.

#### **Request Headers:**

| Header        | Type   | Required | Description                           |
| ------------- | ------ | -------- | ------------------------------------- |
| Authorization | String | Yes      | Bearer token for admin authentication |

#### **Query Parameters:**

| Parameter | Type   | Required | Description                    |
| --------- | ------ | -------- | ------------------------------ |
| fileName  | String | Yes      | Name of the document to search |

#### **Request Example:**

```
GET /api/admin/searchDocuments?fileName=document.pdf
Authorization: Bearer <token>
```

#### **Response:**

**Success Response (200 OK):**

```json
{
  "documents": [
    {
      "category": "Legal",
      "fileType": "pdf",
      "fileName": "document.pdf",
      "filePath": "/uploads/document.pdf",
      "uploadedBy": "60f8a8b8b3e8f4a5a8a4c6e5",
      "status": "approved"
    }
  ],
  "totalDocuments": 1
}
```

**Error Responses:**

- **400 Bad Request:** Missing query parameter.

```json
{
  "documents": [],
  "count": 0,
  "message": "fileName query parameter is required"
}
```

- **400 Bad Request:** Server error.

```json
{
  "message": "Something went wrong"
}
```

#### **Notes:**

- Ensure the request includes a valid `Bearer token`.
- The `fileName` query must be provided for the search to work.
