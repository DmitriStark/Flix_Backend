# 🎬 Menora Flix Server

Node.js/Express backend for a movie streaming platform with user authentication and OMDB API integration.

## 🚀 Quick Start

### Install & Setup
```bash
npm install
cp .env.example .env  # Configure your environment variables
npm run dev           # Development mode
npm run start            # Production mode
```

### Environment Variables
```env
MONGODB_URI=mongodb://localhost:27017/menora_flix
JWT_SECRET=your_super_secret_jwt_key_here
OMDB_API_KEY=your_omdb_api_key_here
PORT=5000
CLIENT_URL=http://localhost:3000
```

## 📡 API Endpoints

### Authentication
```
POST /api/auth/register    # Register user
POST /api/auth/login       # Login user
```

### Movies (Protected)
```
GET /api/movies/search     # Search movies (?search=query)
GET /api/movies/popular    # Popular movies
GET /api/movies/new        # New releases  
GET /api/movies/details/:imdbID  # Movie details
```

## 🔧 Usage Examples

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"password123"}'
```

**Search Movies:**
```bash
curl -X GET "http://localhost:5000/api/movies/search?search=inception" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📁 Architecture

```
├── controllers/     # Request handlers
├── repositories/    # Database operations  
├── helpers/         # Utilities (auth, validation, responses)
├── middleware/      # Auth, validation, error handling
├── models/          # MongoDB schemas
├── routes/          # API routes
└── services/        # External APIs (OMDB)
```

## 🛠️ Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB, Mongoose  
- **Auth**: JWT, bcryptjs
- **Validation**: Joi
- **External API**: OMDB (axios)

## 📝 Response Format

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

## 🔒 Authentication

All movie endpoints require `Authorization: Bearer <token>` header.

---

**Built with clean architecture principles for scalability and maintainability.**