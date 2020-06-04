const db = require("../db");
const user = require('../models/user.js');

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
