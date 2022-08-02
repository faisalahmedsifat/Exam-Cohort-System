// @ts-nocheck

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mcqoption extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Mcqquestion, { 
        as: 'mcqoptions',
        foreignKey: {name: 'mcqquestionID', allowNull:false} 
      });
      this.hasMany(models.Mcqoptionselected, { 
        as: 'mcqoption',
        foreignKey: {name: 'mcqoptionID', allowNull:false} 
      });
    }
  }
  Mcqoption.init({
    mcqOptionText: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isMcqOptionCor: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Mcqoption',
    tableName: 'mcqoption'
  });
  return Mcqoption;
};