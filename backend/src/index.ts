import express from 'express';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

app.listen(process.env.SERVER_PORT, () => {
  console.log(`http://localhost:${process.env.SERVER_PORT}`);
  console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});