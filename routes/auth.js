const express=require('express');
const router=express.Router();
const passport=require('passport');
const User=require('../modals/user');

router.get('/register',(req,res)=>{
    res.render('auth/register');
});


router.post('/register',async (req,res)=>{
    try{
        const {username,email,password}=req.body;
        const newuser=new User({email,username});
        const reguser=await User.register(newuser,password);
        req.login(reguser,err=>{
            if(err) return next(err);
            req.flash('success','Welcome to blog');
            res.redirect('/blogs');
        })
        
    }
    catch(err){
        req.flash('error',err.message);
        res.redirect('/register');
    }
});

router.get('/login',(req,res)=>{
    res.render('auth/login');
});


router.post('/login',passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}),(req,res)=>{
    req.flash('success','Welcome back');
    const redirectUrl=req.session.returnTo ||'/blogs';
    delete req.session.returnTo
    res.redirect(redirectUrl);
})


router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success','logout succesfull');
    res.redirect('/blogs');
});





module.exports=router;
