const express = require("express");
const path = require("path");
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static HTML/CSS/JS from 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection
require("./db"); // Make sure db.js is in the same folder

// Routes
const loginData = require("./routes/route");
const routeRouter = require("./routes/app");

app.use(loginData);
app.use(routeRouter);

// Optional home route (in case of direct access to "/")
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Listen on dynamic port for deployment or 5000 locally
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
