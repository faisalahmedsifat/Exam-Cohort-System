// @ts-nocheck
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Microvivaquestion extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.hasOne(models.Question, {
                foreignKey: { name: 'microvivaquestionID', allowNull: false }
            });
        }
    }
    Microvivaquestion.init({
        micQuesAudioID: {
            type: DataTypes.STRING,
            allowNull: false
        },
        micCorAudioID: {
            type: DataTypes.STRING,
            allowNull: false
        },
        micCorAnsText: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Microvivaquestion',
        tableName: 'microviva_questions'
    });
    return Microvivaquestion;
};
