import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

export const swaggerSpec = swaggerJSDoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Barite API",
            version: "1.0.0",
            description: "Backend API for Barite society management app",
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Local dev",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: [
        path.join(__dirname, "../routes/*.ts"),
        path.join(__dirname, "../controllers/*.ts"),
    ],
});
