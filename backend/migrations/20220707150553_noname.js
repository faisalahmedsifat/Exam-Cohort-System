const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "users", deps: []
 *
 */

const info = {
  revision: 1,
  name: "noname",
  created: "2022-07-07T15:05:53.740Z",
  comment: "",
};

const migrationCommands = (transaction) => [
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
];

const rollbackCommands = (transaction) => [
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
