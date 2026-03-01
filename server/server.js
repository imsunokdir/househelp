const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const https = require("https");

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
const dbRouter = require("./Routes/db.route");
const { healthRouter } = require("./Routes/health.route");
const { cloudinaryConfig } = require("./Configurations/cloudinary.config");
const { boostRouter } = require("./Routes/boost.route");
const { messageRouter } = require("./Routes/message.route");
const { notificationRouter } = require("./Routes/notification.route");
const { listingRouter } = require("./Routes/listing.route");
const { initSocket } = require("./socket");
const { setIO } = require("./Utils/notificationHelper");

const { expireOverdueBoosts } = require("./Controllers/boost.controller");
const {
  expireOverdueListings,
  warnExpiringListings,
} = require("./Controllers/listing.controller");
const { dashboardRouter } = require("./Routes/dashboard.route");

const mongoDbSession = require("connect-mongodb-session")(session);

// ─── Constants ───────────────────────────────────────────────────────────────
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT;

const store = new mongoDbSession({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

// ─── Socket.io Setup ─────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: process.env.REDIRECT_LINK,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// ─── Middlewares ─────────────────────────────────────────────────────────────
app.set("trust proxy", 1);
app.set("view engine", "ejs");

app.use(
  cors({
    origin: process.env.REDIRECT_LINK,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  }),
);

app.options(
  "*",
  cors({
    origin: [process.env.REDIRECT_LINK],
    credentials: true,
  }),
);

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
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/v1/user", userRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/service", serviceRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/rating", ratingRouter);
app.use("/api/v1/image", imageRouter);
app.use("/api/v1/boost", boostRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/notification", notificationRouter);
app.use("/api/v1/listing", listingRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/mongo", dbRouter);
app.use("/health", healthRouter);
app.use(authRoutes);

// ─── SSR Routes (testing only) ───────────────────────────────────────────────
app.get("/login-page", (req, res) => res.render("login"));
app.get("/dashboard-page", (req, res) => res.render("dashboard"));

// ─── Initialize Socket.io ────────────────────────────────────────────────────
initSocket(io);
setIO(io); // Give notification helper access to io

// Self-ping to prevent Render free tier sleep
if (process.env.NODE_ENV === "production") {
  setInterval(
    () => {
      https
        .get(`${process.env.BACKEND_URL}/health`, (res) => {
          console.log(`Self-ping: ${res.statusCode}`);
        })
        .on("error", (err) => {
          console.log("Self-ping failed:", err.message);
        });
    },
    14 * 60 * 1000,
  );
}

// ─── Start Server ────────────────────────────────────────────────────────────
server.listen(PORT, async () => {
  dbConfig();
  cloudinaryConfig();
  console.log(`Server has started on port: ${PORT}`);
});

// ─── Background Jobs ─────────────────────────────────────────────────────────
setInterval(expireOverdueBoosts, 60 * 60 * 1000); // Every hour
setInterval(expireOverdueListings, 60 * 60 * 1000); // Every hour
setInterval(warnExpiringListings, 60 * 60 * 1000); // Every hour
