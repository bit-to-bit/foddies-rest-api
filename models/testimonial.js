import { DataTypes } from 'sequelize';
import { sequelize } from '../db/sequelize.js';

export const Testimonial = sequelize.define(
  'testimonial',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ownerId: { type: DataTypes.INTEGER, allowNull: true },
    testimonial: { type: DataTypes.TEXT, allowNull: false },
  },
  {
    timestamps: true,
    tableName: 'testimonials',
  }
);

Testimonial.associate = (models) => {
  Testimonial.belongsTo(models.User, { foreignKey: 'ownerId', as: 'owner' });
};
