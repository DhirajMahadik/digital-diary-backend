const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    fullname: String,
    email: String,
    phone: String,
    password:String,
    task: Array,
    completed_task: Array,
},
    {
        timestamps: true
    })

module.exports = mongoose.model('dd-users', UserSchema); 