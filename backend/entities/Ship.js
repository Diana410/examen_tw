import db from '../dbConfig.js';
import Sequelize from 'sequelize';

const Ship = db.define("Ship", {
    ShipId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    ShipNume: {
        type: Sequelize.STRING,
        validate: {
            len: {
                args: [3, 100],
                msg: "Numele barcii trebuie sa aiba intre 3 si 100 caractere!"
            }
        },
        allowNull: false
    },
    ShipDisplacement: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

export default Ship;