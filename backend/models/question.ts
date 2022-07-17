// @ts-nocheck

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Mcqquestion, {
        foreignKey: { name: 'mcqquestionID', allowNull: false }
      });

      this.belongsTo(models.Microvivaquestion, {
        foreignKey: { name: 'microvivaquestionID', allowNull: false }
      });

      this.belongsToMany(models.Candidatelist, {
        through: models.Answer,
        foreignKey: 'questionID'
      });
      this.belongsTo(models.Assessment, {
        as: 'question',
        foreignKey: { name: 'assessmentID', allowNull: false }
      });
    }
  }
  Question.init({
    questionID: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    marks: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    timeLimit: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Question',
    tableName: 'questions'
  });
  return Question;
};