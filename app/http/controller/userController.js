const controller = require('./controller');
const superagent = require('superagent');
const Payment = require('app/models/payment');

class userController extends controller {
    async index(req , res , next) {
        try {
            res.render('home/panel/index' , { title : 'پنل کاربری'})
        } catch (err) {
            next(err);
        }
    }

    async history(req , res , next) {
        try {
            let page = req.query.page || 1;
            let payments = await Payment.paginate({ user : req.user.id } , { page , sort : { createdAt : -1 } , limit : 20 , populate : 'course'});
            
            res.render('home/panel/history' , { title : 'پرداختی ها' , payments})
        } catch (err) {
            next(err);
        }
    }

    async vip(req , res , next) {
        try {
            res.render('home/panel/vip')
        } catch (err) {
            next(err);
        }
    }

    async vipPayment(req , res , next) {
        try {
            let plan = req.body.plan,
                price = 0;

                switch (plan) {
                    case "3":
                        price = 30000;
                        break;
                    case "12":
                        price = 120000;
                        break;
                    default:
                        price = 10000;
                        break;
                }


          // buy proccess
          // این کد برای تابع Payment  و ایجاد شناسه ی پرداخت و ارجاع کاربر به درگاه پرداخت زرین پال
          let params = {
            merchant_id: 'f83cc956-f59f-11e6-889a-005056a205be',
            amount: price,
            callback_url: 'http://localhost:3000/user/panel/vip/payment/check',
            description: 'بابت افزایش اعتبار ویژه',
            email: req.user.email
        }
        superagent.post('https://api.zarinpal.com/pg/v4/payment/request.json')
            .send(params)
            .set('cache-control', 'no-cache')
            .set('content-type', 'application/json')
            .then(async data => {

                let payment = new Payment({
                    user: req.user.id,
                    vip: true,
                    resnumber: JSON.parse(data.text).data.authority,
                    price: price
                });
                await payment.save();

                res.redirect(`https://www.zarinpal.com/pg/StartPay/${JSON.parse(data.text).data.authority}/ZarinGate`)
            }).catch(err => res.json(err));
        } catch (err) {
            next(err);
        }
    }

    async vipPaymentCheck(req , res , next) {
        try {

            if(req.query.Status && req.query.Status !== 'OK')
            return this.alertAndBack(req, res , {
                title : 'دقت کنید',
                message : 'پرداخت شما با موفقیت انجام نشد',
            });

            let payment = await Payment.findOne({ resnumber : req.query.Authority}).exec();


                if(! payment.vip)
                return this.alertAndBack(req , res , {
                    title : 'دقت کنید',
                    text : 'این تراکنش مربوط به افزایش اعتبار اعضای ویژه نمیشود',
                    icon : 'error'
                });


                // و این کد هم برای قسمت تصدیق اصالت پس از پرداخت
                let params = {
                    merchant_id: 'f83cc956-f59f-11e6-889a-005056a205be',
                    amount: payment.price,
                    authority: req.query.Authority
     
                }
                superagent.post('https://api.zarinpal.com/pg/v4/payment/verify.json')
                    .send(params)
                    .set('cache-control', 'no-cache')
                    .set('content-type', 'application/json')
                    .then(async data => {
                        if (JSON.parse(data.text).data.code === 100) {
                            payment.set({paymentStatus: true});

                            

                let time = 0,
                    type = ''

                switch (payment.price) {
                    case 10000:
                        time = 1;
                        type = 'month';
                        break;
                    case 30000:
                        time = 3;
                        type = '3month';
                        break;
                    case 120000:
                        time = 12;
                        type = '12month';
                        break;
                }

                if(time == 0) {
                    this.alert(req, {
                        title: 'دقت کنید',
                        text: 'پرداخت مورد نظر با موفقیت انجام نشد.',
                        icon: 'error',
                        button: 'بسیار خوب',
                    })
                    return res.redirect('/user/panel/vip');
                }

                let vipTime = req.user.isVip() ? new Date(req.user.vipTime) : new Date();
                vipTime.setMonth( vipTime.getMonth() + time);

                req.user.set({ vipTime , vipType : type});
                await req.user.save();




                            await payment.save();
                            this.alert(req, {
                                title: 'با تشکر',
                                text: 'پرداخت مورد نظر با موفقیت انجام شد.',
                                icon: 'success',
                                button: 'بسیار خوب',
                            })
                            return res.redirect('/user/panel/vip');
                        } else {
                            return this.alertAndBack(req, res, {
                                title: 'دقت کنید',
                                text: 'پرداخت شما با موفقیت انجام نشد',
                                icon:'error',
                                button: 'خیلی خوب'
                            });
                        }
                    }).catch(err => {
                    return this.alertAndBack(req, res, {
                        title: 'دقت کنید',
                        text: 'پرداخت شما با موفقیت انجام نشد',
                        icon:'error',
                        button: 'خیلی خوب'
                    });
                });
        } catch (err) {
            next(err);
        }
    }


}

module.exports = new userController();