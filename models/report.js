const report = function(report){
    this.fire_date = report.fire_date
    this.report_date = report.report_date
    this.description = report.description
    this.severity_level = report.severity_level
    this.location = report.location
}

module.exports = report