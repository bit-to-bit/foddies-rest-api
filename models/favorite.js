import { DataTypes } from "sequelize";

import { sequelize } from "../db/sequelize.js";

export const Favorite = sequelize.define(
  "favorite",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    recipeId: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    timestamps: true,
    tableName: "favorites",
    indexes: [{ fields: ["userId", "recipeId"], unique: true }],
  }
);

Favorite.associate = (models) => {
  Favorite.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  Favorite.belongsTo(models.Recipe, { foreignKey: "recipeId", as: "recipe" });
};
