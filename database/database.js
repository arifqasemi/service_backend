const { Sequelize } = require("sequelize");

const sequelize = new Sequelize('node_database','root','',{
    dialect:'mysql',
    host:'localhost'

})


module.exports = sequelize