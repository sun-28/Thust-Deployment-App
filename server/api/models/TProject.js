const mongoose = require('mongoose')
const {Schema} = mongoose

const TProject = new Schema({
    slug:{
        type: String,
        required: true,
        unique: true,
    },
    gitUrl:{
        type: String,
        required: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tusers'
    }
},{timestamps: true})


module.exports = mongoose.model('TProjects',TProject);