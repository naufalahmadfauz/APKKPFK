'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const dataPasien = ['Naufal', 'Fauzi', 'Rahmat', 'Ujang', 'Euis', 'Abdul','Somad','Rahmat','Usman','Eka Sukerna', 'Cucu','Azkiya','Entar'];
    const alamat = ['Sumedang', 'Bandung', 'Jakarta', 'Cirebon', 'Bogor', 'Tasikmalaya', 'Garut', 'Purwakarta', 'Indramayu', 'Majalengka'];
    const jenisKelamin = ['Laki-laki', 'Perempuan'];
    const pasienJkn = ['Tidak', 'Ya'];
    const jenisPasien = ['Baru', 'Lama'];

    const dataPasienRecords = dataPasien.map((name, index) => {
      const randomId = Math.floor(Math.random() * 10000);
      const idRegistrasiPasien = `PS-${randomId.toString().padStart(4, '0')}-${index + 1}`;
      const nik = 3211181809000000 + index + 1;
      const randomAlamat = alamat[Math.floor(Math.random() * alamat.length)];
      const randomJenisKelamin = jenisKelamin[Math.floor(Math.random() * jenisKelamin.length)];
      const randomYear = Math.floor(Math.random() * (2022 - 1990 + 1)) + 1990;
      const randomMonth = Math.floor(Math.random() * 12) + 1;
      const randomDay = Math.floor(Math.random() * 28) + 1;
      const randomPasienJkn = pasienJkn[Math.floor(Math.random() * pasienJkn.length)];
      
      const randomJenisPasien = jenisPasien[Math.floor(Math.random() * jenisPasien.length)];
      const createdAt = new Date();
      createdAt.setMinutes(createdAt.getMinutes() + index);

      return {
        id_registrasi_pasien: idRegistrasiPasien,
        nik: nik,
        nama_lengkap: name,
        alamat: randomAlamat,
        jenis_kelamin: randomJenisKelamin,
        tanggal_lahir: `${randomYear}-${randomMonth.toString().padStart(2, '0')}-${randomDay.toString().padStart(2, '0')}`,
        pasien_jkn: randomPasienJkn,
        jenis_pasien: randomJenisPasien,
        foto_ktp: 'foto-ktp.jpg',
        createdAt: createdAt,
        updatedAt: new Date()
      };
    });

    return queryInterface.bulkInsert('data_pasien', dataPasienRecords, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('data_pasien', null, {});
  }
};