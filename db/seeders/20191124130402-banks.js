const bankNames = ['Monobank', 'PrivatBank'];

module.exports = {
  up: async (queryInterface) => {
    const banks = await Promise.all(bankNames.map((bank) => ({
      name: bank,
      createdAt: new Date(),
      updatedAt: new Date(),
    })));

    return queryInterface.bulkInsert('Banks', banks, {});
  },
  down: (queryInterface) => Promise.all(
    bankNames.map((bank) => queryInterface.bulkDelete(
      'Banks',
      { name: bank },
    )),
  ),
};
