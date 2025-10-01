"use strict";

export async function up({ context }) {
  const { queryInterface } = context;
  const CLOUD = process.env.CLOUDINARY_CLOUD_NAME;

  const url = (slug) =>
    `https://res.cloudinary.com/${CLOUD}/image/upload/foodies/categories/${slug}.jpg`;

  const MAP = {
    Beef: url("beef"),
    Breakfast: url("breakfast"),
    Desserts: url("dessert"),
    Lamb: url("lamb"),
    Goat: url("goat"),
    Miscellaneous: url("miscellaneous"),
    Pasta: url("pasta"),
    Pork: url("pork"),
    Seafood: url("seafood"),
    Side: url("side"),
    Starter: url("starter"),
    Chicken: url("chicken"),
    Soup: url("soup"),
    Vegan: url("vegan"),
    Vegetarian: url("vegetarian"),
  };

  for (const [name, img] of Object.entries(MAP)) {
    await queryInterface.sequelize.query(
      `UPDATE "categories" SET "img" = :img WHERE "name" = :name`,
      { replacements: { img, name } }
    );
  }
}

export async function down({ context }) {
  const { queryInterface } = context;
  const CLOUD = process.env.CLOUDINARY_CLOUD_NAME;
  const FALLBACK = `https://res.cloudinary.com/${CLOUD}/image/upload/foodies/placeholders/category.png`;
  await queryInterface.sequelize.query(`UPDATE "categories" SET "img" = :img`, {
    replacements: { img: FALLBACK },
  });
}
