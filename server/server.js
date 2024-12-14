const express = require("express");
const { userRouter } = require("./Routes/user.route");
const dbConfig = require("./Configurations/db.config");
const cors = require("cors");

require("dotenv").config();

const passport = require("./passport/google");
const authRoutes = require("./Routes/auth");

const { categoryRouter } = require("./Routes/category.route");
const { serviceRouter } = require("./Routes/service.route");
const reviewRouter = require("./Routes/review.route");
const ratingRouter = require("./Routes/rating.route");
const session = require("express-session");
const imageRouter = require("./Routes/image.route");

const mongoDbSession = require("connect-mongodb-session")(session);

// constants
const app = express();
const PORT = process.env.PORT;
const store = new mongoDbSession({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

// Middlewares
app.set("view engine", "ejs");

// CORS Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

// Add this to handle preflight requests explicitly
app.options("*", cors());

// Handle preflight requests explicitly

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(
  session({
    secret: process.env.JWT_SECRET_KEY,
    store: store,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set true if using HTTPS
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Router-level middlewares
app.use("/api/v1/user", userRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/service", serviceRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/rating", ratingRouter);
app.use("/api/v1/image", imageRouter);
app.use(authRoutes);

//server side rendering rooutes for testing only
app.get("/login-page", (req, res) => {
  return res.render("login");
});

app.get("/dashboard-page", (req, res) => {
  return res.render("dashboard");
});

// Start the server
app.listen(PORT, async () => {
  await dbConfig();
  console.log(`Server has started on port: ${PORT}`);
});
