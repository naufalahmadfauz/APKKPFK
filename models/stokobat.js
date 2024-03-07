'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class stokObat extends Model {
    static associate(models) {
  this.belongsTo(models.dataObat, {foreignKey: 'id_obat', as: 'dataObat'});
      this.hasMany(models.detailpenguranganobat, { foreignKey: 'id_stok_obat', as: 'detailPenguranganObat' });
    }
  };
  stokObat.init({
    id_stok_obat: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    id_obat: {
  type: DataTypes.STRING,
  references: {
    model: 'data_obat', // name of Target model
    key: 'id_obat', // key in Target model that we're referencing
  },
},
    nomer_batch:{
      type: DataTypes.STRING,
    }, 
    expire: DataTypes.DATE,
    jumlah: DataTypes.INTEGER,
    satuan: DataTypes.STRING,
    harga_satuan: DataTypes.INTEGER,
    tipe_obat: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'StokObat',
    tableName: 'stok_obat',
  });
  return stokObat;
};