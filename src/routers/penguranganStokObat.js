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

const {penguranganObat,detailpenguranganobat,Pembayaran,Sequelize,Terapi,RekamMedis,sequelize, DataPasien, StokObat,
    dataObat
} = require('../../models')

//halaman list pengurangan obat
router.get('/apoteker/list_pengurangan_obat', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 16;
        const offset = parseInt(req.query.offset) || 0;
        const prevOffset = offset - limit < 0 ? 0 : offset - limit;
        const nextOffset = offset + limit;
        const penguranganObatRecords = await penguranganObat.findAll({
            order: [
                [sequelize.literal(`CASE status_pengurangan_obat
                    WHEN 'Verifikasi' THEN 1
                    WHEN 'Disetujui' THEN 2
                    ELSE 3
                END`)],
                ['createdAt', 'DESC']
            ],
            limit,
            offset
        });
        res.render('penguranganObat/listPenguranganObatApoteker',{penguranganObatRecords,limit,nextOffset,prevOffset});
        // res.send(penguranganObatRecords);
    } catch (e) {
        res.status(500).send('Error! ' + e);
    }
});
//Halaman form pengurangan obat
router.get('/apoteker/pengurangan_obat', async (req, res) => {
    try {
        const stokObat = await StokObat.findAll({include: [{
            model: dataObat,
                as: 'dataObat'
            }]});
        res.render('penguranganObat/buatPenguranganObat',{stokObat});
        // res.send(penguranganObatRecords);
    } catch (e) {
        res.status(500).send('Error! ' + e);
    }
});

router.get('/pemilik/list_pengurangan_obat', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 16;
        const offset = parseInt(req.query.offset) || 0;
        const prevOffset = offset - limit < 0 ? 0 : offset - limit;
        const nextOffset = offset + limit;
        const penguranganObatRecords = await penguranganObat.findAll({
            order: [
                [sequelize.literal(`CASE status_pengurangan_obat
                    WHEN 'Verifikasi' THEN 1
                    WHEN 'Disetujui' THEN 2
                    ELSE 3
                END`)],
                ['createdAt', 'DESC']
            ],
            limit,
            offset
        });
        res.render('penguranganObat/listPenguranganObatPemilik',{penguranganObatRecords,limit,nextOffset,prevOffset});
        // res.send(penguranganObatRecords);
    } catch (e) {
        res.status(500).send('Error! ' + e);
    }
});



//Halaman detail pengurangan obat
router.get('/apoteker/pengurangan_obat/:id_pengurangan_obat', async (req, res) => {
    try {
        const idPenguranganObat = req.params.id_pengurangan_obat;
        const penguranganObatRecord = await penguranganObat.findOne({ 
            where: {
                id_pengurangan_obat: idPenguranganObat
            }
        });

        const detailPenguranganObat = await detailpenguranganobat.findAll({ 
            where: { id_pengurangan_obat: idPenguranganObat },
            include: [{
                model: StokObat,
                as: 'stokObat',
                include: [{
                    model: dataObat,
                    as: 'dataObat'
                }]
            }]
        });

        res.render('penguranganObat/detailPenguranganObat',{ penguranganObatRecord, detailPenguranganObat });
        // res.send({ penguranganObatRecord, detailPenguranganObatArray });
    } catch (e) {
        res.status(500).send('Error! ' + e);
    }
})
router.get('/pemilik/pengurangan_obat/:id_pengurangan_obat', async (req, res) => {
    try {
        const idPenguranganObat = req.params.id_pengurangan_obat;
        const penguranganObatRecord = await penguranganObat.findOne({ 
            where: {
                id_pengurangan_obat: idPenguranganObat
            }
        });

        const detailPenguranganObat = await detailpenguranganobat.findAll({ 
            where: { id_pengurangan_obat: idPenguranganObat },
            include: [{
                model: StokObat,
                as: 'stokObat',
                include: [{
                    model: dataObat,
                    as: 'dataObat'
                }]
            }]
        });
        res.render('penguranganObat/detailPenguranganObatPemilik',{ penguranganObatRecord, detailPenguranganObat });
        // res.send({ penguranganObatRecord, detailPenguranganObatArray });
    } catch (e) {
        res.status(500).send('Error! ' + e);
    }
})
//halaman detail pengurangan obat pemilik
//bedanya ada tombol setujui tidak
// router.post('/apoteker/pengurangan_obat', async (req, res) => {
//     try {
//         const randomNum = Math.floor(1000 + Math.random() * 9000);
//         const penguranganObatCount = await penguranganObat.count();
//         const idPenguranganObat = `PGO-${randomNum}-${penguranganObatCount + 1}`;
//
//         const detailPenguranganObatArray = req.body.detailPenguranganObat.pengurangan;
//         console.log(detailPenguranganObatArray)
//         for (const detail of detailPenguranganObatArray) {
//             const stokObat = await StokObat.findOne({ where: { id_stok_obat: detail.id_stok_obat } });
//             if (!stokObat) {
//                 return res.status(400).send({ error: `Stok Obat with id ${detail.id_stok_obat} not found` });
//             }
//             if (detail.jumlah > stokObat.jumlah) {
//                 return res.status(400).send({ error: `The provided jumlah is more than the available stok obat for id ${detail.id_stok_obat}` });
//             }
//         }
//
//         const newPenguranganObat = await penguranganObat.create({
//             id_pengurangan_obat: idPenguranganObat,
//             status_pengurangan_obat: "Verifikasi",
//             createdAt: new Date(),
//             updatedAt: new Date()
//         });
//
//         for (const detail of detailPenguranganObatArray) {
//             const idDetailPenguranganObat = `${randomNum}-${idPenguranganObat.slice(-1)}`;
//             await detailpenguranganobat.create({
//                 id_detail_pengurangan_obat: idDetailPenguranganObat,
//                 id_pengurangan_obat: idPenguranganObat,
//                 id_stok_obat: detail.id_stok_obat,
//                 jumlah: detail.jumlah,
//                 satuan: detail.satuan,
//                 createdAt: new Date(),
//                 updatedAt: new Date()
//             });
//         }
//         res.status(200).send(newPenguranganObat);
//     } catch (e) {
//         console.error(e)
//         res.status(500).send('Error! ' + e);
//     }
// });

