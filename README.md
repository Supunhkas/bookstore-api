# Bookstore API

A simple RESTful API for managing a bookstore, built with Node.js and Express.

## Tech Stack

- **Node.js**: Runtime environment
- **Express 5**: Web framework
- **TypeScript**: Typed JavaScript
- **Prisma**: ORM with SQLite
- **Zod**: Schema validation
- **Jest**: Testing framework

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Supunhkas/bookstore-api.git
   cd bookstore-api
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Copy `.env.example` to `.env` and configure accordingly:
   ```bash
   cp .env.example .env
   ```
   _For Windows:_ `copy .env.example .env`

### Database Setup

Generate Prisma client and run migrations:

```bash
npm run prisma:migrate
npm run prisma:generate
```

### Running the App

- **Development Mode**:
  ```bash
  npm run dev
  ```
- **Build and Start**:
  ```bash
  npm run build
  npm start
  ```
```bash
npm test
```

## API Endpoints

All routes below require `Authorization: <AUTH_TOKEN>` header.

| Method | Endpoint | Description | Request Body (JSON) |
| :--- | :--- | :--- | :--- |
| `GET` | `/books` | List all books | - |
| `GET` | `/books/:id` | Get book details | - |
| `POST` | `/books` | Create a book | `{ "title", "author", "year", "genre?" }` |
| `PUT` | `/books/:id` | Update a book | `{ "title?", "author?", "year?", "genre?" }` |
| `DELETE` | `/books/:id` | Delete a book | - |
