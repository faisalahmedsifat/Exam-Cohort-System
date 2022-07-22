// @ts-nocheck
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Mcqquestion extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.hasOne(models.Question, {
                foreignKey: { name: 'mcqquestionID', allowNull: true }
            });
        }
    }
    Mcqquestion.init({
        mcqStatement: {
            type: DataTypes.STRING,
            allowNull: false
        },
        mcqOp1: {
            type: DataTypes.STRING,
            allowNull: false
        },
        mcqOp2: {
            type: DataTypes.STRING,
            allowNull: false
        },
        mcqOp3: {
            type: DataTypes.STRING,
            allowNull: false
        },
        mcqOp4: {
            type: DataTypes.STRING,
            allowNull: false
        },
        mcqOp1IsCor: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        mcqOp2IsCor: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        mcqOp3IsCor: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        mcqOp4IsCor: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Mcqquestion',
        tableName: 'mcq_questions'
    });
    return Mcqquestion;
};
