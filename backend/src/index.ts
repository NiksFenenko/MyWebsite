import express from "express";
import cors from "cors";


import {ENV} from "./config/env";
import { clerkMiddleware } from '@clerk/express'

import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import commentRoutes from "./routes/commentRoutes";


const app = express ();

app.use(cors({origin: ENV.FRONTEND_URL }));
app.use(clerkMiddleware()); // auth obj will be attachted to the req
app.use(express.json()); // parses JSON requset bodies.
app.use(express.urlencoded({extended: true })); // parses from data (like HTML forms).

app.get("/", (req, res) => {
    const {}=req.body 
   res.json ({
    message: "Welcome to Productify API - Powered by PostgreSQL, Drizzle ORM & Clerk Auth",
    endpoints: {
        users: "/api/users",
        products: "/api/products",
        comments: "/api/comments",
    },
   });
});

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/comments", commentRoutes); 


app.listen(ENV.PORT,() => console.log("server is up and running on PORT:" ,ENV.PORT) ) 