import mongoose from "mongoose";

const User = mongoose.Schema({
    username: {
        type: String,
        min: 4,
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
}, {
    timestamps: true
})

export default mongoose.model('User', User);