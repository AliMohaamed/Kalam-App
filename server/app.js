import session from "express-session";
import passport from "passport";
import authRoutes from "./routes/authRouter.js";
import userRoutes from './routes/userRoutes.js'; 
import messageRoutes from './routes/messageRoutes.js';
import cors from "cors";

function startApp(app, express) {
  app.use(cors({
    origin: "http://localhost:3000"
  }));
  // --- Middleware ---
  app.use(
    session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // --- Routes ---
  app.use("/api/auth", authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/messages', messageRoutes);

  app.get("/", (req, res) => {
    res.send("API is running...");
  });

  //   --- Error Handling ---
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
  });
}

export default startApp;
