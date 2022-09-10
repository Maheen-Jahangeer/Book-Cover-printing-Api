import express from 'express';
import { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } from '../helper/verifyToken.js';
import bcrypt from 'bcrypt';
import User from '../model/User.js';
// import { storage } from '../helper/firebase.js';
// import {ref} from 'firebase/storage';
// import {} from 'firebase/app'
// import {serviceAccount} from '../helper/book-cover-printing-firebase-adminsdk-be3me-6d1814b0fe.json';
// import storage from '@react-native-firebase/storage';
// import { firebaseConfig } from '../helper/firebase.js';
// import firebase from 'firebase';
// import { firestore } from 'firebase-admin';

const router = express.Router()

// var admin = require("firebase-admin");

// var serviceAccount = require("path/to/serviceAccountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

//update user
router.put('/update/:id', async (req, res) => {
    try {
        console.log('request bod items', req.body)
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10)
        }
        if(req.body.image !== ""){
            
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        })
        res.status(200).json(updatedUser)
    } catch (err) {
        console.log('error reason', err)
        res.status(500).json(err)
    }
})

//Delete user
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User deleted successfully")
    } catch (err) {
        res.status(500).json(err.message)
    }
})

//Get user by id
router.get('/find/:id', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json(err.message)
    }
})

//Get all users
router.get('/all-users', verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.name
    try {
        const users = query ? await User.find().sort({ _id: -1 }).limit(1) : await User.find()
        res.status(200).json(users)
    } catch (err) {
        res.status(500).json(err.message)
    }
})

export default router;