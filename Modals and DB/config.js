const mongoose = require('mongoose')

const Connect = () => {

    return mongoose.connect('mongodb+srv://dhirajdemo9221:dhirajdemo%40123@cluster0.10xjk3l.mongodb.net/test')
   

}

module.exports = Connect