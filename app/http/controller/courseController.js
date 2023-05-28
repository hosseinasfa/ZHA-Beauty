const controller = require('./controller');
const Course = require('app/models/course');
const Episode = require('app/models/episode');
const Category = require('app/models/category');
const Payment = require('app/models/payment');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const superagent = require('superagent');


class courseController extends controller {
    async index(req , res , next) {
        try {

          
           
            //for search
            let query = {};
            let { search , type , category} = req.query;

            if(search)
                query.title = new RegExp(search , 'gi');

            if(type && type != 'all')
                query.type = type;

            if(category && category != 'all') {
                category = await Category.findOne({ slug : category});
                if(category)
                    query.categories = { $in : [ category.id ]}
            }
                
            let courses = Course.find({ ...query});

            if(req.query.order)
                courses.sort({ createdAt : -1 });
                courses = await courses.exec();

            let categories = await Category.find({});


            res.render('home/courses' , { courses , categories , title : 'دوره ها'});
        } catch (err) {
            next(err);
        }
    }

    async payment(req , res , next) {
        try {
            this.isMongoId(req.body.course);

            let course = await Course.findById(req.body.course);
            if(! course) {
                return this.alertAndBack(req , res , {
                    title : 'دقت کنید',
                    text : 'چنین دوره ای یافت نشد',
                    icon : 'error'
                })
            }

            if(await req.user.checkLearning(course)) {
                return this.alertAndBack(req , res , {
                    title : 'دقت کنید',
                    text : 'شما قبلا در این دوره ثبت نام کرده اید',
                    icon : 'error',
                    button : 'خیلی خوب'
                })
            }

            if(course.price == 0 && (course.type == 'vip' || course.type == 'free')) {
                return this.alertAndBack(req, res, {
                    title : 'دقت کنید',
                    text : 'این دوره مخصوص اعضای ویژه یا رایگان است و قابل خریداری نیست',
                    type : 'error',
                    button : 'خیلی خوب'
                });
            }


          // buy proccess
          // این کد برای تابع Payment  و ایجاد شناسه ی پرداخت و ارجاع کاربر به درگاه پرداخت زرین پال
          let params = {
            merchant_id: 'f83cc956-f59f-11e6-889a-005056a205be',
            amount: course.price,
            callback_url: 'http://localhost:3000/courses/payment/checker',
            description: `بابت خرید ${course.title}`,
            email: req.user.email
        }
        superagent.post('https://api.zarinpal.com/pg/v4/payment/request.json')
            .send(params)
            .set('cache-control', 'no-cache')
            .set('content-type', 'application/json')
            .then(async data => {

                let payment = new Payment({
                    user: req.user.id,
                    course: course.id,
                    resnumber: JSON.parse(data.text).data.authority,
                    price: course.price
                });
                await payment.save();

                res.redirect(`https://www.zarinpal.com/pg/StartPay/${JSON.parse(data.text).data.authority}/ZarinGate`)
            }).catch(err => res.json(err));
    } catch (err) {
        next(err);
    }
    }

    async checker(req , res , next) {
        try {

            if(req.query.Status && req.query.Status !== 'OK')
                return this.alertAndBack(req, res , {
                    title : 'دقت کنید',
                    message : 'پرداخت شما با موفقیت انجام نشد',
                });
                
                let payment = await Payment.findOne({ resnumber : req.query.Authority}).populate('course').exec();

                if(! payment.course)
                return this.alertAndBack(req , res , {
                    title : 'دقت کنید',
                    text : 'دوره ای که شما پرداخت کرده اید وجود ندارد',
                    icon : 'error'
                });


                // و این کد هم برای قسمت تصدیق اصالت پس از پرداخت
                let params = {
                    merchant_id: 'f83cc956-f59f-11e6-889a-005056a205be',
                    amount: payment.course.price,
                    authority: req.query.Authority
     
                }
                superagent.post('https://api.zarinpal.com/pg/v4/payment/verify.json')
                    .send(params)
                    .set('cache-control', 'no-cache')
                    .set('content-type', 'application/json')
                    .then(async data => {
                        if (JSON.parse(data.text).data.code === 100) {
                            payment.set({paymentStatus: true});
                            req.user.coursesBought.push(payment.course.id);
                            await payment.save();
                            await req.user.save();
                            this.alert(req, {
                                title: 'با تشکر',
                                text: 'پرداخت مورد نظر با موفقیت انجام شد.',
                                icon: 'success',
                                button: 'بسیار خوب',
                            })
                            return res.redirect(payment.course.path());
                        } else {
                            return this.alertAndBack(req, res, {
                                title: 'دقت کنید',
                                text: 'پرداخت شما با موفقیت انجام نشد',
                                icon:'error',
                                button: 'خیلی خوب'
                            });
                        }
                    }).catch(err => {
                    //  return res.json(err);
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

    async single(req , res) {
        let course = await Course.findOneAndUpdate({ slug : req.params.course } , { $inc : { viewCount : 1 }})
                                .populate([
                                    {
                                         path : 'user' , select : 'name'
                                    } ,
                                    {
                                        path : 'episodes',
                                        options : {
                                            sort : { number : 1 }
                                        }
                                    }
                                ])
                                .populate([
                                    {
                                        path : 'comments',
                                        match : {
                                            parent : { $eq : null },
                                            approved : true
                                        },
                                        populate : [
                                            {
                                                path : 'user' , 
                                                select : 'name'
                                            },
                                            {
                                                path : 'comments',
                                                match : {
                                                    approved : true
                                                },
                                                populate : { path : 'user' , select : 'name'}
                                            }
                                        ]
                                    }
                                ]);

  

        let categories = await Category.find({ parent : null }).populate('childs').exec();


        
        res.render('home/single-course' , { course , categories });
    }

    async download(req , res , next) {
        try {
            this.isMongoId(req.params.episode);

            let episode = await Episode.findById(req.params.episode);
            if(! episode) this.error('چنین فایلی برای این جلسه وجود ندارد' , 404);

            if(! this.checkHash(req , episode)) this.error('اعتبار لینک شما به پایان رسیده است.' , 403)

            let filePath = path.resolve(`./public/download/A@S$Sdfsf!#gdfkjsdKX#$/${episode.videoUrl}`);
            if(! fs.existsSync(filePath)) this.error('چنین فایلی برای دانلود وجود ندارد.' , 404);

            await episode.inc('downloadCount');

        res.download(filePath);
        } catch (err) {
            next(err);
        }
    }



    checkHash(req , episode) {
        let timestamps = new Date().getTime();
        if(req.query.t < timestamps) return false;

        let text = `GH#4%73@2WSdcfnasdkad${episode.id}${req.query.t}`;

        return bcrypt.compareSync(text , req.query.mac);
    }


}

module.exports = new courseController();