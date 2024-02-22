const mongoose = require('mongoose')
const {Schema} = mongoose

const TUser = new Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        min:3
    },
    password:{
        type: String,
        required: true
    },
})


module.exports = mongoose.model('TUsers',TUser);