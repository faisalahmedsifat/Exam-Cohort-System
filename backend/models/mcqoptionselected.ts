// @ts-nocheck

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mcqoptionselected extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Mcqanswer, { 
        as: 'mcqoption',
        foreignKey: {name: 'mcqanswerID', allowNull:false}
      });
    }
  }
  Mcqoptionselected.init({
    isSelectedInAnswer: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Mcqoptionselected',
    tableName: 'mcqoptionselected',
  });
  return Mcqoptionselected;
};