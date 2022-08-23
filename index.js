import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import morgan from 'morgan';

import userRouter from './src/routes/user.js';
import authRouter from './src/routes/auth.js';
import bookRouter from './src/routes/book.js';
import cartRouter from './src/routes/cart.js';

const app = express();
app.use(express.json());
app.use(bodyParser.json());
// app.use(JSON.parse());
dotenv.config();

app.use(helmet());
app.use(morgan('dev'));

const envs = {
    host:process.env.PORT,
    mongodb:process.env.MONGODB
}

mongoose.connect(envs.mongodb,(err)=> {
    if(err){
        console.log("Database connection failed")
    }else{
        console.log("Database connection success")
    }
})

app.use('/user', userRouter);
app.use('/auth', authRouter);
app.use('/books', bookRouter);
app.use('/cart', cartRouter);

app.listen(envs.host,()=> {
    console.log(`Server is running on port ${envs.host}`)
});