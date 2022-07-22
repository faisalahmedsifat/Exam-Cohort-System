// @ts-nocheck

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.ExamCohort, { 
        as: {
          singular: 'evaluatorcohort',
          plural: 'evaluatorcohorts'
        },
        foreignKey: {name: 'evaluatorID', allowNull:false} 
      });

      this.belongsToMany(models.ExamCohort, { 
        as: 'assignedcohort',
        through: models.Candidatelist,
        foreignKey: 'candidateID',
        otherKey: "cohortID"
      });
    }
  }
  User.init({
    userID: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    emailID: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users'
  });
  return User;
};