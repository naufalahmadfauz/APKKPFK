const express = require('express')
const router = new express.Router()
const {Op} = require("sequelize");
// const {pictureUpload} = require('../functions/multerConfiguration')
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
const auth = require('../../middleware/auth')
dayjs.extend(customParseFormat)
const {ProfilDokter, DataPasien, DataJkn, NomerAntrian} = require('../../models')
const {ktpjknUpload,storageFolder} = require('../functions/multerConfiguration')
storageFolder()
router.get('/', async (req, res) => {
    res.render('LandingPge/index')
})
//pemilihan dokter
router.get('/daftar', async (req, res) => {
    try {
        if (req.session.id_registrasi_pasien) {
            res.redirect('/antrian/saya')
        } else {
            const dokter = await ProfilDokter.findAll()

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
                ]
            });

            const antrianTerakhirDokterUmum = await NomerAntrian.findOne({
                where: {
                    id_dokter: 'PDU-8473-1',
                    status_antrian: 'terdaftar',
                    createdAt: {
                        [Op.gte]: dayjs().startOf('day').toDate(),
                        [Op.lte]: dayjs().endOf('day').toDate()
                    }
                },
                order: [
                    ['nomer_antrian', 'DESC']
                ]
            });

            const antrianTerakhirDokterGigi = await NomerAntrian.findOne({
                where: {
                    id_dokter: 'PDG-3523-1',
                    status_antrian: 'terdaftar',
                    createdAt: {
                        [Op.gte]: dayjs().startOf('day').toDate(),
                        [Op.lte]: dayjs().endOf('day').toDate()
                    }
                },
                order: [
                    ['nomer_antrian', 'DESC']
                ]
            });

// Fetch all the NomerAntrian records within the same day, with id_dokter as "PDG-3523-1" and status_antrian as "terdaftar" or "terpanggil"
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
                ]
            });


// Pick the record with the smallest nomer_antrian attribute for 'terdaftar' and the biggest for 'terpanggil'
            const smallestNomerAntrianTerdaftarDokterUmum = antrianRecordsDokterUmum.find(record => record.status_antrian === 'terdaftar');
            const biggestNomerAntrianTerpanggilDokterUmum = antrianRecordsDokterUmum.reverse().find(record => record.status_antrian === 'terpanggil');

            const smallestNomerAntrianTerdaftarDokterGigi = antrianRecordsDokterGigi.find(record => record.status_antrian === 'terdaftar');
            const biggestNomerAntrianTerpanggilDokterGigi = antrianRecordsDokterGigi.reverse().find(record => record.status_antrian === 'terpanggil');
            const statusDokterUmum = await ProfilDokter.findOne({where: {id_dokter: 'PDU-8473-1'}})
            const statusDokterGigi = await ProfilDokter.findOne({where: {id_dokter: 'PDG-3523-1'}})

            let render = {
                dokter,
                antrianTerakhirDokterUmum,
                antrianTerakhirDokterGigi,
                smallestNomerAntrianTerdaftarDokterUmum,
                biggestNomerAntrianTerpanggilDokterUmum,
                smallestNomerAntrianTerdaftarDokterGigi,
                biggestNomerAntrianTerpanggilDokterGigi
            }
            if (statusDokterGigi.status_dokter === 'Aktif') {
                render.statusDokterGigi = 'Aktif'
            }
            if (statusDokterUmum.status_dokter === 'Aktif') {
                render.statusDokterUmum = 'Aktif'
            }
            res.render('pendaftaranPasienDaring/daftar', render)
        }
    } catch (e) {
        res.status(500).send('Error! ' + e)
    }
})

//pemilihan pasien lama atau baru
router.get('/daftar/dokter_umum/', async (req, res) => {
    try {
        if (req.session.id_registrasi_pasien) {
            res.redirect('/antrian/saya')
        } else {
            req.session.id_dokter = 'PDU-8473-1';
            req.session.jenis_dokter = 'Dokter Umum';
            res.render('pendaftaranPasienDaring/daftarDokterUmum')
        }
    } catch (e) {
        res.status(500).send('Error! ' + e)
    }
});
router.get('/daftar/dokter_gigi/', async (req, res) => {
    try {
        if (req.session.id_registrasi_pasien) {
            res.redirect('/antrian/saya')
        } else {
            req.session.id_dokter = 'PDG-3523-1';
            req.session.jenis_dokter = 'Dokter Gigi';
            res.render('pendaftaranPasienDaring/daftarDokterGigi')
            // res.send('Ini halaman pasien lama atau baru dokter gigi')
        }
    } catch (e) {
        res.status(500).send('Error! ' + e)
    }
});

