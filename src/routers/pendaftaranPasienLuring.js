const express = require('express')
const router = new express.Router()
const {Op} = require("sequelize");
const {pictureUpload, ktpjknUpload} = require('../functions/multerConfiguration')
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
const auth = require('../../middleware/auth')

dayjs.extend(customParseFormat)

const {Sequelize, ProfilDokter, DataPasien, sequelize, NomerAntrian, DataJkn} = require('../../models')

//list data pasien lama
//halaman pendaftaran pasien
router.get('/admin/list_data_pasien', async (req, res) => {
    const sortField = req.query.sort || 'createdAt';
    const sortOrder = req.query.order || 'ASC';
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const jknFilter = req.query.pasien_jkn;

    const searchQuery = req.query.search || '';

    const prevOffset = offset - limit < 0 ? 0 : offset - limit;
    const nextOffset = offset + limit;
    // const validSortFields = ['tanggal_lahir', 'pasien_jkn', 'jenis_pasien', 'createdAt', 'updatedAt'];
    // if (!validSortFields.includes(sortField)) {
    //     return res.status(400).send({error: 'Invalid sort field'});
    // }
    //
    // const validSortOrders = ['ASC', 'DESC'];
    // if (!validSortOrders.includes(sortOrder)) {
    //     return res.status(400).send({error: 'Invalid sort order'});
    // }
    let whereClause = {};
    if (jknFilter) {
        whereClause.pasien_jkn = jknFilter;
    }

    if (searchQuery) {
        whereClause[Op.or] = [
            {nama_lengkap: {[Op.iLike]: '%' + searchQuery + '%'}},
            {nik: {[Op.iLike]: '%' + searchQuery + '%'}},
            {alamat: {[Op.iLike]: '%' + searchQuery + '%'}}
        ];
    }

    try {
        const pasien = await DataPasien.findAll({
            where: whereClause,
            order: [
                [sortField, sortOrder]
            ],
            limit: limit,
            offset: offset
        });
        res.render('pendaftaranPasienLuring/listDataPasien', {pasien, prevOffset, nextOffset, limit})
        // res.send(pasien);
    } catch (e) {

    }
})

