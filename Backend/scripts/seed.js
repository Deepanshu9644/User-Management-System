require('dotenv').config();

const sequelize = require('../src/config/db');
const User = require('../src/models/User');

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    await User.destroy({ where: {}, truncate: true, restartIdentity: true });

    const sampleUsers = [
      {
        name: 'Leanne Graham',
        email: 'leanne@example.com',
        phone: '1-770-736-8031',
        company: 'Romaguera-Crona',
        address: {
          street: 'Kulas Light',
          city: 'Gwenborough',
          zipcode: '92998-3874',
          geo: { lat: 37.3159, lng: 81.1496 }
        }
      },
      {
        name: 'Ervin Howell',
        email: 'ervin@example.com',
        phone: '010-692-6593',
        company: 'Deckow-Crist',
        address: {
          street: 'Victor Plains',
          city: 'Wisokyburgh',
          zipcode: '90566-7771',
          geo: { lat: -43.9509, lng: -34.4618 }
        }
      }
    ];

    await User.bulkCreate(sampleUsers);

    console.log('Seed completed.');
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

seed();
