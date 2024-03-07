'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('akun', [
      {
        username: 'admin',
        password: 'admin',
        jabatan: 'administrasi',
        createdAt: new Date(),
        updatedAt: new Date()
      },{
        username: 'dokterumum',
        password: 'dokterumum',
        jabatan: 'dokterumum',
        createdAt: new Date(),
        updatedAt: new Date()
      },{
        username: 'doktergigi',
        password: 'doktergigi',
        jabatan: 'doktergigi',
        createdAt: new Date(),
        updatedAt: new Date()
      },{
        username: 'asisten',
        password: 'asisten',
        jabatan: 'asisten',
        createdAt: new Date(),
        updatedAt: new Date()
      },{
        username: 'apoteker',
        password: 'apoteker',
        jabatan: 'apoteker',
        createdAt: new Date(),
        updatedAt: new Date()
      },{
        username: 'pemilik',
        password: 'pemilik',
        jabatan: 'pemilik',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // add more data here
    ], {})
    
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
