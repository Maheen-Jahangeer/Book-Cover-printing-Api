import mongoose from "mongoose";

const Books = mongoose.Schema({
    bookName: {
        type: String,
        unique: true
    },
    bookDisciption: {
        type: String
    },
    image: {
        data: Buffer,
        contentType: String
    },
    price: {
        type: Number
    },
    offer: {
        type: Number
    },
    rating:{
        type:Number
    },
    ratingCount:{
        type:Number
    }
}, {
    timestamps: true
});

export default mongoose.model('Books', Books)