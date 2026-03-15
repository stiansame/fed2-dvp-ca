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

- [x] **POST /auth/register** - User registration

```JSON
      {
      "username": "tylerdurden",
      "email": "tyler@bestsoaps.com",
      "password": "P@ssword!2026"
      }
```

- [x] **POST /auth/login** - User login (returns JWT)

```JSON
	{
	  "email": "tylerdurden@bestsoaps.com",
	  "password": "P@ssw0rd123!"
	}
```

- [x] **GET /articles** - View all articles (public access)

Example request: `Get/articles`

- [x] **POST /articles** - Submit new article (protected, requires JWT)

```JSON
      {
      "title": "Human fat used in soap",
      "body": "Dapper entrepeneur robbed high profile liposuction clinics and used their waste to manufacture sought after bars of soap",
      "category": "fiction"
      }
```

### DB Tables

- [x] users

```SQL
    CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username varchar(50) UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
```

- [x] articles

```SQL
    CREATE TABLE articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    category VARCHAR(100),
    submitted_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (submitted_by) REFERENCES users(id)
    );
```

## Setup

1. Install dependencies

```BASH
	npm install
```

2. Copy `.env.example`to `.env`and ipdate with your own values

```BASH
	Copy-Item .env.example .env
```

3. Run the application

```BASH
	npm run dev
```

### Installed dependencies

Check your `package.json` file and make sure the following dependencies are in place:

- [x] bcrypt
- [x] cors
- [x] dotenv
- [x] express
- [x] jsonwebtoken
- [x] mysql2
- [x] swagger-jsdoc
- [x] swagger-ui-express
- [x] zod

---

### Scripts

- [x] `npm run dev`: Starts the server in development mode.
- [x] `npm run build`: Compiles TypeScript code to JavaScript (for production)
- [x] `npm start`: Runs the compiled JavaScript code (for production)

---

### Swagger

Swagger is installed and used for documentation of API-endpoints.

- [x] http://localhost:[PORT]/api-docs/
- [ ] example: `http://localhost:3000/api-docs`

---

### For testing (local dev only)

You can use these credentials for manual testing in Postman or using Swagger:

- [x] **email**: tylderdurden@bestsoaps.com
- [x] **password**: P@ssw0rd123!

## Motivation

My decision to build an API backend using SQL was an easy one. I use SQL as part of my daily job, and builing and managing REST- APIs is a key competance in my work. In that regard this course has been super-insightful and very relevant to my work.

What I enjoued the most was gaining knowledge and skills into how an API is actually built, so that I can better understand how other API's work and can use this knowledge to build, maintain and improve API's on my own as part of my work.

My least favourite part of this assignment, as with any assignment, was debugging and seraching for errors when something broke. Especially in the beginning, before I had proper validation that helped somewhat in narrowing the search down. Also, using A.I (github Co-Pilot in VS Code, Chat GPT) and rubberducking solutions helped.

VS a solutioon such as SupaBase, I think my biggest takeaway is that I much prefer to have total control of my API and all my code. From a time vs cost perspective, I appreciate how Supabase would be a valid option, just as Tailwind would be for CSS.

For this assignment I wanted to focus on the middleware/backend code, and really write my own API from scratch, not configure Supabasee and write a Fronend to interact with it, so the choice was easy :)

## Notes on A.I

In this course assignment, the following LLM's were used:

- [x] GitHub Co-Pilot (Inside VS Code)
- [x] Chat GPT


### How A.I was used

- [x] **Rubberducking** - Explaining concepts and code from the course material
- [x] **Code-review** - Reviewing my code and commenting, offering hints to best practices and why
- [x] **Debugging** - Explaining why the code would break, and point to possible culprits
- [x] **Drafting documentation** - Drafting swagger documentation for the routes used in this CA. Based on video in course material
- [x] **Not used to generate copy/paste code I do not understand**

### Student responsibility

As the learner, I am responsible for:

- [x] Writing and understanding all code I submit
- [x] Not copy-pasting solutions without comprehension
- [x] Asking clarifying questions when concepts are unclear
- [x] Taking time to think through problems before asking for help
- [x] Using AI as a tutor, not as a substitute for learning

## Code Citations

### Student Responsibility

Copied with pride from [@annikaeld](https://github.com/annikaeld)

**Source:**
[https://github.com/annikaeld/development-platforms-ca/blob/main/AI-usage.md](https://github.com/annikaeld/development-platforms-ca/blob/main/AI-usage.md)
