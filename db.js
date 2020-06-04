const mysql = require("mysql");



module.exports={
    mysql,
    con: mysql.createConnection({
        host:"localhost",
        user: "root",
        password: "toma1502",
        database: `mydb`
    })
} 
