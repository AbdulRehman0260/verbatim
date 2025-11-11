import express from 'express';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
const app = express();
app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});
