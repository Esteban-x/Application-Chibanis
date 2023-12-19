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
        console.log("connexion a la base de données réussie")
    })
    .catch((err) => {
        console.log(err)
    })
app.listen(port, () => {
    console.log(`le serveur est connecté sur le port ${port}`)
})

//CONNEXION ET INSCRIPTION

const User = require("./models/user")
const Activity = require("./models/activity")
const Message = require("./models/message")

app.post('/register', async (req, res) => {
    try {
        const { name, email, password, avatar, age, role, firstname, address, birthday, phone, city } = req.body
        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({ message: "Cet email existe déja" })
        }

        const newUser = new User({
            name: name,
            firstname: firstname,
            email: email,
            password: password,
            avatar: avatar,
            birthday: birthday,
            age: age,
            address: address,
            phone: phone,
            role: role,
            city: city,
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
            return res.status(404).json({ message: "Adresse email ou mot de passe invalide" })
        }
        if (user.password !== password) {
            return res.status(500).json({ message: "Adresse email ou mot de passe invalide" })
        }
        const token = jwt.sign({ userId: user._id }, secretKey)
        console.log("connexion réussis")
        return res.status(200).json({ token, user })

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

//PARTICIPATION
app.put("/activity/:activityId/:userId/participate", async (req, res) => {
    try {
        const activityId = req.params.activityId
        const userId = req.params.userId
        const activity = await Activity.findById(activityId).populate("user", "firstname")
        const updatedActivity = await Activity.findByIdAndUpdate(activityId,
            { $addToSet: { participants: userId } },
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
            { $pull: { participants: userId } },
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

//RECUPERER UNE ACTIVITE
app.get("/activity/:activityId/", async (req, res) => {
    try {
        const { activityId } = req.params
        const activity = await Activity.findById(activityId)
        if (!activity) {
            return res.status(404).json({ message: "activité introuvable" })
        }
        res.status(200).json(activity)
    } catch (err) {
        console.log("erreur lors de la recuperation de l'activité", err)
    }
})

//RECUPERER TOUTES LES ACTIVITES
app.get("/get-activities", async (req, res) => {
    try {
        const activity = await Activity.find().populate("user", "firstname").populate("participants", "firstname").sort({ createdAt: -1 })
        res.status(200).json(activity)
    } catch (err) {

        res.status(500).json({ message: "erreur lors de la récuperation des activités" })
    }
})

//INFORMATIONS DU COMPTE
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

//MODIFICATION DU COMPTE
app.post("/profile/edit/:userId", async (req, res) => {
    try {
        const userId = req.params.userId
        const { name, firstname, email, birthday, password, phone, address, city, avatar, age } = req.body

        const user = await User.updateOne(
            { _id: userId },
            {
                $set: {
                    name, firstname, email, birthday, password, phone, address, city, avatar, age
                }
            }
        )

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non existant" })
        }

        return res.status(200).json({ message: "Profil modifié" })

    } catch (err) {
        console.log("Erreur lors de la modification du compte", err)
        res.status(500).json({ message: "erreur lors de la modification du compte", err })
    }
})

//MODIFICATION DE L'ACTIVITE
app.post(`/activity/edit/:activityId`, async (req, res) => {
    try {
        const { activityId } = req.params
        const { title, content, user, image, date } = req.body
        const activity = await Activity.updateOne(
            { _id: activityId },
            {
                $set: { title, content, user, image, date }
            }
        )
        if (!activity) return res.status(404).json({
            message: "activité introuvable"
        })
        return res.status(200).json({ message: "activité modifié" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//SUPPRESSION DE L'ACTIVITE
app.delete("/delete/activity/:activityId", async (req, res) => {
    try {
        const activityId = req.params.activityId
        const activity = await Activity.findByIdAndDelete(activityId)
        res.status(200).json({ message: "L'activité a bien été supprimé" })
    } catch (err) {
        console.log("erreur lors de la suppression de l'activité", err)
        res.status(500).json({ message: "Erreur lors de la suppression de l'activité" })
    }
})

//SUPPRESSION DU COMPTE
app.delete("/delete/user/:userId", async (req, res) => {
    console.log("tentative de suppression")
    try {
        console.log("suppression en cours")
        const userId = req.params.userId
        console.log("id de l'utilisateur :", userId)
        const user = await User.findByIdAndDelete(userId)

        res.status(200).json({ message: "L'utilisateur a bien été supprimé", user })
    } catch (err) {
        console.log("erreur lors de la suppression du compte", err)
        res.status(500).json({ message: "Erreur lors de la suppression du compte" })
    }
})

//SYSTEME DE MESSAGERIE
app.post("/message", (req, res) => {
    const { sender, receiver, content } = req.body
    if (!sender || !receiver || !content) {
        return res.status(400).json({ message: "Tous les champs sont requis" })
    }


    User.findById(sender)
        .then(user => {
            const newMessage = new Message({
                sender,
                senderName: user.name,
                receiver,
                content
            })

            newMessage.save()
                .then(message => res.status(200).json(message)) // 
                .catch(err => res.status(500).json({ message: "Erreur lors de l'envoi du message : ", err }))
        })
        .catch(err => res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur : ", err }))
})

app.get("/messages/:userId/:receiverId", (req, res) => {
    const { userId, receiverId } = req.params

    if (!userId || !receiverId) {
        return res.status(500).json({
            message: "Les deux utilisateurs son requis pour l'envoi du message : "
        })
    }

    Message.find({
        $or: [
            { sender: userId, receiver: receiverId },
            { sender: receiverId, receiver: userId }
        ]
    })
        .sort({ timestamp: 1 })
        .then(messages => res.status(200).json(messages))
        .catch(err => res.status(500).json({ message: "Erreur lors de la récuperation des messages", error: err }))
})