//pengisian form pasien lama
router.get('/daftar/dokter_gigi/pasien_lama', async (req, res) => {
    try {
        if (req.session.id_registrasi_pasien) {
            res.redirect('/antrian/saya')
        } else {
            res.render('pendaftaranPasienDaring/daftarDokterGigiPasienLama')
        }
    } catch (e) {
        res.status(500).send('Error! ' + e)
    }
});
router.get('/daftar/dokter_umum/pasien_lama', async (req, res) => {
    try {
        if (req.session.id_registrasi_pasien) {
            res.redirect('/antrian/saya')
        } else {
            res.render('pendaftaranPasienDaring/daftarDokterUmumPasienLama')
        }
    } catch (e) {
        res.status(500).send('Error! ' + e)
    }
});
router.post('/daftar/pasien_lama/cari_pasien', async (req, res) => {
    try {
        console.log(req.body)
        const {id_registrasi_pasien_nik} = req.body;
        if (!id_registrasi_pasien_nik) {
            return res.status(400).send('id_registrasi_pasien_nik must be provided');
        }

        const pasien = await DataPasien.findOne({
            where: {
                [Op.or]: [
                    {id_registrasi_pasien: id_registrasi_pasien_nik},
                    {nik: id_registrasi_pasien_nik}
                ],
                jenis_pasien: 'Lama'
            }
        });

        if (!pasien) {
            return res.status(404).send('Anda belum terdaftar menjadi pasien lama di klinik ini, silahkan mendaftar menjadi pasien baru');
        }

        res.send(pasien);
    } catch (e) {
        res.status(500).send('Error! ' + e);
    }
});
router.get('/daftar/pasien_lama/:id_registrasi_pasien', async (req, res) => {
    try {
        let pasien = await DataPasien.findOne({
            where: {
                id_registrasi_pasien: req.params.id_registrasi_pasien
            }
        });

        if (!pasien) {
            return res.status(404).send('Pasien not found');
        }


        let notformatted = pasien.tanggal_lahir;
        let tglLahirFormat = dayjs(notformatted).format('DD-MM-YYYY');


        res.render('pendaftaranPasienDaring/detailPasienLama', {pasien, tglLahirFormat});
    } catch (e) {
        res.status(500).send('Error! ' + e);
    }
});
router.post('/daftar/pasien_lama', async (req, res) => {
    try {
        
        const id_dokter = req.session.id_dokter
        
        const antrianRecords = await NomerAntrian.findAll({
            where: {
                id_dokter: id_dokter,
                status_antrian: {
                    [Op.or]: ['terdaftar', 'terpanggil']
                },
                createdAt: {
                    [Op.gte]: dayjs().startOf('day').toDate(),
                    [Op.lte]: dayjs().endOf('day').toDate()
                }
            },
            order: [
                ['nomer_antrian', 'DESC']
            ]
        });

        const recordCount = antrianRecords.length > 0 ? antrianRecords[0].nomer_antrian : 0;
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const prefix = req.session.jenis_dokter === 'Dokter Gigi' ? 'DG' : 'DU';
        const id_antrian = `${prefix}-${randomNum}-${recordCount + 1}`;
        const nomer_antrian = recordCount + 1;
        const antrian = await NomerAntrian.create({
            id_antrian, id_dokter, nomer_antrian, status_antrian: 'terdaftar', ...req.body
        });
        req.session.id_antrian = id_antrian;
        // res.send(antrian);
        res.redirect('/verifikasi/' + req.body.id_registrasi_pasien)
    } catch (e) {
        res.status(500).send('Error! ' + e);
    }
});

