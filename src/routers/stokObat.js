const express = require('express')
const router = new express.Router()
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
const auth = require('../../middleware/auth')
const Sequelize = require('sequelize');
dayjs.extend(customParseFormat)

const {pengadaanObat, fakturPajak, stokObat,detailPengadaanObat,dataObat,Pembayaran,Terapi,RekamMedis, RekamMedisAwal,sequelize, DataPasien, StokObat} = require('../../models')
const {Op} = require("sequelize");

//list stok obat
router.get('/apoteker/list_stok_obat', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 15;
        const offset = parseInt(req.query.offset) || 0;
        const prevOffset = offset - limit < 0 ? 0 : offset - limit;
        const nextOffset = offset + limit;
        const searchQuery = req.query.search || '';
        let whereClause = {};

        if (searchQuery) {
            whereClause[Op.or] = [
                { nomer_batch: { [Op.iLike]: '%' + searchQuery + '%' } },
                { '$dataObat.nama_obat$': { [Op.iLike]: '%' + searchQuery + '%' } },
                
            ];
        }
        const stokObat = await StokObat.findAll({
            order: [
                ['createdAt', 'DESC']
            ],
            include: [{
                model: dataObat,
                as: 'dataObat',
                attributes: ['nama_obat','id_obat']
            }],
            where: whereClause,
            limit,
            offset
        });
        
        res.render('stokObat/listStokObat', {stokObat,prevOffset,nextOffset,limit});
        // res.send(stokObat);
    } catch (e) {
        res.status(500).send('Error! ' + e);
    }
})

module.exports = router;