// @ts-nocheck

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mcqanswer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasOne(models.Answer, { 
        as: 'answer',
        foreignKey: {name: 'mcqanswerID', allowNull:true}
      });
      this.hasMany(models.Mcqoptionselected, {
        as: 'selectedoption',
        foreignKey: {name: 'mcqanswerID', allowNull:true},
        onDelete: 'CASCADE'
      });
    }
  }
  Mcqanswer.init({
  }, {
    sequelize,
    modelName: 'Mcqanswer',
    tableName: 'mcq_answers'
  });
  return Mcqanswer;
};