router.post('/apoteker/pengurangan_obat', async (req, res) => {
    try {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const penguranganObatCount = await penguranganObat.count();
        const idPenguranganObat = `PGO-${randomNum}-${penguranganObatCount + 1}`;

        const detailPenguranganObatArray = req.body.detailPenguranganObat
        await penguranganObat.create({
            id_pengurangan_obat: idPenguranganObat,
            status_pengurangan_obat: 'Verifikasi'
        });
        for (const detail of detailPenguranganObatArray) {
            const idDetailPenguranganObat = `${Math.floor(1000 + Math.random() * 9000)}`;
            await detailpenguranganobat.create({
                id_detail_pengurangan_obat: idDetailPenguranganObat,
                id_pengurangan_obat: idPenguranganObat,
                id_stok_obat: detail.id_stok_obat,
                jumlah: detail.jumlah
            });
        }

        

        res.status(200).send({ message: 'Pengurangan Obat created successfully' });
    } catch (e) {
        console.error(e)
        res.status(500).send('Error! ' + e);
    }
});

router.patch('/pemilik/setujui_pengurangan_obat/:id_pengurangan_obat', async (req, res) => {
    try {
        const idPenguranganObat = req.params.id_pengurangan_obat;
        const penguranganObats = await penguranganObat.findOne({ where: { id_pengurangan_obat: idPenguranganObat } });
        penguranganObats.status_pengurangan_obat = "Disetujui";
        
        const detailPenguranganObatArray = await detailpenguranganobat.findAll({ where: { id_pengurangan_obat: idPenguranganObat } });

        for (const detail of detailPenguranganObatArray) {
            const stokObat = await StokObat.findOne({ where: { id_stok_obat: detail.id_stok_obat } });
            stokObat.jumlah -= detail.jumlah;
            await stokObat.save();
        }

        await penguranganObats.save();

        res.send(penguranganObats);
    } catch (e) {
        console.error(e)
        res.status(500).send('Error! ' + e);
    }
});
router.patch('/pemilik/tolak_pengurangan_obat/:id_pengurangan_obat', async (req, res) => {
    try {
        const idPenguranganObat = req.params.id_pengurangan_obat;
        const penguranganObats = await penguranganObat.findOne({ where: { id_pengurangan_obat: idPenguranganObat } });
        penguranganObats.status_pengurangan_obat = "Ditolak";
        await penguranganObats.save();
        res.send(penguranganObats);
    } catch (e) {
        console.error(e)
        res.status(500).send('Error! ' + e);
    }
});
module.exports = router

