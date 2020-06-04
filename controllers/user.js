const db = require("../db");
const user = require('../models/user.js');
const bcrypt = require("bcrypt");
var config = require('../config');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer')


exports.findById = (req,res) =>{
     const id_user = req.params.id_user

    db.con.query("SELECT username,password,contact,email,user_type FROM user",
    id_user,(err,result)=>{
        if(err){
            console.log("Error:",err)
            res.status(500).send({message:err.message ||"ocorreu um erro"})
        }else if(!result[0]){
            res.status(404).send({"Not found": "User não foi encontrado"})
        }else{
            //res.status(200).send({"success":[result]})
            res.render('idUser.html',{
                name: result[0].username

            })
        }
    })
}

exports.findAll = (req,res) =>{
    db.con.query("SELECT * FROM user", (err,result)=>{
        if(err){
            console.log("Error:",err)
            res.status(500).send({message:err.message ||"ocorreu um erro"})
        }else if(!result[0]){
            res.status(404).send({"Not found": "User não foi encontrado"})
        }else{

            res.render('allUsers.html',{
                data: result
            })
        }
    })
}
function sendSignUpMail(res,email){

    let idUser = 0
            
    User.getLastId((err,data)=>{
        if(err){
            if(err.kind==="not_found"){
                id_user = 0
            }else{
                res.status(500).send({message:err.message || "Ocorreu um erro"})
            }
        }else{

            idUser = data[0].id_user
            console.log(id_user)
            // If no errors or conflicts are encountered:
            var token = jwt.sign({id:id_user}, config.secret, {
                expiresIn: new Date().getTime() +  10 * 60 * 1000 // expires in 10 min
            });

            var transporter = nodemailer.createTransport({
                service:'gmail',
                auth:{
                    user:'user@gmail.com',
                    pass:'user.'
                }
            })

            var mailOptions = {
                from:'user@gmail.com',
                to:email,
                subject:"Registo lit",
                html:'<h1>Por favor confirme a sua conta no link abaixo!</h1><a href="http://localhost:3000/confirm/'+token+'"><H2>Clique aqui!</H2></a>'
            }

            transporter.sendMail(mailOptions,function(err,info){
                if(err){
                    console.log(err);
                    res.status(500).send({message:err.message || "Ocorreu um erro"})
                }else{
                    console.log('Message sent: ' + info.response);
                    return res.status(201).send({"success": "Registo feito! Por favor verifique o seu email para confirmar a sua conta."});
                }
            })
        
        }
    })
}

exports.signUp = (req,res)=>{
    
    if(!req.body){
        res.status(400).send({message:"Content cannot be empty"})
    }else{
        const username = db.con.escape(req.body.username)
        const password = req.body.password
        const contact = req.body.contact
        const email = req.body.email
        const user_type = db.con.escape(req.body.user_type)
        

        user.findAll((err,data)=>{
            if (err){
                if(err.kind==="not_found"){
                    bcrypt.hash(password,10).then(function(hash){
                        const user = new User({
                            username : username,
                            password:hash,
                            contact: contact,
                            email: email,
                            user_type: user_type
                        })
                        
                        user.signUp(user,(err,data)=>{
                            if(err){  
                                return res.status(500).send({message:err.message || "Ocorreu um erro"})
                            }
                  
                            else{
                                sendSignUpMail(res,email)
                            }
                           
                        })
                        
                    })
                    
                }else{
                    return res.status(500).send({message:err.message ||"Ocorreu um erro"})
                }
                
            }else{
                
                let conflict = false
                //Checks if there's a conflicting email or username
                data.find((data)=>{
                    
                    if(data.email === email  || data.username === username){
                        conflict = true
                       return 
                    }
                })
                console.log(conflict)
              

                if(conflict == false){
                    bcrypt.hash(password,10).then(function(hash){
                        const user = new User({
                            username : username,
                            password:hash,
                            email: email,
                            contact: contact,                            
                            user_type: user_type,                          
                        })
                        
                        User.signUp(user,(err,data)=>{
                            if(err){  
                                return res.status(500).send({message:err.message || "Ocorreu um erro"})
                            }
                            /* 
                            else if (!err){
                               
                                // create a token
                                var token = jwt.sign({id:data[0].idUser}, config.secret, {
                                    expiresIn: 86400 // expires in 24 hours
                                });
                                return res.status(200).send({ auth: true, token: token });
                            }
                            */
                     
                           else{
                            sendSignUpMail(res,email)
                           } 
                           
                        })
                    })

                }else{
                    return res.status(409).send({"conflict":"O nome do utilizador ou email já está a ser utilizado"})
                }
                

                
            }
           


            

        })
    }
}




exports.verifyToken = (req,res,next)=>{
    var token = req.headers['x-access-token'];
    if (!token)
      return res.status(403).send({ auth: false, message: 'No token provided.' });
      
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err)
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        
      // if everything good, save to request for use in other routes
      req.idUser = decoded.id;
      next();
    });
}




exports.confirm = (req,res) =>{
    
    var token = req.params.token

    var data = jwt.decode(token,config.secret);
    
    console.log(data)
    console.log(new Date(data.exp));
    console.log(new Date());

    if(new Date(data.exp)> new Date()){
        
            console.log("user found");

            User.confirm(data.id,(err,result)=>{
                if(err){
                    if(err.kind==="not_found"){
                        res.status(404).send({"not found": "O utilizador não foi encontrado"})
                    }
                    else{
                        res.status(500).send({message:err.message || "Ocorreu um erro"})
                    }
                }else{

                    res.status(200).send({"success":"Email foi verificado"})
                }
            })
        
    }else{
        console.log("Link is expired");
        res.status(401).send({"Expired":"O token passou o prazo de validade"})
    }
}

exports.login = (req,res) =>{

    const username = db.con.escape(req.body.username)
    const password = req.body.password

    
        User.findAll((err,data)=>{
            if(err){
                if(err.kind==="not_found"){
                    res.status(404).send({"not found": "Nenhum utilizador foi encontrado"})
                }else{
                    res.status(500).send({message:err.message || "Ocorreu um erro"})
                }
            }else{

                let found = false
                let errorMessage = ""

                data.find((data)=>{
              
                    if(data.username == username && bcrypt.compareSync(password,data.password)){
                        found = true
                      
                    }
                })

              
                if(found == true){
                    var token = jwt.sign({ id: data.idUser }, config.secret, {
                        expiresIn: 86400 // expires in 24 hours
                      });

                    res.status(201).send({ auth: true, token: token });
                }else{
                    res.status(401).send({ auth: false, token: null, message:"As credenciais são inválidas" });
                }
            }
        })
      
}