//tampilkan pilihan dokter pendaftaran
router.get('/admin/buat_antrian/', async (req, res) => {
    try {
        const smallestNomerAntrianTerdaftarDokterUmum = await NomerAntrian.findOne({
            where: {
                id_dokter: 'PDU-8473-1',
                status_antrian: 'terdaftar',
                createdAt: {
                    [Op.gte]: dayjs().startOf('day').toDate(),
                    [Op.lte]: dayjs().endOf('day').toDate()
                }
            },
            order: [
                ['nomer_antrian', 'ASC']
            ]
        });
        const biggestNomerAntrianTerpanggilDokterUmum = await NomerAntrian.findOne({
            where: {
                id_dokter: 'PDU-8473-1',
                status_antrian: 'terpanggil',
                createdAt: {
                    [Op.gte]: dayjs().startOf('day').toDate(),
                    [Op.lte]: dayjs().endOf('day').toDate()
                }
            },
            order: [
                ['nomer_antrian', 'DESC']
            ]
        });
        const smallestNomerAntrianTerdaftarDokterGigi = await NomerAntrian.findOne({
            where: {
                id_dokter: 'PDG-3523-1',
                status_antrian: 'terdaftar',
                createdAt: {
                    [Op.gte]: dayjs().startOf('day').toDate(),
                    [Op.lte]: dayjs().endOf('day').toDate()
                }
            },
            order: [
                ['nomer_antrian', 'ASC']
            ]
        });
        const biggestNomerAntrianTerpanggilDokterGigi = await NomerAntrian.findOne({
            where: {
                id_dokter: 'PDG-3523-1',
                status_antrian: 'terpanggil',
                createdAt: {
                    [Op.gte]: dayjs().startOf('day').toDate(),
                    [Op.lte]: dayjs().endOf('day').toDate()
                }
            },
            order: [
                ['nomer_antrian', 'DESC']
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
        res.render('pendaftaranPasienLuring/buatAntrian', {
            smallestNomerAntrianTerdaftarDokterUmum,
            biggestNomerAntrianTerpanggilDokterUmum,
            smallestNomerAntrianTerdaftarDokterGigi,
            biggestNomerAntrianTerpanggilDokterGigi,
            antrianTerakhirDokterUmum,
            antrianTerakhirDokterGigi
        })

        // res.send({
        //     smallestNomerAntrianTerdaftarDokterUmum,
        //     biggestNomerAntrianTerpanggilDokterUmum,
        //     smallestNomerAntrianTerdaftarDokterGigi,
        //     biggestNomerAntrianTerpanggilDokterGigi,
        // });

    } catch (e) {
        res.status(500).send('Error! ' + e)
    }
})

//tampilan pasien lama atau baru
router.get('/admin/buat_antrian/dokter_umum/pilihan_pasien', async (req, res) => {
    try {
        req.session.id_dokter = 'PDU-8473-1'
        res.render('pendaftaranPasienLuring/daftarDokterUmum')
        // res.send('pilihan pasien lama atau umum dokter umum')
    } catch (e) {
        res.status(500).send('Error! ' + e)
    }
})
router.get('/admin/buat_antrian/dokter_gigi/pilihan_pasien', async (req, res) => {
    try {
        req.session.id_dokter = 'PDG-3523-1'
        res.render('pendaftaranPasienLuring/daftarDokterGigi')
    } catch (e) {
        res.status(500).send('Error! ' + e)
    }
})

//formulir pasien lama
router.get('/admin/buat_antrian/pasien_lama', async (req, res) => {
    try {
        res.render('pendaftaranPasienLuring/daftarPasienLama')
        // res.send('Formulir pasien lamas')
    } catch (e) {
        res.status(500).send('Error! ' + e)
    }
})

router.post('/admin/buat_antrian/cari_pasien', async (req, res) => {
    try {
        // Check if id_registrasi_pasien exists
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
            return res.status(404).send('Pasien belum terdaftar');
        }

        res.send(pasien);
        //redirect ke route bawah dengan id_registrasi_pasien
    } catch (e) {
        res.status(500).send('Error! ' + e);
    }
});

//tampilan data satu pasien lama pendaftaran pasien lama
router.get('/admin/buat_antrian/pilihan_pasien/pasien_lama/:id_registrasi_pasien', async (req, res) => {
    try {
        let pasien = await DataPasien.findOne({
            where: {
                id_registrasi_pasien: req.params.id_registrasi_pasien
            }
        });

        let jknPasien = await DataJkn.findOne({
            where: {
                id_registrasi_pasien: req.params.id_registrasi_pasien
            }
        });

        if (!jknPasien) {
            jknPasien = undefined
        }
        console.log('this his' + jknPasien.foto_kartu_jkn)
        let notformatted = pasien.tanggal_lahir;
        let tglLahirFormat = dayjs(notformatted).format('DD-MM-YYYY');
        res.render('pendaftaranPasienLuring/detailPasienLama', {pasien, tglLahirFormat, jknPasien})
        // res.send(pasien)
    } catch (e) {
        res.status(500).send('Error! ' + e)
    }
})
//tampilan data satu pasien lama pendaftaran pasien lama

router.get('/admin/detail_pasien/:id_registrasi_pasien', async (req, res) => {
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
        let detailPasienHalaman = true
        let jknPasien = await DataJkn.findOne({
            where: {
                id_registrasi_pasien: req.params.id_registrasi_pasien
            }
        });

        if (!jknPasien) {
            jknPasien = undefined
        }
        res.render('pendaftaranPasienLuring/detailPasienLama', {pasien, tglLahirFormat, detailPasienHalaman, jknPasien})
        // res.send(pasien)
    } catch (e) {
        res.status(500).send('Error! ' + e)
    }
})
router.post('/admin/buat_antrian/pasien_lama', async (req, res) => {
    try {
        // Check if id_registrasi_pasien exists
        const pasien = await DataPasien.findOne({
            where: {
                id_registrasi_pasien: req.body.id_registrasi_pasien
            }
        })

        if (!pasien) {
            return res.status(404).send('Pasien belum terdaftar');
        }

        // Count the number of records in the NomerAntrian table within the same day, with the provided id_dokter and with status_antrian as 'terdaftar'
        const antrianRecords = await NomerAntrian.findAll({
            where: {
                id_dokter: req.session.id_dokter,
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
        let id_antrian;
        // Construct the id_antrian string
        if (req.session.id_dokter === 'PDU-8473-1') {
            id_antrian = `DU-${randomNum}-${recordCount + 1}`;
        } else if (req.session.id_dokter === 'PDG-3523-1') {
            id_antrian = `DG-${randomNum}-${recordCount + 1}`;
        }


        // Construct the nomer_antrian
        const nomer_antrian = recordCount + 1;

        // Create a new NomerAntrian record
        const antrian = await NomerAntrian.create({
            id_antrian,
            id_dokter: req.session.id_dokter,
            nomer_antrian,
            status_antrian: 'terdaftar',
            ...req.body
        });
        req.session.id_dokter = ''
        res.send(antrian);
        // res.send(antrian);
    } catch (e) {
        console.log(req.body)
        console.error(e)


        res.status(500).send('Error! ' + e);
    }
});

//formulir pasien baru
router.get('/admin/buat_antrian/pasien_baru', async (req, res) => {
    try {
        res.render('pendaftaranPasienLuring/daftarPasienBaru')
        // res.send('Halaman formulir pasien baru')
    } catch (e) {
        res.status(500).send('Error! ' + e)
    }
})
router.post('/admin/daftar/pasien_baru/', ktpjknUpload.fields([{
    name: 'ktp_upload_user',
    maxCount: 1
}, {name: 'jkn_upload_user', maxCount: 1}]), async (req, res) => {
    try {
        let ktp_filename = req.files['ktp_upload_user'][0].filename
        let jkn_filename = ''
        
        if (req.files['jkn_upload_user']) {
            jkn_filename = req.files['jkn_upload_user'][0].filename
        }
        // Parse tanggal_lahir from the request body
        const parsedDate = dayjs(req.body.tanggal_lahir, 'DD-MM-YYYY');

        // Check if the date is valid
        if (!parsedDate.isValid()) {
            console.log(req.body.tanggal_lahir)
            console.log(parsedDate);
            return res.status(400).send('Invalid date format. Please use DD-MM-YYYY');
        }

        // Convert tanggal_lahir to JavaScript Date object
        req.body.tanggal_lahir = parsedDate.add(12, 'hour').toDate();

        // Set jenis_pasien and pilihan_dokter
        req.body.jenis_pasien = 'Lama';

        // Create a new DataPasien record
        const randomNumPasien = Math.floor(1000 + Math.random() * 9000);
        const recordCountPasien = await DataPasien.count();

        const id_registrasi_pasien = `PS-${randomNumPasien}-${recordCountPasien + 1}`;

        // const pasien = await DataPasien.create(req.body);
        const pasien = await DataPasien.create({id_registrasi_pasien, foto_ktp: ktp_filename, ...req.body});

        // Create a new DataBpjs record only if pasien_bpjs is 'Ya'

        if (req.body.pasien_jkn === 'Ya') {
            await DataJkn.create({
                id_registrasi_pasien,
                nomer_kartu: req.body.nomer_kartu,
                faskes_tingkat: req.body.faskes_tingkat,
                foto_kartu_jkn: jkn_filename
            });
        }
        // Count the number of records in the NomerAntrian table within the same day, with the provided id_dokter and with status_antrian as 'terdaftar'
        const antrianRecords = await NomerAntrian.findAll({
            where: {
                id_dokter: req.session.id_dokter,
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

        // Generate a random 4-digit number
        const randomNum = Math.floor(1000 + Math.random() * 9000);

        // Construct the id_antrian string
        let id_antrian = '';
        console.log(req.session.id_dokter)
        // Construct the id_antrian string
        if (req.session.id_dokter === 'PDU-8473-1') {
            id_antrian = `DU-${randomNum}-${recordCount + 1}`;
        } else if (req.session.id_dokter === 'PDG-3523-1') {
            id_antrian = `DG-${randomNum}-${recordCount + 1}`;
        }

        // Construct the nomer_antrian
        const nomer_antrian = recordCount + 1;

        // Create a new NomerAntrian record
        const antrian = await NomerAntrian.create({
            id_antrian,
            id_dokter: req.session.id_dokter,
            nomer_antrian,
            status_antrian: 'terdaftar',
            id_registrasi_pasien: pasien.id_registrasi_pasien
        });
        req.session.id_dokter = ''
        res.send({pasien, nomer_antrian});
    } catch (e) {
        console.log(req.session.id_dokter)
        console.error(e)
        res.status(500).send('Error! ' + e);
    }
});

//edit data pasien
router.get('/admin/list_data_pasien/edit_jkn/:id_registrasi_pasien', async (req, res) => {
    try {
        const pasien = await DataPasien.findOne({
            where: {
                id_registrasi_pasien: req.params.id_registrasi_pasien
            }
        });

        let jkn = await DataJkn.findOne({
            where: {
                id_registrasi_pasien: req.params.id_registrasi_pasien
            }
        });
        if (!jkn) {
            jkn = undefined
        }
        let notformatted = pasien.tanggal_lahir;
        let tglLahirFormat = dayjs(notformatted).format('YYYY-MM-DD');

        res.render('pendaftaranPasienLuring/editJknPasien', {
            pasien,
            jkn,
            tglLahirFormat,
        })
        // res.send({pasien, jkn});
    } catch (e) {
        res.status(500).send('Error! ' + e);
    }
});
router.patch('/admin/list_data_pasien/edit_jkn/:id_registrasi_pasien', ktpjknUpload.single('foto_jkn'), async (req, res) => {
    try {
        let pasien = await DataPasien.findOne({
            where: {
                id_registrasi_pasien: req.params.id_registrasi_pasien
            }
        });

        const jkn = await DataJkn.findOne({where: {nomer_kartu: req.body.nomer_kartu}})
        if (jkn) {
            return res.status(409).send('Nomor kartu JKN sudah terdaftar');
        }
        
        let new_jkn = await DataJkn.create({
            id_registrasi_pasien: req.params.id_registrasi_pasien,
            nomer_kartu: req.body.nomer_kartu,
            faskes_tingkat: req.body.faskes_tingkat,
            foto_kartu_jkn: req.file.filename
        })
        pasien.pasien_jkn = 'Ya';
        await pasien.save()
        res.send(new_jkn);
    } catch (e) {
        res.status(500).send('Error! ' + e);
    }
});

module.exports = router