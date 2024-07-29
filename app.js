
//modules
require('dotenv').config();
const express=require('express')
const expressLayout=require('express-ejs-layouts')
const methodOverride=require('method-override')
const cookieParser=require('cookie-parser');
const session =require('express-session')
const Mongostore=require('connect-mongo')
const connectDB= require('./server/config/db');

//custom functions
const {isActiveRoute}=require('./server/helpers/routeHelpers')
 
 
 
 

const app =express()
const PORT =5000 || process.env.PORT;

//connect DB
connectDB();

//middleware
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'))
app.use(session({
    secret:'keyboard cat',
    resave:false,
    saveUninitialized:false,
    store:Mongostore.create({
        mongoUrl:process.env.MONGODB_URI
    })
    
}))

app.use(express.static('public'));

//templating engine
app.use(expressLayout);
app.set('layout','./layouts/main')
app.set('view engine','ejs')
 
//global variables
app.locals.isActiveRoute=isActiveRoute;


//routes
app.use('/',require('./server/routes/main')) 
app.use('/',require('./server/routes/admin'))


app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}......`)
})