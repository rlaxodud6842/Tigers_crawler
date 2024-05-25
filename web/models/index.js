const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mydatabase', 'myuser', 'mypassword', {
  host: 'localhost',
  dialect: 'mysql'
});

const User = require('./user')(sequelize);

sequelize.sync({ alter: true }).then(() => {
  console.log('Database & tables created!');
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});

module.exports = {
  sequelize,
  User
};

