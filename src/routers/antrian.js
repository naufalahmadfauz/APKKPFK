const express = require('express')
const router = new express.Router()
const {Op, Sequelize} = require("sequelize");
const {pictureUpload} = require('../functions/multerConfiguration')
const {ProfilDokter, NomerAntrian, DataPasien, DataJkn} = require("../../models");
const dayjs = require("dayjs");


//halaman antrian pasien
router.get('/antrian/saya', async (req, res) => {
    try {
        // Get the start and end of the current day
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // Fetch the NomerAntrian record for the current user within the same day
        const antrian = await NomerAntrian.findOne({
            where: {
                id_registrasi_pasien: req.session.id_registrasi_pasien,
                createdAt: {
                    [Op.gte]: startOfDay,
                    [Op.lte]: endOfDay
                }
            },
            include: {
                model: ProfilDokter,
                as:'profilDokter',
                attributes: ['jenis_dokter','nama_dokter']
            }
        });

        //sementara pakai id pasien dulu
        // const antrian = await NomerAntrian.findOne({
        //     where: {
        //         id_registrasi_pasien: 'PS-3932-1',
        //         createdAt: {
        //             [Op.gte]: startOfDay,
        //             [Op.lte]: endOfDay
        //         }
        //     },
        //     include: {
        //         model: ProfilDokter,
        //         as: 'profilDokter',
        //         attributes: ['jenis_dokter', 'nama_dokter']
        //     }
        // });
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

        const biggestNomerAntrianTerdaftarDokterUmum = await NomerAntrian.findOne({
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

        const biggestNomerAntrianTerdaftarDokterGigi = await NomerAntrian.findOne({
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

        const antrianRecordsDokterUmum = await NomerAntrian.findAll({
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
            ],
            include: {
                model: DataPasien,
                as: 'dataPasien',
                attributes: ['nama_lengkap']
            }
        });

        const antrianRecordsDokterGigi = await NomerAntrian.findAll({
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
            ],
            include: {
                model: DataPasien,
                as: 'dataPasien',

                attributes: ['nama_lengkap']
            }
        });


        // Check if the NomerAntrian record exists
        if (!antrian) {
            return res.status(404).send('Belum mendapatkan nomer antrian');
        }
        
        // Send the fetched record as a response
        res.render('antrian/antrianSaya', {
            smallestNomerAntrianTerdaftarDokterUmum,
            biggestNomerAntrianTerdaftarDokterUmum,
            biggestNomerAntrianTerpanggilDokterUmum,
            smallestNomerAntrianTerdaftarDokterGigi,
            biggestNomerAntrianTerdaftarDokterGigi,
            biggestNomerAntrianTerpanggilDokterGigi,
            antrianRecordsDokterUmum,
            antrianRecordsDokterGigi,
            antrian
        });
    } catch (e) {
        res.status(500).send('Error! ' + e);
    }
});

//halaman antrian pasien lama
router.get('/admin/antrian', async (req, res) => {
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

        const biggestNomerAntrianTerdaftarDokterUmum = await NomerAntrian.findOne({
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
        const biggestNomerAntrianTerdaftarDokterGigi = await NomerAntrian.findOne({
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

        const limitDokterUmum = parseInt(req.query.limitDokterUmum) || 15;
        const offsetDokterUmum = parseInt(req.query.offsetDokterUmum) || 0;
        const prevOffsetDokterUmum = offsetDokterUmum - limitDokterUmum < 0 ? 0 : offsetDokterUmum - limitDokterUmum;
        const nextOffsetDokterUmum = offsetDokterUmum + limitDokterUmum;
        
        const antrianRecordsDokterUmum = await NomerAntrian.findAll({
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
            ],
            include: {
                model: DataPasien,
                as: 'dataPasien',
                attributes: ['nama_lengkap', 'nik']
            },
            limit: limitDokterUmum,
            offset: offsetDokterUmum
        });



        const limitDokterGigi = parseInt(req.query.limitDokterGigi) || 15;
        const offsetDokterGigi = parseInt(req.query.offsetDokterGigi) || 0;
        const prevOffsetDokterGigi = offsetDokterGigi - limitDokterGigi < 0 ? 0 : offsetDokterGigi - limitDokterGigi;
        const nextOffsetDokterGigi = offsetDokterGigi + limitDokterGigi;
        
        
        const antrianRecordsDokterGigi = await NomerAntrian.findAll({
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
            ],
            include: {
                model: DataPasien,
                as: 'dataPasien',
                attributes: ['nama_lengkap', 'nik']
            },
            limit: limitDokterGigi,
            offset: offsetDokterGigi
        });

        const statusDokterUmum = await ProfilDokter.findOne({where: {id_dokter: 'PDU-8473-1'}, attributes: ['status_dokter']});
        const statusDokterGigi = await ProfilDokter.findOne({where: {id_dokter: 'PDG-3523-1'}, attributes: ['status_dokter']});
        
        res.render('antrian/adminAntrian', {
            smallestNomerAntrianTerdaftarDokterUmum,
            biggestNomerAntrianTerpanggilDokterUmum,
            biggestNomerAntrianTerdaftarDokterUmum,
            smallestNomerAntrianTerdaftarDokterGigi,
            biggestNomerAntrianTerdaftarDokterGigi,
            biggestNomerAntrianTerpanggilDokterGigi,
            antrianRecordsDokterUmum,
            antrianRecordsDokterGigi,
            prevOffsetDokterUmum,
            nextOffsetDokterUmum,
            limitDokterUmum,
            offsetDokterUmum,
            prevOffsetDokterGigi,
            nextOffsetDokterGigi,
            limitDokterGigi,
            offsetDokterGigi,
            statusDokterUmum,
            statusDokterGigi
        });
        // res.send( {
        //     smallestNomerAntrianTerdaftarDokterUmum,
        //     biggestNomerAntrianTerpanggilDokterUmum,
        //     smallestNomerAntrianTerdaftarDokterGigi,
        //     biggestNomerAntrianTerpanggilDokterGigi,
        //     antrianRecordsDokterUmum,
        //     antrianRecordsDokterGigi
        // });
    } catch (e) {
        res.status(500).send('Error! ' + e)
    }
});
//ini bakal ada button
router.patch('/admin/tutup_antrian/dokter_umum', async (req, res) => {
    try {
        // Update the status_dokter of the selected id_dokter to 'Nonaktif'
        const dokter = await ProfilDokter.update({status_dokter: 'Nonaktif'}, {
            where: {
                id_dokter: 'PDU-8473-1'
            }
        });

        // Check if the dokter record was updated
        if (dokter[0] === 0) {
            return res.status(404).send('Dokter not found');
        }

        // Get the start and end of the current day
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 58, 59, 999);

        // Update the status_antrian to 'ditolak' for all NomerAntrian records with the same id_dokter and where status_antrian is not 'terpanggil' and createdAt is within the current day
        const antrian = await NomerAntrian.update({status_antrian: 'ditolak'}, {
            where: {
                id_dokter: 'PDU-8473-1',
                status_antrian: {
                    [Op.ne]: 'terpanggil'
                },
                createdAt: {
                    [Op.gte]: dayjs().startOf('day').toDate(),
                    [Op.lte]: dayjs().endOf('day').toDate()
                }
            }
        });
        await DataPasien.destroy({
            where: {
                jenis_pasien: 'Baru',
                createdAt: {
                    [Op.gte]: dayjs().startOf('day').toDate(),
                    [Op.lte]: dayjs().endOf('day').toDate()
                }
            }
        });
        const pasienBaru = await DataPasien.findAll({
            where: {
                jenis_pasien: 'Baru',
                createdAt: {
                    [Op.between]: [startOfDay, endOfDay]
                }
            },
            attributes: ['id_registrasi_pasien']
        });
        const idRegistrasiPasienBaru = pasienBaru.map(pasien => pasien.id_registrasi_pasien);
        await DataJkn.destroy({
            where: {
                id_registrasi_pasien: {
                    [Op.in]: idRegistrasiPasienBaru
                }
            }
        });

        res.send({message: 'Antrian berhasil ditutup'});
    } catch (e) {
        console.error(e)
        res.status(500).send('Error! ' + e);
    }
});
router.patch('/admin/tutup_antrian/dokter_gigi', async (req, res) => {
    try {
        // Update the status_dokter of the selected id_dokter to 'Nonaktif'
        const dokter = await ProfilDokter.update({status_dokter: 'Nonaktif'}, {
            where: {
                id_dokter: 'PDG-3523-1'
            }
        });

        // Check if the dokter record was updated
        if (dokter[0] === 0) {
            return res.status(404).send('Dokter not found');
        }

        // Get the start and end of the current day
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 58, 59, 999);

        // Update the status_antrian to 'ditolak' for all NomerAntrian records with the same id_dokter and where status_antrian is not 'terpanggil' and createdAt is within the current day
        const antrian = await NomerAntrian.update({status_antrian: 'ditolak'}, {
            where: {
                id_dokter: 'PDG-3523-1',
                status_antrian: {
                    [Op.ne]: 'terpanggil'
                },
                createdAt: {
                    [Op.gte]: dayjs().startOf('day').toDate(),
                    [Op.lte]: dayjs().endOf('day').toDate()
                }
            }
        });
        await DataPasien.destroy({
            where: {
                jenis_pasien: 'Baru',
                createdAt: {
                    [Op.gte]: dayjs().startOf('day').toDate(),
                    [Op.lte]: dayjs().endOf('day').toDate()
                }
            }
        });
        const pasienBaru = await DataPasien.findAll({
            where: {
                jenis_pasien: 'Baru',
                createdAt: {
                    [Op.between]: [startOfDay, endOfDay]
                }
            },
            attributes: ['id_registrasi_pasien']
        });
        const idRegistrasiPasienBaru = pasienBaru.map(pasien => pasien.id_registrasi_pasien);
        await DataJkn.destroy({
            where: {
                id_registrasi_pasien: {
                    [Op.in]: idRegistrasiPasienBaru
                }
            }
        });

        res.send({message: 'Antrian berhasil ditutup'});
    } catch (e) {
        console.error(e)
        res.status(500).send('Error! ' + e);
    }
});


router.patch('/admin/buka_antrian/dokter_gigi', async (req, res) => {
    try {
        const dokter = await ProfilDokter.update({status_dokter: 'Aktif'}, {
            where: {
                id_dokter: 'PDG-3523-1'
            }
        });
        // Check if the dokter record was updated
        if (dokter[0] === 0) {
            return res.status(404).send('Dokter not found');
        }
        res.send({message: 'Antrian berhasil dibuka'});
    } catch (e) {
        res.status(500).send('Error! ' + e);
    }
});
router.patch('/admin/buka_antrian/dokter_umum', async (req, res) => {
    try {
        // Update the status_dokter of the selected id_dokter to 'Nonaktif'
        const dokter = await ProfilDokter.update({status_dokter: 'Aktif'}, {
            where: {
                id_dokter: 'PDU-8473-1'
            }
        });
        // Check if the dokter record was updated
        if (dokter[0] === 0) {
            return res.status(404).send('Dokter not found');
        }
        res.send({message: 'Antrian berhasil dibuka'});
    } catch (e) {
        res.status(500).send('Error! ' + e);
    }
});


router.patch('/aturantrian/dokter_umum', async (req, res) => {
    try {
        // Fetch all the NomerAntrian records within the same day, with id_dokter as "PDU-8473-1" and status_antrian as "terdaftar"
        const antrianRecords = await NomerAntrian.findAll({
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
        console.log(antrianRecords)
        // Check if there are any records
        if (antrianRecords.length > 0) {
            // Take the first record (which has the smallest nomer_antrian attribute) and set its status_antrian to "terpanggil"
            antrianRecords[0].status_antrian = 'terpanggil';

            // Save the changes
            await antrianRecords[0].save();

            // Send a response back to the client with the updated record
            res.send(antrianRecords[0]);
        } else {
            res.status(404).send({message: 'No records found'});
        }
    } catch (e) {
        res.status(500).send({error: 'An error occurred while trying to update the record'});
    }
});
router.patch('/aturantrian/dokter_gigi', async (req, res) => {
    try {
        // Fetch all the NomerAntrian records within the same day, with id_dokter as "PDU-8473-1" and status_antrian as "terdaftar"
        const antrianRecords = await NomerAntrian.findAll({
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

        // Check if there are any records
        if (antrianRecords.length > 0) {
            // Take the first record (which has the smallest nomer_antrian attribute) and set its status_antrian to "terpanggil"
            antrianRecords[0].status_antrian = 'terpanggil';

            // Save the changes
            await antrianRecords[0].save();

            // Send a response back to the client with the updated record
            res.send(antrianRecords[0]);
        } else {
            res.status(404).send({message: 'No records found'});
        }
    } catch (e) {
        res.status(500).send({error: 'An error occurred while trying to update the record'});
    }
});
module.exports = router