import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Book Review API",
      version: "1.0.0",
      description:
        "API documentation for the Book Review App (Node.js + Express + MongoDB)",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "jwt_token",
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
    ],
  },

  apis: ["./src/routes/*.js", "./src/models/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
export { swaggerUi };
