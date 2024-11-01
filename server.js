const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config(); // Load environment variables from .env

const app = express();
const PORT = 8080;

// Serve static files (e.g., JS, CSS, images) from the 'hotel/scripts' directory
app.use(
  "/hotel/scripts",
  express.static(path.join(__dirname, "hotel/scripts"))
);

// Route to serve HTML files with environment variable injection
app.get("/hotel/:page.html", (req, res) => {
  const page = req.params.page; // Get the requested page (e.g., index, admin)
  const filePath = path.join(__dirname, "hotel", `${page}.html`);

  // Check if the requested HTML file exists
  if (fs.existsSync(filePath)) {
    // Read the HTML file and inject environment variables
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.status(500).send("Error reading the HTML file.");
        return;
      }

      // Inject environment variables into the HTML before serving it
      const injectedHtml = data.replace(
        "<head>",
        `<head>
        <script>
          window.env = {
            IDENTITY_POOL_ID: "${process.env.IDENTITY_POOL_ID || ""}",
            COGNITO_DOMAIN: "${process.env.COGNITO_DOMAIN || ""}",
            APP_ID: "${process.env.APP_ID || ""}",
            API_URL: "${process.env.API_URL || ""}"
          };
        </script>`
      );

      // Send the modified HTML file
      res.send(injectedHtml);
    });
  } else {
    // Return a 404 error if the HTML file doesn't exist
    res.status(404).send("Page not found.");
  }
});

app.get("/hotel/", (req, res) => {
  const filePath = path.join(__dirname, "hotel", `index.html`);

  // Check if the requested HTML file exists
  if (fs.existsSync(filePath)) {
    // Read the HTML file and inject environment variables
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.status(500).send("Error reading the HTML file.");
        return;
      }

      // Inject environment variables into the HTML before serving it
      const injectedHtml = data.replace(
        "<head>",
        `<head>
        <script>
          window.env = {
            IDENTITY_POOL_ID: "${process.env.IDENTITY_POOL_ID || ""}",
            COGNITO_DOMAIN: "${process.env.COGNITO_DOMAIN || ""}",
            APP_ID: "${process.env.APP_ID || ""}",
          };
        </script>`
      );

      // Send the modified HTML file
      res.send(injectedHtml);
    });
  } else {
    // Return a 404 error if the HTML file doesn't exist
    res.status(404).send("Page not found.");
  }
});

// All your other route handlers here...

// Catch-all route handler for undefined routes
app.use((req, res) => {
  res.status(404).send("404: Page Not Found");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/hotel/index.html`);
});
