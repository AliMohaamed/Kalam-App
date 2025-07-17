<div align="center">
  <img src="./client/public/favicon.svg" alt="Kalam Logo" width="120" />
  <h1>Kalam - Real-time Chat Application</h1>
  <p>
    A feature-rich, full-stack real-time chat application built with a modern, scalable architecture.
  </p>

  <p>
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
    <img src="https://img.shields.io/badge/Socket.io-010101?&style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.io">
    <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma">
  </p>
</div>

---

## 📖 Overview

**Kalam** (Arabic for "Speech") is a high-performance chat application engineered to demonstrate a modern, decoupled full-stack architecture. It provides secure user authentication, persistent message history, and a seamless real-time communication experience. The project emphasizes clean code, separation of concerns, and best practices in both backend and frontend development.

## ✨ Key Features

-   **🔐 Secure Google OAuth 2.0:** Passwordless, secure authentication handled by Passport.js.
-   **⚡ Real-time Messaging:** Instant bi-directional communication powered by WebSockets via Socket.io.
-   **📚 Persistent Chat History:** All conversations are stored in a robust PostgreSQL database, managed by the Prisma ORM.
-   **✔✔ Read Receipts:** Real-time feedback to users when their messages have been read.
-   **💻 Responsive UI:** A clean and modern user interface built with React and Bootstrap, optimized for all screen sizes.
-   **🏗️ Scalable Architecture:** Decoupled frontend and backend with a well-organized structure (Controllers, Services, Context API) for maintainability.

---

## 🏛️ Architecture Overview

The application follows a classic client-server architecture:

-   **Frontend (Client):** A React Single-Page Application (SPA) responsible for rendering the UI and managing user interactions.
-   **Backend (Server):** A Node.js/Express server that exposes a REST API for core functionalities (auth, fetching data) and a Socket.io server for real-time events.
-   **Database:** A PostgreSQL database acting as the single source of truth for all persistent data.
-   **Authentication Flow:** The backend handles the OAuth 2.0 flow with Google, issuing a JWT to the client upon successful authentication. The client then uses this JWT to authenticate subsequent API requests and Socket.io connections.

---

## 🛠️ Tech Stack

| Category                | Technology                                                                          |
| ----------------------- | ----------------------------------------------------------------------------------- |
| **Backend** | Node.js, Express.js, PostgreSQL, Prisma, Socket.io, Passport.js, JWT                |
| **Frontend** | React.js, Vite, React Router, Context API, Axios, Socket.io Client, Bootstrap        |
| **Development** | Nodemon, Concurrently (recommended), ESLint, Prettier                               |

---

## 🚀 Getting Started

Follow these instructions to set up and run the project on your local machine for development and testing purposes.

### Prerequisites

-   Node.js (v18+ recommended)
-   PostgreSQL
-   `pnpm` or `npm` or `yarn`
-   A configured Google Cloud Platform project with OAuth 2.0 credentials.

### 1. Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://your-repository-url.com/kalam.git](https://your-repository-url.com/kalam.git)
    cd kalam/server
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Setup your PostgreSQL database:**
    Connect to PostgreSQL (e.g., using `psql`) and create the database:
    ```sql
    CREATE DATABASE chatapp;
    ```

4.  **Configure Environment Variables:**
    Create a `.env` file in the `server` directory and populate it with your credentials.

| Variable             | Description                                          | Example                                                            |
| -------------------- | ---------------------------------------------------- | ------------------------------------------------------------------ |
| `DATABASE_URL`       | Connection string for your PostgreSQL database.      | `postgresql://USER:PASSWORD@localhost:5432/chatapp`              |
| `GOOGLE_CLIENT_ID`   | Your Google OAuth 2.0 Client ID.                     | `your-google-client-id.apps.googleusercontent.com`                 |
| `GOOGLE_CLIENT_SECRET` | Your Google OAuth 2.0 Client Secret.                 | `GOCSPX-your-secret`                                               |
| `JWT_SECRET`         | A long, random string for signing JSON Web Tokens.   | `a-very-strong-and-long-secret-key`                                |
| `CLIENT_URL`         | The full URL for the frontend OAuth callback.        | `http://localhost:3000/auth/callback`                              |
| `PORT`               | The port on which the backend server will run.       | `5000`                                                             |


5.  **Apply Database Migrations:**
    This command applies the schema defined in `prisma/schema.prisma` to your database.
    ```bash
    npx prisma migrate dev
    ```

6.  **Start the Backend Server:**
    ```bash
    npm run dev
    ```
    The server will be running on `http://localhost:5000`.

### 2. Frontend Setup

1.  **Navigate to the client directory:**
    ```bash
    cd ../client
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the Frontend Development Server:**
    ```bash
    npm run dev
    ```
    The React app will be available at `http://localhost:3000`.

---

## 📡 API Endpoints

The backend exposes the following RESTful endpoints:

| Method | Endpoint                    | Protection | Description                                        |
| :----- | :-------------------------- | :--------- | :------------------------------------------------- |
| `GET`  | `/api/auth/google`          | Public     | Initiates the Google OAuth 2.0 login flow.         |
| `GET`  | `/api/auth/google/callback` | Public     | Callback URL for Google to redirect to after auth. |
| `GET`  | `/api/auth/logout`          | Public     | Logs the user out.                                 |
| `GET`  | `/api/users`                | Private    | Fetches a list of all registered users.            |
| `GET`  | `/api/messages/:userId`     | Private    | Fetches the chat history with a specific user.     |

*Private endpoints require a valid JWT in the `Authorization: Bearer <token>` header.*

---

## 🗺️ Roadmap & Future Features

-   [ ] **Real-time Online/Offline Status:** Broadcast user presence to all clients.
-   [ ] **Typing Indicators:** Show a "...is typing" indicator to improve UX.
-   [ ] **Unread Message Counters:** Display badges for unread messages on the contact list.
-   [ ] **Group Chats:** Implement multi-user conversations.
-   [ ] **File & Image Sharing:** Integrate a cloud storage service like Cloudinary or AWS S3.
-   [ ] **Push Notifications:** Notify users of new messages when the app is in the background.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/AliMohaamed/Kalam-App).

