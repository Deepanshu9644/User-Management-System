const { Sequelize } = require('sequelize');

const {
  DB_URI,
  PGHOST,
  PGPORT,
  PGDATABASE,
  PGUSER,
  PGPASSWORD,
  DB_LOGGING
} = process.env;

const logging = String(DB_LOGGING).toLowerCase() === 'true' ? console.log : false;

let sequelize;

if (DB_URI) {
  sequelize = new Sequelize(DB_URI, {
    dialect: 'postgres',
    logging,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 }
  });
} else {
  sequelize = new Sequelize(PGDATABASE, PGUSER, PGPASSWORD, {
    host: PGHOST,
    port: Number(PGPORT || 5432),
    dialect: 'postgres',
    logging,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 }
  });
}

module.exports = sequelize;