//pengisian form pasien baru
router.get('/daftar/dokter_umum/pasien_baru', async (req, res) => {
    try {
        if (req.session.id_registrasi_pasien) {
            res.redirect('/antrian/saya')
        } else {
            req.session.jenis_dokter = 'Dokter Umum'
            res.render('pendaftaranPasienDaring/daftarDokterUmumPasienBaru')

        }
    } catch (e) {
        res.status(500).send('Error! ' + e)
    }
});
router.get('/daftar/dokter_gigi/pasien_baru', async (req, res) => {
    try {
        if (req.session.id_registrasi_pasien) {
            res.redirect('/antrian/saya')
        } else {
            req.session.jenis_dokter = 'Dokter Gigi'
            res.render('pendaftaranPasienDaring/daftarDokterGigiPasienBaru')
        }
    } catch (e) {
        res.status(500).send('Error! ' + e)
    }
});
router.post('/daftar/pasien_baru/',ktpjknUpload.fields([{name:'ktp_upload_user',maxCount:1},{name:'jkn_upload_user',maxCount:1}]), async (req, res) => {
    try {
        
        let ktp_filename = req.files['ktp_upload_user'][0].filename
        let jkn_filename = req.files['jkn_upload_user'][0].filename
        
        

        const parsedDate = dayjs(req.body.tanggal_lahir, 'DD-MM-YYYY');

        if (!parsedDate.isValid()) {
            return res.status(400).send('Invalid date format. Please use DD-MM-YYYY');
        }
        req.body.tanggal_lahir = parsedDate.add(12, 'hour').toDate();
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const recordCount = await DataPasien.count();
        const id_registrasi_pasien = `PS-${randomNum}-${recordCount + 1}`;

        const existingPasien = await DataPasien.findOne({
            where: {
                nik: req.body.nik
            }
        });
        if (existingPasien) {
            return res.status(409).send('Anda sudah terdaftar sebelumya, silahkan pilih mendaftar sebagai pasien lama');
        }

        const pasien = await DataPasien.create({id_registrasi_pasien,foto_ktp:ktp_filename, jenis_pasien: 'Baru', ...req.body});

        if (req.body.pasien_jkn === 'Ya') {
            await DataJkn.create({id_registrasi_pasien,foto_kartu_jkn:jkn_filename, ...req.body});
        }
        // } else {
        //     await DataJkn.create({nomer_kartu: '0', id_registrasi_pasien, faskes_tingkat: '0'});
        // }

        const antrianCount = await NomerAntrian.count();
        const prefix = req.session.jenis_dokter === 'Dokter Gigi' ? 'DG' : 'DU';
        const id_antrian = `${prefix}-${randomNum}-${antrianCount + 1}`;

        const antrianToday = await NomerAntrian.findAll({
            where: {
                id_dokter: req.session.id_dokter,
                createdAt: {
                    [Op.gte]: dayjs().startOf('day').toDate(),
                    [Op.lte]: dayjs().endOf('day').toDate()
                },
                status_antrian: {
                    [Op.or]: ['terdaftar', 'terpanggil']
                }
            },
            order: [
                ['nomer_antrian', 'DESC']
            ]
        });

        const maxNomerAntrian = antrianToday.length > 0 ? antrianToday[0].nomer_antrian : 0;

        const antrian = await NomerAntrian.create({
            id_antrian,
            id_registrasi_pasien,
            id_dokter: req.session.id_dokter,
            nomer_antrian: maxNomerAntrian + 1,
            status_antrian: 'verifikasi'
        });

        res.send({pasien, antrian});
    } catch (e) {
        console.error(e)
        res.status(500).send('Error! ' + e);
    }
});

//id_registrasi_pasien buat ini nanti hasil redirect pas daftar pasien baru / lama
router.get('/verifikasi/:id_registrasi_pasien', async (req, res) => {
    try {
        req.session.id_registrasi_pasien = req.params.id_registrasi_pasien;
        // Fetch the patient record
        const pasien = await DataPasien.findOne({
            where: {
                id_registrasi_pasien: req.params.id_registrasi_pasien
            }
        });
        // Check if the patient record exists
        if (!pasien) {
            await req.session.destroy();
            return res.status(404).render('pendaftaranPasienDaring/verifikasi', {message: 'Ditolak'});
        }
        // Check the jenis_pasien field
        if (pasien.jenis_pasien === 'Lama') {
            return res.render('pendaftaranPasienDaring/verifikasi', {message: 'Diterima'});
        } else {
            return res.render('pendaftaranPasienDaring/verifikasi', {message: 'Sedang Verifikasi'});
        }
    } catch (e) {
        res.status(500).send('Error! ' + e);
    }
});

