const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');




const blogSchema = mongoose.Schema({
    user : { type : Schema.Types.ObjectId , ref : 'User'},
    categories : [ { type : Schema.Types.ObjectId , ref : 'Category'} ],
    title : { type : String , required : true},
    slug : { type : String , required : true},
    body : { type : String , required : true},
    images : { type : Object , required : true},
    thumb : { type : String , required : true},
    tags : { type : String , required : true},
    time : { type : String , default : '00:00:00'},
    viewCount : { type : Number , default : 0},
    commentCount : { type : Number , default : 0},
    lang : { type : String , required : true }
} , { timestamps : true , toJSON : { virtuals : true }});

blogSchema.plugin(mongoosePaginate);



blogSchema.methods.inc = async function(field , num = 1) {
    this[field] += num;
    await this.save();
}



blogSchema.methods.path = function() {
    return `/blogs/${this.slug}`;
}



blogSchema.virtual('comments' , {
    ref : 'Comment',
    foreignField : 'blog',
    localField : '_id' 
    
});



module.exports = mongoose.model('Blog' , blogSchema);