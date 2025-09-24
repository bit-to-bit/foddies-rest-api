import { DataTypes } from 'sequelize';
import { sequelize } from './sequelize.js';
import { User } from './User.js';

export const Testimonial = sequelize.define(
  'Testimonial',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    ownerId: {
      type: DataTypes.STRING(24),
      allowNull: false,
    },
    testimonial: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: 'testimonials',
    timestamps: true,
    updatedAt: false,
  }
);

Testimonial.belongsTo(User, { foreignKey: 'ownerId', as: 'author' });