//halaman list pendaftar pasien daring baru
router.get('/admin/pendaftar_daring_baru', async (req, res) => {
    try {
        const limitDokterUmum = parseInt(req.query.limitDokterUmum) || 15;
        const offsetDokterUmum = parseInt(req.query.offsetDokterUmum) || 0;
        const prevOffsetDokterUmum = offsetDokterUmum - limitDokterUmum < 0 ? 0 : offsetDokterUmum - limitDokterUmum;
        const nextOffsetDokterUmum = offsetDokterUmum + limitDokterUmum;


        const limitDokterGigi = parseInt(req.query.limitDokterGigi) || 15;
        const offsetDokterGigi = parseInt(req.query.offsetDokterGigi) || 0;
        const prevOffsetDokterGigi = offsetDokterGigi - limitDokterGigi < 0 ? 0 : offsetDokterGigi - limitDokterGigi;
        const nextOffsetDokterGigi = offsetDokterGigi + limitDokterGigi;


        const pasienBaruDokterUmum = await DataPasien.findAll({
            where: {
                jenis_pasien: 'Baru',
                createdAt: {
                    [Op.gte]: dayjs().startOf('day').toDate(),
                    [Op.lte]: dayjs().endOf('day').toDate()
                }
            },
            include: {
                model: NomerAntrian,
                as: 'nomerAntrian',
                where: {
                    id_dokter: 'PDU-8473-1',
                    status_antrian: 'verifikasi',
                    createdAt: {
                        [Op.gte]: dayjs().startOf('day').toDate(),
                        [Op.lte]: dayjs().endOf('day').toDate()
                    }
                },
                order: [
                    ['nomer_antrian', 'DESC']
                ]
            },
            limit: limitDokterUmum,
            offset: offsetDokterUmum
        });

        const pasienBaruDokterGigi = await DataPasien.findAll({
            where: {
                jenis_pasien: 'Baru',
                createdAt: {
                    [Op.gte]: dayjs().startOf('day').toDate(),
                    [Op.lte]: dayjs().endOf('day').toDate()
                }
            },
            include: {
                model: NomerAntrian,
                as: 'nomerAntrian',
                where: {
                    id_dokter: 'PDG-3523-1',
                    status_antrian: 'verifikasi',
                    createdAt: {
                        [Op.gte]: dayjs().startOf('day').toDate(),
                        [Op.lte]: dayjs().endOf('day').toDate()
                    }
                },
                order: [
                    ['nomer_antrian', 'DESC']
                ]
            },
            limit: limitDokterGigi,
            offset: offsetDokterGigi
        });

        res.render('pendaftaranPasienDaring/pendaftarDaringBaru', {
            pasienBaruDokterUmum,
            pasienBaruDokterGigi,
            prevOffsetDokterUmum,
            nextOffsetDokterUmum,
            limitDokterUmum,
            offsetDokterUmum,
            prevOffsetDokterGigi,
            nextOffsetDokterGigi,
            limitDokterGigi,
            offsetDokterGigi,
        });
        // res.send({
        //     pasienBaruDokterUmum,
        //     pasienBaruDokterGigi,
        //     prevOffsetDokterUmum,
        //     nextOffsetDokterUmum,
        //     limitDokterUmum,
        //     offsetDokterUmum,
        //     prevOffsetDokterGigi,
        //     nextOffsetDokterGigi,
        //     limitDokterGigi,
        //     offsetDokterGigi,
        // });
    } catch (e) {
        res.status(500).send('Error! ' + e)
    }
});
//detail pendaftar pasien baru
router.get('/admin/pendaftar_daring_baru/:id_registrasi_pasien', async (req, res) => {
    try {
        const pasien = await DataPasien.findOne({
            where: {
                id_registrasi_pasien: req.params.id_registrasi_pasien
            }
        });

        const dataJkn = await DataJkn.findOne({where: {id_registrasi_pasien: req.params.id_registrasi_pasien}});
        let notformatted = pasien.tanggal_lahir;
        let tglLahirFormat = dayjs(notformatted).format('DD-MM-YYYY');
        res.render('pendaftaranPasienDaring/detailPendaftarDaringBaru', {pasien, tglLahirFormat,dataJkn});
    } catch (e) {
        res.status(500).send('Error! ' + e);
    }
});

