const { User } = require('../Models/User');

let auth = (req, res, next) => {
    //인증처리
    
    // cookie
    let token = req.cookies.x_auth;

    // 토큰복호화 후 유저 검색
    User.findByToken(token, (err, user) => {

        if (err) throw err;
        if ( ! user) return res.json({ isAuth: false, error: true});

        req.token = token;
        req.user = user;
        next();
    });
    
    // 유저 있다면 인증
}

module.exports = { auth };