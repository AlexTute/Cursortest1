# API Keys CRUD API Documentation

## Overview
This API provides comprehensive CRUD operations for managing API keys with usage tracking, validation, and security features.

## Base URL
```
/api/keys
```

## Authentication
All endpoints require proper Supabase service role configuration.

## Endpoints

### 1. List All API Keys
**GET** `/api/keys`

Returns a list of all API keys with their usage information.

#### Response
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "My API Key",
      "key": "ak_1234567890_abcdefghijklmnop",
      "usageLimit": 1000,
      "usageCount": 150,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 2. Create New API Key
**POST** `/api/keys`

Creates a new API key with optional usage limit.

#### Request Body
```json
{
  "name": "My New API Key",
  "usageLimit": 1000
}
```

#### Validation Rules
- `name`: Required, 2-50 characters
- `usageLimit`: Optional, 1-1,000,000 range

#### Response
```json
{
  "data": {
    "id": "uuid",
    "name": "My New API Key",
    "key": "ak_1234567890_abcdefghijklmnop",
    "usageLimit": 1000,
    "usageCount": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Get Single API Key
**GET** `/api/keys/[id]`

Retrieves details of a specific API key.

#### Response
```json
{
  "data": {
    "id": "uuid",
    "name": "My API Key",
    "key": "ak_1234567890_abcdefghijklmnop",
    "usageLimit": 1000,
    "usageCount": 150,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Update API Key
**PATCH** `/api/keys/[id]`

Updates an existing API key's name and/or usage limit.

#### Request Body
```json
{
  "name": "Updated API Key Name",
  "usageLimit": 2000
}
```

#### Response
```json
{
  "data": {
    "id": "uuid",
    "name": "Updated API Key Name",
    "key": "ak_1234567890_abcdefghijklmnop",
    "usageLimit": 2000,
    "usageCount": 150,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### 5. Delete API Key
**DELETE** `/api/keys/[id]`

Permanently deletes an API key.

#### Response
```json
{
  "data": {
    "id": "uuid",
    "name": "Deleted API Key",
    "key": "ak_1234567890_abcdefghijklmnop",
    "usageLimit": 1000,
    "usageCount": 150,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 6. Increment Usage Count
**POST** `/api/keys/[id]/usage`

Increments the usage count for an API key.

#### Request Body
```json
{
  "increment": 1
}
```

#### Response
```json
{
  "data": {
    "id": "uuid",
    "name": "My API Key",
    "key": "ak_1234567890_abcdefghijklmnop",
    "usageLimit": 1000,
    "usageCount": 151,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### 7. Reset Usage Count
**DELETE** `/api/keys/[id]/usage`

Resets the usage count to zero.

#### Response
```json
{
  "data": {
    "id": "uuid",
    "name": "My API Key",
    "key": "ak_1234567890_abcdefghijklmnop",
    "usageLimit": 1000,
    "usageCount": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "API key name is required"
}
```

### 404 Not Found
```json
{
  "error": "API key not found"
}
```

### 429 Too Many Requests
```json
{
  "error": "Usage limit exceeded",
  "currentUsage": 1000,
  "limit": 1000,
  "remaining": 0
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Utility Functions

### validateApiKey(apiKey)
Validates an API key and returns its details.

### incrementApiKeyUsage(apiKey, increment)
Increments usage count for an API key.

### generateApiKey(prefix)
Generates a secure API key with timestamp and random components.

### isValidApiKeyFormat(apiKey)
Checks if an API key has a valid format.

## Database Schema

```sql
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  value TEXT UNIQUE NOT NULL,
  usage INTEGER,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Security Features

1. **Secure Key Generation**: Uses timestamp + multiple random components
2. **Usage Tracking**: Prevents exceeding limits
3. **Input Validation**: Comprehensive validation on all inputs
4. **Error Handling**: Detailed error messages and logging
5. **Rate Limiting**: Built-in usage limit enforcement

## Usage Examples

### JavaScript/Node.js
```javascript
// Create API key
const response = await fetch('/api/keys', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'My API Key',
    usageLimit: 1000
  })
});

// Validate API key
const validation = await validateApiKey('ak_1234567890_abcdefghijklmnop');
if (validation.valid) {
  console.log('Key is valid:', validation.keyData);
}
```

### cURL
```bash
# List all keys
curl -X GET http://localhost:3000/api/keys

# Create new key
curl -X POST http://localhost:3000/api/keys \
  -H "Content-Type: application/json" \
  -d '{"name": "My Key", "usageLimit": 1000}'

# Update key
curl -X PATCH http://localhost:3000/api/keys/uuid \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Key"}'
```
