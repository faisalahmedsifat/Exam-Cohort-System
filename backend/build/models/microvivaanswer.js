// @ts-nocheck
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Microvivaanswer extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.hasOne(models.Answer, {
                foreignKey: { name: 'microvivaanswerID', allowNull: true }
            });
        }
    }
    Microvivaanswer.init({
        micAnsAudioID: {
            type: DataTypes.STRING,
            allowNull: false
        },
        micAnsAudioText: {
            type: DataTypes.STRING
        }
    }, {
        sequelize,
        modelName: 'Microvivaanswer',
        tableName: 'microviva_answer'
    });
    return Microvivaanswer;
};
