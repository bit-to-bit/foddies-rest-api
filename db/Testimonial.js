import { DataTypes } from "sequelize";

import { sequelize } from "./sequelize.js";
import { User } from "./User.js";

export const Testimonial = sequelize.define(
  "Testimonial",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    testimonial: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "testimonials",
    timestamps: true,
    updatedAt: false,
  }
);

Testimonial.belongsTo(User, { foreignKey: "ownerId", as: "author" });
