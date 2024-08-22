const sequelize = require("../database/database");
const Sequelize = require('sequelize')


const Messages= sequelize.define('Messages',{
    title:{
        type:Sequelize.STRING
    },
    author:{
        type:Sequelize.STRING
    },
    description:{
        type:Sequelize.STRING
    },
    image:{
        type:Sequelize.STRING
    }
})


module.exports = Messages