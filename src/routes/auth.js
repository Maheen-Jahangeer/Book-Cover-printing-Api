import express from 'express';
import User from '../model/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router()

//register new user
router.post('/register',async (req,res)=> {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password,10)
        const newUser = new User({
            username: req.body.username,
            email:req.body.email,
            password:hashedPassword
        })
        await newUser.save();
        res.status(200).json(newUser)
    }catch(err){
        res.status(500).json(err)
    }
})

//login user
router.post('/login',async(req,res)=> {
    try{
        const user = await User.findOne({email:req.body.email})
        if(!user){
            res.status(500).json("User is not registered")
        }else{
            const isPasswordVerified = await bcrypt.compare(req.body.password, user?.password)
            if(isPasswordVerified){
                const accessKey = await jwt.sign({
                    id:user._id,
                    isAdmin:user.isAdmin
                })
                res.status(200).json({user, accessKey})
            }else{
                res.status(500).json('Passwords are incorrect')
            }
        }
    }catch(err){
        res.status(500).json(err)
    }
})

export default router;