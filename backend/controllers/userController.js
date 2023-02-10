const User=require("../models/userModel");

const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");

//
const router=require("express").Router();

// const User = require("../models/User");
const {verifyToken, verifyTokenAndAuthentication, verifyTokenAndAdmin}=require("./verifyToken");
// router.get("/usertest",(req,res)=>{
//     res.send("User test is successful");
// })

// router.post("/userposttest",(req,res)=>{
//     const username=req.body.username;
//     console.log(username);
//     res.send("your username is: " +username);
// })

//UPDATE
router.put("/:id", verifyTokenAndAuthentication,async(req,res)=>{
    // if(req.user.id===req.params.id || req.user.isAdmin){

    // }
    //change password
    if(req.body.password){
        req.body.password=CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();

    }
    try{
        const updatedUser=await User.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true});
        res.status(200).json(updatedUser);
    }catch(err){
        res.status(500).json(err);
    }
})


//DELETE USER
router.delete("/:id", verifyTokenAndAuthentication, async(req,res)=>{
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User is deleted")
    }
    catch(err){
        router.status(500).json(err);
    }
})

//GET USER
router.get("/find/:id", verifyTokenAndAdmin, async(req,res)=>{
    try{
        const user=await User.findById(req.params.id)
        // res.status(200).json(user)
        const { password, ...others} = user._doc;

        res.status(200).json(others);
    }
    catch(err){
        router.status(500).json(err);
    }
})

//GET ALL USERS
router.get("/", verifyTokenAndAdmin, async(req,res)=>{
    const query=req.query.new;

    try{
        const users=query? await User.find().sort({_id:-1}).limit(5) : await User.find()
        // res.status(200).json(user)
        // const { password, ...others} = user._doc;

        res.status(200).json(users);
    }
    catch(err){
        router.status(500).json(err);
    }
})


//GET USER STATS
router.get("/stats", verifyTokenAndAdmin,async(req,res)=>{
    const date=new Date();
    const lastyear=new Date(date.setFullYear(date.getFullYear()-1));
    try{
        const data= await User.aggregate([
            {$match: {createdAt:{$gte: lastyear}}},
            {$project: {month:{$month:"$createdAt"},},},
            {$group: {_id: "$month",total:{$sum:1}},},
        ]);
        res.status(200).json(data);
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports=router
