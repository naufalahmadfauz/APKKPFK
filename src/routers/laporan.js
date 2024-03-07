const express = require('express')
const router = new express.Router()
const {Op} = require("sequelize");

const {pengadaanObat,detailPengadaanObat, NomerAntrian, DataPasien, DataJkn, RekamMedis, StokObat, Terapi} = require("../../models");
const dayjs = require("dayjs");


//halaman antrian pasien
router.get('/pemilik/laporan', async (req, res) => {
    try {
        // Send the fetched record as a response
        res.send('halaman pemilik');
    } catch (e) {
        res.status(500).send('Error! ' + e);
    }

});
router.get('/pemilik/laporan/:tahun/:bulan', async (req, res) => {
    try {
        const month = parseInt(req.params.bulan);
        const year = parseInt(req.params.tahun);
        let startDate = new Date(year, month, 1);
        let endDate = new Date(year, month + 1, 0);

        const totalPasienJkn = await RekamMedis.count({
            include: [{
                model: DataPasien,
                as: 'dataPasien',
                where: {pasien_jkn: 'Ya'}
            }],
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate]
                }
            }
        });

// Fetch totalPasienUmum
        const totalPasienUmum = await RekamMedis.count({
            include: [{
                model: DataPasien,
                as: 'dataPasien',
                where: {pasien_jkn: 'Tidak'}
            }],
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate]
                }
            }
        });

        const rekamMedisDokterUmum = await RekamMedis.findAll({
            where: {
                id_dokter: 'PDU-8473-1',
                createdAt: {[Op.between]: [startDate, endDate]}
            }
        });
        const rekamMedisDokterGigi = await RekamMedis.findAll({
            where: {
                id_dokter: 'PDG-3523-1',
                createdAt: {[Op.between]: [startDate, endDate]}
            }
        });

        let keuntunganDokterUmum = 0;
        rekamMedisDokterUmum.forEach(rekamMedis => {
            if (rekamMedis.hasil_lab !== '-') keuntunganDokterUmum += 20000;
            if (rekamMedis.pasien_jkn !== 'Ya') keuntunganDokterUmum += 30000;
        });

        let keuntunganDokterGigi = 0;
        rekamMedisDokterGigi.forEach(rekamMedis => {
            if (rekamMedis.hasil_lab !== '-') keuntunganDokterGigi += 20000;
            if (rekamMedis.pasien_jkn !== 'Ya') keuntunganDokterGigi += 40000;
        });

        const terapiRecords = await Terapi.findAll({
            where: {createdAt: {[Op.between]: [startDate, endDate]}},
            include: [{
                model: StokObat,
                as: 'stokObat'
            }]
        });

        let keuntunganObatUmum = 0;
        let keuntunganObatJkn = 0;

        terapiRecords.forEach(record => {
            const {total} = record;
            const {harga_satuan, tipe_obat} = record.stokObat;

            if (tipe_obat === 'Umum') {
                keuntunganObatUmum += total * harga_satuan;
            } else if (tipe_obat === 'JKN') {
                keuntunganObatJkn += total * harga_satuan;
            }
        });
        res.send({
            totalPasienJkn,
            totalPasienUmum,
            keuntunganDokterUmum,
            keuntunganDokterGigi,
            keuntunganObatUmum,
            keuntunganObatJkn
        });
    } catch (e) {
        res.status(500).send('Error! ' + e);
    }
});
module.exports = router