router.patch('/admin/setujui_pasien/:id_registrasi_pasien', async (req, res) => {
    try {
        // Update the jenis_pasien status of the patient
        const pasien = await DataPasien.update({jenis_pasien: 'Lama'}, {
            where: {
                id_registrasi_pasien: req.params.id_registrasi_pasien
            }
        });

        // Check if the patient exists
        if (!pasien[0]) {
            return res.status(404).send('Patient not found');
        }

        // Find the NomerAntrian record with the same id_registrasi_pasien, within the same day, and with status_antrian as 'verifikasi'
        const antrian = await NomerAntrian.findOne({
            where: {
                id_registrasi_pasien: req.params.id_registrasi_pasien,
                createdAt: {
                    [Op.gte]: dayjs().startOf('day').toDate(),
                    [Op.lte]: dayjs().endOf('day').toDate()
                },
                status_antrian: 'verifikasi'
            }
        });

        // If such a record is found, update its status_antrian to 'terdaftar'
        if (antrian) {
            // Fetch all the NomerAntrian records within the same day with status_antrian as 'terdaftar' or 'terpanggil'
            const antrianToday = await NomerAntrian.findAll({
                where: {
                    id_dokter: antrian.id_dokter,
                    createdAt: {
                        [Op.gte]: dayjs().startOf('day').toDate(),
                        [Op.lte]: dayjs().endOf('day').toDate()
                    },
                    status_antrian: {
                        [Op.or]: ['terdaftar', 'terpanggil']
                    }
                },
                order: [
                    ['nomer_antrian', 'DESC']
                ]
            });
            // Find the record with the highest nomer_antrian attribute
            console.log(antrianToday.length)
            const antrianTerdaftarToday = antrianToday.filter(record => record.status_antrian === 'terdaftar');
            const lengthOfAntrianTerdaftarToday = antrianTerdaftarToday.length;
            console.log(lengthOfAntrianTerdaftarToday)
            const maxNomerAntrian = lengthOfAntrianTerdaftarToday > 0 ? antrianTerdaftarToday[0].nomer_antrian : 0;
            // Update the nomer_antrian attribute of the current record to be the highest nomer_antrian + 1
            antrian.nomer_antrian = maxNomerAntrian + 1;
            
            antrian.status_antrian = 'terdaftar';
            await antrian.save();
        }
        res.send(antrian);
    } catch (e) {
        res.status(500).send('Error! ' + e);
    }
});
router.delete('/admin/tolak_pasien/:id_registrasi_pasien', async (req, res) => {
    try {
        // Delete the DataPasien record
        

        // Delete the DataJkn record
        await DataJkn.destroy({
            where: {
                id_registrasi_pasien: req.params.id_registrasi_pasien
            }
        });

        // Delete the NomerAntrian record
        await NomerAntrian.destroy({
            where: {
                id_registrasi_pasien: req.params.id_registrasi_pasien
            }
        });
        const pasienResult = await DataPasien.destroy({
            where: {
                id_registrasi_pasien: req.params.id_registrasi_pasien
            }
        });

        // Check if the DataPasien record was deleted
        if (pasienResult === 0) {
            return res.status(404).send('Patient not found');
        }
        res.send({message: 'Pasien berhasil ditolak'});
    } catch (e) {
        console.error(e)
        res.status(500).send('Error! ' + e);
    }
});
module.exports = router

