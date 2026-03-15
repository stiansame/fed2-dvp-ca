import express from "express";
import "dotenv/config";
import cors from "cors";
import articleRoutes from "./routes/articles";
import authRoutes from "./routes/auth";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const app = express();
const PORT = process.env.PORT || 3000;

// --- SWAGGER SETUP --- //

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Dev Platforms API",
      version: "1.0.0",
      description: "A simple API for managing users and articles",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Path to the API route files
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

//API documentation route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//Enable Built in middleware
app.use(cors());
app.use(express.json());

// Connect route modules
app.use("/articles", articleRoutes);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
