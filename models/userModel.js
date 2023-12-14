const bcryptjs = require("bcryptjs")
const bcrypt = require("bcryptjs/dist/bcrypt")
const mongoose =  require ("mongoose")


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    wallet:{
        type: Number,
        default: 0
    }

})

//this enables us to hash password............
userSchema.pre("save", function (next){
    let saltRound = 10 //the number of the hashcode
    if(this.password !== undefined){
        bcryptjs.hash(this.password, saltRound).then((hashedPassword)=>{
            console.log(hashedPassword);
            this.password = hashedPassword
            next()
        })
    }
})




const userMoodel = mongoose.models.user_tbs || mongoose.model("user_tbs", userSchema) //first line is to access ur model while the second after || is to create your model

module.exports = userMoodel;