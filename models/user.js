import { DataTypes } from "sequelize";

import { sequelize } from "../db/sequelize.js";

export const User = sequelize.define(
  "user",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { args: true, msg: "Email already exists" },
    },
    password: { type: DataTypes.STRING, allowNull: false },
    avatar: { type: DataTypes.STRING, allowNull: true },
    token: { type: DataTypes.STRING, allowNull: true },
  },
  {
    timestamps: true,
    tableName: "users",
  }
);

User.associate = (models) => {
  User.hasMany(models.Recipe, { foreignKey: "ownerId", as: "recipes" });
  User.hasMany(models.Testimonial, {
    foreignKey: "ownerId",
    as: "testimonials",
  });

  User.belongsToMany(models.User, {
    through: models.UserFollower,
    as: "followers",
    foreignKey: "followingId",
    otherKey: "followerId",
  });

  User.belongsToMany(models.User, {
    through: models.UserFollower,
    as: "following",
    foreignKey: "followerId",
    otherKey: "followingId",
  });
};
