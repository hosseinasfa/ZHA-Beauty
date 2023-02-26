const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');




const sliderSchema = mongoose.Schema({
    user : { type : Schema.Types.ObjectId , ref : 'User'},
    title : { type : String , required : true},
    slug : { type : String , required : true},
    images : { type : Object , required : true},
    thumb : { type : String , required : true},
} , { timestamps : true , toJSON : { virtuals : true }});

sliderSchema.plugin(mongoosePaginate);

sliderSchema.methods.path = function() {
    return `/sliders/${this.slug}`;
}


module.exports = mongoose.model('Slider' , sliderSchema);