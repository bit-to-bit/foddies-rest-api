"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up({ context }) {
  const { queryInterface, DataTypes } = context;
  await queryInterface.createTable("favorites", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    recipeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });
  await queryInterface.addConstraint("favorites", {
    fields: ["userId", "recipeId"],
    type: "unique",
    name: "uniq_user_recipe_favorite",
  });
  await queryInterface.addConstraint("favorites", {
    fields: ["userId"],
    type: "foreign key",
    name: "fk_favorites_user",
    references: { table: "users", field: "id" },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  await queryInterface.addConstraint("favorites", {
    fields: ["recipeId"],
    type: "foreign key",
    name: "fk_favorites_recipe",
    references: { table: "recipes", field: "id" },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
}

export async function down({ context }) {
  const { queryInterface } = context;

  await queryInterface
    .removeConstraint("favorites", "fk_favorites_recipe")
    .catch(() => {});
  await queryInterface
    .removeConstraint("favorites", "fk_favorites_user")
    .catch(() => {});
  await queryInterface
    .removeConstraint("favorites", "uniq_user_recipe_favorite")
    .catch(() => {});

  await queryInterface.dropTable("favorites").catch(() => {});
}
