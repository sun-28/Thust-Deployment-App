const jwt= require('jsonwebtoken')
const JWT_SECRET= process.env.JWT_SECRET

const authenticate = (req,res,next) =>{
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({success:false,error: "Invalid Token"});
    }
    try {
        const data = jwt.verify(token,JWT_SECRET);
        req.userId = data._id;
        next();
    } catch (error) {
        res.status(401).json({success:false,error: "Invalid Token"});
    }
}

module.exports = authenticate;