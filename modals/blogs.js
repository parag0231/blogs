const mongoose=require('mongoose');
const Review = require('./review');
const User = require('./user');
const Schema=mongoose.Schema;

const BlogSchema=new Schema({
    title:String,
    content:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ],
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
});

//mongo middleware use to delete all reviews related to a post
BlogSchema.post('findOneAndDelete',async (doc)=>{
    if(doc){
        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
});

module.exports=mongoose.model('Blog',BlogSchema);


