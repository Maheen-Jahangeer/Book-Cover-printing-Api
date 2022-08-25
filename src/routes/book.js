import express, { response } from 'express';
import bcrypt from 'bcrypt';
import Books from '../model/Books.js';
import multer from 'multer';
import fs from 'fs';
import {verifyTokenAndAdmin, verifyTokenAndAuthorization, verifyToken} from '../helper/verifyToken.js';
import { responseHelper } from '../helper/responseHelper.js';

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
            bookName:req.body.bookName,
            bookDisciption:req.body.bookDisciption,
            image:req.body.image,
            categories:req.body.categories,
            rating:req.body.rating,
            ratingCount:req.body.ratingCount,
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
            const bookName = req.body.bookName
            const bookDisciption = req.body.bookDisciption
            const image  = {
                data: fs.readFileSync('src/images/'+req.file.filename),
                contentType:'images/jpg'
            }
            const price = req.body.price
            const rating = req.body.rating
            const ratingCount = req.body.ratingCount
            const updatedBooks = await Books.findByIdAndUpdate(req.params.id, {
                $set : {
                    bookName, bookDisciption, image, rating,ratingCount, price
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
router.get('/find/:id',verifyToken,async (req,res)=> {
    try{
            console.log('id', req.params.id)
            const books = await Books.findById(req.params.id)
            res.status(200).json(books);
            console.log('books', books)
    }catch(err){
        res.status(500).json(err.message);
        console.log('error',err)
    }
})

//Get all Bookss
router.get('/all-books',verifyToken,async(req,res)=> {
    const qNew =req.query.name
    const qCategories = req.query.categories;
    try{
        let books = [];
        if(qNew){
            books = await Books.find().sort({_id: -1}).limit(1) }
            else if(qCategories){
                books = await Books.find({categories: {
                    $in:[qCategories]
                }})
            }
            else{
            books = await Books.find();
        }
            // const {bookName} =  Books
            const bookName = 'test book Name'
        res.status(200).json(books)
        console.log("response for client", books)
    }catch(err){
        res.status(402).json(err.message);
        console.log("user id", err)
    }
})

export default router;