import { DataTypes } from 'sequelize';
import { sequelize } from '../db/sequelize.js';

export const Area = sequelize.define(
  'area',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
  },
  {
    timestamps: true,
    tableName: 'areas',
  }
);

Area.associate = (models) => {
  Area.hasMany(models.Recipe, { foreignKey: 'areaId', as: 'recipes' });
};
