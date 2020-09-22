const express = require('express')
const app = express()
const port = 3000

const bodyParser = require('body-parser');
const { User } = require("./Models/User");

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

//application/json
app.use(bodyParser.json());

//DB Connect
const mongoose = require("mongoose")
mongoose.connect('mongodb+srv://dbUser:min472315@boilerplate.xsr8b.mongodb.net/<dbname>?retryWrites=true&w=majority',{
	useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log("Mongo DB Connected..."))
	.catch(err => console.log(err))

app.get('/', (req, res) => {
	res.send('Hello World!')
})

app.post('/register',(req, res) => {
	//회원 가입
	const user = new User(req.body)
	
	user.save((err, userInfo) => {
		if(err) return res.json({ success: false, msg: err})

		return res.status(200).json({success:true, msg: user})

	});//MongDB에서 제공해주는 Method

})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})