const express = require('express')
const router = new express.Router()
const {Pasien} = require('../../models/')
const {Op} = require("sequelize");
const {pictureUpload} = require('../functions/multerConfiguration')
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
const auth = require('../../middleware/auth')
const moment = require('moment');

dayjs.extend(customParseFormat)

const {
    Sequelize,
    dataObat,
    Terapi,
    RekamMedis,
    RekamMedisAwal,
    sequelize,
    NomerAntrian,
    DataPasien,
    StokObat
} = require('../../models')

//list rekam medis awal semua
router.get('/asisten_dokter/list_rekam_medis_awal', async (req, res) => {
    try {
        // Retrieve sort field and order from the request query parameters
        const sortField = req.query.sort || 'createdAt';
        const sortOrder = req.query.order || 'DESC';
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const prevOffset = offset - limit < 0 ? 0 : offset - limit;
        const nextOffset = offset + limit;
        const searchQuery = req.query.search || '';

        // Construct the where clause for filtering and searching
        let whereClause = {};
        if (req.query.date === 'today') {
            whereClause.createdAt = {
                [Op.between]: [dayjs().startOf('day').toDate(), dayjs().endOf('day').toDate()]
            };
        }
        if (req.query.search) {
            whereClause[Op.or] = [
                {id_rekam_medis_awal: {[Op.iLike]: '%' + req.query.search + '%'}},
                {'$dataPasien.nama_lengkap$': {[Op.iLike]: '%' + req.query.search + '%'}},
                {id_registrasi_pasien: {[Op.iLike]: '%' + req.query.search + '%'}}
            ];
        }

        // Fetch all RekamMedisAwal records with the constructed where clause and order
        const rekamMedisAwal = await RekamMedisAwal.findAll({
            where: whereClause,
            order: [[sortField, sortOrder]],
            include: [{
                model: DataPasien,
                as: 'dataPasien',
                attributes: ['nama_lengkap', 'nik']
            }],
            limit,
            offset
        });
        console.log(rekamMedisAwal)
        // Send the fetched records as a response
        res.render('pencatatanRekamMedis/listRekamMedisAwal', {
            rekamMedisAwal,
            prevOffset,
            nextOffset,
            limit
        })
        // res.send(rekamMedisAwal);
    } catch (e) {
        res.status(500).send('Error! ' + e);
    }
});
//halaman satu rekam medis asisten dokter
router.get('/asisten_dokter/rekam_medis_awal/:id_rekam_medis_awal', async (req, res) => {
    try {
        // Fetch the RekamMedisAwal record with the provided id_rekam_medis_awal
        const rekamMedisAwal = await RekamMedisAwal.findOne({
            where: {
                id_rekam_medis_awal: req.params.id_rekam_medis_awal
            }, include: [{
                model: DataPasien,
                as: 'dataPasien',
                attributes: ['nama_lengkap', 'nik', 'tanggal_lahir', 'jenis_kelamin']
            }],
        });

        // Check if the RekamMedisAwal record exists
        if (!rekamMedisAwal) {
            return res.status(404).send('Rekam Medis Awal not found');
        }

        let birthdate = rekamMedisAwal.dataPasien.tanggal_lahir;
        let now = moment();
        let age = now.diff(birthdate, 'years');

        if (age < 1) {
            age = now.diff(birthdate, 'days') + " Hari";
        } else {
            age = age + " Tahun";
        }

        // Send the fetched record as a response
        res.render('pencatatanRekamMedis/detailRekamMedisAwal', {rekamMedisAwal, age});
        // res.send(rekamMedisAwal);
    } catch (e) {
        res.status(500).send('Error! ' + e);
    }
});
//halaman data pasien yang mendaftar hari ini
router.get('/asisten_dokter/rekam_medis_awal_antrian', async (req, res) => {
    try {
        const limitDokterUmum = parseInt(req.query.limitDokterUmum) || 15;
        const offsetDokterUmum = parseInt(req.query.offsetDokterUmum) || 0;
        const prevOffsetDokterUmum = offsetDokterUmum - limitDokterUmum < 0 ? 0 : offsetDokterUmum - limitDokterUmum;
        const nextOffsetDokterUmum = offsetDokterUmum + limitDokterUmum;

        const limitDokterGigi = parseInt(req.query.limitDokterGigi) || 15;
        const offsetDokterGigi = parseInt(req.query.offsetDokterGigi) || 0;
        const prevOffsetDokterGigi = offsetDokterGigi - limitDokterGigi < 0 ? 0 : offsetDokterGigi - limitDokterGigi;
        const nextOffsetDokterGigi = offsetDokterGigi + limitDokterGigi;


        const antrianRecordsDokterUmum = await NomerAntrian.findAll({
            where: {
                id_dokter: 'PDU-8473-1',
                status_antrian: {
                    [Op.or]: ['terdaftar', 'terpanggil']
                },
                createdAt: {
                    [Op.gte]: dayjs().startOf('day').toDate(),
                    [Op.lte]: dayjs().endOf('day').toDate()
                }
            },
            order: [
                ['nomer_antrian', 'ASC']
            ],
            include: {
                model: DataPasien,
                as: 'dataPasien',
            },
            limit: limitDokterUmum,
            offset: offsetDokterUmum
        });

        const antrianRecordsDokterGigi = await NomerAntrian.findAll({
            where: {
                id_dokter: 'PDG-3523-1',
                status_antrian: {
                    [Op.or]: ['terdaftar', 'terpanggil']
                },
                createdAt: {
                    [Op.gte]: dayjs().startOf('day').toDate(),
                    [Op.lte]: dayjs().endOf('day').toDate()
                }
            },
            order: [
                ['nomer_antrian', 'ASC']
            ],
            include: {
                model: DataPasien,
                as: 'dataPasien',
                attributes: ['nama_lengkap', 'nik']
            },
            limit: limitDokterGigi,
            offset: offsetDokterGigi
        });

        // const antrianDokterUmum = antrianRecords.filter(record => record.id_dokter === 'PDU-8473-1');
        // const antrianDokterGigi = antrianRecords.filter(record => record.id_dokter === 'PDG-3523-1');

        res.render('pencatatanRekamMedis/daftarAntrianAsistenDokter', {
            antrianRecordsDokterGigi,
            antrianRecordsDokterUmum,
            limitDokterUmum,
            limitDokterGigi,
            prevOffsetDokterGigi,
            prevOffsetDokterUmum,
            nextOffsetDokterGigi,
            nextOffsetDokterUmum,
            offsetDokterGigi,
            offsetDokterUmum

        });
        // res.send({
        //     antrianDokterUmum,
        //     antrianDokterGigi
        // });
    } catch (e) {
        res.status(500).send('Error! ' + e);
    }
});
//Form rekam medis awal
router.get('/asisten_dokter/buat_rekam_medis_awal/:id_registrasi_pasien', async (req, res) => {
    try {
        let dataPasien = await DataPasien.findByPk(req.params.id_registrasi_pasien)
        res.render('pencatatanRekamMedis/buatRekamMedisAwal', {dataPasien})
        // res.send('Form rekam medis awal');
    } catch (e) {
        res.status(500).send('Error! ' + e);
    }
});
//simpan rekam medis awal
router.post('/asisten_dokter/rekam_medis_awal/:id_registrasi_pasien', async (req, res) => {
    try {
        // Generate a random 4-digit number
        const randomNum = Math.floor(1000 + Math.random() * 9000);

        // Count the number of records in the RekamMedisAwal table
        const recordCount = await RekamMedisAwal.count();

        // Construct the id_rekam_medis_awal string
        const id_rekam_medis_awal = `RMA-${randomNum}-${recordCount + 1}`;

        // Retrieve id_registrasi_pasien from the request parameters
        const id_registrasi_pasien = req.params.id_registrasi_pasien;

        // Retrieve berat_badan, tinggi_badan, tekanan_darah_sistolik, tekanan_darah_diastolik, suhu_badan, and riwayat_penyakit from the request body
        const {
            berat_badan,
            tinggi_badan,
            tekanan_darah_sistolik,
            tekanan_darah_diastolik,
            suhu_badan,
            riwayat_penyakit
        } = req.body;

        // Create a new RekamMedisAwal record
        const rekamMedisAwal = await RekamMedisAwal.create({
            id_rekam_medis_awal,
            id_registrasi_pasien,
            berat_badan,
            tinggi_badan,
            tekanan_darah_sistolik,
            tekanan_darah_diastolik,
            suhu_badan,
            riwayat_penyakit
        });

        // Send the created RekamMedisAwal record as a response
        res.send(rekamMedisAwal);
    } catch (e) {
        res.status(500).send('Error! ' + e);
    }
});


