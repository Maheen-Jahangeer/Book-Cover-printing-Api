import mongoose from "mongoose";

const Cart = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    products: [
        {
            productId: {
                type: String
            }, quantity: {
                type: String
            }
        }
    ]
}, {
    timestamps: true
})

export default mongoose.model('Cart', Cart);