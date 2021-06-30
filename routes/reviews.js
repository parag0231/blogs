const express=require('express');
const router=express.Router({mergeParams:true});
const Blog=require('../modals/blogs');
const Review=require('../modals/review');
const {isLoggedIn}=require('../middleware');



router.post('/',isLoggedIn,async (req,res)=>{
    const blog=await Blog.findById(req.params.id);
    const review=new Review(req.body.review);
    review.author=req.user._id;
    blog.reviews.push(review);
    await review.save();
    await blog.save();
    req.flash('success','Added new review');
    res.redirect(`/blogs/${blog._id}`);
})

router.delete('/:idr',isLoggedIn,async (req,res)=>{
    const cr=await Review.findById(req.params.idr);
    if(!cr.author.equals(req.user._id)){
        req.flash('error','You do not have permission');
        return res.redirect(`/blogs/${req.params.id}`)
    }
    const blog=await Blog.findByIdAndUpdate(req.params.id,{$pull:{reviews:req.params.idr}});
    await Review.findByIdAndDelete(req.params.idr);
    req.flash('success','Succesfullly deleted review');
    res.redirect(`/blogs/${blog._id}`);
});

module.exports=router;