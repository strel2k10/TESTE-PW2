const db = require("../db");
const User = require('../models/user.js');

exports.findById = (req,res) =>{
     idUser = req.params.idUser

    db.con.query("SELECT username,email,contacto,avatar,password,dieta,userType,idRestaurante FROM User WHERE idUser = ? ativo = 1",
    idUser,(err,result)=>{
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
    db.con.query("SELECT * FROM User", (err,result)=>{
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
