const { get } = require('lodash');
const CardRepository = require('../repositories/card');

const joinBanks = (cards) => {
  const promises = cards.map(async (card) => {
    const bank = await card.getBank();
    const cardInfo = card.get({ plain: true });

    return {
      ...cardInfo,
      bank,
      group: {
        id: '1',
        name: 'Family',
      },
    };
  });

  return Promise.all(promises);
};

const groupByBanks = (cards) => cards.reduce((grouped, card) => {
  const bankId = get(card, 'bankId');
  const bank = get(card, 'bank');

  if (!grouped[bankId]) {
    return {
      ...grouped,
      [bankId]: {
        bank,
        cards: [card],
      },
    };
  }

  grouped[bankId].cards.push(card);
  return grouped;
}, {});

const BanksController = {
  getAll: async (ctx) => {
    const { groupIds } = ctx.request.query;

    const groupCards = await CardRepository.findAll({
      groupId: groupIds.split(','),
    });

    const withBanks = await joinBanks(groupCards);

    const groupedByBanks = groupByBanks(withBanks);
    return ctx.send(200, Object.values(groupedByBanks));
  },
  getCards: (ctx) => ctx.send(200, 'getCards'),
  delete: async (ctx) => {
    const { id } = ctx.params;

    try {
      const cards = await CardRepository.findAll({ bankId: id });
      const promises = cards.map((bankCard) => CardRepository.delete(bankCard.id));
      const deleteResult = await Promise.all(promises);

      const isDeleted = deleteResult.every(Boolean);

      return (isDeleted)
        ? ctx.send(200, { success: true })
        : ctx.send(500, { success: false, error: `Unable to delete bank with id: ${id}` });
    } catch (error) {
      return ctx.send(500, { error: error.message });
    }
  },
};

module.exports = BanksController;
