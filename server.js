var express = require("express")
var bodyPraser = require('body-parser')
var app = express()
//var port = process.env.PORT || 3000

var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')
const { sendStatus } = require("express/lib/response")


app.use(express.static(__dirname))
app.use(bodyPraser.json())
app.use(bodyPraser.urlencoded({extended:false}))

//const mongoDB  = 'mongodb+srv://Samirlc1:samirlamichhane@cluster0.gkoty.mongodb.net/Chat?retryWrites=true&w=majority';

const mongoDB= 'mongodb+srv://samirlc1:samirlamichhane@cluster0.gkoty.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
var Message = mongoose.model('Message',{
    name:String,
    message:String
})


app.get('/messages',(req,res)=>{
    Message.find({},(err,messages)=>{

        res.send(messages)
    })
    
})

app.post('/messages',(req,res)=>{
    var message = new Message(req.body)
    message.save((err)=> {
        if(err)
            sendStatus(500)
    
    io.emit('message',req.body)
    res.sendStatus(200)
    })
    
})

io.on('connection',(socket)=>{
    console.log('User connected')

    socket.on('disconnect', () => {
        console.log('User disconnected');
      })
})

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('MongoDB connected')
}).catch(err => console.log(err))

var server = http.listen(3000, ()=>{
    console.log("Server is Listening on port",server.address().port ) 
}) 

  