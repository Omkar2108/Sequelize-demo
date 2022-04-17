const express = require('express');
const {User} = require('./models');
const argon2 = require('argon2');

const app = express();

app.use(express.json());

const port = 4000;
app.get('/', (_, res)=>{
    
    res.send('Hello World');
})

app.post('/register', async (req, res)=>{
    const {username, password} = req.body;
    const hashedPassword = await argon2.hash(password);
    User.create({username, password:hashedPassword})
    .then(user=>{
        res.send(user);
    })
    .catch(err=>{
        res.send(err);
    })
})

app.get('/getalluser', async(_, res)=>{
    User.findAll()
    .then(users=>{
        res.send(users);
    })
    .catch(err=>{
        res.send(err);
    })
})

app.post('/login', async (req, res)=>{
    const {username, password} = req.body;
    const hashedPassword = await argon2.hash(password);
    await User.findOne({where:{username, password:hashedPassword}})
    .then(user=>{
        res.send({user, auth:true});
    })
    .catch(err=>{
        res.send(err);
    })
})

app.post('/update', async (req, res)=>{
    const {username, password, newPassword} = req.body;
    const hashedPassword = await argon2.hash(password);
    await User.findOne({where:{username, password:hashedPassword}})
    .then(user=>{
        user.password= argon2.hash(newPassword);
        user.save();
        res.send(user);
    })
    .catch(err=>{
        res.send(err);
    })
})

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
})