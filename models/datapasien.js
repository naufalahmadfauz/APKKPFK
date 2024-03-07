'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class DataPasien extends Model {
        static associate(models) {
            // define association here
            this.hasOne(models.DataJkn, {foreignKey: 'id_registrasi_pasien', as: 'dataJkn'});
            this.hasMany(models.NomerAntrian, {foreignKey: 'id_registrasi_pasien', as: 'nomerAntrian'});
            this.hasMany(models.RekamMedis, {foreignKey: 'id_registrasi_pasien', as: 'rekamMedis'});
            this.hasMany(models.RekamMedisAwal, {foreignKey: 'id_registrasi_pasien', as: 'rekamMedisAwal'});
            this.hasMany(models.Pembayaran, {foreignKey: 'id_registrasi_pasien', as: 'pembayaran'});
        }
    }

    DataPasien.init({
        id_registrasi_pasien: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        nik: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        nama_lengkap: DataTypes.STRING,
        alamat: DataTypes.STRING,
        jenis_kelamin: DataTypes.STRING,
        tanggal_lahir: {
            type: DataTypes.DATE,
            allowNull: false
        },
        pasien_jkn: DataTypes.STRING,
        jenis_pasien: DataTypes.STRING,

        foto_ktp: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'DataPasien',
        tableName: 'data_pasien'
    });
    return DataPasien;
};