// router.post('/daftar/pasien_baru/', async (req, res) => {
//     try {
//         const parsedDate = dayjs(req.body.tanggal_lahir, 'DD-MM-YYYY');
//         if (!parsedDate.isValid()) {
//             return res.status(400).send('Invalid date format. Please use DD-MM-YYYY');
//         }
//         req.body.tanggal_lahir = parsedDate.add(12, 'hour').toDate();
//         const randomNum = Math.floor(1000 + Math.random() * 9000);
//         const recordCount = await DataPasien.count();
//         const id_registrasi_pasien = `PS-${randomNum}-${recordCount + 1}`;
//         req.body.pilihan_dokter = req.session.jenis_dokter
//         const pasien = await DataPasien.create({id_registrasi_pasien, ...req.body});
//         if (req.body.pasien_jkn === 'Ya') {
//             const jkn = await DataJkn.create({id_registrasi_pasien, ...req.body});
//             res.send({pasien, jkn});
//         } else {
//             const jkn = await DataJkn.create({nomer_jkn: '0', id_registrasi_pasien,faskes_tingkat: '0'});
//             res.send(pasien);
//         }
//     } catch (e) {
//         res.status(500).send('Error! ' + e);
//     }
// });
// router.patch('/admin/setujui_pasien/:id_registrasi_pasien', auth, async (req, res) => {
//     try {
//         // Update the jenis_pasien status of the patient
//         const pasien = await DataPasien.update({jenis_pasien: 'Lama'}, {
//             where: {
//                 id_registrasi_pasien: req.params.id_registrasi_pasien
//             }
//         });
//         // Check if the patient exists
//         if (!pasien[0]) {
//             return res.status(404).send('Patient not found');
//         }
//
//         // Count the number of records in the NomerAntrian table within the same day, with the provided id_dokter and with status_antrian as 'terdaftar'
//         const recordCount = await NomerAntrian.count({
//             where: {
//                 id_dokter: req.body.id_dokter, status_antrian: 'terdaftar', createdAt: {
//                     [Op.gte]: dayjs().startOf('day').toDate(), [Op.lte]: dayjs().endOf('day').toDate()
//                 }
//             }
//         });
//
//         // Construct the id_antrian string
//         const prefix = pasien.pilihan_dokter === 'Dokter Gigi' ? 'DG' : 'DU';
//         const id_antrian = `${prefix}-${recordCount + 1}`;
//
//         // Construct the nomer_antrian
//         const nomer_antrian = recordCount + 1;
//
//         // Create a new NomerAntrian record
//         const antrian = await NomerAntrian.create({
//             id_antrian,
//             nomer_antrian,
//             id_registrasi_pasien: req.params.id_registrasi_pasien,
//             status_antrian: 'terdaftar', ...req.body
//         });
//         console.log(antrian)
//         console.log(pasien)
//         res.send(antrian);
//     } catch (e) {
//         res.status(500).send('Error! ' + e);
//     }
// });
//nanti ada halaman isi form get daftar_pasien_baru/:id_dokter
// set session jenis_dokter di session user pas setelah masuk ke halaman get_daftar_pasien_baru
//jadi cari id_dokter sesuai param, lalu ambil jenis_dokter dari profil_dokter, set session usernya
//
// router.patch('/pasien/:reg',async (req,res)=>{
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['nama','jkn','alamat','status','tinggi_badan','berat_badan','usia']
//     const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
//     if (!isValidOperation) {
//         return res.status(400).send({error: 'Invalid updates'})
//     }
//
//     try {
//         const pasien = await Pasien.findByPk(req.params.reg)
//         if (!pasien) {
//             return res.status(404).send()
//         }
//
//         updates.forEach((update => pasien[update] = req.body[update]))
//
//         await pasien.save()
//
//         res.send(pasien)
//     }catch (e) {
//         res.status(500).send('Error! ' + e)
//     }
// })
//
// router.post('/pasien',pictureUpload.single('ktp'), async (req,res)=>{
//     const userInput = Object.keys(req.body)
//     const allowedUpdates = ['nama','jkn','alamat','status','tinggi_badan','berat_badan','usia']
//     const isValidOperation = userInput.every((userInput) => allowedUpdates.includes(userInput))
//     if (!isValidOperation) {
//         return res.status(400).send({error: 'Invalid updates'})
//     }
//     try {
//         const latestPasien = await Pasien.findOne({
//             order: [
//                 ['createdAt', 'DESC']
//             ]
//         });
//
//         let newReg;
//         if (latestPasien) {
//             const latestRegNumber = parseInt(latestPasien.reg.slice(1));
//             newReg = 'P' + (latestRegNumber + 1).toString();
//         } else {
//             newReg = 'P1'; // Default value for the first record
//         }
//         const pasien = await Pasien.create({ ...req.body, reg: newReg, ktp:req.file.filename })
//         res.send(pasien)
//     }catch (e) {
//         console.log(e)
//         res.status(500).send('Error! ' + e)
//     }
// })
//
// router.delete('/pasien/bulk', async (req, res) => {
//     const regs = req.body;
//     console.log(regs)
//     try {
//         const numDeleted = await Pasien.destroy({
//             where: {
//                 reg: regs
//             }
//         });
//         res.send({ deleted: numDeleted });
//     } catch (e) {
//         res.status(500).send('Error! ' + e);
//     }
// });
// router.get('/pasien', async (req, res) => {
//     const sortField = req.query.sort || 'createdAt';
//     const sortOrder = req.query.order || 'ASC';
//     const limit = parseInt(req.query.limit) || 10;
//     const offset = parseInt(req.query.offset) || 0;
//     const jknFilter = req.query.jkn;
//     const statusFilter = req.query.status;
//     const searchQuery = req.query.search || '';
//
//
//     const validSortFields = ['jkn','status','usia', 'berat_badan', 'tinggi_badan', 'createdAt','updatedAt'];
//     if (!validSortFields.includes(sortField)) {
//         return res.status(400).send({ error: 'Invalid sort field' });
//     }
//
//     const validSortOrders = ['ASC', 'DESC'];
//     if (!validSortOrders.includes(sortOrder)) {
//         return res.status(400).send({ error: 'Invalid sort order' });
//     }
//
//     let whereClause = {};
//     if (jknFilter) {
//         whereClause.jkn = jknFilter;
//     }
//     if (statusFilter) {
//         whereClause.status = statusFilter;
//     }
//
//     if (searchQuery) {
//         whereClause[Op.or] = [
//             { nama: { [Op.iLike]: '%' + searchQuery + '%' } },
//             { alamat: { [Op.iLike]: '%' + searchQuery + '%' } }
//         ];
//     }
//
//     try {
//         const pasien = await Pasien.findAll({
//             where: whereClause,
//             order: [
//                 [sortField, sortOrder]
//             ],
//             limit: limit,
//             offset: offset
//         });
//
//         const pasienWithKtpUrl = pasien.map(record => {
//             const ktpUrl = `http://127.0.0.1:3000/static/${record.ktp}`;
//             return { ...record.toJSON(), ktpUrl };
//         });
//
//         res.send(pasienWithKtpUrl);
//
//         // res.send(pasien);
//     } catch (e) {
//         res.status(500).send('Error! ' + e);
//     }
// });
// router.delete('/admin/tolak_pasien/:id_registrasi_pasien', auth, async (req, res) => {
//     try {
//         // Delete the patient record
//         const result = await DataPasien.destroy({
//             where: {
//                 id_registrasi_pasien: req.params.id_registrasi_pasien
//             }
//         });
//
//         // Check if the patient record was deleted
//         if (result === 0) {
//             return res.status(404).send('Patient not found');
//         }
//
//         res.send({message: 'Pasien berhasil ditolak'});
//     } catch (e) {
//         res.status(500).send('Error! ' + e);
//     }
// });