//halaman rekam medis awal dari dokter hari ini
router.get('/dokter/list_rekam_medis_awal', async (req, res) => {
    try {
        // Retrieve sort field and order from the request query parameters
        const sortField = req.query.sort || 'createdAt';
        const sortOrder = req.query.order || 'DESC';
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const prevOffset = offset - limit < 0 ? 0 : offset - limit;
        const nextOffset = offset + limit;
        const searchQuery = req.query.search || '';

        // Construct the where clause for filtering and searching
        let whereClause = {
            createdAt:{
                [Op.between]: [dayjs().startOf('day').toDate(), dayjs().endOf('day').toDate()]   
            }
        };
        
        if (req.query.search) {
            whereClause[Op.or] = [
                {id_rekam_medis_awal: {[Op.iLike]: '%' + req.query.search + '%'}},
                {'$dataPasien.nama_lengkap$': {[Op.iLike]: '%' + req.query.search + '%'}},
                {id_registrasi_pasien: {[Op.iLike]: '%' + req.query.search + '%'}}
            ];
        }

        // Fetch all RekamMedisAwal records with the constructed where clause and order
        const rekamMedisAwal = await RekamMedisAwal.findAll({
            where: whereClause,
            order: [[sortField, sortOrder]],
            include: [{
                model: DataPasien,
                as: 'dataPasien',
                attributes: ['nama_lengkap', 'nik']
            }],
            limit,
            offset
        });
        console.log(rekamMedisAwal)
        // Send the fetched records as a response
        res.render('pencatatanRekamMedis/listRekamMedisAwalHariIni', {
            rekamMedisAwal,
            prevOffset,
            nextOffset,
            limit
        })
        // res.send(rekamMedisAwal);
    } catch (e) {
        res.status(500).send('Error! ' + e);
    }
});
//halaman detail rekam medis awal dari dokter
router.get('/dokter/rekam_medis_awal_hari_ini/:id_rekam_medis_awal', async (req, res) => {
    try {
        // Fetch the RekamMedisAwal record with the provided id_rekam_medis_awal
        const rekamMedisAwal = await RekamMedisAwal.findOne({
            where: {
                id_rekam_medis_awal: req.params.id_rekam_medis_awal
            }, include: [{
                model: DataPasien,
                as: 'dataPasien',
                attributes: ['nama_lengkap', 'nik', 'tanggal_lahir', 'jenis_kelamin']
            }],
        });

        // Check if the RekamMedisAwal record exists
        if (!rekamMedisAwal) {
            return res.status(404).send('Rekam Medis Awal not found');
        }

        let birthdate = rekamMedisAwal.dataPasien.tanggal_lahir;
        let now = moment();
        let age = now.diff(birthdate, 'years');

        if (age < 1) {
            age = now.diff(birthdate, 'days') + " Hari";
        } else {
            age = age + " Tahun";
        }

        // Send the fetched record as a response
        res.render('pencatatanRekamMedis/detailRekamMedisAwalDokter', {rekamMedisAwal, age});
        // res.send(rekamMedisAwal);
    } catch (e) {
        res.status(500).send('Error! ' + e);
    }
});


