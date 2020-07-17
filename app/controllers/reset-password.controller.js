const nodemailer = require('nodemailer');
const model = require('../models');
const bCrypt = require('bcryptjs');

var User = model.user;
var tempPassword;


module.exports.IdentifyEmailExist = (req,res,next) => {
    var email = req.body.email;
    User.findOne({
        where:{
            email: email,
        } 
    }).then(function(user){
        if(!user){
            res.render('./web/reset-password',{
                layout: false,
                hasErrors: true,
                message: 'Email is not found',
            })
            console.log("Email not found");
            return;
        }
        else{
            next();
        }
    })
}

module.exports.SendMail = async (req,res, next) => {
    var email = req.body.email;

	tempPassword = MakeTempPass(10);

	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'onlineauction.hcmus@gmail.com',
			pass: '12345678a@'
		},
		tls: {
			// do not fail on invalid certs
			rejectUnauthorized: false
		}
	});

	let info = await transporter.sendMail({
		from: '"Online Auction" <onlineauction@gmail.com>',
        to: `${email}`,
        subject: "Reset Password",
        text: `This is your new temporary password: ${tempPassword}`,
        html: `<b>Use this password to login and make sure to change your password later: ${tempPassword}</b>`
      });
      
    next();
}

module.exports.ChangeTemporyPassword = (req,res) =>{
    var email = req.body.email;
    User.findOne({
        where:{
            email: email,
        } 
    }).then(function(user){
        if(user)
        {
            var hashPass = bCrypt.hashSync(tempPassword, bCrypt.genSaltSync(8), null);
            user.password = hashPass;
            User.ChangePassword(user);
            
            res.render('./web/reset-password',{
                layout:false,
                ResetPasswordSuccess: true,
            })
        }
        else
        {
            res.render('./web/reset-password',{
                layout:false,
                hasErrors: true,
                message: "Something went wrong, please try again later",
            });
            return;
        }
    });
}

function MakeTempPass(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }