import express from 'express';
import { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } from '../helper/verifyToken.js';
import bcrypt from 'bcrypt';
import User from '../model/User.js';

const router = express.Router()

//update user
router.put('/update/:id', verifyTokenAndAuthorization,async (req,res)=> {
    try{
        if(req.body.password){
            req.body.password =await bcrypt.hash(req.body.password,10)
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            $set:req.body
        })
        res.status(200).json(updatedUser)
    }catch(err){
        res.status(500).json(err)
    }
})

//Delete user
router.delete('/:id',verifyTokenAndAdmin,async (req,res)=> {
    try{
         await User.findByIdAndDelete(req.params.id);
         res.status(200).json("User deleted successfully")
    }catch(err){
        res.status(500).json(err.message)
    }
})

//Get user by id
router.get('/find/:id',verifyTokenAndAdmin,async (req,res)=> {
    try{
            const user = await User.findById(req.params.id)
            res.status(200).json(user)
    }catch(err){
        res.status(500).json(err.message)
    }
})

//Get all users
router.get('/all-users',verifyTokenAndAdmin,async(req,res)=> {
    const query =req.query.name
    try{
        const users = query ? await User.find().sort({_id: -1}).limit(1) : await User.find()
        res.status(200).json(users)
    }catch(err){
        res.status(500).json(err.message)
    }
})

export default router;