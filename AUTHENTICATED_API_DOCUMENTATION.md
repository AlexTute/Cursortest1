# Authenticated API Keys CRUD API Documentation

## Overview
This API provides user-specific CRUD operations for managing API keys. All endpoints require authentication via JWT token in the Authorization header.

## Authentication
All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Base URL
```
/api/user/api-keys
```

## Endpoints

### 1. List User's API Keys
**GET** `/api/user/api-keys`

Returns all API keys belonging to the authenticated user.

#### Headers
```
Authorization: Bearer <jwt-token>
```

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
**POST** `/api/user/api-keys`

Creates a new API key for the authenticated user.

#### Headers
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

#### Request Body
```json
{
  "name": "My New API Key",
  "usageLimit": 1000
}
```

#### Validation Rules
- `name`: Required, 2-50 characters, must be unique per user
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
**GET** `/api/user/api-keys/[id]`

Retrieves details of a specific API key belonging to the authenticated user.

#### Headers
```
Authorization: Bearer <jwt-token>
```

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
**PATCH** `/api/user/api-keys/[id]`

Updates an existing API key belonging to the authenticated user.

#### Headers
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

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
**DELETE** `/api/user/api-keys/[id]`

Permanently deletes an API key belonging to the authenticated user.

#### Headers
```
Authorization: Bearer <jwt-token>
```

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
**POST** `/api/user/api-keys/[id]/usage`

Increments the usage count for an API key belonging to the authenticated user.

#### Headers
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

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
**DELETE** `/api/user/api-keys/[id]/usage`

Resets the usage count to zero for an API key belonging to the authenticated user.

#### Headers
```
Authorization: Bearer <jwt-token>
```

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

### 8. Validate API Key
**POST** `/api/user/api-keys/validate`

Validates an API key and returns its details if it belongs to the authenticated user.

#### Headers
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

#### Request Body
```json
{
  "apiKey": "ak_1234567890_abcdefghijklmnop"
}
```

#### Response
```json
{
  "valid": true,
  "keyData": {
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

## Error Responses

### 400 Bad Request
```json
{
  "error": "API key name is required"
}
```

### 401 Unauthorized
```json
{
  "error": "Missing or invalid authorization header"
}
```

### 404 Not Found
```json
{
  "error": "API key not found"
}
```

### 409 Conflict
```json
{
  "error": "An API key with this name already exists"
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

## Database Schema

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API Keys table with user relationship
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  value TEXT UNIQUE NOT NULL,
  usage INTEGER,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name) -- Ensure unique names per user
);
```

## Row Level Security (RLS)

The database uses Row Level Security to ensure users can only access their own data:

- Users can only view, create, update, and delete their own API keys
- All queries automatically filter by `user_id`
- No cross-user data access is possible

## Usage Examples

### JavaScript/React with NextAuth
```javascript
import { useAuthenticatedApiKeys } from '@/hooks/useAuthenticatedApiKeys';

function ApiKeysComponent() {
  const { 
    keys, 
    loading, 
    createKey, 
    updateKey, 
    deleteKey, 
    incrementUsage 
  } = useAuthenticatedApiKeys();

  const handleCreateKey = async () => {
    try {
      await createKey('My New Key', 1000);
      console.log('Key created successfully');
    } catch (error) {
      console.error('Error creating key:', error);
    }
  };

  return (
    <div>
      {keys.map(key => (
        <div key={key.id}>
          <h3>{key.name}</h3>
          <p>Usage: {key.usageCount}/{key.usageLimit || '∞'}</p>
        </div>
      ))}
    </div>
  );
}
```

### cURL Examples
```bash
# List user's API keys
curl -X GET http://localhost:3000/api/user/api-keys \
  -H "Authorization: Bearer <jwt-token>"

# Create new API key
curl -X POST http://localhost:3000/api/user/api-keys \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "My Key", "usageLimit": 1000}'

# Update API key
curl -X PATCH http://localhost:3000/api/user/api-keys/uuid \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Key"}'

# Validate API key
curl -X POST http://localhost:3000/api/user/api-keys/validate \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "ak_1234567890_abcdefghijklmnop"}'
```

## Security Features

1. **User Isolation**: Each user can only access their own API keys
2. **JWT Authentication**: Secure token-based authentication
3. **Input Validation**: Comprehensive validation on all inputs
4. **Usage Tracking**: Per-user usage limits and tracking
5. **Row Level Security**: Database-level access control
6. **Audit Logging**: All operations are logged with user context

## Migration

Run the `database-migration.sql` script to:
1. Create the users table
2. Add user_id column to api_keys table
3. Set up Row Level Security policies
4. Create necessary indexes
