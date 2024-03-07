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
const Sequelize = require('sequelize');
dayjs.extend(customParseFormat)

const {
    pengadaanObat,
    fakturPajak,
    StokObat,
    detailPengadaanObat,
    detailpenguranganobat,
    dataObat,
    Pembayaran,
    Terapi,
    RekamMedis,
    RekamMedisAwal,
    sequelize,
    DataPasien,
} = require('../../models')

//list pengadaan obat
router.get('/apoteker/list_pengadaan_obat', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const prevOffset = offset - limit < 0 ? 0 : offset - limit;
        const nextOffset = offset + limit;
        const pengadaan = await pengadaanObat.findAll({
            order: [
                [sequelize.literal(`CASE status_pengadaan_obat 
                    WHEN 'Disetujui' THEN 1 
                    WHEN 'Diverifikasi' THEN 2 
                    WHEN 'Diterima' THEN 3 
                    ELSE 4 
                END`)],
                ['createdAt', 'DESC']
            ],
            limit,
            offset
        });
        res.render('pengadaanObat/listPengadaanObatApoteker', {pengadaan, nextOffset, prevOffset, limit})
        // res.send(pengadaan);
    } catch (e) {
        res.status(500).send('Error! ' + e);
    }
})

router.get('/pemilik/list_pengadaan_obat', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const prevOffset = offset - limit < 0 ? 0 : offset - limit;
        const nextOffset = offset + limit;
        const pengadaan = await pengadaanObat.findAll({
            order: [
                [sequelize.literal(`CASE status_pengadaan_obat 
                    WHEN 'Disetujui' THEN 1 
                    WHEN 'Diverifikasi' THEN 2 
                    WHEN 'Diterima' THEN 3 
                    ELSE 4 
                END`)],
                ['createdAt', 'DESC']
            ],
            limit,
            offset
        });
        res.render('pengadaanObat/listPengadaanObatPemilik', {pengadaan, nextOffset, prevOffset, limit})
        // res.send(pengadaan);
    } catch (e) {
        res.status(500).send('Error! ' + e);
    }
})
router.get('/pemilik/detail_pengadaan_obat/:id_pengadaan_obat', async (req, res) => {
    try {
        const id_pengadaan_obat = req.params.id_pengadaan_obat;

        const pengadaan = await pengadaanObat.findByPk(id_pengadaan_obat);
        if (!pengadaan) {
            return res.status(404).send('Pengadaan obat not found');
        }

        const detailPengadaan = await detailPengadaanObat.findAll({
            where: {id_pengadaan_obat: id_pengadaan_obat},
            include: [{
                model: dataObat,
                as: 'dataObat'
            }]
        });
        // Map over the detailPengadaan array to format the expire date

        let pengadaanDiverifikasi
        if (pengadaan.status_pengadaan_obat === 'Diverifikasi') {
            pengadaanDiverifikasi = true;
        }
        res.render('pengadaanObat/detailPengadaanObatPemilik', {
            pengadaan,
            detailPengadaan,
            pengadaanDiverifikasi
        });
        // res.send({pengadaan, detailPengadaan});
    } catch (e) {
        res.status(500).send('Error! ' + e);
    }
});

