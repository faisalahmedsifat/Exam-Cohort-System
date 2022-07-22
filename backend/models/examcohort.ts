// @ts-nocheck

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ExamCohort extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, { 
        as: {
          singular: 'evaluatorcohort',
          plural: 'evaluatorcohorts'
        },
        foreignKey: {name: 'evaluatorID', allowNull:false} 
      });

      this.belongsToMany(models.User, { 
        as: 'candidate',
        through: models.Candidatelist,
        foreignKey: 'cohortID',
        otherKey: "candidateID"
      });

      this.hasMany(models.Assessment, { 
        as: 'assessment',
        foreignKey: {name: 'cohortID', allowNull:false} 
      });
    }
  }
  ExamCohort.init({
    cohortID: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ExamCohort',
    tableName: 'examcohorts'
  });
  return ExamCohort;
};