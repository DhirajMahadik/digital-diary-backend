const mongoose = require('mongoose')

const Connect = () => {

    return mongoose.connect('mongodb+srv://dhirajdemo9221:dhiraj%40123@dhirajcloud.i0murtn.mongodb.net/test')
   

}

module.exports = Connect