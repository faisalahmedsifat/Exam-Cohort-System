// @ts-nocheck
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Mcqanswer extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.hasOne(models.Answer, {
                foreignKey: { name: 'mcqanswerID', allowNull: true }
            });
        }
    }
    Mcqanswer.init({
        mcqOp1Selected: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        mcqOp2Selected: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        mcqOp3Selected: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        mcqOp4Selected: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Mcqanswer',
        tableName: 'mcq_answers'
    });
    return Mcqanswer;
};
