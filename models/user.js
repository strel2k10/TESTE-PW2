const User = function(user){
    this.username = user.username
    this.email = user.email
    this.contacto = user.contact
    this.password = user.password
    this.userType = user.userType
    this.ativo = user.active
}


module.exports = User