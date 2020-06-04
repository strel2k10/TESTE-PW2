const db = require("../db");
const report = require('../models/report.js');

exports.findById = (req,res) =>{
     const id_report = req.params.id_report

    db.con.query("SELECT fire_date,report_date,description,severity_level,password,user_type, FROM Report",
    id_report,(err,result)=>{
        if(err){
            console.log("Error:",err)
            res.status(500).send({message:err.message ||"ocorreu um erro"})
        }else if(!result[0]){
            res.status(404).send({"Not found": "User não foi encontrado"})
        }else{
            //res.status(200).send({"success":[result]})
            res.render('report.html',{
                report: result[0].description

            })
        }
    })
}

exports.findAll = (req,res) =>{
    db.con.query("SELECT * FROM report", (err,result)=>{
        if(err){
            console.log("Error:",err)
            res.status(500).send({message:err.message ||"ocorreu um erro"})
        }else if(!result[0]){
            res.status(404).send({"Not found": "User não foi encontrado"})
        }else{

            res.render('allReports.html',{
                data: result
            })
        }
    })
}
