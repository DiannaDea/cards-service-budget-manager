const { get } = require('lodash');
const CardRepository = require('../repositories/card');

const joinBanks = (cards) => {
  const promises = cards.map(async (card) => {
    const bank = await card.getBank();
    const cardInfo = card.get({ plain: true });

    return {
      ...cardInfo,
      bank,
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
  delete: (ctx) => ctx.send(200, 'delete'),
};

module.exports = BanksController;
