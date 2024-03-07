'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RekamMedis extends Model {
    static associate(models) {
      // One-to-many relationship with DataPasien
      this.belongsTo(models.DataPasien, { foreignKey: 'id_registrasi_pasien', as: 'dataPasien' });
      this.hasMany(models.Terapi, { foreignKey: 'id_rekam_medis', as: 'terapi' });


      // One-to-one relationship with RekamMedisAwal
      this.belongsTo(models.RekamMedisAwal, { foreignKey: 'id_rekam_medis_awal', as: 'rekamMedisAwal' });
      this.belongsTo(models.ProfilDokter, { foreignKey: 'id_dokter', as: 'profilDokter' });
      this.hasOne(models.Pembayaran, { foreignKey: 'id_rekam_medis', as: 'pembayaran' });
    }
  }
  RekamMedis.init({
    id_rekam_medis: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    id_registrasi_pasien: {
      type: DataTypes.STRING,
      references: {
        model: 'data_pasien',
        key: 'id_registrasi_pasien'
      }
    },
    id_rekam_medis_awal: {
      type: DataTypes.STRING,
      references: {
        model: 'rekam_medis_awal',
        key: 'id_rekam_medis_awal'
      }
    },
    id_dokter: {
      type: DataTypes.STRING,
      references: {
        model: 'profil_dokter',
        key: 'id_dokter'
      }
    },
    hasil_lab: DataTypes.STRING,
    gejala: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'RekamMedis',
    tableName: 'rekam_medis',
  });
  return RekamMedis;
};