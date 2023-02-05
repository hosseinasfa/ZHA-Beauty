const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');



const categorySchema = mongoose.Schema({
    name : { type : String , required : true },
    slug : { type : String , required : true},
    parent : { type : Schema.Types.ObjectId , ref : 'Category' , default : null }
} , { timestamps : true , toJSON : { virtuals : true } });

categorySchema.plugin(mongoosePaginate);


categorySchema.virtual('childs' , {
    ref : 'Category',
    foreignField : 'parent',
    localField : '_id',
    
});


categorySchema.virtual('courses' , {
    ref : 'Course',
    localField : '_id',
    foreignField : 'categories'
});

module.exports = mongoose.model('Category' , categorySchema);