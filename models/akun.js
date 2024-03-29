'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Akun extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }

    Akun.init({
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        password: DataTypes.STRING,
        jabatan: DataTypes.STRING
    }, {
        sequelize,
        tableName: 'akun',
        modelName: 'Akun',
    });
    return Akun;
};