//halaman pilihan obat umum atau jkn 
router.get('/apoteker/pengadaan_obat', async (req, res) => {
    try {
        res.render('pengadaanObat/pilihanPengadaanObat')
        // res.send('Halaman pilihan pengadaan obat umum atau jkn');
    } catch (e) {
        res.status(500).send('Error! ' + e);
    }
});
//halaman formulir pengadaan obat umum
router.get('/apoteker/pengadaan_obat/umum/', async (req, res) => {
    try {
        const now = dayjs();
        const startOfPreviousMonth = now.subtract(2, 'month').startOf('month');
        const endOfPreviousMonth = now.subtract(2, 'month').endOf('month');

        const terapiRecords = await sequelize.models.Terapi.findAll({
            where: {
                createdAt: {
                    [Sequelize.Op.between]: [startOfPreviousMonth.toISOString(), endOfPreviousMonth.toISOString()]
                }
            },
            include: [{
                model: sequelize.models.StokObat,
                as: 'stokObat',
                where: {
                    tipe_obat: 'Umum'
                },
                include: [{
                    model: sequelize.models.dataObat,
                    as: 'dataObat'
                }]
            }]
        });
        const expiredStokObatRecords = await StokObat.findAll({
            where: {
                expire: {
                    [Op.lt]: new Date()
                },
                tipe_obat: 'Umum'
            },
            include: [{
                model: dataObat,
                as: 'dataObat'
            }]
        });


        const detailPenguranganObatRecords = await detailpenguranganobat.findAll({
            include: [{
                model: StokObat,
                as: 'stokObat',
                where: {
                    tipe_obat: 'Umum'
                },
                include: [{
                    model: dataObat,
                    as: 'dataObat'
                }]
            }]
        });

        const consumedStokObat = terapiRecords.reduce((acc, terapi) => {
            const idObat = terapi.stokObat.id_obat;
            const consumed = terapi.total;
            const namaObat = terapi.stokObat.dataObat.nama_obat;
            const satuan = terapi.stokObat.satuan;

            if (acc[idObat]) {
                acc[idObat].jumlah += consumed;
            } else {
                acc[idObat] = {
                    jumlah: consumed,
                    nama_obat: namaObat,
                    satuan: satuan
                };
            }

            return acc;
        }, {});

        for (let detail of detailPenguranganObatRecords) {
            const idObat = detail.stokObat.id_obat;
            const jumlah = detail.jumlah;
            const namaObat = detail.stokObat.dataObat.nama_obat;
            const satuan = detail.stokObat.satuan;

            if (consumedStokObat[idObat]) {
                consumedStokObat[idObat].jumlah += jumlah;
            } else {
                consumedStokObat[idObat] = {
                    jumlah: jumlah,
                    nama_obat: namaObat,
                    satuan: satuan
                };
            }
        }

        for (let detail of expiredStokObatRecords) {
            const idObat = detail.id_obat;
            const jumlah = detail.jumlah;
            const namaObat = detail.dataObat.nama_obat;
            const satuan = detail.satuan;

            if (consumedStokObat[idObat]) {
                consumedStokObat[idObat].jumlah += jumlah;
            } else {
                consumedStokObat[idObat] = {
                    jumlah: jumlah,
                    nama_obat: namaObat,
                    satuan: satuan
                };
            }
        }

        const consumedStokObatArray = Object.entries(consumedStokObat).map(([id_obat, {
            jumlah,
            nama_obat,
            satuan
        }]) => ({id_obat, jumlah, nama_obat, satuan}));

        // const result = Object.entries(consumedStokObat).map(([id_obat, { jumlah, nama_obat, satuan }]) => ({ id_obat, jumlah, nama_obat, satuan }));
        res.render('pengadaanObat/buatPengadaanObatUmum', {consumedStokObatArray})
        // res.send({detailPenguranganObatRecords,expiredStokObatRecords,consumedStokObatArray})
        // res.json(result);
    } catch (e) {
        res.status(500).send('Error! ' + e);
    }
});
//halaman formulir pengadaan obat JKN
router.get('/apoteker/pengadaan_obat/jkn/', async (req, res) => {
    try {
        const now = dayjs();
        const startOfPreviousMonth = now.subtract(2, 'month').startOf('month');
        const endOfPreviousMonth = now.subtract(2, 'month').endOf('month');

        const terapiRecords = await sequelize.models.Terapi.findAll({
            where: {
                createdAt: {
                    [Sequelize.Op.between]: [startOfPreviousMonth.toISOString(), endOfPreviousMonth.toISOString()]
                }
            },
            include: [{
                model: sequelize.models.StokObat,
                as: 'stokObat',
                where: {
                    tipe_obat: 'JKN'
                },
                include: [{
                    model: sequelize.models.dataObat,
                    as: 'dataObat'
                }]
            }]
        });
        const expiredStokObatRecords = await StokObat.findAll({
            where: {
                expire: {
                    [Op.lt]: new Date()
                },
                tipe_obat: 'JKN'
            },
            include: [{
                model: dataObat,
                as: 'dataObat'
            }]
        });


        const detailPenguranganObatRecords = await detailpenguranganobat.findAll({
            include: [{
                model: StokObat,
                as: 'stokObat',
                where: {
                    tipe_obat: 'JKN'
                },
                include: [{
                    model: dataObat,
                    as: 'dataObat'
                }]
            }]
        });

        const consumedStokObat = terapiRecords.reduce((acc, terapi) => {
            const idObat = terapi.stokObat.id_obat;
            const consumed = terapi.total;
            const namaObat = terapi.stokObat.dataObat.nama_obat;
            const satuan = terapi.stokObat.satuan;

            if (acc[idObat]) {
                acc[idObat].jumlah += consumed;
            } else {
                acc[idObat] = {
                    jumlah: consumed,
                    nama_obat: namaObat,
                    satuan: satuan
                };
            }

            return acc;
        }, {});

        for (let detail of detailPenguranganObatRecords) {
            const idObat = detail.stokObat.id_obat;
            const jumlah = detail.jumlah;
            const namaObat = detail.stokObat.dataObat.nama_obat;
            const satuan = detail.stokObat.satuan;

            if (consumedStokObat[idObat]) {
                consumedStokObat[idObat].jumlah += jumlah;
            } else {
                consumedStokObat[idObat] = {
                    jumlah: jumlah,
                    nama_obat: namaObat,
                    satuan: satuan
                };
            }
        }

        for (let detail of expiredStokObatRecords) {
            const idObat = detail.id_obat;
            const jumlah = detail.jumlah;
            const namaObat = detail.dataObat.nama_obat;
            const satuan = detail.satuan;

            if (consumedStokObat[idObat]) {
                consumedStokObat[idObat].jumlah += jumlah;
            } else {
                consumedStokObat[idObat] = {
                    jumlah: jumlah,
                    nama_obat: namaObat,
                    satuan: satuan
                };
            }
        }

        const consumedStokObatArray = Object.entries(consumedStokObat).map(([id_obat, {
            jumlah,
            nama_obat,
            satuan
        }]) => ({id_obat, jumlah, nama_obat, satuan}));

        // const result = Object.entries(consumedStokObat).map(([id_obat, { jumlah, nama_obat, satuan }]) => ({ id_obat, jumlah, nama_obat, satuan }));
        res.render('pengadaanObat/buatPengadaanObatJkn', {consumedStokObatArray})
        // res.send({detailPenguranganObatRecords,expiredStokObatRecords,consumedStokObatArray})
        // res.json(result);
    } catch (e) {
        res.status(500).send('Error! ' + e);
    }
});

