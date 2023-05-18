import express from 'express'
import jwt from'jsonwebtoken'
import mongoose from 'mongoose'

const app = express()

mongoose
    .connect('mongodb+srv://rafa:Uy6PES6HxKA8UTV@cluster0.oinetw9.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log('DB works perfectly'))
    .catch((err) => console.log('DB error occured', err))

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello world')
})

app.post('/auth/login', (req, res) => {
    console.log(req.body)

    // when we get a request, we would need to generate a jwt
    const token = jwt.sign({
        name: req.body.name,
        email: req.body.email
    }, 'secretkey123')

    res.json({ 
        message: 'login successfull',
        token
    })
})

app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log('Server is running on port 4444')
})