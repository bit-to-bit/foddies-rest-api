# Foddies REST API

## Environment Variables

Create a `.env` file in the root of the project with the following variables:

```env
DATABASE_DIALECT=postgres
DATABASE_NAME=db_name
DATABASE_USERNAME=db_user
DATABASE_PASSWORD=db_user_password
DATABASE_HOST=db_host
DATABASE_PORT=5432
APP_PORT=3000
APP_HOST=http://localhost
JWT_SECRET=jwt_secret_key
```

## Installation

```bash
npm install
```

## Running the Project

Start:

```bash
npm start
```

Start in development mode:

```bash
npm run dev
```

## Health Check

Check if the server is running:

```http
GET http://localhost:3000/api/health/ping
```

## Linting & Formatting

Run lint check:

```bash
npm run lint
```

Automatically fix issues (must be run **before every push**):

```bash
npm run lint:fix
```

## Documentation (Swagger)

Start the server and open:

```http
http://localhost:3000/docs
```