// router.post('/pembayaran/:id_rekam_medis', async (req, res) => {
//     try {
//         const idRekamMedis = req.params.id_rekam_medis;
//         const rekamMedis = await RekamMedis.findOne({ where: { id_rekam_medis: idRekamMedis } });
//
//         if (!rekamMedis) {
//             return res.status(404).send({ error: 'Rekam Medis not found' });
//         }
//
//         const idRegistrasiPasien = rekamMedis.id_registrasi_pasien;
//         const basePayment = rekamMedis.hasil_lab ? 80000 : 50000;
//
//         let totalPembayaran = basePayment;
//         const terapiRecords = await Terapi.findAll({ where: { id_rekam_medis: idRekamMedis } });
//
//         for (const terapi of terapiRecords) {
//             const stokObat = await StokObat.findOne({ where: { id_stok_obat: terapi.id_stok_obat } });
//             totalPembayaran += terapi.total * stokObat.harga_satuan;
//         }
//
//         const randomNum = Math.floor(1000 + Math.random() * 9000);
//         const pembayaranCount = await Pembayaran.count();
//         const idPembayaran = `PB-${randomNum}-${pembayaranCount + 1}`;
//
//         const pembayaran = await Pembayaran.create({
//             id_pembayaran: idPembayaran,
//             id_rekam_medis: idRekamMedis,
//             id_registrasi_pasien: idRegistrasiPasien,
//             total_pembayaran: totalPembayaran,
//             createdAt: new Date(),
//             updatedAt: new Date()
//         });
//
//         res.send(pembayaran);
//     } catch (e) {
//         res.status(500).send('Error! ' + e);
//     }
// });
// router.post('/pengurangan_obat', async (req, res) => {
//     try {
//         const randomNum = Math.floor(1000 + Math.random() * 9000);
//         const penguranganObatCount = await penguranganObat.count();
//         const idPenguranganObat = `PGO-${randomNum}-${penguranganObatCount + 1}`;
//
//         const newPenguranganObat = await penguranganObat.create({
//             id_pengurangan_obat: idPenguranganObat,
//             status_pengurangan_obat: req.body.status_pengurangan_obat,
//             createdAt: new Date(),
//             updatedAt: new Date()
//         });
//
//         const detailPenguranganObatArray = req.body.detailPenguranganObat;
//         for (const detail of detailPenguranganObatArray) {
//             const idDetailPenguranganObat = `${randomNum}-${idPenguranganObat.slice(-1)}`;
//             await detailpenguranganobat.create({
//                 id_detail_pengurangan_obat: idDetailPenguranganObat,
//                 id_pengurangan_obat: idPenguranganObat,
//                 id_stok_obat: detail.id_stok_obat,
//                 jumlah: detail.jumlah,
//                 satuan: detail.satuan,
//                 createdAt: new Date(),
//                 updatedAt: new Date()
//             });
//         }
//
//         res.status(201).send(newPenguranganObat);
//     } catch (e) {
//         res.status(500).send('Error! ' + e);
//     }
// });
// router.post('/admin/pengurangan_obat', async (req, res) => {
//     try {
//         const randomNum = Math.floor(1000 + Math.random() * 9000);
//         const penguranganObatCount = await penguranganObat.count();
//         const idPenguranganObat = `PGO-${randomNum}-${penguranganObatCount + 1}`;
//
//         const newPenguranganObat = await penguranganObat.create({
//             id_pengurangan_obat: idPenguranganObat,
//             status_pengurangan_obat: "Verifikasi",
//             createdAt: new Date(),
//             updatedAt: new Date()
//         });
//
//         const detailPenguranganObatArray = req.body.detailPenguranganObat;
//         for (const detail of detailPenguranganObatArray) {
//             const idDetailPenguranganObat = `${randomNum}-${idPenguranganObat.slice(-1)}`;
//             await detailpenguranganobat.create({
//                 id_detail_pengurangan_obat: idDetailPenguranganObat,
//                 id_pengurangan_obat: idPenguranganObat,
//                 id_stok_obat: detail.id_stok_obat,
//                 jumlah: detail.jumlah,
//                 satuan: detail.satuan,
//                 createdAt: new Date(),
//                 updatedAt: new Date()
//             });
//         }
//
//         res.status(201).send(newPenguranganObat);
//     } catch (e) {
//         res.status(500).send('Error! ' + e);
//     }
// });