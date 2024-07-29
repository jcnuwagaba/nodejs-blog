const express =require('express')
const router =express.Router();
const Post=require('../models/Posts');
const isActiveRoute = require('../helpers/routeHelpers');





 
//Routes
router.get('',async(req,res)=>{
    try{
        const locals={
            title:'node js blog',
            description:'Simple Blog created with nodejs and mongodb'
        }
        let perPage=10
        let page=req.query.page || 1;

        const data = await Post.aggregate({$sort:{createdAt:-1}})
        .skip(perPage*page-perPage)
        .limit(perPage)
        .exec();

        const count =await Post.countDocuments();
        const nextPage=parseInt(page)+1;
        const hasNextPage =nextPage<=Math.ceil(count/perPage)

       
       return res.render('index',{locals,data,current:page,nextPage:hasNextPage?nextPage:null,currentRoute:'/'})


    }catch(err){ 
        console.log('Error:',err)
    }

   
})

// get post :id
router.get('/post/:id',async(req,res)=>{
    try{
        let  link = req.params.id;
        const data=await Post.findById({_id:link})

        const locals={
            title:data.title,
            description:'Simple Blog created with nodejs and mongodb'
        }
       
     
        res.render('post',{locals,data,currentRoute:`/post/${link}`})
    }
    catch(error){
        console.log("Error:",error)
    }
})

//post search
router.post('/search',async(req,res)=>{
    try{
         
        const locals={
            title:"Search",
            description:'Simple Blog created with nodejs and mongodb'
        }
       let searchTerm=req.body.searchTerm;
        const searchTermNoSpecialChar=searchTerm.replace(/[^a-zA-Z0-9]/g,"")
        const data =await Post.find({
            $or:[
                    {title:{$regex:new RegExp(searchTermNoSpecialChar,'i')}},
                {body:{$regex:new RegExp(searchTermNoSpecialChar,'i')}}

            ]
        });
            //res.send(searchTermNoSpecialChar)
       res.render('search',{locals,data})
    }
    catch(error){
        console.log("Error:",error)
    }
})






router.get('/about',(req,res)=>{
    res.render('about',{currentRoute:'/about'})
})

router.get('/contact',(req,res)=>{
    res.render('about',{currentRoute:'/contact'})
})

module.exports=router;

/*

function insertPostData(){
    Post.insertMany([
      {
          title:'Building a Blog',
          body:'This is the text body'
      }
  ])
 
}

insertPostData();
*/