//list rekam medis dokter
router.get('/dokter/list_rekam_medis', async (req, res) => {
    try {
        // Retrieve sort field and order from the request query parameters
        const sortField = req.query.sort || 'createdAt';
        const sortOrder = req.query.order || 'DESC';
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const prevOffset = offset - limit < 0 ? 0 : offset - limit;
        const nextOffset = offset + limit;


        // Construct the where clause for filtering and searching
        let whereClause = {};
        if (req.akun) {
            if (req.akun.jabatan === 'dokterumum') {
                whereClause = {id_dokter: 'PDU-8473-1'}
            } else if (req.akun.jabatan === 'doktergigi') {
                whereClause = {id_dokter: 'PDG-3523-1'}
            }
        } else {
            whereClause = {}
        }
        if (req.query.search) {
            whereClause[Op.or] = [
                {id_rekam_medis: {[Op.iLike]: '%' + req.query.search + '%'}},
                {'$dataPasien.nama_lengkap$': {[Op.iLike]: '%' + req.query.search + '%'}},
                {id_registrasi_pasien: {[Op.iLike]: '%' + req.query.search + '%'}}
            ];
        }

        // Fetch all RekamMedisAwal records with the constructed where clause and order
        const rekamMedis = await RekamMedis.findAll({
            where: whereClause,
            order: [[sortField, sortOrder]],
            include: [{
                model: DataPasien,
                as: 'dataPasien',
            }],
            limit,
            offset
        });


        res.render('pencatatanRekamMedis/listRekamMedis', {rekamMedis, limit, nextOffset, prevOffset});

        // Send the fetched records as a response
        // res.render('pencatatanRekamMedis/listRekamMedis', {rekamMedis, limit, nextOffset, prevOffset})
        // res.send(rekamMedis);
    } catch (e) {
        res.status(500).send('Error! ' + e);
    }
});
//detail rekam medis
router.get('/dokter/rekam_medis/detail/:id_rekam_medis', async (req, res) => {
    try {
        // Fetch the RekamMedisAwal record with the provided id_rekam_medis_awal
        const rekamMedis = await RekamMedis.findOne({
            where: {
                id_rekam_medis: req.params.id_rekam_medis
            }, include: [{
                model: Terapi,
                as: 'terapi'
            }, {
                model: DataPasien,
                as: 'dataPasien',
            }]
        });
        const terapiRecords = await Terapi.findAll({where: {id_rekam_medis: req.params.id_rekam_medis}});

        const terapiDetails = await Promise.all(terapiRecords.map(async (terapi) => {
            const stokObat = await StokObat.findOne({
                where: {id_stok_obat: terapi.id_stok_obat},
                include: [{
                    model: dataObat,
                    as: 'dataObat',
                }]
            });
            if (stokObat === null) {
                return {
                    nama_obat: '[Obat Dari luar Klinik] ' + terapi.terapi_luar,
                    satuan: terapi.satuan,
                    total: terapi.total,
                    dosis: terapi.dosis
                };
            }else{
                return {
                    nama_obat: stokObat.dataObat.nama_obat,
                    satuan: stokObat.satuan,
                    total: terapi.total,
                    dosis: terapi.dosis
                };
            }
            
        }));
        console.log(terapiDetails)
        let birthdate = rekamMedis.dataPasien.tanggal_lahir;
        let now = moment();
        let age = now.diff(birthdate, 'years');

        if (age < 1) {
            age = now.diff(birthdate, 'days') + " Hari";
        } else {
            age = age + " Tahun";
        }
        // Check if the RekamMedisAwal record exists
        if (!rekamMedis) {
            return res.status(404).send('Rekam Medis Awal not found');
        }

        // Send the fetched record as a response
        res.render('pencatatanRekamMedis/detailRekamMedis', {rekamMedis, age, terapiDetails});
        // res.send(rekamMedis);
    } catch (e) {
        res.status(500).send('Error! ' + e);
    }
});


