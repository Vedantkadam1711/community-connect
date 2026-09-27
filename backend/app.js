import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/events", registrationRoutes);
app.use("/api/events", eventRoutes);


app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CommuniEvent API is running"
  });
});

export default app;