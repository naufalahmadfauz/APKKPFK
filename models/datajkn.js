'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DataJkn extends Model {
    static associate(models) {
      this.belongsTo(models.DataPasien, { foreignKey: 'id_registrasi_pasien', as: 'dataPasien' });
    }
  }
  DataJkn.init({
    nomer_kartu: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    id_registrasi_pasien: {
      type: DataTypes.STRING,
      references: {
        model: 'data_pasien', // name of Target model
        key: 'id_registrasi_pasien', // key in Target model that we're referencing
      },
    },
    faskes_tingkat: DataTypes.STRING,
    foto_kartu_jkn: DataTypes.STRING,
  }, {
    sequelize,
    tableName: 'data_jkn',
    modelName: 'DataJkn',
  });
  return DataJkn;
};