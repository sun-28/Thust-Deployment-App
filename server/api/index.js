const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
require('dotenv').config();


const app = express();

app.use(express.json());
app.use(cors());
app.use('/auth',require('./routes/auth'))


mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log('Connected To DB');
})
.catch(()=>{
    console.log('Error connecting to DB');
})

app.listen(8000,()=>{
    console.log('Server Listening on Port : 8000');
})