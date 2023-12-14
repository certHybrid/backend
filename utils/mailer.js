const nodemailer = require("nodemailer")
const sendMail = async (email, username)=>{
    const contactTemplate= `
    <div>
    <p>
     Dear ${username}, you're welcome to Hybrid App. Thank you for applying to Hybrid App.
    </p>
    </div>
    `

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth:{
            user: process.env.GMAIL,
            pass: process.env.PASS,
        },
    })

    const mailOptions = {
        from: process.env.GMAIL,
        to: email, 
        subject: "Hybrid_Team --- Welcome Message",
        text: "Lord",
        html: contactTemplate,
    }
    try {
        await transporter.sendMail(mailOptions);
        console.log("email sent successfully");
    } catch (error) {
        console.error("Error sending mail", error);
        throw error
        
    }
}

module.exports = {sendMail}