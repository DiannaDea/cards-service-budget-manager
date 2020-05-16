const { v4: uuidv4 } = require('uuid');

const bankNames = ['Monobank', 'PrivatBank', 'Custom'];

module.exports = {
  up: async (queryInterface) => {
    const banks = await Promise.all(bankNames.map((bank) => ({
      id: uuidv4(),
      name: bank,
      internalName: bank.toLocaleLowerCase(),
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
