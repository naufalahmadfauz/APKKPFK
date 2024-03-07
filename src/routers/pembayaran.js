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

const {
    dataObat,
    Pembayaran,
    Sequelize,
    Terapi,
    RekamMedis,
    RekamMedisAwal,
    sequelize,
    DataPasien,
    StokObat
} = require('../../models')

//List pembayaran semua
router.get('/admin/list_pembayaran', async (req, res) => {
    try {
        const sortField = req.query.sort || 'createdAt';
        const sortOrder = req.query.order || 'DESC';
        const searchQuery = req.query.search || '';
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        let whereClause = {};
        
        if (searchQuery) {
        whereClause[Op.or] = [
            { '$rekamMedis.dataPasien.nama_lengkap$': { [Op.iLike]: '%' + searchQuery + '%' } },
        ];
    }
        const pembayaranRecords = await Pembayaran.findAll({
            where: whereClause,
            include: [{
                model: RekamMedis,
                as: 'rekamMedis',
                include: [{
                    model: DataPasien,
                    as: 'dataPasien',
                    attributes: ['nik','nama_lengkap','pasien_jkn']
                }]
            }],
            order: [[sortField, sortOrder]],
            limit,
            offset
        });
        res.send(pembayaranRecords);
    } catch (error) {
        res.status(500).send({error: 'An error occurred while processing your request.'});
    }
});

//List daftar pasien yang belum melakukan pembayaran
router.get('/admin/pembayaran', async (req, res) => {
    try {
        const startOfDay = dayjs().startOf('day').toDate();
        const endOfDay = dayjs().endOf('day').toDate();
        const sortField = req.query.sort || 'createdAt';
        const sortOrder = req.query.order || 'DESC';
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const prevOffset = offset - limit < 0 ? 0 : offset - limit;
        const nextOffset = offset + limit;
        const rekamMedisRecords = await RekamMedis.findAll({
            where: {
                createdAt: {
                    [Op.between]: [startOfDay, endOfDay]
                }
            },
            include: [{
                model: DataPasien,
                as: 'dataPasien',
            }],
            order: [[sortField, sortOrder]],
            limit,
            offset
        });
        
        res.render('pembayaran/listYangBelumBayar', {
            rekamMedisRecords,
            prevOffset,
            nextOffset,
            limit,
        });
        // res.send(rekamMedisRecords);
    } catch (error) {
        res.status(500).send({error: 'An error occurred while processing your request.'});
    }
});
//Halaman pembayaran,ini bakal nampilin total biaya yang harus dibayar
router.get('/admin/pembayaran/:id_rekam_medis', async (req, res) => {
    try {
        const idRekamMedis = req.params.id_rekam_medis;
        const rekamMedis = await RekamMedis.findOne({where: {id_rekam_medis: idRekamMedis}});
        const dataPasien = await DataPasien.findOne({where: {id_registrasi_pasien: rekamMedis.id_registrasi_pasien}});

        let biayaPengobatan = rekamMedis.id_dokter === 'PDU-8473-1' ? 30000 : 40000;
        let totalJkn = dataPasien.pasien_jkn === 'Ya' ? biayaPengobatan : 0;
        if (dataPasien.pasien_jkn === 'Ya') {
            biayaPengobatan = 0;
        }
        const biayaLab = rekamMedis.hasil_lab !== '-' ? 20000 : 0;
        const terapiRecords = await Terapi.findAll({where: {id_rekam_medis: idRekamMedis}});
        let totalYangHarusDibayar = biayaPengobatan + biayaLab;
        let totalYangHarusDitagih = biayaPengobatan + biayaLab;
        const terapiDetails = await Promise.all(terapiRecords.map(async (terapi) => {
            const stokObat = await StokObat.findOne({
                where: {id_stok_obat: terapi.id_stok_obat},
                include: [{
                    model: dataObat,
                    as: 'dataObat',
                }]
            });
            if (stokObat!== null) {
                const totalBiayaObat = stokObat.tipe_obat !== 'JKN' ? terapi.total * stokObat.harga_satuan : 0;

                totalYangHarusDibayar += terapi.total * stokObat.harga_satuan;
                totalYangHarusDitagih += totalBiayaObat;
                if (stokObat.tipe_obat === 'JKN') {
                    totalJkn += terapi.total * stokObat.harga_satuan;
                }
                return {
                    nama_obat: stokObat.dataObat.nama_obat,
                    satuan: stokObat.satuan,
                    total: terapi.total,
                    totalBiayaObat
                };
            }else{
                return {
                    nama_obat: '[Obat Diluar Klinik] '+ terapi.terapi_luar,
                    satuan: terapi.satuan_luar,
                    total: terapi.total,
                    totalBiayaObat: 0
                };
            }
            
        }));
        
        console.log(terapiDetails)

        res.render('pembayaran/detailPembayaran',{
            biayaPengobatan,
            biayaLab,
            terapi: terapiDetails,
            totalYangHarusDibayar,
            totalYangHarusDitagih,
            totalJkn,
            idRekamMedis
        });
        // res.send({
        //     biayaPengobatan,
        //     biayaLab,
        //     terapi: terapiDetails,
        //     totalYangHarusDibayar,
        //     totalYangHarusDitagih,
        //     totalJkn
        // });
    } catch (error) {
        res.status(500).send({error: 'An error occurred while processing your request.'});
    }
});
router.post('/admin/pembayaran/', async (req, res) => {
    try {
        const idRekamMedis = req.body.idRekamMedis
        const rekamMedis = await RekamMedis.findOne({where: {id_rekam_medis: idRekamMedis}});
        
        
        if (!rekamMedis) {
            return res.status(404).send({error: 'Rekam Medis not found'});
        }

        const idRegistrasiPasien = rekamMedis.id_registrasi_pasien;

        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const pembayaranCount = await Pembayaran.count();
        const idPembayaran = `PB-${randomNum}-${pembayaranCount + 1}`;

        const pembayaran = await Pembayaran.create({
            id_pembayaran: idPembayaran,
            id_rekam_medis: idRekamMedis,
            id_registrasi_pasien: idRegistrasiPasien,
            total_pembayaran: req.body.total_pembayaran,
            total_pembayaran_jkn: req.body.total_pembayaran_jkn,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        res.send(pembayaran);
    } catch (e) {
        res.status(500).send('Error! ' + e);
    }
});

module.exports = router