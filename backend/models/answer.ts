// @ts-nocheck

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Answer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Mcqanswer, { 
        as: {
          singular: 'mcqanswer',
          plural: 'mcqanswers',
        },
        foreignKey: {name: 'mcqanswerID', allowNull:true}
      });
      
      this.belongsTo(models.Microvivaanswer, { 
        foreignKey: {name: 'microvivaanswerID', allowNull:true}
      });
    }
  }
  Answer.init({
    answerID: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    viewedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    submittedAt: {
      type: DataTypes.DATE
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isCorrect: {
      type: DataTypes.BOOLEAN,
      defaultValue: null,
      allowNull: true
    },
    hasAutoEvaluated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    hasAdjustedManually: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    scoreRightNow: {
      type: DataTypes.FLOAT,
      defaultValue: null,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Answer',
    tableName: 'answers'
  });
  return Answer;
};