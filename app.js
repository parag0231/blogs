const express=require('express');
const app=express();
const path=require('path');
const mongoose=require('mongoose');
const Blog=require('./modals/blogs');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const Review=require('./modals/review');
const session=require('express-session');
const passport=require('passport');
const LocalStratergy=require('passport-local');
const User=require('./modals/user');
const flash=require('connect-flash');

//routes
const blogs=require('./routes/blogs');
const reviews=require('./routes/reviews')
const authroutes=require('./routes/auth');

mongoose.connect('mongodb+srv://parag:please999@cluster0.nir8g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false
});

const db=mongoose.connection;

db.on("error",console.error.bind(console,"connection error:"));

db.once("open",()=>{
    console.log("Database connected");
});

//setting ejs as view engine
app.set('view engine','ejs');

app.set('views',path.join(__dirname,'views'));


//when after form req.body is empty parsing request.body
app.use(express.urlencoded({extended:true}));




//form me method=post ko overritr karne ke liye put
app.use(methodOverride('_method'));

app.engine('ejs',ejsMate);


//to use content of public file
app.use(express.static(path.join(__dirname,'public')));

const sessionConfig={
    secret:'please',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}


app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());



//passport using
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
});


app.get('/',(req,res)=>{
    res.redirect('/blogs');
})


app.use('/blogs',blogs);
app.use('/blogs/:id/reviews',reviews);
app.use('/',authroutes);




app.listen(3000,()=>{
    console.log('app listening on 3000');
})
