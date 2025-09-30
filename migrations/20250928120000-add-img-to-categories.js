"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up({ context }) {
  const { queryInterface, DataTypes } = context;

  await queryInterface.addColumn("categories", "img", {
    type: DataTypes.STRING(1000),
    allowNull: false,
    defaultValue: "/images/placeholders/category.jpg",
  });

  await queryInterface.sequelize.query(`
    UPDATE "categories"
    SET "img" = '/images/placeholders/category.jpg'
    WHERE "img" IS NULL OR trim("img") = ''
  `);
}

export async function down({ context }) {
  const { queryInterface, DataTypes } = context;

  await queryInterface.changeColumn("categories", "img", {
    type: DataTypes.STRING(1000),
    allowNull: true,
    defaultValue: null,
  });
}