//halaman edit pengadaan obat kalau sudah Disetujui
//cek kalau pengadaan obat disetujui,kalau enggak button lengkapi pengadaan disabled
router.get('/apoteker/pengadaan_obat/lengkapi_pengadaan_jkn/:id_pengadaan_obat', async (req, res) => {
    try {
        const id_pengadaan_obat = req.params.id_pengadaan_obat;

        const pengadaan = await pengadaanObat.findByPk(id_pengadaan_obat);
        if (!pengadaan) {
            return res.status(404).send('Pengadaan obat not found');
        }

        const detailPengadaan = await detailPengadaanObat.findAll({
            where: {
                id_pengadaan_obat: id_pengadaan_obat,
                status_pengadaan: 'Disetujui'
            }, include: [{
                model: dataObat,
                as: 'dataObat'
            }]
        });

        res.render('pengadaanObat/lengkapiPengadaanObatJkn', {pengadaan, detailPengadaan});
        // res.send({pengadaan, detailPengadaan});
    } catch (e) {
        res.status(500).send('Error! ' + e);
    }
});
router.get('/apoteker/pengadaan_obat/lengkapi_pengadaan_umum/:id_pengadaan_obat', async (req, res) => {
    try {
        const id_pengadaan_obat = req.params.id_pengadaan_obat;

        const pengadaan = await pengadaanObat.findByPk(id_pengadaan_obat);
        if (!pengadaan) {
            return res.status(404).send('Pengadaan obat not found');
        }

        const detailPengadaan = await detailPengadaanObat.findAll({
            where: {
                id_pengadaan_obat: id_pengadaan_obat,
                status_pengadaan: 'Disetujui'
            }, include: [{
                model: dataObat,
                as: 'dataObat'
            }]
        });

        res.render('pengadaanObat/lengkapiPengadaanObatUmum', {pengadaan, detailPengadaan});
        // res.send({pengadaan, detailPengadaan});
    } catch (e) {
        res.status(500).send('Error! ' + e);
    }
});
//halaman detail pengadaan obat
router.get('/apoteker/detail_pengadaan_obat/:id_pengadaan_obat', async (req, res) => {
    try {
        const id_pengadaan_obat = req.params.id_pengadaan_obat;

        const pengadaan = await pengadaanObat.findByPk(id_pengadaan_obat);
        if (!pengadaan) {
            return res.status(404).send('Pengadaan obat not found');
        }

        const detailPengadaan = await detailPengadaanObat.findAll({
            where: {
                id_pengadaan_obat: id_pengadaan_obat,
                status_pengadaan: {[Op.or]: ['Diverifikasi', 'Disetujui', 'Diterima']}
            },
            include: [{
                model: dataObat,
                as: 'dataObat'
            }]
        });
        // Map over the detailPengadaan array to format the expire date

        let pengadaanDisetujui
        if (pengadaan.status_pengadaan_obat === 'Disetujui') {
            pengadaanDisetujui = true;
        }
        res.render('pengadaanObat/detailPengadaanObat', {
            pengadaan,
            detailPengadaan,
            pengadaanDisetujui
        });
        // res.send({pengadaan, detailPengadaan});
    } catch (e) {
        res.status(500).send('Error! ' + e);
    }
});
//halaman detail pengadaan obat untuk pemilik,bedanya pemilik ada tombol setujui atau tolak

