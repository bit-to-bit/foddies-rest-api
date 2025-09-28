"use strict";

export async function up({ context }) {
  const { queryInterface, Sequelize } = context;

  await queryInterface.addColumn("categories", "order", {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  });

  const ORDER = [
    "Beef",
    "Breakfast",
    "Desserts",
    "Lamb",
    "Goat",
    "Miscellaneous",
    "Pasta",
    "Pork",
    "Seafood",
    "Side",
    "Starter",
  ];

  for (let i = 0; i < ORDER.length; i++) {
    const name = ORDER[i];
    await queryInterface.sequelize.query(
      `UPDATE "categories" SET "order" = :order WHERE "name" = :name`,
      { replacements: { order: i + 1, name } }
    );
  }
}

export async function down({ context }) {
  const { queryInterface } = context;
  await queryInterface.removeColumn("categories", "order");
}
