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

    })
    .catch((err) => {

    })
app.listen(port, () => {

})

//CONNEXION ET INSCRIPTION

const User = require("./models/user")
const Activity = require("./models/activity")

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

        return res.status(500).json({ message: "La connexion a echoué" })
    }
})

//RECUPERE TOUS LES UTILISATEURS SAUF CELUI EN LIGNE

app.get("/user/:userId", (req, res) => {
    try {
        const loggedInUserId = req.params.userId
        User.find({ _id: { $ne: loggedInUserId } }).then((users) => {
            res.status(200).json(users)
        }).catch((err) => {

            res.status(500).json("erreur lors de la récupération des utilisateurs")
        })
    }
    catch (err) {

        res.status(500).json({ message: "erreur lors de la récupération des utilisateurs" })
    }
})

//SYSTEME DE PUBLICATION
app.post("/create-activity", async (req, res) => {
    try {
        const { content, userId, title, date, image } = req.body
        const newActivityData = {
            user: userId,
            title: title,
            date: date,
            image: image
        }
        if (content) {
            newActivityData.content = content
        }
        const newActivity = new Activity(newActivityData)
        await newActivity.save()

        res.status(200).json({ message: "Nouvelle activité publié" })

    } catch (err) {

        res.status(500).json({
            message: "erreur: ", err
        })
    }
})

//SYSTEME DE PARTICIPATION
app.put("/activity/:activityId/:userId/participate", async (req, res) => {
    try {
        const activityId = req.params.activityId
        const userId = req.params.userId
        const activity = await Activity.findById(activityId).populate("user", "name")
        const updatedActivity = await Activity.findByIdAndUpdate(activityId,
            { $addToSet: { participate: userId } },
            { new: true }
        )
        if (!updatedActivity) {
            return res.status(404).json({ messsage: "activité introuvable" })
        }
        updatedActivity.user = activity.user
        res.json(updatedActivity)
    } catch (err) {
        res.status(500).json({ message: "erreur lors de la participation ", err })
    }
})

//ANNULATION DE LA PARTICIPATION
app.put("/activity/:activityId/:userId/leave", async (req, res) => {
    try {
        const activityId = req.params.activityId
        const userId = req.params.userId
        const activity = await Activity.findById(activityId).populate("user", "name")
        const updatedActivity = await Activity.findByIdAndUpdate(activityId,
            { $pull: { participate: userId } },
            { new: true }
        )
        if (!updatedActivity) {
            return res.status(404).json({ messsage: "activité introuvable" })
        }
        updatedActivity.user = activity.user
        res.json(updatedActivity)
    } catch (err) {
        res.status(500).json({ message: "erreur lors de l'annulation ", err })
    }
})

//RECUPERER TOUTES LES ACTIVITES
app.get("/get-activities", async (req, res) => {
    try {
        const activity = await Activity.find().populate("user", "name").sort({ createdAt: -1 })
        res.status(200).json(activity)
    } catch (err) {

        res.status(500).json({ message: "erreur lors de la récuperation des activités" })
    }
})

//AFFICHAGE DU PROFIL
app.get("/profile/:userId", async (req, res) => {
    try {
        const userId = req.params.userId
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({
                message: "utilisateur inexistant"
            })
        }
        return res.status(200).json({ user })
    } catch (err) {

        res.status(500).json({ message: "erreur:", err })
    }
})

