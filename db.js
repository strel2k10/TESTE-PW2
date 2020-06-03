const mysql = require("mysql");



module.exports={
    mysql,
    con: mysql.createConnection({
        host:"localhost:3306",
        user: "root",
        password: "123456789",
        database: `teste`
    })
} 
