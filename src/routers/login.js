const express = require('express')
const router = new express.Router()
const sharp = require('sharp')
const path = require("path");
const fs = require('fs');
const {Pasien} = require('../../models/')
const {Op} = require("sequelize");
const {pictureUpload} = require('../functions/multerConfiguration')
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
const auth = require('../../middleware/auth')

dayjs.extend(customParseFormat)

const {Sequelize, ProfilDokter, DataPasien, Akun,sequelize, DataBpjs, NomerAntrian} = require('../../models')

router.get('/login', async (req, res) => {
    res.render('login/login')
})
router.get('/admin/dashboard', async (req, res) => {
    res.render('login/dashboardAdmin')
})
router.get('/asisten_dokter/dashboard', async (req, res) => {
    res.render('login/dashboardAsistenDokter')
})
router.get('/dokter_umum/dashboard', async (req, res) => {
    res.render('login/dashboardDokterUmum')
})
router.get('/dokter_gigi/dashboard', async (req, res) => {
    res.render('login/dashboardDokterGigi')
})
router.get('/apoteker/dashboard', async (req, res) => {
    res.render('login/dashboardApoteker')
})
router.get('/pemilik/dashboard', async (req, res) => {
    res.render('login/dashboardPemilik')
})

router.get('/logout', async (req, res) => {
    req.session.destroy()
    res.redirect('/login')
})
router.post('/login', async (req, res) => {
    try {
        // Find the user with the provided username
        const akun = await Akun.findOne({ where: { username: req.body.username } });

        // If the user is found and the password matches
        if (akun && akun.password === req.body.password) {
            // Set the session username to the provided username
            req.session.username = req.body.username;

            // Send a success response
            res.send({ akun: akun });
        } else {
            // If the user is not found or the password doesn't match, send an error response
            res.status(401).send({ error: 'Invalid username or password' });
        }
    } catch (e) {
        // If there's an error, send an error response
        res.status(500).send({ error: 'An error occurred while trying to log in' });
    }
});


module.exports = router