//todo : pengadaan obat 
//kalau misalnya semua attribut sama dalam pengadaan obat,jangan bikin stok baru, tambah aja totalnya ke stok yang sudah ada
router.post('/apoteker/pengadaan_obat', async (req, res) => {

    try {
        let jenis_pengadaan_obat = req.body.jenis_pengadaan_obat;

        const randomNumPengadaan = Math.floor(1000 + Math.random() * 9000);
        const pengadaanObatCount = await pengadaanObat.count();
        const id_pengadaan_obat = `PO-${randomNumPengadaan}-${pengadaanObatCount + 1}`;
        const pengadaan = await pengadaanObat.create({
            id_pengadaan_obat,
            jenis_pengadaan_obat,
            status_pengadaan_obat: 'Diverifikasi'
        });
        if (!Array.isArray(req.body.detailPengadaanObat)) {
            return res.status(400).send();
        }

        for (let detail of req.body.detailPengadaanObat) {
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            const Y = pengadaan.id_pengadaan_obat.split('-')[2];
            const id_detail_pengadaan_obat = `${randomNum}-${Y}`;

            await detailPengadaanObat.create({
                id_detail_pengadaan_obat: id_detail_pengadaan_obat,
                id_obat: detail.id_obat,
                jumlah: detail.jumlah_obat,
                satuan: detail.satuan,
                status_pengadaan: 'Diverifikasi',
                id_pengadaan_obat: pengadaan.id_pengadaan_obat,
                // other fields will be updated later
            });
        }
        // await detailPengadaanObat.create({
        //     id_detail_pengadaan_obat: id_detail_pengadaan_obat,
        //     id_obat,
        //     jumlah:req.body.jumlah_obat,
        //     satuan,
        //     id_pengadaan_obat: pengadaan.id_pengadaan_obat,
        //     // other fields will be updated later
        // });

        res.send(pengadaan);
    } catch (e) {

        res.status(500).send(e);
    }
});
router.patch('/pemilik/setujui_pengadaan/:id', async (req, res) => {
    try {
        // Fetch the pengadaan_obat record with the status 'Diverifikasi'
        const pengadaan = await pengadaanObat.findOne({
            where: {
                id_pengadaan_obat: req.params.id,
                status_pengadaan_obat: 'Diverifikasi'
            }
        });

        // If no such record exists, send a 404 response
        if (!pengadaan) {
            return res.status(404).send({error: 'No pengadaan_obat record found with the specified ID and status.'});
        }
        for (let detail of req.body.detailPengadaanObat) {
        }
        // Change the status to 'Disetujui'
        pengadaan.status_pengadaan_obat = 'Disetujui';

        // Save the changes
        await pengadaan.save();


        // Fetch the detail_pengadaan_obat records associated with the id_pengadaan_obat
        const detailPengadaanRecords = await detailPengadaanObat.findAll({
            where: {id_pengadaan_obat: req.params.id}
        });
        console.log(req.body.detailPengadaanObat)
        // Update the status_pengadaan for each record based on the array received from the user
        for (let detail of req.body.detailPengadaanObat) {
            const record = detailPengadaanRecords.find(record => record.id_detail_pengadaan_obat === detail.id_detail_pengadaan_obat);
            if (record) {
                record.status_pengadaan = detail.status_pengadaan;
                await record.save();
            }
        }
        // Send a success response
        res.status(200).send(pengadaan);
    } catch (e) {
        // If an error occurs, send a 500 response
        console.error(e)
        res.status(500).send(e);
    }
});
router.patch('/pemilik/tolak_pengadaan/:id', async (req, res) => {
    try {
        // Fetch the pengadaan_obat record with the status 'Diverifikasi'
        const pengadaan = await pengadaanObat.findOne({
            where: {
                id_pengadaan_obat: req.params.id,
                status_pengadaan_obat: 'Diverifikasi'
            }
        });

        // If no such record exists, send a 404 response
        if (!pengadaan) {
            return res.status(404).send({error: 'No pengadaan_obat record found with the specified ID and status.'});
        }

        // Change the status to 'Disetujui'
        pengadaan.status_pengadaan_obat = 'Ditolak';

        // Save the changes
        await pengadaan.save();

        // Send a success response
        res.status(200).send(pengadaan);
    } catch (e) {
        // If an error occurs, send a 500 response
        res.status(500).send(e);
    }
});

