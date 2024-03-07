// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class NomerAntrian extends Model {
//     static associate(models) {
//       // define association here
//     }
//   }
//   NomerAntrian.init({
//     id_antrian: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       primaryKey: true
//     },
//     id_registrasi_pasien: DataTypes.STRING,
//     id_dokter: DataTypes.STRING,
//     nomer_antrian: DataTypes.INTEGER,
//     status_antrian: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'NomerAntrian',
//     tableName: 'nomer_antrian'
//   });
//   return NomerAntrian;
// };

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NomerAntrian extends Model {
    static associate(models) {
      this.belongsTo(models.DataPasien, { foreignKey: 'id_registrasi_pasien', as: 'dataPasien' });
      this.belongsTo(models.ProfilDokter, { foreignKey: 'id_dokter', as: 'profilDokter' });
    }
  }
  NomerAntrian.init({
    id_antrian: {
      type: DataTypes.STRING,
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
    id_dokter: {
      type: DataTypes.STRING,
      references: {
        model: 'profil_dokter', // name of Target model
        key: 'id_dokter', // key in Target model that we're referencing
      },
    },
    nomer_antrian: DataTypes.INTEGER,
    status_antrian: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'NomerAntrian',
    tableName: 'nomer_antrian'
  });
  return NomerAntrian;
};