//halaman formulir rekam medis
router.get('/dokter/buat_rekam_medis/:id_rekam_medis_awal', async (req, res) => {
    try {
        const rekamMedisAwal = await RekamMedisAwal.findOne({
            where: {
                id_rekam_medis_awal: req.params.id_rekam_medis_awal
            }
        });

        if (!rekamMedisAwal) {
            return res.status(404).send('Rekam Medis Awal not found');
        }

        const pasien = await DataPasien.findOne({
            where: {
                id_registrasi_pasien: rekamMedisAwal.id_registrasi_pasien
            }
        });

        let latestRekamMedis = await RekamMedis.findOne({
            where: {
                id_registrasi_pasien: rekamMedisAwal.id_registrasi_pasien
            },
            order: [
                ['createdAt', 'DESC']
            ],
            include: [{
                model: Terapi,
                as: 'terapi'
            },
                {
                    model: DataPasien,
                    as: 'dataPasien'
                }]
        });

        let whereClause = {
            jumlah: {
                [Op.gte]: 1
            },
            expire: {
                [Op.gte]: dayjs().add(1, 'day').toDate()
            }
        };

        let orderClause = [
            ['id_obat', 'ASC'],
            ['expire', 'ASC']
        ];

        if (pasien.pasien_jkn === 'Ya') {
            orderClause.unshift([sequelize.literal(`tipe_obat='JKN'`), 'DESC']);
        } else {
            whereClause.tipe_obat = {
                [Op.ne]: 'JKN'
            };
        }

        const stokObat = await StokObat.findAll({
            where: whereClause,
            order: orderClause,
            include: [{
                model: dataObat,
                as: 'dataObat'
            }]
        });

        const stokObatWithNamaObat = stokObat.map(record => {
            const {dataObat, ...stokObatData} = record.toJSON();
            return {...stokObatData, nama_obat: dataObat.nama_obat};
        });


        const terapiRecords = await Terapi.findAll({where: {id_rekam_medis: latestRekamMedis.id_rekam_medis}});

        const terapiDetails = await Promise.all(terapiRecords.map(async (terapi) => {
            const stokObat = await StokObat.findOne({
                where: {id_stok_obat: terapi.id_stok_obat},
                include: [{
                    model: dataObat,
                    as: 'dataObat',
                }]
            });
            if (stokObat === null) {
                return {
                    nama_obat: terapi.terapi_luar,
                    satuan: terapi.satuan,
                    total: terapi.total,
                    dosis: terapi.dosis
                };
            }else{
                return {
                    nama_obat: stokObat.dataObat.nama_obat,
                    satuan: stokObat.satuan,
                    total: terapi.total,
                    dosis: terapi.dosis
                };
            }
            
        }));
        
        let birthdate = latestRekamMedis.dataPasien.tanggal_lahir;
        let now = moment();
        let age = now.diff(birthdate, 'years');

        if (age < 1) {
            age = now.diff(birthdate, 'days') + " Hari";
        } else {
            age = age + " Tahun";
        }
        res.render('pencatatanRekamMedis/buatRekamMedis', {rekamMedisAwal, latestRekamMedis, stokObat: stokObatWithNamaObat,age,terapiDetails})
        // res.send({
        //     rekamMedisAwal,
        //     latestRekamMedis,
        //     stokObat: stokObatWithNamaObat
        // });
    } catch (e) {
        console.error(e)
        res.status(500).send('Error! ' + e);
    }
});
router.post('/dokter/rekam_medis/:id_rekam_medis_awal', async (req, res) => {
    try {
        
        // Generate a random 4-digit number
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        let id_dokter = ''
        if (req.akun) {
            if (req.akun.jabatan === 'dokterumum') {
                id_dokter = 'PDU-8473-1'
            } else if (req.akun.jabatan === 'doktergigi') {
                id_dokter = 'PDG-3523-1'
            }
        } else {
            id_dokter = 'PDU-8473-1'
        }
        // Count the number of records in the RekamMedis table
        const recordCount = await RekamMedis.count();

        // Construct the id_rekam_medis string
        const id_rekam_medis = `RM-${randomNum}-${recordCount + 1}`;

        // Retrieve id_rekam_medis_awal from the request parameters
        const id_rekam_medis_awal = req.params.id_rekam_medis_awal;
        const rekamMedisAwal = await RekamMedisAwal.findOne({
            where: {
                id_rekam_medis_awal: id_rekam_medis_awal
            }
        });
        if (!rekamMedisAwal) {
            return res.status(404).send('Rekam Medis Awal not found');
        }
        const {hasil_lab, gejala, terapi} = req.body;
        const id_registrasi_pasien = rekamMedisAwal.id_registrasi_pasien;

        // Create a new RekamMedis record
        const rekamMedis = await RekamMedis.create({
            id_rekam_medis,
            id_dokter,
            id_registrasi_pasien,
            id_rekam_medis_awal,
            hasil_lab,
            gejala
        });

        // Check if terapi is defined and is an array
        if (Array.isArray(terapi)) {
            for (let i = 0; i < terapi.length; i++) {
                
                // Generate a random 4-digit number for id_terapi
                const randomNumTerapi = Math.floor(1000 + Math.random() * 9000);

                // Construct the id_terapi string
                let id_terapi = `${randomNumTerapi}-${i + 1}`;

                // Retrieve id_stok_obat, total, and dosis from the terapi item
                let {id_stok_obat, total, dosis,satuan,nama_obat_terapi_luar,satuan_luar} = terapi[i];

                // Fetch the StokObat record with the provided id_stok_obat
                const stokObat = await StokObat.findOne({
                    where: {
                        id_stok_obat: id_stok_obat
                    }
                });
                console.log(satuan_luar)
                
                if (!stokObat) {
                    const newTerapi = await Terapi.create({
                        id_terapi,
                        id_rekam_medis,
                        id_stok_obat_luar:null,
                        terapi_luar:nama_obat_terapi_luar,
                        satuan_luar,
                        total,
                        satuan,
                        dosis
                    });
                }else
                {
                    // Subtract the total from the jumlah
                    stokObat.jumlah -= total;

                    // Save the updated StokObat record
                    await stokObat.save();

                    // Create a new Terapi record
                    const newTerapi = await Terapi.create({
                        id_terapi,
                        id_rekam_medis,
                        id_stok_obat,
                        total,
                        dosis
                    }); 
                }

            }
        }
        // Iterate over the terapi array and create a new Terapi record for each item
        // Send the created RekamMedis record as a response
        res.send(rekamMedis);
    } catch (e) {
        console.error(e)
        res.status(500).send('Error! ' + e);
    }
});
module.exports = router

