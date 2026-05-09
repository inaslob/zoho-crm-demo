# Zoho CRM Project Dashboard

## 1. Architecture Overview
The application is a **Client-Server web application** designed to bridge Zoho CRM with a custom user interface.

* **Frontend:** A simple HTML/JavaScript dashboard using the `Fetch API` to communicate with the Backend.
* **Backend (Node.js/Express):** Acts as a middleware to handle server-side logic and proxy requests to Zoho’s API.
* **Database:** No local database is used; Zoho CRM acts as the single source of truth for all data.

## 2. Setup Instructions
To get the application running on your local machine:

1. **Environment:** Ensure Node.js is installed on your computer.
2. **API Registration:** Create a "Self-Client" in the Zoho API Console to generate a `Client ID`, `Client Secret`, and a `Grant Code`.
3. **Authentication:** Perform a one-time "Handshake" (using Postman) to exchange the Grant Code for an initial `access_token` and `refresh_token`.
4. **Deployment:**
   * Open your terminal in the project folder.
   * Run `npm install` to load dependencies (Express and Axios).
   * Setup environment variable API_KEY to have the obtained token value.
   * Start the server by running `node server.js`.
5. **Access:** Open your browser and go to `http://localhost:3000`.

