
//============================ sending mail to reset password confirmation ......

const nodeMailer = require("nodemailer")

const sendEmail = async (options) => {
    const transporter = nodeMailer.createTransport({
        host:process.env.SMPT_HOST,
        port:process.env.SMPT_PORT,
        // secure: false,
        auth:{
            user:process.env.SMPT_MAIL,
            pass:process.env.SMPT_PASSWORD,
        }
    })
   
 
    const mailOptions = { 
        from:process.env.SMPT_MAIL,
        to: options.email, 
        subject:options.subject,
        text:options.message 
    }


    console.log("message ==>" , mailOptions)
    
await transporter.sendMail(mailOptions)
}

module.exports = sendEmail

