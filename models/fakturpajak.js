// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class fakturPajak extends Model {
//     static associate(models) {
//       // define association here
//     }
//   };
//   fakturPajak.init({
//     nomer_seri_faktur_pajak: {
//       type: DataTypes.STRING,
//       primaryKey: true
//     },
//     nama_pt_penjual: DataTypes.STRING,
//     alamat_pt_penjual: DataTypes.STRING,
//     npwp_pt_penjual: DataTypes.STRING,
//     ppn: DataTypes.INTEGER,
//     total: DataTypes.INTEGER
//   }, {
//     sequelize,
//     modelName: 'fakturPajak',
//     tableName: 'faktur_pajak',
//   });
//   return fakturPajak;
// };

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class fakturPajak extends Model {
    static associate(models) {
      this.hasOne(models.pengadaanObat, {foreignKey: 'nomer_seri_faktur_pajak',as: 'pengadaanObat'});
    }
  };
  fakturPajak.init({
    nomer_seri_faktur_pajak: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    nama_pt_penjual: DataTypes.STRING,
    alamat_pt_penjual: DataTypes.STRING,
    npwp_pt_penjual: DataTypes.STRING,
    ppn: DataTypes.INTEGER,
    total: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'fakturPajak',
    tableName: 'faktur_pajak',
  });
  return fakturPajak;
};