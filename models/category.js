import { DataTypes } from "sequelize";

import { sequelize } from "../db/sequelize.js";

export const Category = sequelize.define(
  "category",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    img: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      defaultValue: "/images/placeholders/category.jpg",
    },
  },
  {
    timestamps: true,
    tableName: "categories",
  }
);

Category.associate = (models) => {
  Category.hasMany(models.Recipe, { foreignKey: "categoryId", as: "recipes" });
};