// router.post('/daftar/pasien_lama',ktpjknUpload.fields([{name:'ktp',maxCount:1},{name:'jkn',maxCount:1}]), async (req, res) => {
//     try {
//         console.log(req.files['ktp'][0].filename)
//         console.log(req.files['jkn'][0].filename)
//         // const id_dokter = req.session.id_dokter || req.body.id_dokter;
//         const id_dokter = req.body.id_dokter;
//         const antrianRecords = await NomerAntrian.findAll({
//             where: {
//                 id_dokter: id_dokter,
//                 status_antrian: {
//                     [Op.or]: ['terdaftar', 'terpanggil']
//                 },
//                 createdAt: {
//                     [Op.gte]: dayjs().startOf('day').toDate(),
//                     [Op.lte]: dayjs().endOf('day').toDate()
//                 }
//             },
//             order: [
//                 ['nomer_antrian', 'DESC']
//             ]
//         });
//
//         const recordCount = antrianRecords.length > 0 ? antrianRecords[0].nomer_antrian : 0;
//         const randomNum = Math.floor(1000 + Math.random() * 9000);
//         // const prefix = req.session.jenis_dokter||req.body.jenis_dokter === 'Dokter Gigi' ? 'DG' : 'DU';
//         const prefix = req.body.jenis_dokter === 'Dokter Gigi' ? 'DG' : 'DU';
//         const id_antrian = `${prefix}-${randomNum}-${recordCount + 1}`;
//         const nomer_antrian = recordCount + 1;
//         const antrian = await NomerAntrian.create({
//             id_antrian, id_dokter, nomer_antrian, status_antrian: 'terdaftar', ...req.body
//         });
//         req.session.id_antrian = id_antrian;
//         console.log(antrian)
//         console.log(req.body.id_dokter)
//         res.send(antrian);
//         // res.redirect('/verifikasi/' + req.body.id_registrasi_pasien)
//     } catch (e) {
//         res.status(500).send('Error! ' + e);
//     }
// });
