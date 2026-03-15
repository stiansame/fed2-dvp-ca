# Development Platforms CA (FM2AJDP05)

Course assignment for Noroff FED2 Development Platforms Module

## Description

### Brief

Build a news platform where users can browse and submit news articles, using an Express.js API backend with authentication and database integration. No frontend required.

### Project Requirements

**Public Access:**

- [x] Anyone can view the list of news articles
- [x] Articles display title, body, category, and submission date

**User Authentication:**

- [x] User registration with email and password
- [x] User login

**Article Management:**

- [x] Only authenticated users can submit news articles
- [x] Article details: title, body, category (submission date can be automatic)
- [x] Articles automatically tagged with submitter (logged-in user) information

## Implementation

### Tech stack:

- [x] Express.js with TypeScript
- [x] MySQL database with mysql2
- [x] JWT authentication with bcrypt password hashing
- [x] Basic validation
- [x] Simple error handling

### Key Implementation Requirements

- [x] Use Express Router to organise endpoints
- [x] Implement JWT authentication middleware
- [x] The create article route must be protected by authentication
- [x] Include proper error handling and status codes
- [x] Use parameterised queries for SQL injection prevention

### Required Endpoints

- [x] POST /auth/register - User registration
```JSON
      {
      "username": "tyler",
      "email": "tylerdurden@bestsoaps.com",
      "password": P@ssword!2026
      }
```
- [x] POST /auth/login - User login (returns JWT)
```JSON
	{
	  "email": "tylerdurden@bestsoaps.com",
	  "password": P@ssword!2026
	}
```
- [x] GET /articles - View all articles (public access)

      Example request: Get/articles
    
- [x] POST /articles - Submit new article (protected, requires JWT)
```JSON
      {
      "title": "Human fat used in soap",
      "body": "Dapper entrepeneur robbed high profile liposuction clinics and used their waste to manufacture sought after bars of soap",
      "category": "fiction""
      }
```


