const router = require('express').Router();
const TUser = require('../models/TUser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const jwt_secret = process.env.JWT_SECRET;

router.post('/signup', async (req,res) => {
    try {

        const {username,password} = req.body;
        const user = await TUser.findOne({username});
        if(user){
            return res.json({success:false,error: "username already exists!"})
        }
        const salt= await bcrypt.genSalt(10);
        const secpass = await bcrypt.hash(password,salt)
        const tuser = await TUser.create({username,password:secpass});
        const data = {
            _id : tuser._id,
            username : tuser.username
        }
        const token = jwt.sign(data,jwt_secret);
        res.json({success:true,token});

    } catch (error) {
        console.log(error)
        res.json({success:false,error:'Internal Server error'});
    }
})


router.post('/login',async (req,res) => {
    try {

        const {username,password} = req.body;
        const user = await TUser.findOne({username});
        if(!user){
            return res.json({success:false,error: "user doesn't exist!"})
        }
        const match = await bcrypt.compare(password,user.password);

        if(!match){
            return res.json({success:false,error: "incorrect password!"})
        }
        const data = {
            _id : user._id,
            username: user.username
        }
        const token = jwt.sign(data,jwt_secret);
        res.json({success:true,token});

    } catch (error) {
        console.log(error)
        res.json({success:false,error:'Internal Server error'});
    }
})



module.exports = router;