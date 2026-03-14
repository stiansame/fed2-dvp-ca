import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/users";
import articleRoutes from "./routes/articles";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//Enable Built in middleware
app.use(cors());
app.use(express.json());

// Connect route modules
app.use("/users", userRoutes);
app.use("/articles", articleRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
