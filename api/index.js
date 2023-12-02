const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const crypto = require('crypto')
const nodemailer = require('nodemailer')

const app = express()
const port = 3000
const cors = require('cors')
app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
const jwt = require('jsonwebtoken')

mongoose.connect('mongodb+srv://root:root@cluster0.b5pvpka.mongodb.net/')
.then(()=>{
    console.log("Connexion à la base de données avec succès")
})
.catch((err)=>{
    console.log("Erreur lors de la connexion avec la base de données", err)
})
app.listen(port, ()=>{
    console.log("Le serveur est lancé sur le port 3000")
})

const User = require("./models/user")
const Post = require("./models/post")

app.post('/register', async(req,res)=>{
    try{
        const {name, email, password} = req.body
        const existingUser = await User.findOne({email})
        
        if(existingUser){
            return res.status(400).json({message:"L'email est déja utilisé"})
        }

        const newUser = new User({
            name:name,
            password:password,
            email:email
        })

        newUser.verificationToken = crypto.randomBytes(20).toString("hex")

        await newUser.save()

        sendVerificationEmail(newUser.email, newUser.verificationToken)

        res.status(200).json({message:"Inscription avec succès !"})
    }
    catch(err){
        console.log("erreur lors de l'inscription", err)
        res.status(500).json({message: "erreur lors de l'enregistrement de l'utilisateur"})
    }
})

const sendVerificationEmail = async(email, verificationToken) => {
    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"esteprowork@gmail.com",
            pass:"gdvo pftx xslg chxa"
        }
    })

    const mailOptions = {
        from:"chibanis.com",
        to:email,
        subject:"Verification de votre addresse mail",
        text:`cliquer sur le lien suivant pour verifier votre addresse mail : http://localhost:3000/verify/${verificationToken}`
    }
    try {
        await transporter.sendMail(mailOptions)
    }
    catch (err) {
        console.error("erreur lors de l'envoi de l'email de vérification", err)
    }
}

app.get("/verify/:token", async(req, res) =>{
    try{
        const token = req.params.token
        const user = await User.findOne({verificationToken: token})
        if(!user){
            return res.status(404).json({message: "Lien déja utilisé"})
        }
        user.verified = true
        user.verificationToken = undefined
        await user.save()

        return res.status(200).json({message:"Addresse email vérifiée"})      
    }
    catch(err){
        console.log("lien invalide", err)
        res.status(500).json({message: "Erreur lors de la vérification de l'adresse mail"})
    }
})

const generateSecretKey = () => {
    const secretKey = crypto.randomBytes(32).toString("hex")
    return secretKey
}

const secretKey = generateSecretKey()

app.post("/login", async(req, res) =>{
    try{
        const {email, password} = req.body
        const user = await User.findOne({email:email})
        if(!user){
            res.status(400).json({message:"Adresse email ou mot de passe invalide"})
        }
        if(user.password !== password){
            res.status(400).json({message:"Adresse email ou mot de passe invalide"})
        }
        const token = jwt.sign({userId:user._id}, secretKey)

        res.status(200).json({token})
    }
    catch(err){
        console.log("Erreur lors de la connexion")
        res.status(500).json({message:"La connexion a echoué"})
    }
})