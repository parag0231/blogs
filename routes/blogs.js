const express=require('express');
const router=express.Router();
const Blog=require('../modals/blogs');
const Review=require('../modals/review');
const {isLoggedIn}=require('../middleware');

router.get('/',async (req,res)=>{
    const blogs=await Blog.find({});
    res.render('blogs/index',{blogs});
});

router.get('/new',isLoggedIn,(req,res)=>{
    res.render('blogs/new');
});

router.post('/',isLoggedIn,async (req,res)=>{
    
    const blog=new Blog(req.body.blog);
    blog.author=req.user._id;
    await blog.save();
    req.flash('success','Successfully created a new blog');
    res.redirect(`/blogs/${blog._id}`);
});

router.get('/:id',isLoggedIn,async (req,res)=>{
    const blog=await Blog.findById({_id:req.params.id}).populate({path:'reviews',populate:{path:'author'}}).populate('author');
    if(!blog){
        req.flash('error','Cannot find this blog');
        return res.redirect('/blogs');
    }
    res.render('blogs/show',{blog});
});

router.get('/:id/edit',isLoggedIn,async (req,res)=>{
    const blog=await Blog.findById({_id:req.params.id});
    if(!blog){
        req.flash('error','Cannot find this blog');
        return res.redirect('/blogs');
    }
    if(!blog.author.equals(req.user._id)){
        req.flash('error','You do not have permission');
        return res.redirect(`/blogs/${req.params.id}`)
    }
    res.render('blogs/edit',{blog});
});


router.put('/:id',isLoggedIn,async (req,res)=>{
    const cblog=await Blog.findById(req.params.id);
    if(!cblog.author.equals(req.user._id)){
        req.flash('error','You do not have permission');
        return res.redirect(`/blogs/${req.params.id}`)
    }
    const blog=await Blog.findByIdAndUpdate({_id:req.params.id},{...req.body.blog},{new:true});
    req.flash('success','Successfully updated blog');
    res.redirect(`/blogs/${blog._id}`);
});


router.delete('/:id',isLoggedIn,async (req,res)=>{
    const {id}=req.params;
    await Blog.findByIdAndDelete(id);
    req.flash('success','Succesfullly deleted blog');
    res.redirect('/blogs');
});

module.exports=router;