// router.post('/admin/rekam_medis/:id_rekam_medis_awal', async (req, res) => {
//     try {
//         // Generate a random 4-digit number
//         const randomNum = Math.floor(1000 + Math.random() * 9000);
//
//         // Count the number of records in the RekamMedis table
//         const recordCount = await RekamMedis.count();
//
//         // Construct the id_rekam_medis string
//         const id_rekam_medis = `RM-${randomNum}-${recordCount + 1}`;
//         const id_rekam_medis_awal = req.params.id_rekam_medis_awal;
//
//         // Retrieve id_registrasi_pasien, id_rekam_medis_awal, hasil_lab, and gejala from the request body
//         const { id_registrasi_pasien, hasil_lab, gejala, terapi } = req.body;
//
//         // Create a new RekamMedis record
//         const rekamMedis = await RekamMedis.create({
//             id_rekam_medis,
//             id_registrasi_pasien,
//             id_rekam_medis_awal,
//             hasil_lab,
//             gejala
//         });
//
//         // Iterate over the terapi array and create a new Terapi record for each item
//         for (let i = 0; i < terapi.length; i++) {
//             // Generate a random 4-digit number for id_terapi
//             const randomNumTerapi = Math.floor(1000 + Math.random() * 9000);
//
//             // Construct the id_terapi string
//             const id_terapi = `${randomNumTerapi}-${i + 1}`;
//
//             // Retrieve id_stok_obat, total, and dosis from the terapi item
//             const { id_stok_obat, total, dosis } = terapi[i];
//
//             // Create a new Terapi record
//             const newTerapi = await Terapi.create({
//                 id_terapi,
//                 id_rekam_medis,
//                 id_stok_obat,
//                 total,
//                 dosis
//             });
//         }
//
//         // Send the created RekamMedis record as a response
//         res.send(rekamMedis);
//     } catch (e) {
//         res.status(500).send('Error! ' + e);
//     }
// });
// router.get('/dokter/buat_rekam_medis/:id_rekam_medis_awal', async (req, res) => {
//     try {
//         const rekamMedisAwal = await RekamMedisAwal.findOne({
//             where: {
//                 id_rekam_medis_awal: req.params.id_rekam_medis_awal
//             }
//         });
//
//         if (!rekamMedisAwal) {
//             return res.status(404).send('Rekam Medis Awal not found');
//         }
//
//         const pasien = await DataPasien.findOne({
//             where: {
//                 id_registrasi_pasien: rekamMedisAwal.id_registrasi_pasien
//             }
//         });
//
//         let whereClause = {
//             jumlah: {
//                 [Op.gte]: 1
//             },
//             expire: {
//                 [Op.gte]: dayjs().add(1, 'day').toDate()
//             }
//         };
//
//         let orderClause = [
//             ['id_obat', 'ASC'],
//             ['expire', 'ASC']
//         ];
//
//         if (pasien.pasien_jkn === 'Ya') {
//             orderClause.unshift([sequelize.literal(`tipe_obat='JKN'`), 'DESC']);
//         } else {
//             whereClause.tipe_obat = {
//                 [Op.not]: 'JKN'
//             };
//         }
//         const stokObat = await StokObat.findAll({
//             where: whereClause,
//             order: orderClause,
//             include: [{
//                 model: dataObat,
//                 as: 'dataObat'
//             }]
//         });
//
//         // Map over the stokObat array to include the nama_obat in the response
//         const stokObatWithNamaObat = stokObat.map(record => {
//             const { dataObat, ...stokObatData } = record.toJSON();
//             if (!dataObat) {
//                 console.log('dataObat is undefined for record:', record);
//                 return stokObatData;
//             }
//             return { ...stokObatData, nama_obat: dataObat.nama_obat };
//         });
//
//         res.send(stokObatWithNamaObat);
//     } catch (e) {
//         res.status(500).send('Error! ' + e);
//     }
// });
// router.get('/dokter/buat_rekam_medis/:id_rekam_medis_awal', async (req, res) => {
//     try {
//         const rekamMedisAwal = await RekamMedisAwal.findOne({
//             where: {
//                 id_rekam_medis_awal: req.params.id_rekam_medis_awal
//             }
//         });
//
//         if (!rekamMedisAwal) {
//             return res.status(404).send('Rekam Medis Awal not found');
//         }
//
//         const pasien = await DataPasien.findOne({
//             where: {
//                 id_registrasi_pasien: rekamMedisAwal.id_registrasi_pasien
//             }
//         });
//
//         const latestRekamMedis = await RekamMedis.findOne({
//             where: {
//                 id_registrasi_pasien: rekamMedisAwal.id_registrasi_pasien
//             },
//             order: [
//                 ['createdAt', 'DESC']
//             ]
//         });
//
//         let whereClause = {
//             jumlah: {
//                 [Op.gte]: 1
//             },
//             expire: {
//                 [Op.gte]: dayjs().add(1, 'day').toDate()
//             }
//         };
//
//         let orderClause = [
//             ['id_obat', 'ASC'],
//             ['expire', 'ASC']
//         ];
//
//         if (pasien.pasien_jkn === 'Ya') {
//             orderClause.unshift([sequelize.literal(`tipe_obat='JKN'`), 'DESC']);
//         } else {
//             whereClause.tipe_obat = {
//                 [Op.ne]: 'JKN'
//             };
//         }
//
//         const stokObat = await StokObat.findAll({
//             where: whereClause,
//             order: orderClause,
//             include: [{
//                 model: dataObat,
//                 as: 'dataObat'
//             }]
//         });
//
//         const stokObatWithNamaObat = stokObat.map(record => {
//             const { dataObat, ...stokObatData } = record.toJSON();
//             return { ...stokObatData, nama_obat: dataObat.nama_obat };
//         });
//
//         res.send({
//             id_rekam_medis_awal: rekamMedisAwal.id_rekam_medis_awal,
//             latestRekamMedis,
//             stokObat: stokObatWithNamaObat
//         });
//     } catch (e) {
//         res.status(500).send('Error! ' + e);
//     }
// });