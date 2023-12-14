const bcryptjs = require("bcryptjs")
const userModel = require("../models/userModel")
const { generateToken, verifyToken } = require("../services/sessionService")
const { cloudinary } = require("../utils/cloudinaryConfig")
const { sendMail } = require("../utils/mailer")

const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const checkExistingDetails = await userModel.findOne({
            $or: [{ email: email }, { username: username }]
        })
        if (checkExistingDetails) {
            return res.status(409).send({ message: "Email or Username already exist" })
        }
        const result = await userModel.create({ username, email, password })
        if (!result) {
            return res.status(400).send({ message: "error creating user" })
        }
        sendMail(email, username) // this will enable the mailer
        return res.status(201).send({ message: "account has been created", result })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error })
    }

}

const signin = async (req, res) => {
    try {
        const { email, password } = req.body
        const result = await userModel.findOne({ email }) //remove password since its been hashed
        const compare = await bcryptjs.compare(password, result.password)//this will make it to compare the hashed and the normal password
        console.log(compare);
        if (!result || !compare) {
            return res.status(401).send({ message: "Invalid email or password" })
        }
        const token = generateToken(email) //we are setting our email here as the payload

        return res.status(200).send({ message: `Welcome ${result.username}`, token, result })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error })
    }
}

const verifyUserToken = async (req, res, next) => {
    try {
        const auth = req.headers.authorization
        console.log("a", auth)
        const token = auth.split(" ")[1]
        console.log(token)// since we need just authorisation inside header and not bearer, so we need split to turn it into array and pick index 1 which is token""  authorization: `bearer ${token}`"
        if (!token) {
            return res.status(401).send({ message: "Unauthorized" })
        }
        const userEmail = verifyToken(token)
        const user = await userModel.findOne({ email: userEmail }) //this will enable you to view the user information and om the next line, replace userEmail with user
        return res.status(200).send({ message: "user verification successful", user })

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error.message })

    }
}


const imageUpload = async (req, res) => {
    const { file } = req.body
    try {
        console.log(file);
        const result = await cloudinary.uploader.upload(file)
        console.log(result);
        const url = result.secure_url
        return res.status(200).send({ message: "Image uploaded successfully" })
    } catch (error) {
        console.log(error);

    }
}





module.exports = { signup, signin, verifyUserToken, imageUpload }