//pengisian formulir pengadaan obat sudah disetujui

router.put('/apoteker/pengadaan_obat/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const pengadaan = await pengadaanObat.findByPk(id);
        if (!pengadaan) {
            return res.status(404).send('Pengadaan obat not found');
        }
        await fakturPajak.create({
            nomer_seri_faktur_pajak: req.body.nomer_seri_faktur_pajak,
            nama_pt_penjual: req.body.nama_pt_penjual,
            alamat_pt_penjual: req.body.alamat_pt_penjual,
            npwp_pt_penjual: req.body.npwp_pt_penjual,
            ppn: req.body.ppn,
            total: req.body.total_pajak
        });

        pengadaan.nomer_seri_faktur_pajak = req.body.nomer_seri_faktur_pajak;
        pengadaan.status_pengadaan_obat = 'Diterima'
        await pengadaan.save()

        const detailPengadaanObatArray = req.body.detailPengadaanObat;
        for (let detail of detailPengadaanObatArray) {
            console.log('Ini Detail' + detail.nomer_batch)
            const detailPengadaan = await detailPengadaanObat.findAll({where: {id_pengadaan_obat: req.params.id}});

            for (let isiDetailPengadaan of detailPengadaan) {
                console.log('Ini Isi Detail' + isiDetailPengadaan.nomer_batch)
                isiDetailPengadaan.expire = dayjs(detail.expire, 'DD-MM-YYYY').toDate();
                isiDetailPengadaan.nomer_batch = detail.nomer_batch;
                isiDetailPengadaan.harga_satuan = detail.harga_satuan;
                isiDetailPengadaan.total = isiDetailPengadaan.jumlah * detail.harga_satuan;
                await isiDetailPengadaan.save();
            }

            const existingStokObat = await StokObat.findOne({
                where: {
                    id_obat: detail.id_obat,
                    nomer_batch: detail.nomer_batch,
                    expire: detail.expire,
                    satuan: detail.satuan,
                    tipe_obat: pengadaan.jenis_pengadaan_obat
                }
            });

            if (existingStokObat) {
                existingStokObat.jumlah += detailPengadaan.jumlah;
                await existingStokObat.save();
            } else {
                const stokObatCount = await StokObat.count();
                const id_stok_obat = `SO-${Math.floor(1000 + Math.random() * 9000)}-${stokObatCount + 1}`;
                await StokObat.create({
                    id_stok_obat: id_stok_obat,
                    id_obat: detail.id_obat,
                    jumlah: detail.jumlah,
                    satuan: detail.satuan,
                    nomer_batch: detail.nomer_batch,
                    expire: detail.expire,
                    harga_satuan: detail.harga_jual_satuan,
                    tipe_obat: pengadaan.jenis_pengadaan_obat
                });
            }
            // detailPengadaan.nomer_batch = detail.nomer_batch
            // detailPengadaan.expire = detail.expire
            // detailPengadaan.harga_satuan = detail.harga_satuan
            // detailPengadaan.total = detailPengadaan.jumlah * detail.harga_satuan;
            //
            // await detailPengadaan.save();


        }

        res.send({message: "Sukses"});
    } catch (e) {
        console.error(e)
        res.status(500).send(e);
    }
});

