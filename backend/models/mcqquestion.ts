// @ts-nocheck

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mcqquestion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasOne(models.Question, { 
        as: 'mcqquestion',
        foreignKey: {name: 'mcqquestionID', allowNull:true} 
      });
      this.hasMany(models.Mcqoption, { 
        as: 'mcqoptions',
        foreignKey: {name: 'mcqquestionID', allowNull:true} 
      });
    }
  }
  Mcqquestion.init({
    mcqStatement: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Mcqquestion',
    tableName: 'mcq_questions'
  });
  return Mcqquestion;
};