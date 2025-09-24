import { sequelize } from './sequelize.js';
import { DataTypes } from 'sequelize';

export const Area = sequelize.define(
  'Area',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: 'areas',
    timestamps: false,
  }
);
