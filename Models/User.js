const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

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
        minlength: 5
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

// save함수를 실행하기 전에 해당 함수를 먼저 실행합니다.
userSchema.pre('save', function(next) {
    let user = this;

    if ( ! user.isModified('password')) return next();

    // 비밀번호를 암호화 시킴
    bcrypt.genSalt(saltRounds, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();// 다음 함수로 진행 여기서는 save 함수

        })

    });

}); //MongDB에서 제공해주는 Method

// 비밀번호 확인
userSchema.methods.comparePassword = function (inputPassword, cb) {

    let user = this;

    bcrypt.compare(inputPassword, user.password, (err, isMatch) => {
        if(err) return cb(err);

        cb(null, isMatch);
    });
}

// 토큰 생성
userSchema.methods.generateToken = function(cb) {

    let user = this;

    // jsonwebtoken 사용
    user.token =  jwt.sign(user._id.toHexString(), 'secretToken');
    user.save(function(err, user) {
        if (err) return cb(err);

        cb(null, user);
    })
    
}

userSchema.statics.findByToken = function(token, cb) {
    let user = this;

    //토큰 decode
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // 유저 아이디를이용하여 유저 검색 후
        // 클라이언트에서 가져온 token과 db에 보관된 토큰이 일치하는지 확인
        user.findOne({'_id' : decoded, 'token' : token}, function (err, user) {
            if (err) return cb(err);

            cb(null, user);
        });

    });
}

const User = mongoose.model('User', userSchema);

//다른곳에서 사용할 수 있도록 exports
module.exports = { User }