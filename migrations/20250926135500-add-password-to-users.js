"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up({ context }) {
  const { queryInterface, DataTypes } = context;
  await queryInterface.addColumn("users", "password", {
    type: DataTypes.STRING,
    allowNull: true,
  });
  await queryInterface.sequelize.query(
    `UPDATE "users" SET "password" = 'defaultpassword' WHERE "password" IS NULL;`
  );
  await queryInterface.changeColumn("users", "password", {
    type: DataTypes.STRING,
    allowNull: false,
  });
}

export async function down({ context }) {
  const { queryInterface } = context;
  await queryInterface.removeColumn("users", "password");
}
