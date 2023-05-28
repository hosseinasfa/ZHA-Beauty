const controller = require('./controller');
const Blog = require('app/models/blog');
const Category = require('app/models/category');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');


class blogController extends controller {
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
                
            let blogs = Blog.find({ ...query}).populate('user');

            if(req.query.order)
                blogs.sort({ createdAt : -1 });
                blogs = await blogs.exec();

            let categories = await Category.find({});


            res.render('home/blogs' , { blogs , categories , title : 'مقاله ها'});
        } catch (err) {
            next(err);
        }
    }



    async single(req , res) {
        let blog = await Blog.findOneAndUpdate({ slug : req.params.blog } , { $inc : { viewCount : 1 }})
                                .populate([
                                    {
                                         path : 'user' , select : 'name'
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


        
        res.render('home/single-blog' , { blog , categories });
    }





    checkHash(req , episode) {
        let timestamps = new Date().getTime();
        if(req.query.t < timestamps) return false;

        let text = `GH#4%73@2WSdcfnasdkad${episode.id}${req.query.t}`;

        return bcrypt.compareSync(text , req.query.mac);
    }


}

module.exports = new blogController();