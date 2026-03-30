import cookieParser from "cookie-parser";
import express from "express";
import authRoute from "./modules/auth/auth.routes.js";
import ApiError from "./common/utils/api-error.js";

const app = express();
// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
// Routes
app.use("/api/auth", authRoute)

// app.all("{*path}", (req, res) => {
//   throw ApiError.notFound(`Route ${req.originalUrl} not found`);
// });
export default app;