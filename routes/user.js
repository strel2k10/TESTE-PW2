module.exports = app =>{
    const user = require("../controllers/user.js")

    app.get('/users/:idUser', user.findById)

    app.get('/users', user.findAll)
}