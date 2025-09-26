import { DataTypes } from 'sequelize';
import { sequelize } from '../db/sequelize.js';

export const UserFollower = sequelize.define(
  'userFollower',
  {
    followerId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    followingId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
  },
  {
    tableName: 'user_followers',
    timestamps: false,
  }
);

UserFollower.associate = (models) => {};
