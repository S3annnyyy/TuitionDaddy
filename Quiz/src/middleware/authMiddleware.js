// authMiddleware.js
import jwt from 'jsonwebtoken';
import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(cookieParser());

export const authenticateToken = (req, res, next) => {
    console.log('Cookies:', req.cookies);
    console.log('Request Headers:', req.headers);
    const token = req.cookies.token;
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};
