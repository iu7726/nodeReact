const express = require('express')
const app = express()
const port = 3000

//DB Connect
const mongoose = require("mongoose")
mongoose.connect('mongodb+srv://dbUser:min472315@boilerplate.xsr8b.mongodb.net/<dbname>?retryWrites=true&w=majority',{
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log("Mongo DB Connected..."))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})