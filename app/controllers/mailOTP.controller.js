const nodemailer = require('nodemailer');
const model = require('../models');
var randomNumber;

module.exports.MailOTP = async (req, res) => {
	var email = req.body.email;

	var otp = Math.floor(1000 + Math.random() * 9000);
	randomNumber = otp;

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
        subject: "Email OTP",
        text: `This is your OTP: ${randomNumber}`,
        html: `<b>Enter this OTP: ${randomNumber} to activate your Online Auction account</b>`
	  });

	console.log(info);
	res.end();

}

module.exports.Validate = (req, res,next) => {

	if (parseInt(req.body.otp) == randomNumber) {
		console.log('OTP passed');
		next();
		
	} else {
		res.render('web/register', {
			layout: false,
			showMailOTP: true,
			OTPFailed: true
		});
		console.log('OTP failed');
	}
}

module.exports.ActivateUser = (req,res)=>{
	var user = req.body.email;
	model.user.Activate(user).then(function(result){
		if(result[0] == 1){
			console.log('activate thanh cong');
			res.render('web/register', {
				layout: false,
				registerSuccess: true
			});
		}
		else{
			console.log('activate that bai');
			res.render('web/register');
		}
	})
}
