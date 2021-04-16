const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/key');

const { User } = require('./Models/User');
const { auth } = require('./middleware/auth');

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

//application/json
app.use(bodyParser.json());
app.use(cookieParser());

//DB Connect
const mongoose = require("mongoose")
mongoose.connect(config.mongoURI ,{
	useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log("Mongo DB Connected..."))
	.catch(err => console.log(err))

app.get('/', (req, res) => {
	res.send('Hello World!')
})

app.post('/api/users/register',(req, res) => {
	//회원 가입
	const user = new User(req.body)
	
	user.save((err, userInfo) => {
		if(err) return res.json({ success: false, msg: err})

		return res.status(200).json({success:true, msg: user})

	});//MongDB에서 제공해주는 Method

})

app.post('/api/users/login', (req, res) => {
	// 로그인

	// 요청된 이메일을 DB에서 찾음
	User.findOne({ email: req.body.email }, (err, user) => {
		if ( ! user) {
			return res.json({loginSuccess: false, message: "해당 이메일이 없습니다."})
		}

		// 요청된 이메일이 DB에 있다면 비밀번호 확인
		user.comparePassword(req.body.password, (err, isMatch) => {
			if ( ! isMatch) return res.json({loginSuccess: false, message: "비빌번호가 다릅니다."})
		});
		
		// 토큰 생성
		user.generateToken((err, user) => {
			if (err) return res.status(400).send(err);

			// 토큰 저장
			res.cookie("x_auth", user.token)
			.status(200).json({ loginSuccess: true, userId: user._id});
			
		})
	});
	
})

app.get('/api/users/auth', auth, (req, res) => {
	res.status(200).json({ user: req.user })
})

app.get('/api/users/logout', auth, (req, res) => {
	User.findOneAndUpdate(
		{ _id: req.user._id }, 
		{ token: "" }, 
		(err, user) => {
			if (err) return res.json({ success: false, err });
			return res.status(200).send({ success: true });
		}
	)
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})