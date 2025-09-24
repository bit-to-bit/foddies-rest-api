import { DataTypes } from 'sequelize';
import { sequelize } from './sequelize.js';

export const Ingredient = sequelize.define(
  'Ingredient',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    desc: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    img: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Ingredient',
    tableName: 'ingredients',
    timestamps: false,
  }
);
