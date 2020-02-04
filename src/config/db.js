import Sequelize from 'sequelize';

  // in Prod, this is taken from config
export default new Sequelize('xxx', 'yyy', 'zzz', {
  host: 'abcde',
  dialect: 'postgres',
  pool: {
    max: 9,
    min: 0,
    idle: 10000,
  },
});
