const express = require ("express")
const app = express()
require("dotenv").config()
const mongoose = require ("mongoose")
const userRouter = require("./routes/userRouter")
const cors = require ("cors")
app.use(cors({origin:"*"}))


app.use(express.urlencoded())
app.use(express.json({limit:"100mb"})) //this is incase youre testing with thunderclient..advisable to add both urlencoded and json..

app.use("/users", userRouter)







const connect = ()=>{
    mongoose.connect(process.env.MONGODB_URI).then(()=>{
        console.log("connected to mongodb")
    }).catch((err)=>{
        console.log(err)
       
    })
}
connect()

app.listen(4041,()=>{
    console.log("App listening on port 4041")
})