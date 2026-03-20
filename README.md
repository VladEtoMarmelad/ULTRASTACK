# ULTRASTACK

## Installation

Follow these steps to get the project set up on your local machine.

**1. Install Backend Dependencies**

Navigate to the backend directory and install the required npm packages.

```bash
cd ultrastack-backend
npm install
```

**2. Install Frontend Dependencies**

From the project root, navigate to the frontend directory and install its packages.

```bash
# Make sure you are in the project's root directory first
cd ultrastack-frontend
npm install
```

## Running the Application

To run the application, you will need to start both the backend and the frontend development servers. It's best to use two separate terminal windows for this.

**1. Start the Backend Server**

In your first terminal, navigate to the backend directory and run the development server.

```bash
# Navigate to the backend directory
cd path/to/your-project/ultrastack-backend

# Run the server
npm run start
```

The NestJS backend will start and listen for requests. By default, it runs on `http://localhost:3030`.

**2. Start the Frontend Server**

In your second terminal, navigate to the frontend directory and run the development server.

```bash
# Navigate to the frontend directory
cd path/to/your-project/ultrastack-frontend

# Run the server
npm dev
```

The Next.js frontend will start. By default, it runs on `http://localhost:3000`.

**3. Open The App!**

You can now access the ULTRASTACK by opening your web browser and navigating to:

[**http://localhost:3000**](http://localhost:3000)