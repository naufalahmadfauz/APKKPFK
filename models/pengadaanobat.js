// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class pengadaanObat extends Model {
//     static associate(models) {
//       // define association here
//     }
//   };
//   pengadaanObat.init({
//     id_pengadaan_obat: {
//       type: DataTypes.STRING,
//       primaryKey: true
//     },
//     nomer_seri_faktur_pajak: DataTypes.STRING,
//     status_pengadaan_obat: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'pengadaanObat',
//     tableName: 'pengadaan_obat',
//   });
//   return pengadaanObat;
// };

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pengadaanObat extends Model {
    static associate(models) {
      this.belongsTo(models.fakturPajak, {foreignKey: 'nomer_seri_faktur_pajak',as: 'fakturPajak'});
      this.hasMany(models.detailPengadaanObat, {foreignKey: 'id_pengadaan_obat',as: 'detailPengadaanObat'})
    }
  };
  pengadaanObat.init({
    id_pengadaan_obat: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    nomer_seri_faktur_pajak: {
      type: DataTypes.STRING,
      references: {
        model: 'faktur_pajak', // name of Target model
        key: 'nomer_seri_faktur_pajak', // key in Target model that we're referencing
      },
    },
    status_pengadaan_obat: DataTypes.STRING,
    jenis_pengadaan_obat: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'pengadaanObat',
    tableName: 'pengadaan_obat',
  });
  return pengadaanObat;
};