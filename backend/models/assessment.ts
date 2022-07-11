// @ts-nocheck

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Assessment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.ExamCohort, { 
        foreignKey: {name: 'cohortID', allowNull:false} 
      });
    }
  }
  Assessment.init({
    AssessmentID: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    availableDateTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    dueDateTime: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Assessment',
    tableName: 'assessments'
  });
  return Assessment;
};