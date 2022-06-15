const express = require('express')
const app = express()

const jwt = require('jsonwebtoken')

//confi mdileware

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


//PALAVA SECRETA PARA O NOSSO TOKEN HEHE

const SECRET = "$#@#$asdjadla2@!#12312123'1!@#!@#"


const VerificaToken = (req, res, next) => {
    const token = req.headers['x-access-token']
    console.log(token)
    if (!token) {
        console.log("não logou ainda !!")
        return res.status(401).json({ "auth": false, "msg": "não exite token meu jovem!!" })
    }

    jwt.verify(token, SECRET, function (err, decoded) {
        if (err) {
            console.log("erro nego tentando burlar!!")
            return res.status(500).json({ "auth": false, "msg": "Meu patrão o token é invalido!!" })
        }

        req.UserID = decoded.id
        next()
    })
}


app.get('/', VerificaToken, (req, res, next) => {
    console.log("entrouoo")
    res.status(200).json({ "msg": "logado com sucesso!!" + req.UserID })
})

app.get('/teste', VerificaToken, (req, res, next) => {
    res.status(200).json({ "msg": "entrou na rota teste" })
})

app.post('/login', (req, res) => {
    const { user, pass } = req.body

    if (user === "admin" && pass === "123") {
        const id = 1
        const token = jwt.sign({ id }, SECRET, { expiresIn: 150 })

        return res.status(200).json({ "auth": true, "token": token })
    }
    res.status(500).json({ "auth": false, "msg": "Usuario ou senha invalidoo!!!!!!!!!!" })
})





const server = app.listen(8081, () => {
    console.log("servidor online!!")
})


process.on("SIGINT", () => {
    console.log("fechando servidor!")
    server.close()
})
