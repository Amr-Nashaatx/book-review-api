import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Book Review API",
      version: "1.0.0",
      description:
        "Comprehensive API for a Book Review application. Supports user authentication, book catalog management, reviews, and personal shelves.",
      contact: {
        name: "Book Review API Support",
      },
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
          description: "JWT token stored in httpOnly cookie",
        },
      },
      schemas: {
        // ============ Response Wrappers ============
        ApiResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              enum: ["success", "error"],
              example: "success",
            },
            data: {
              type: "object",
              description: "Response payload (varies per endpoint)",
            },
            message: {
              type: "string",
              example: "Operation completed successfully",
            },
          },
        },

        // ============ User Schemas ============
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "64ff1ac2b72d3a10f7e3c9a4",
            },
            name: {
              type: "string",
              example: "John Doe",
            },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            role: {
              type: "string",
              enum: ["user", "admin"],
              example: "user",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        RegisterUser: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: {
              type: "string",
              minLength: 3,
              maxLength: 10,
              example: "johndoe",
            },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            password: {
              type: "string",
              minLength: 8,
              maxLength: 20,
              example: "securePass123",
            },
          },
        },

        LoginUser: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            password: {
              type: "string",
              minLength: 8,
              maxLength: 20,
              example: "securePass123",
            },
          },
        },

        AuthResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "success",
            },
            data: {
              type: "object",
              properties: {
                user: {
                  $ref: "#/components/schemas/User",
                },
                token: {
                  type: "string",
                  description: "JWT token (if applicable to endpoint)",
                },
              },
            },
            message: {
              type: "string",
              example: "User registered successfully",
            },
          },
        },

        // ============ Book Schemas ============
        Book: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "64ff1ac2b72d3a10f7e3c9a4",
            },
            title: {
              type: "string",
              example: "The Hobbit",
            },
            author: {
              type: "string",
              example: "J.R.R. Tolkien",
            },
            genre: {
              type: "string",
              example: "Fantasy",
            },
            isbn: {
              type: "string",
              example: "978-0547928227",
            },
            publishedYear: {
              type: "integer",
              example: 1937,
            },
            description: {
              type: "string",
              example: "A fantasy adventure novel about Bilbo Baggins.",
            },
            averageRating: {
              type: "number",
              format: "float",
              minimum: 0,
              maximum: 5,
              example: 4.8,
            },
            createdBy: {
              type: "string",
              description: "ID of the user who created the book entry",
              example: "64ff1ac2b72d3a10f7e3c9a4",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        BookPayload: {
          type: "object",
          required: ["title", "author", "genre", "publishedYear"],
          properties: {
            title: {
              type: "string",
              example: "The Hobbit",
            },
            author: {
              type: "string",
              example: "J.R.R. Tolkien",
            },
            genre: {
              type: "string",
              example: "Fantasy",
            },
            isbn: {
              type: "string",
              example: "978-0547928227",
            },
            publishedYear: {
              type: "integer",
              example: 1937,
            },
            description: {
              type: "string",
              example: "A fantasy adventure novel.",
            },
          },
        },

        BookUpdatePayload: {
          type: "object",
          properties: {
            title: {
              type: "string",
            },
            author: {
              type: "string",
            },
            genre: {
              type: "string",
            },
            isbn: {
              type: "string",
            },
            publishedYear: {
              type: "integer",
            },
            description: {
              type: "string",
            },
          },
        },

        // ============ Review Schemas ============
        Review: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "6532c4a94bd0c4e1f8a2a1d1",
            },
            book: {
              type: "string",
              description: "ID of the reviewed book",
              example: "64ff1ac2b72d3a10f7e3c9a4",
            },
            user: {
              type: "string",
              description: "ID of the review author",
              example: "64ff1ac2b72d3a10f7e3c9a5",
            },
            rating: {
              type: "integer",
              minimum: 1,
              maximum: 5,
              example: 5,
            },
            comment: {
              type: "string",
              maxLength: 500,
              example: "Fantastic read! Loved every moment.",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        ReviewPayload: {
          type: "object",
          required: ["rating"],
          properties: {
            rating: {
              type: "integer",
              minimum: 1,
              maximum: 5,
              example: 5,
            },
            comment: {
              type: "string",
              maxLength: 500,
              example: "An excellent read!",
            },
          },
        },

        ReviewList: {
          type: "array",
          items: {
            $ref: "#/components/schemas/Review",
          },
        },

        // ============ Shelf Schemas ============
        Shelf: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "64ff1ac2b72d3a10f7e3c9a6",
            },
            user: {
              type: "string",
              description: "ID of the shelf owner",
              example: "64ff1ac2b72d3a10f7e3c9a4",
            },
            name: {
              type: "string",
              example: "Want to Read",
            },
            description: {
              type: "string",
              example: "Books I plan to read this year",
            },
            books: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Array of book IDs on this shelf",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        ShelfPayload: {
          type: "object",
          required: ["name"],
          properties: {
            name: {
              type: "string",
              example: "Favorites",
            },
            description: {
              type: "string",
              example: "My all-time favorite books",
            },
          },
        },

        // ============ Error Schemas ============
        ErrorResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "error",
            },
            message: {
              type: "string",
              example: "An error occurred",
            },
            errors: {
              type: "array",
              description: "Detailed error information (if available)",
              items: {
                type: "object",
              },
            },
          },
        },
      },
    },
  },

  apis: ["./src/routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
export { swaggerUi };
