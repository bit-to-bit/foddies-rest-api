"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up({ context }) {
  const { queryInterface, DataTypes } = context;
  await queryInterface.addColumn("users", "token", {
    type: DataTypes.STRING,
    allowNull: true,
  });
}

export async function down({ context }) {
  const { queryInterface } = context;
  await queryInterface.removeColumn("users", "token");
}
