const jwt = require("jsonwebtoken") //always install and import this to use token

const generateToken = (payload)=>{
    try {
        console.log(payload);
        const token = jwt.sign({payload}, process.env.SECRET_KEY, {expiresIn: 60}) //the expire value is in secs
        return token;
        
    } catch (error) {
        console.log(error);
        
    }
}

//function to verify token
const verifyToken = (token)=>{
    try{
        if(!token){
            throw new Error ({name: "Authentication error", message: "No token provided"})
        }
        const decodedtoken = jwt.verify(token, process.env.SECRET_KEY)
        const email = decodedtoken.payload
        return email
    } catch (error){
        console.log(error);
        if (error.name == "TokenExpiredError"){
            throw new Error ("Session expired please login again")
        }
        throw new Error ("please login to continue")
    }
}

module.exports = {generateToken, verifyToken}