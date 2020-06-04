module.exports = app =>{
    const report = require("../controllers/report.js")

    app.get('/reports/:idReport', report.findById)

    app.get('/reports', report.findAll)
}