// router.put('/apoteker/pengadaan_obat/:id', async (req, res) => {
//    
//     // const { nomer_batch, expire, harga_satuan,  } = req.body;
//     try {
//         const detailPengadaan = await detailPengadaanObat.findOne({ where: { id_pengadaan_obat: req.params.id } });
//         detailPengadaan.expire = dayjs(req.body.expire, 'DD-MM-YYYY').toDate();
//
//         detailPengadaan.nomer_batch = req.body.nomer_batch;
//        
//         detailPengadaan.harga_satuan = req.body.harga_satuan;
//         detailPengadaan.total = detailPengadaan.jumlah * req.body.harga_satuan;
//         await detailPengadaan.save();
//
//         // Create a new faktur_pajak record with the provided attributes
//         await fakturPajak.create({
//             nomer_seri_faktur_pajak: req.body.nomer_seri_faktur_pajak,
//             nama_pt_penjual: req.body.nama_pt_penjual,
//             alamat_pt_penjual: req.body.alamat_pt_penjual,
//             npwp_pt_penjual: req.body.npwp_pt_penjual,
//             ppn: req.body.ppn,
//             total: req.body.total
//         });
//         const pengadaan = await pengadaanObat.findByPk(req.params.id);
//         pengadaan.status_pengadaan_obat = 'Diterima';
//         pengadaan.nomer_seri_faktur_pajak = req.body.nomer_seri_faktur_pajak;
//         await pengadaan.save();
//         // Generate id_stok_obat
//         const stokObatCount = await StokObat.count();
//         const id_stok_obat = `SO-${Math.floor(1000 + Math.random() * 9000)}-${stokObatCount + 1}`;
//
//         // Create a new stok_obat record
//         const makeStokObat = await StokObat.create({
//             id_stok_obat: id_stok_obat,
//             id_obat: detailPengadaan.id_obat,
//             nomer_batch: req.body.nomer_batch,
//             expire: req.body.expire,
//             satuan: detailPengadaan.satuan,
//             harga_satuan: req.body.harga_jual_satuan,
//             jumlah: detailPengadaan.jumlah,
//             tipe_obat: pengadaan.status_pengadaan_obat
//         });
//        
//
//         res.status(200).send();
//     } catch (e) {
//         console.log(e)
//         res.status(500).send(e);
//     }
// });

// router.put('/apoteker/pengadaan_obat/:id', async (req, res) => {
//     try {
//         const pengadaan = await pengadaanObat.findByPk(req.params.id);
//         pengadaan.status_pengadaan_obat = 'Diterima';
//         pengadaan.nomer_seri_faktur_pajak = req.body.nomer_seri_faktur_pajak;
//         await pengadaan.save();
//        
//         const detailPengadaan = await detailPengadaanObat.findAll({
//             where: {id_pengadaan_obat: req.params.id}
//         });
//        
//         for (let detail of detailPengadaanObat) {
//             detail.expire = dayjs(req.body.expire, 'DD-MM-YYYY').toDate();
//             detail.nomer_batch = req.body.nomer_batch;
//             detail.harga_satuan = req.body.harga_satuan;
//             detail.total = detailPengadaan.jumlah * req.body.harga_satuan;
//             await detail.save();
//         }
//        
//
//         await fakturPajak.create({
//             nomer_seri_faktur_pajak: req.body.nomer_seri_faktur_pajak,
//             nama_pt_penjual: req.body.nama_pt_penjual,
//             alamat_pt_penjual: req.body.alamat_pt_penjual,
//             npwp_pt_penjual: req.body.npwp_pt_penjual,
//             ppn: req.body.ppn,
//             total: req.body.total
//         });
//        
//         const existingStokObat = await StokObat.findOne({
//             where: {
//                 id_obat: detailPengadaan.id_obat,
//                 nomer_batch: req.body.nomer_batch,
//                 expire: req.body.expire,
//                 satuan: detailPengadaan.satuan,
//                 tipe_obat: pengadaan.status_pengadaan_obat
//             }
//         });
//
//         if (existingStokObat) {
//             existingStokObat.jumlah += detailPengadaan.jumlah;
//             await existingStokObat.save();
//         } else {
//            
//             const stokObatCount = await StokObat.count();
//             const id_stok_obat = `SO-${Math.floor(1000 + Math.random() * 9000)}-${stokObatCount + 1}`;
//
//             await StokObat.create({
//                 id_stok_obat: id_stok_obat,
//                 id_obat: detailPengadaan.id_obat,
//                 nomer_batch: req.body.nomer_batch,
//                 expire: req.body.expire,
//                 satuan: detailPengadaan.satuan,
//                 harga_satuan: req.body.harga_jual_satuan,
//                 jumlah: detailPengadaan.jumlah,
//                 tipe_obat: pengadaan.status_pengadaan_obat
//             });
//         }
//
//         res.send({message: 'Pengadaan obat updated successfully'});
//     } catch (e) {
//         res.status(500).send('Error! ' + e);
//     }
// });
module.exports = router;