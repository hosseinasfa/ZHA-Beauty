const controller = require('app/http/controller/controller');
const passport = require('passport');
const PasswordReset = require('app/models/password-reset');
const User = require('app/models/user');
const uniqueString = require('unique-string');
const nodemailer = require('nodemailer');


class forgotPasswordController extends controller {
    showForgotPasswordForm(req , res , next) {
        try {
            const title = ' فراموشی رمز عبور';
            res.render('home/auth/passwords/email' , { title });
        } catch (err) {
            next(err);
        }
    }

    async sendPasswordResetLink(req , res , next) {
        try {
            let result = await this.validationData(req)
            if(result) { 
                return this.sendResetLink(req , res);
            } 
            
            return this.back(req , res);
              
        } catch (err) {
            next(err);
        }
  };

async  sendResetLink(req , res , next) {
    try {
        let user = await User.findOne({ email : req.body.email });
        if(! user) {
            req.flash( 'errors' , 'چنین کاربری وجود ندارد');
            return this.back(req , res);
        }
    
        const newPasswordReset = new PasswordReset({
            email : req.body.email,
            token : uniqueString()
        });
    
        await newPasswordReset.save();
    
        // Send Email
        let transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            secure: false, // true for 465, false for other ports
            auth: {
              user: 'c7b72b7e786530', // generated ethereal user
              pass: 'b2744c2de9b4bd', // generated ethereal password
            },
        });

          // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"مجله زیبایی ژا 👻" <zhabeauty.ir>', // sender address
            to: `${newPasswordReset.email}`, // list of receivers
            subject: "بازیابی رمز عبور", // Subject line
            html: `
                <h2>بازیابی رمز عبور</h2>
                <p>برای بازیابی رمز عبور بر روی لینک زیر کلیک کنید</p>
                <a href="${config.siteurl}/auth/password/reset/${newPasswordReset.token}">بازیابی</a>
            `
        });

        transporter.sendMail(info , (err , info) => {
            if(err) return console.log(err);

            console.log('Message Sent : %s' , info.messageId );

            this.alert(req , {
                title : 'دقت کنید',
                message : 'لینک بازیابی رمز عبور به ایمیل شما ارسال شد',
                icon : 'success'
            });

            return res.redirect('/');

        })
        
    
        /* req.flash( 'success' , 'ایمیل بازیابی رمز عبور با موفقیت ارسال شد'); */
        res.redirect('/');
    } catch (err) {
        next(err);
    }

  }

}

module.exports = new forgotPasswordController();