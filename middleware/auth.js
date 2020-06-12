const jwt =require('jsonwebtoken');
const config =require('config');



module.exports = function(req,res,next){
// Get token from headers
const token =req.header('x-auth-token');
//Check there is token or not
if(!token){
    res.status(401).json({msg:'Authorization denied due to no token'});
}
else{
//Verify token
try {
    const decoded =jwt.verify(token,config.get('jwtSecret'));
    req.user =decoded.user; 
    next();
} catch (err) {
    res.status(401).json({msg:'Invalid Token'});
    
}

}}
;