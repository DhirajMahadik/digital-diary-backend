const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
const app = express()
const port = 5500
app.use(express.json())
mongoose.set('strictQuery', true);
app.use(cors())
const User = require('./Modals and DB/user')
const Connect = require('./Modals and DB/config')
const secretKey = "dhiraj"


const verify_token = (req, res, next)=>{
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader === 'undefined'){
        res.send({result:"invalid token"})
    }else{
        const bearer = bearerHeader.split(" ")
        const token = bearer[1]
        req.token = token
        next()
    }
}
 





// const verify_token =(req, res, next)=>{
//     const bearerHeader = req.headers['authorization'];
//     if(typeof bearerHeader === 'undefined'){
//         res.send({result :'invalid token'})
//     }else{
//         const bearer = bearerHeader.split(" ")
        
//         ;
//         const token = bearer[1]
//         req.token = token
//         next();
        
//     }x
 
// }

app.post('/add-user', async (req, res)=>{
    
    let checkUser = await User.findOne({email:req.body.email});
    if(checkUser){
        res.send("Email already exist")
    }else{
        bcrypt.hash(req.body.password,10,(err, hash)=>{
            console.log(hash)
            if(err){
                res.send(err)
            }else{
                console.log(req.body)
                let data =  new User({
                    fullname:req.body.fullname,
                    email:req.body.email,
                    phone:req.body.phone,
                    password:hash
                })
                data.save().then((result)=>{
                    res.send(result)
                    console.log(result)
                })
              
            }
        })
    }
    
})

app.post('/login', async (req, res)=>{
    // console.log(req.body)

    User.findOne({email: req.body.email}).then((response)=>{
        console.log(response)
        if(response){
            bcrypt.compare(req.body.password, response.password).then((success)=>{
                if(success){
                    JWT.sign({email: response.email, _id:response._id}, secretKey, {expiresIn: '900s'} , (err,token)=>{
                        if(err){
                            res.send(err)
                        }else{
                            res.send({token:token})
                            console.log(token)
                        }
                         
                    })
                }else{
                    res.send({error:"Invalid credential"})
                }
            })
        }else{
            res.status(400).send({error:"No user found with this email"})
        }
    })

    
})

app.get('/users', async(req, res)=>{
  let data = await  User.find()
    res.send(data)
})

// app.get('/user/:id', async(req,res)=>{
//     let id = req.params.id
//     let data =  await User.findOne({_id:id})
//     res.send(data)
// })

app.get('/user-profile', verify_token, (req, res)=>{
    JWT.verify(req.token, secretKey, (err, authData)=>{
        if(err){
            res.send(err)
        }else{
            console.log(authData._id)
            // User.findById(mongoose.Types.ObjectId(authData._id)).select('fullname email phone task completed_task').then((user)=>{
            //     res.send(user)
            // })
            User.findOne({_id:authData._id}).then((user)=>{
                res.send({fullname:user.fullname, email:user.email, phone:user.phone, task:user.task, completed_task:user.completed_task , id:user._id })
            })
        }

    })
})

app.post('/add-task', async(req, res)=>{
    let task = req.body.task;
    let id = req.body.id
    console.log(task)
    let data = await User.findOne({_id:id})
    let tasks = data.task
    tasks.push(task)
    User.updateOne({_id:id},
        {$set:{task:tasks}}
        ).then((resp)=>{
            res.send(resp)
        })
})



Connect().then(()=>{
    app.listen(port, ()=>{
        console.log("app is running at port:" + port)
    })
})