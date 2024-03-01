const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
require('dotenv').config();
const { Server } = require('socket.io')
const Redis = require('ioredis')

const app = express();

app.use(express.json());
app.use(cors());
app.use('/auth',require('./routes/auth'))
app.use('/project',require('./routes/project'))


mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log('Connected To DB');
})
.catch(()=>{
    console.log('Error connecting to DB');
})


const sub = new Redis(process.env.REDIS_URI);

const io = new Server({ cors: '*' })

io.on('connection',(socket) => {
    socket.on('subscribe',(channel) => {
        socket.join(channel);
    })
})

const redisSub = () => {

    sub.psubscribe('logs:*')

    sub.on('pmessage', (pattern, channel, message) => {
        io.to(channel).emit('message', message)
    })

}

redisSub()


io.listen(9002, () => console.log('Socket Server 9002'))

app.listen(8000,()=>{
    console.log('Server Listening on Port : 8000');
})