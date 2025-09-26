'use strict';

import models from './models/index.js';
import { sequelize } from './db/sequelize.js';

const { User, Area, Category, Ingredient, Recipe, RecipeIngredient, Testimonial } = models;

async function run() {
  const suffix = Date.now();
  console.log('Starting entity tests - suffix:', suffix);

  try {
    await sequelize.authenticate();
    console.log('✅ DB connection OK');

    // 1) CREATE: users, area, category, ingredients
    console.log('\n--- CREATING ENTITIES ---');
    const userA = await User.create({ name: `Test A ${suffix}`, email: `test-a-${suffix}@example.com` });
    const userB = await User.create({ name: `Test B ${suffix}`, email: `test-b-${suffix}@example.com` });
    console.log('Created users:', userA.id, userB.id);

    const area = await Area.create({ name: `Testland ${suffix}` });
    const category = await Category.create({ name: `Dessert ${suffix}` });
    console.log('Created area & category:', area.id, category.id);

    const ing1 = await Ingredient.create({ name: `Flour ${suffix}`, description: 'Wheat flour' });
    const ing2 = await Ingredient.create({ name: `Sugar ${suffix}`, description: 'Granulated sugar' });
    console.log('Created ingredients:', ing1.id, ing2.id);

    // 2) CREATE recipe (owner via association helper)
    console.log('\n--- CREATING RECIPE ---');
    // Using user.createRecipe ensures relations are set correctly
    const recipe = await userA.createRecipe({
      title: `Unit Test Cake ${suffix}`,
      description: 'A simple test cake',
      thumb: null,
      time: 25,
      instructions: 'Mix and bake',
      areaId: area.id,
      categoryId: category.id,
    });
    console.log('Created recipe id:', recipe.id);

    // 3) LINK ingredients to recipe (through table)
    console.log('\n--- LINKING INGREDIENTS ---');
    // use association helpers; pass measure via `through`
    await recipe.addIngredient(ing1, { through: { measure: '200g' } });
    await recipe.addIngredient(ing2, { through: { measure: '100g' } });
    console.log('Linked ingredients to recipe');

    // 4) READ recipe with includes (owner, area, category, ingredients)
    console.log('\n--- LOADING RECIPE WITH ASSOCIATIONS ---');
    const loadedRecipe = await Recipe.findByPk(recipe.id, {
      include: [
        { model: Ingredient, as: 'ingredients' },
        { model: User, as: 'owner' },
        { model: Area, as: 'area' },
        { model: Category, as: 'category' },
      ],
    });

    console.log('Recipe (brief):', {
      id: loadedRecipe.id,
      title: loadedRecipe.title,
      owner: loadedRecipe.owner?.email,
      area: loadedRecipe.area?.name,
      category: loadedRecipe.category?.name,
      ingredients: loadedRecipe.ingredients.map((i) => i.name),
    });

    // Inspect recipe_ingredients rows (measures)
    const riRows = await RecipeIngredient.findAll({ where: { recipeId: recipe.id } });
    console.log('recipe_ingredients rows:', riRows.map((r) => ({ ingredientId: r.ingredientId, measure: r.measure })));

    // 5) UPDATE some entities
    console.log('\n--- UPDATING ENTITIES ---');
    await recipe.update({ title: `Updated Test Cake ${suffix}` });
    await ing1.update({ description: 'Updated description for flour' });
    await userA.update({ name: `Test A Updated ${suffix}` });
    console.log('Updated recipe title, ingredient desc, user name');

    // Verify updates
    const updatedRecipe = await Recipe.findByPk(recipe.id);
    console.log('Updated recipe title:', updatedRecipe.title);

    // 6) FOLLOWERS: userB follows userA using association helpers
    console.log('\n--- FOLLOWERS (associations) ---');
    // addFollowing exists because in user model you defined belongsToMany as 'following'
    await userB.addFollowing(userA); // userB -> following -> userA
    // load followers of userA
    const followersOfA = await userA.getFollowers();
    console.log('Followers of userA emails:', followersOfA.map((u) => u.email));

    // 7) TESTIMONIAL
    console.log('\n--- TESTIMONIAL ---');
    const testimonial = await Testimonial.create({
      ownerId: userA.id,
      testimonial: `Amazing test testimonial ${suffix}`,
    });
    console.log('Created testimonial id:', testimonial.id);

    // 8) DELETE / unlink: remove one ingredient link, then delete recipe
    console.log('\n--- DELETE / UNLINK ---');
    // Remove ingredient ing2 from recipe (destroy join row)
    await RecipeIngredient.destroy({ where: { recipeId: recipe.id, ingredientId: ing2.id } });
    console.log(`Removed ingredient ${ing2.id} from recipe ${recipe.id}`);

    // Delete recipe (should remove recipe_ingredients due to FK cascade on recipe deletion)
    await recipe.destroy();
    console.log('Deleted recipe');

    // 9) CLEANUP: remove created testimonials, followers, users, ingredients, area, category
    console.log('\n--- CLEANUP ---');
    // remove testimonial
    await Testimonial.destroy({ where: { id: testimonial.id } });

    // remove follower relation: deleting users will cascade thanks to FK definitions,
    // but let's remove explicit follower row to show the operation:
    await sequelize.getQueryInterface().bulkDelete('user_followers', {
      followerId: userB.id,
      followingId: userA.id,
    }).catch(() => { /* ignore if not present */ });

    // remove users
    await User.destroy({ where: { id: [userA.id, userB.id] } });

    // remove ingredients, area, category
    await Ingredient.destroy({ where: { id: [ing1.id, ing2.id] } });
    await Area.destroy({ where: { id: area.id } });
    await Category.destroy({ where: { id: category.id } });

    console.log('Cleanup finished. All test data removed.');
    console.log('\n✅ All tests completed successfully.');
  } catch (err) {
    console.error('❌ Test failed with error:', err);
    process.exitCode = 1;
  } finally {
    // close connection
    await sequelize.close();
  }
}

run();
