'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProfilDokter extends Model {
    static associate(models) {
      // define association here
      this.hasMany(models.NomerAntrian, { foreignKey: 'id_dokter', as: 'nomerAntrian' });
      this.hasMany(models.RekamMedis, { foreignKey: 'id_dokter', as: 'profilDokter' });
    }
  }
  ProfilDokter.init({
    id_dokter: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    nama_dokter: DataTypes.STRING,
    jenis_dokter: DataTypes.STRING,
    status_dokter: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ProfilDokter',
    tableName: 'profil_dokter'
  });
  return ProfilDokter;
};