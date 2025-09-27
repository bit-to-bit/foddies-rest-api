"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up({ context }) {
  const { queryInterface, DataTypes } = context;

  await queryInterface.createTable("users", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    avatar: { type: DataTypes.STRING, allowNull: true },
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

  await queryInterface.createTable("areas", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
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

  await queryInterface.createTable("categories", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
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

  await queryInterface.createTable("ingredients", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    img: { type: DataTypes.STRING, allowNull: true },
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

  await queryInterface.createTable("recipes", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    thumb: { type: DataTypes.STRING, allowNull: true },
    time: { type: DataTypes.INTEGER, allowNull: true },
    instructions: { type: DataTypes.TEXT, allowNull: true },
    ownerId: { type: DataTypes.INTEGER, allowNull: true },
    areaId: { type: DataTypes.INTEGER, allowNull: true },
    categoryId: { type: DataTypes.INTEGER, allowNull: true },
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

  await queryInterface.createTable("recipe_ingredients", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    recipeId: { type: DataTypes.INTEGER, allowNull: false },
    ingredientId: { type: DataTypes.INTEGER, allowNull: false },
    measure: { type: DataTypes.STRING, allowNull: true },
  });

  await queryInterface.createTable("testimonials", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ownerId: { type: DataTypes.INTEGER, allowNull: true },
    testimonial: { type: DataTypes.TEXT, allowNull: false },
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

  await queryInterface.createTable("user_followers", {
    followerId: { type: DataTypes.INTEGER, allowNull: false },
    followingId: { type: DataTypes.INTEGER, allowNull: false },
  });

  await queryInterface.addConstraint("recipe_ingredients", {
    fields: ["recipeId", "ingredientId"],
    type: "unique",
    name: "uniq_recipe_ingredient",
  });

  await queryInterface.addConstraint("user_followers", {
    fields: ["followerId", "followingId"],
    type: "primary key",
    name: "pk_user_followers",
  });

  await queryInterface.addConstraint("recipes", {
    fields: ["ownerId"],
    type: "foreign key",
    name: "fk_recipes_owner",
    references: { table: "users", field: "id" },
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  await queryInterface.addConstraint("recipes", {
    fields: ["areaId"],
    type: "foreign key",
    name: "fk_recipes_area",
    references: { table: "areas", field: "id" },
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  await queryInterface.addConstraint("recipes", {
    fields: ["categoryId"],
    type: "foreign key",
    name: "fk_recipes_category",
    references: { table: "categories", field: "id" },
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  await queryInterface.addConstraint("recipe_ingredients", {
    fields: ["recipeId"],
    type: "foreign key",
    name: "fk_recipe_ingredients_recipe",
    references: { table: "recipes", field: "id" },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  await queryInterface.addConstraint("recipe_ingredients", {
    fields: ["ingredientId"],
    type: "foreign key",
    name: "fk_recipe_ingredients_ingredient",
    references: { table: "ingredients", field: "id" },
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  });

  await queryInterface.addConstraint("testimonials", {
    fields: ["ownerId"],
    type: "foreign key",
    name: "fk_testimonials_owner",
    references: { table: "users", field: "id" },
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  await queryInterface.addConstraint("user_followers", {
    fields: ["followerId"],
    type: "foreign key",
    name: "fk_user_followers_follower",
    references: { table: "users", field: "id" },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  await queryInterface.addConstraint("user_followers", {
    fields: ["followingId"],
    type: "foreign key",
    name: "fk_user_followers_following",
    references: { table: "users", field: "id" },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  await queryInterface.addIndex("recipes", ["title"]);
  await queryInterface.addIndex("ingredients", ["name"]);
  await queryInterface.addIndex("areas", ["name"]);
  await queryInterface.addIndex("categories", ["name"]);
}

export async function down({ context }) {
  const { queryInterface } = context;

  await queryInterface.removeIndex("categories", ["name"]).catch(() => {});
  await queryInterface.removeIndex("areas", ["name"]).catch(() => {});
  await queryInterface.removeIndex("ingredients", ["name"]).catch(() => {});
  await queryInterface.removeIndex("recipes", ["title"]).catch(() => {});

  await queryInterface
    .removeConstraint("user_followers", "fk_user_followers_following")
    .catch(() => {});
  await queryInterface
    .removeConstraint("user_followers", "fk_user_followers_follower")
    .catch(() => {});
  await queryInterface
    .removeConstraint("testimonials", "fk_testimonials_owner")
    .catch(() => {});
  await queryInterface
    .removeConstraint("recipe_ingredients", "fk_recipe_ingredients_ingredient")
    .catch(() => {});
  await queryInterface
    .removeConstraint("recipe_ingredients", "fk_recipe_ingredients_recipe")
    .catch(() => {});
  await queryInterface
    .removeConstraint("recipes", "fk_recipes_category")
    .catch(() => {});
  await queryInterface
    .removeConstraint("recipes", "fk_recipes_area")
    .catch(() => {});
  await queryInterface
    .removeConstraint("recipes", "fk_recipes_owner")
    .catch(() => {});
  await queryInterface
    .removeConstraint("user_followers", "pk_user_followers")
    .catch(() => {});
  await queryInterface
    .removeConstraint("recipe_ingredients", "uniq_recipe_ingredient")
    .catch(() => {});

  await queryInterface.dropTable("user_followers").catch(() => {});
  await queryInterface.dropTable("testimonials").catch(() => {});
  await queryInterface.dropTable("recipe_ingredients").catch(() => {});
  await queryInterface.dropTable("recipes").catch(() => {});
  await queryInterface.dropTable("ingredients").catch(() => {});
  await queryInterface.dropTable("categories").catch(() => {});
  await queryInterface.dropTable("areas").catch(() => {});
  await queryInterface.dropTable("users").catch(() => {});
}
