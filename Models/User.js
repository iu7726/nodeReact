const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name:{
        type: String,
        maxlength: 50
    },
    email:{
        type: String,
        trim: true, //공백을 삭제합니다.
        unique: 1,
    },
    password: {
        type: String,
        maxlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        //권한
        type: Number,
        default:0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
});

const User = mongoose.model('User', userSchema);

//다른곳에서 사용할 수 있도록 exports
module.exports = { user }