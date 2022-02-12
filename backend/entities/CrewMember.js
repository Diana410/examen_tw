import db from '../dbConfig.js';
import Sequelize from 'sequelize';

const CrewMember = db.define("CrewMember", {
    CrewMemberId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    CrewMemberNume: {
        type: Sequelize.STRING,
        validate: {
            len: {
                args: [5, 100],
                msg: "Numele membrului trebuie sa aiba intre 5 si 100 caractere!"
            }
        },
        allowNull: false
    },
    CrewMemberRol: {
        type: Sequelize.STRING,
        allowNull: false
    },
    ShipId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

export default CrewMember;