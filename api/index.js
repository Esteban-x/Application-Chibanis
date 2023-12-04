const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const crypto = require('crypto')
const nodemailer = require('nodemailer')

const app = express()
const port = 3000
const cors = require('cors')
app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const jwt = require('jsonwebtoken')

mongoose.connect('mongodb+srv://root:root@cluster0.b5pvpka.mongodb.net/')
    .then(() => {
        console.log("Connexion à la base de données avec succès")
    })
    .catch((err) => {
        console.log("Erreur lors de la connexion avec la base de données", err)
    })
app.listen(port, () => {
    console.log("Le serveur est lancé sur le port 3000")
})

//CONNEXION ET INSCRIPTION

const User = require("./models/user")
const Post = require("./models/post")

app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body
        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({ message: "L'email est déja utilisé" })
        }

        const newUser = new User({
            name: name,
            password: password,
            email: email
        })

        newUser.verificationToken = crypto.randomBytes(20).toString("hex")

        await newUser.save()

        sendVerificationEmail(newUser.email, newUser.verificationToken)

        res.status(200).json({ message: "Inscription avec succès !" })
    }
    catch (err) {
        console.log("erreur lors de l'inscription", err)
        res.status(500).json({ message: "erreur lors de l'enregistrement de l'utilisateur" })
    }
})

const sendVerificationEmail = async (email, verificationToken) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "esteprowork@gmail.com",
            pass: "gdvo pftx xslg chxa"
        }
    })

    const mailOptions = {
        from: "chibanis.com",
        to: email,
        subject: "Verification de votre addresse mail",
        text: `cliquer sur le lien suivant pour verifier votre addresse mail : http://localhost:3000/verify/${verificationToken}`
    }
    try {
        await transporter.sendMail(mailOptions)
    }
    catch (err) {
        console.error("erreur lors de l'envoi de l'email de vérification", err)
    }
}

app.get("/verify/:token", async (req, res) => {
    try {
        const token = req.params.token
        const user = await User.findOne({ verificationToken: token })
        if (!user) {
            return res.status(404).json({ message: "Lien déja utilisé" })
        }
        user.verified = true
        user.verificationToken = undefined
        await user.save()

        return res.status(200).json({ message: "Addresse email vérifiée" })
    }
    catch (err) {
        console.log("lien invalide", err)
        res.status(500).json({ message: "Erreur lors de la vérification de l'adresse mail" })
    }
})

const generateSecretKey = () => {
    const secretKey = crypto.randomBytes(32).toString("hex")
    return secretKey
}

const secretKey = generateSecretKey()

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(400).json({ message: "Adresse email ou mot de passe invalide" })
        }
        if (user.password !== password) {
            return res.status(400).json({ message: "Adresse email ou mot de passe invalide" })
        }
        const token = jwt.sign({ userId: user._id }, secretKey)

        return res.status(200).json({ token })
    }
    catch (err) {
        console.log("Erreur lors de la connexion")
        return res.status(500).json({ message: "La connexion a echoué" })
    }
})

//RECUPERER TOUS LES UTILISATEURS SAUF CELUI CONNECTE

app.get("/user/:userId", (req, res) => {
    try {
        const loggedInUserId = req.params.userId
        User.find({ _id: { $ne: loggedInUserId } }).then((users) => {
            res.status(200).json(users)
        }).catch((err) => {
            console.log("Erreur ", err)
            res.status(500).json("erreur lors de la récupération des utilisateurs")
        })
    }
    catch (err) {
        console.log("erreur lors de la récupération des utilisateurs")
        res.status(500).json({ message: "erreur lors de la récupération des utilisateurs" })
    }
})

//SYSTEME DE FOLLOW
app.post("/follow", async (req, res) => {
    const { currentUserId, selectedUserId } = req.body
    try {
        await User.findByIdAndUpdate(selectedUserId, {
            $push: { followers: currentUserId }
        })
        res.sendStatus(200)
    } catch (err) {
        console.log("Erreur: ", err)
        res.status(500).json({ message: "Erreur lors de l'abonnement à l'utilisateur" })
    }
})

app.post("/users/unfollow", async (req, res) => {
    const { loggedInUserId, targetUserId } = req.body
    try {
        await User.findByIdAndUpdate(targetUserId, {
            $pull: { followers: loggedInUserId }
        })
        res.status(200).json({ message: "Vous ne suivez plus cette personne" })
    } catch (err) {
        res.status(500).json({ message: "Erreur: ", err })
    }
})

//SYSTEME DE PUBLICATION
app.post("/create-post", async (req, res) => {
    try {
        const { content, userId } = req.body
        const newPostData = {
            user: userId,
        }
        if (content) {
            newPostData.content = content
        }
        const newPost = new Post(newPostData)
        await newPost.save()

        res.status(200).json({ message: "Nouveau post créé" })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "erreur: ", err
        })
    }
})

//SYSTEME DE LIKE
app.put("/post/:postId/:userId/like", async (req, res) => {
    try {
        const postId = req.params.postId
        const userId = req.params.userId
        const post = await Post.findById(postId).populate("user", "name")
        const updatedPost = await Post.findByIdAndUpdate(postId,
            { $addToSet: { likes: userId } },
            { new: true }
        )
        if (!updatedPost) {
            return res.status(404).json({ messsage: "post introuvable" })
        }
        updatedPost.user = post.user
        res.json(updatedPost)
    } catch (err) {
        res.status(500).json({ message: "erreur lors du like: ", err })
    }
})

//SYSTEME DE DISLIKE
app.put("/post/:postId/:userId/unlike", async (req, res) => {
    try {
        const postId = req.params.postId
        const userId = req.params.userId
        const post = await Post.findById(postId).populate("user", "name")
        const updatedPost = await Post.findByIdAndUpdate(postId,
            { $pull: { likes: userId } },
            { new: true }
        )
        if (!updatedPost) {
            return res.status(404).json({ messsage: "post introuvable" })
        }
        updatedPost.user = post.user
        res.json(updatedPost)
    } catch (err) {
        res.status(500).json({ message: "erreur lors du dislike: ", err })
    }
})

//RECUPERER TOUS LES POST
app.get("/get-posts", async (req, res) => {
    try {
        const posts = await Post.find().populate("user", "name").sort({ createdAt: -1 })
        res.status(200).json(posts)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "erreur lors de la récuperation de tous les post" })
    }
})

