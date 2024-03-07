const express = require('express')

const pendaftaranPasienDaring = require('./routers/pendaftaranPasienDaring')
const antrian = require('./routers/antrian')
const pendaftaranPasienLuring = require('./routers/pendaftaranPasienLuring')
const stokObat = require('./routers/stokObat')

const pencatatanRekamMedis = require('./routers/pencatatanRekamMedis')
const pembayaran = require('./routers/pembayaran')
const pengadaanObat = require('./routers/pengadaanObat')
const penguranganObat = require('./routers/penguranganStokObat')
const login = require('./routers/login')
const session = require('express-session')
const MemoryStore = require('memorystore')(session)


const hbs = require('hbs')
const path = require("path");

const viewsPath = path.join(__dirname, '../templates/views')
const vartialsPath = path.join(__dirname, '../templates/partials')
const publicDirectoryPath = path.join(__dirname, '../public')
const pictureDirectoryPath = path.join(__dirname, '../storage/picture')

const app = express()


app.use(express.static(publicDirectoryPath))
app.use(express.static(pictureDirectoryPath))

app.set('views', viewsPath)
app.set('view engine', 'hbs')
hbs.registerPartials(vartialsPath)

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    cookie: {
        maxAge: 1800000,
        sameSite: 'lax'
    },
    resave: false,
    store: new MemoryStore({ checkPeriod: 86400000 })
}));


app.use(login)
app.use(pendaftaranPasienDaring)
app.use(pendaftaranPasienLuring)
app.use(antrian)
app.use(pencatatanRekamMedis)
app.use(pembayaran)
app.use(pengadaanObat)
app.use(penguranganObat)
app.use(stokObat)

module.exports = app

//to be implemented later
//compression already implemented in production