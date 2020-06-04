var express = require("express")
var bodyParser = require("body-parser")
var mustacheExpress = require('mustache-express')
var app = express()



app.engine('html',mustacheExpress())
app.set('view engine', 'html')


app.get('/',function(req,res){
    app.set('views',__dirname + '/views');
    res.render('index.html')
})


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

module.exports = app

require("./routes/user.js")(app)    
require("./routes/report.js")(app)

app.listen(3000,function(){
    console.log("Server running at localhost:3000")
})