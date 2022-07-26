import express from 'express';
import bcrypt from 'bcrypt';
import Books from '../model/Books.js';
import multer from 'multer';
import fs from 'fs';
import {verifyTokenAndAdmin, verifyTokenAndAuthorization, verifyToken} from '../helper/verifyToken.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, 'src/images')
    },
    filename: (req,file,cb) => {
        cb(null, file.originalname)
    }
})
const upload = multer({storage: storage})

//Add Books
router.post('/add',verifyTokenAndAdmin,upload.single('image'), async (req,res) => {
    try{
        const newProduct = await new Books({
            title:req.body.title,
            desc:req.body.desc,
            image:{
                data:fs.readFileSync('src/images/'+req.file.filename),
                contentType:'image/jpg'
            },
            categories:req.body.categories,
            color:req.body.color,
            size:req.body.size,
            price:req.body.price
        })
        await newProduct.save();
        res.status(200).json(newProduct);
    }catch(e) {
        res.status(500).json(e.message)
    }
})


//Update Books
router.put('/:id', verifyTokenAndAdmin,upload.single('image'), async(req,res)=> {
    try{
        if(req.file){
            const title = req.body.title
            const desc = req.body.desc
            const image  = {
                data: fs.readFileSync('src/images/'+req.file.filename),
                contentType:'images/jpg'
            }
            const color =  req.body.color
            const size = req.body.size
            const price = req.body.price
            
            const updatedBooks = await Books.findByIdAndUpdate(req.params.id, {
                $set : {
                    title, desc, image, color, size, price
                }
            })
            res.status(200).json(updatedBooks);
        }
        const updatedBooks = await Books.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true})
        res.status(200).json(updatedBooks);
    }catch(err){
        res.status(500).json(err.message)}
})

//Delete Books
router.delete('/:id',verifyTokenAndAdmin,async (req,res)=> {
    try{
         await Books.findByIdAndDelete(req.params.id);
         res.status(200).json("Books deleted successfully")
    }catch(err){
        res.status(500).json(err.message)
    }
})

//Get Books by id
router.get('/find/:id',verifyTokenAndAdmin,async (req,res)=> {
    try{
            const Books = await Books.findById(req.params.id)
            res.status(200).json(Books)
    }catch(err){
        res.status(500).json(err.message)
    }
})

//Get all Bookss
router.get('/all-Bookss',verifyTokenAndAdmin,async(req,res)=> {
    const qNew =req.query.name
    const qCategories = req.query.categories;
    try{
        let Books = [];
        if(qNew){
        Books = await Books.find().sort({_id: -1}).limit(1) }
        else if(qCategories){
        Books = await Books.find({categories: {
                $in:[qCategories]
            }})
        }
        else{
            Books = await Books.find()
        }
        res.status(200).json(Books)
    }catch(err){
        res.status(500).json(err.message)
    }
})

export default router;