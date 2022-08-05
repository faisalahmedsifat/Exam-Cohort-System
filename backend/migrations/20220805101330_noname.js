const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "mcq_answers", deps: []
 * createTable() => "mcq_questions", deps: []
 * createTable() => "microviva_answer", deps: []
 * createTable() => "users", deps: []
 * createTable() => "examcohorts", deps: [users]
 * createTable() => "candidate_list", deps: [examcohorts, users]
 * createTable() => "assessments", deps: [examcohorts]
 * createTable() => "microviva_questions", deps: [microviva_answer]
 * createTable() => "mcqoption", deps: [mcq_questions]
 * createTable() => "mcqoptionselected", deps: [mcq_answers, mcqoption]
 * createTable() => "questions", deps: [assessments, mcq_questions, microviva_questions]
 * createTable() => "answers", deps: [mcq_answers, microviva_answer, candidate_list, questions]
 *
 */

const info = {
  revision: 1,
  name: "noname",
  created: "2022-08-05T10:13:30.122Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "createTable",
    params: [
      "mcq_answers",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "mcq_questions",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        mcqStatement: {
          type: Sequelize.STRING,
          field: "mcqStatement",
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "microviva_answer",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        micAnsAudioID: {
          type: Sequelize.STRING,
          field: "micAnsAudioID",
          allowNull: false,
        },
        micAnsAudioText: { type: Sequelize.STRING, field: "micAnsAudioText" },
        microvivaquestionID: {
          type: Sequelize.INTEGER,
          field: "microvivaquestionID",
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "users",
      {
        userID: {
          type: Sequelize.UUID,
          field: "userID",
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        firstName: {
          type: Sequelize.STRING,
          field: "firstName",
          allowNull: false,
        },
        lastName: {
          type: Sequelize.STRING,
          field: "lastName",
          allowNull: false,
        },
        emailID: {
          type: Sequelize.STRING,
          field: "emailID",
          unique: true,
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "examcohorts",
      {
        cohortID: {
          type: Sequelize.UUID,
          field: "cohortID",
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        name: { type: Sequelize.STRING, field: "name", allowNull: false },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        evaluatorID: {
          type: Sequelize.UUID,
          field: "evaluatorID",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "users", key: "userID" },
          name: "evaluatorID",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "candidate_list",
      {
        id: {
          type: Sequelize.UUID,
          field: "id",
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        cohortID: {
          type: Sequelize.UUID,
          field: "cohortID",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "examcohorts", key: "cohortID" },
          unique: "candidate_list_candidateID_cohortID_unique",
        },
        candidateID: {
          type: Sequelize.UUID,
          field: "candidateID",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "users", key: "userID" },
          unique: "candidate_list_candidateID_cohortID_unique",
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "assessments",
      {
        assessmentID: {
          type: Sequelize.UUID,
          field: "assessmentID",
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        name: { type: Sequelize.STRING, field: "name", allowNull: false },
        availableDateTime: {
          type: Sequelize.DATE,
          field: "availableDateTime",
          allowNull: false,
        },
        dueDateTime: {
          type: Sequelize.DATE,
          field: "dueDateTime",
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        cohortID: {
          type: Sequelize.UUID,
          field: "cohortID",
          onUpdate: "CASCADE",
          onDelete: "NO ACTION",
          references: { model: "examcohorts", key: "cohortID" },
          name: "cohortID",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "microviva_questions",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        micQuesAudioID: {
          type: Sequelize.STRING,
          field: "micQuesAudioID",
          allowNull: false,
        },
        micCorAudioID: {
          type: Sequelize.STRING,
          field: "micCorAudioID",
          allowNull: false,
        },
        micCorAnsText: {
          type: Sequelize.STRING,
          field: "micCorAnsText",
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        microvivaquesionID: {
          type: Sequelize.INTEGER,
          field: "microvivaquesionID",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "microviva_answer", key: "id" },
          name: "microvivaquesionID",
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "mcqoption",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        mcqOptionText: {
          type: Sequelize.STRING,
          field: "mcqOptionText",
          allowNull: false,
        },
        isMcqOptionCor: {
          type: Sequelize.BOOLEAN,
          field: "isMcqOptionCor",
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        mcqquestionID: {
          type: Sequelize.INTEGER,
          field: "mcqquestionID",
          onUpdate: "CASCADE",
          onDelete: "NO ACTION",
          references: { model: "mcq_questions", key: "id" },
          name: "mcqquestionID",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "mcqoptionselected",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        isSelectedInAnswer: {
          type: Sequelize.BOOLEAN,
          field: "isSelectedInAnswer",
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        mcqanswerID: {
          type: Sequelize.INTEGER,
          field: "mcqanswerID",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "mcq_answers", key: "id" },
          name: "mcqanswerID",
          allowNull: true,
        },
        mcqoptionID: {
          type: Sequelize.INTEGER,
          field: "mcqoptionID",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "mcqoption", key: "id" },
          name: "mcqoptionID",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "questions",
      {
        questionID: {
          type: Sequelize.UUID,
          field: "questionID",
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        type: { type: Sequelize.STRING, field: "type", allowNull: false },
        marks: { type: Sequelize.INTEGER, field: "marks", allowNull: false },
        timeLimit: {
          type: Sequelize.INTEGER,
          field: "timeLimit",
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        assessmentID: {
          type: Sequelize.UUID,
          field: "assessmentID",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "assessments", key: "assessmentID" },
          name: "assessmentID",
          allowNull: false,
        },
        mcqquestionID: {
          type: Sequelize.INTEGER,
          field: "mcqquestionID",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "mcq_questions", key: "id" },
          name: "mcqquestionID",
          allowNull: true,
        },
        microvivaquestionID: {
          type: Sequelize.INTEGER,
          field: "microvivaquestionID",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "microviva_questions", key: "id" },
          name: "microvivaquestionID",
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "answers",
      {
        answerID: {
          type: Sequelize.UUID,
          field: "answerID",
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        viewedAt: { type: Sequelize.DATE, field: "viewedAt", allowNull: false },
        submittedAt: { type: Sequelize.DATE, field: "submittedAt" },
        type: { type: Sequelize.STRING, field: "type", allowNull: false },
        isCorrect: { type: Sequelize.BOOLEAN, field: "isCorrect" },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        mcqanswerID: {
          type: Sequelize.INTEGER,
          field: "mcqanswerID",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "mcq_answers", key: "id" },
          name: "mcqanswerID",
          allowNull: true,
        },
        microvivaanswerID: {
          type: Sequelize.INTEGER,
          field: "microvivaanswerID",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "microviva_answer", key: "id" },
          name: "microvivaanswerID",
          allowNull: true,
        },
        candidateID: {
          type: Sequelize.UUID,
          field: "candidateID",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "candidate_list", key: "id" },
          unique: "answers_questionID_candidateID_unique",
        },
        questionID: {
          type: Sequelize.UUID,
          field: "questionID",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "questions", key: "questionID" },
          unique: "answers_questionID_candidateID_unique",
        },
      },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "dropTable",
    params: ["answers", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["assessments", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["candidate_list", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["examcohorts", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["mcq_answers", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["mcqoption", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["mcqoptionselected", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["mcq_questions", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["microviva_answer", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["microviva_questions", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["questions", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["users", { transaction }],
  },
];

const pos = 0;
const useTransaction = true;

const execute = (queryInterface, sequelize, _commands) => {
  let index = pos;
  const run = (transaction) => {
    const commands = _commands(transaction);
    return new Promise((resolve, reject) => {
      const next = () => {
        if (index < commands.length) {
          const command = commands[index];
          console.log(`[#${index}] execute: ${command.fn}`);
          index++;
          queryInterface[command.fn](...command.params).then(next, reject);
        } else resolve();
      };
      next();
    });
  };
  if (useTransaction) return queryInterface.sequelize.transaction(run);
  return run(null);
};

module.exports = {
  pos,
  useTransaction,
  up: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, migrationCommands),
  down: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, rollbackCommands),
  info,
};
