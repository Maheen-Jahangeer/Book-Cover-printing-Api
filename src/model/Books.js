import mongoose from "mongoose";

const Books = mongoose.Schema({
    title: {
        type: String,
        unique: true
    },
    desc: {
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
    }
}, {
    timestamps: true
});

export default mongoose.model('Books', Books)