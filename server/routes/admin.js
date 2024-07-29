const express =require('express')
const router =express.Router();
const Post =require('../models/Posts');
const User =require('../models/Users');
const bcrypt=require('bcrypt');
const jwt =require('jsonwebtoken')

const jwtSecret=process.env.JWT_SECRET;
 
const adminLayout='../views/layouts/admin'
 
//admin-login page

router.get('/admin',(req,res)=>{
    try{    
        const locals={
            title:"admin",
            description:"Simple Blog Created with NodeJs,Express and MongoDB"
        }

        res.render('admin/index',{locals})

    }catch(error){
        console.log(error);
    }
   
})

//user login
router.post('/admin',async(req,res)=>{

    try {
        
        const {username,password}=req.body;
        const user= await User.findOne({username:username})
         
        if(!user){
            return res.status(401).json({message:"Invalid Credentials"})
        }
        const isPasswordValid=await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(401).json({message:"Invalid Credentials"})
        }
        
        const token = jwt.sign({userId:user._id},jwtSecret)
        res.cookie('token',token,{httpOnly:true})
        
       
        
        res.redirect('/dashboard')


    } catch (error) {
        return res.status(404).send('Internal Server Error')
    }

})

const authMiddleWare=(req,res,next)=>{
    const token =req.cookies.token;
    if(!token){
        return res.status(401).json({message:"unauthorized Access"})
    }
    try {
       
        const decoded=jwt.verify(token,jwtSecret);
        
        //req.userId=decoded.userId;
        if(decoded){ 
            next();
        }
         
       
    } catch (error) {
          res.status(401).json({message:"unauthorized Access"})
    }
}





router.get('/dashboard',authMiddleWare,async(req,res)=>{

    try{
res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

        const locals={
            title:"Dashboard",
            description:"Simple Blog create NodeJs,Express & MongoDB"
        }

        const data =await Post.find()
        res.render('./admin/dashboard',{data,locals,layout:adminLayout});
    }catch(error){
            console.log(error)
    }


})

 //get add post form
router.get('/add-post',authMiddleWare,async(req,res)=>{
    try{
        const locals={
            title:"Dashboard",
            description:"Simple Blog create NodeJs,Express & MongoDB"
        }

        const data =await Post.find()
        res.render('./admin/add-post',{locals,layout:adminLayout});
    }catch(error){
            console.log(error)
    }

})

//post -post data into the databasea
router.post('/add-post',authMiddleWare,async(req,res)=>{
    const{title,body}=req.body

    try{

        try {
            const newPost =new Post({
                title,
                body
            })
            
            
            const data =await Post.create(newPost)
            
            res.redirect('/dashboard');
       
        } catch (error) {
            console.log('Error:',error)
        }

   
    }catch(error){
            console.log(error)
    }

})
router.get('/edit-post/:id',authMiddleWare,async(req,res)=>{

    const locals={
        title:"Edit Post",
        description:"Simple Blog create NodeJs,Express & MongoDB"
    }
   
    try {
        const data =await Post.findOne({_id:req.params.id})
        console.log(data)
        return res.render("admin/edit-post",{data,layout:adminLayout,locals})

    } catch (error) {
        console.log('Error:',error)
    }
})










router.put('/edit-post/:id',authMiddleWare,async(req,res)=>{
        const {title,body,}=req.body
        try {
            await Post.findByIdAndUpdate(req.params.id,{
                title,
                body,
                updatedAt:Date.now()
            })
          

            //res.redirect(`/edit-post/${req.params.id}`)
            res.redirect(`/post/${req.params.id}`)
            

        } catch (error) {
            console.log('Error:',error)
        }
})


router.delete('/delete-post/:id',authMiddleWare,async(req,res)=>{
 
    try{    
        await Post.deleteOne({_id:req.params.id})
        res.redirect('/dashboard')

    }catch(error){
        console.log(error);
    }
   
})


router.get('/logout',authMiddleWare,async(req,res)=>{
        res.clearCookie('token');
        req.session.destroy();
        res.redirect('/admin')
})


/*
 

//Post
//Admin - Check login
router.post('/register',async(req,res)=>{
    try{    
        const {username,password}=req.body;
        
        const hashedPassword=await bcrypt.hash(password,10); 

        try {
            const user=await User.create({username,password:hashedPassword})
            res.status(201).json(`{message:'User Created',user:${user}}`)

        } catch (error) {
            if(error===11000){
                res.status(409).json(`{message:'Username taken..'}`)
            }
            res.status(500).json(`{message:'Internal Server Error'}`)
        }

    }catch(error){
        console.log(error);
    }
   
})















/*

router.get('/admin',(req,res)=>{
    const locals={
        title:"admin",
        description:"Simple Blog Created with NodeJs,Express and MongoDB"
    }
    try{    
        res.render('admin',{locals,data})

    }catch(error){
        console.log(error);
    }
   
})

*/
module.exports=router;