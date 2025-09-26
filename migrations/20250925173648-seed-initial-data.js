'use strict';

import fs from 'fs/promises';
import path from 'path';

function safeParseJSON(text) {
  const cleaned = text.replace(/,\s*]/g, ']').replace(/,\s*}/g, '}');
  return JSON.parse(cleaned);
}

function extractId(obj) {
  if (!obj) return null;
  if (typeof obj === 'string') return obj;
  if (obj.$oid) return obj.$oid;
  if (obj.$id) return obj.$id;
  return JSON.stringify(obj);
}

async function readSeed(fileName) {
  const p = path.join(process.cwd(), 'seeders', 'data', fileName);
  const raw = await fs.readFile(p, 'utf8');
  return safeParseJSON(raw);
}

async function tableHasColumn(queryInterface, tableName, columnName) {
  try {
    const desc = await queryInterface.describeTable(tableName);
    return Object.prototype.hasOwnProperty.call(desc, columnName);
  } catch (err) {
    return false;
  }
}

export async function up({ context }) {
  const sequelize = context.sequelize ?? context.queryInterface?.sequelize;
  const queryInterface = context.queryInterface ?? (sequelize && sequelize.getQueryInterface && sequelize.getQueryInterface());
  if (!sequelize || !queryInterface) {
    throw new Error('Migration context does not contain sequelize or queryInterface.');
  }

  const [usersSrc, areasSrc, categoriesSrc, ingredientsSrc, recipesSrc, testimonialsSrc] =
    await Promise.all([
      readSeed('users.json'),
      readSeed('areas.json'),
      readSeed('categories.json'),
      readSeed('ingredients.json'),
      readSeed('recipes.json'),
      readSeed('testimonials.json'),
    ]);

  const recipeIngredientsHasCreatedAt = await tableHasColumn(queryInterface, 'recipe_ingredients', 'createdAt');
  const recipeIngredientsHasUpdatedAt = await tableHasColumn(queryInterface, 'recipe_ingredients', 'updatedAt');
  const userFollowersHasCreatedAt = await tableHasColumn(queryInterface, 'user_followers', 'createdAt');
  const userFollowersHasUpdatedAt = await tableHasColumn(queryInterface, 'user_followers', 'updatedAt');

  const transaction = await sequelize.transaction();
  try {
    const userMap = {};
    const areaMap = {};
    const categoryMap = {};
    const ingredientMap = {};

    for (const u of usersSrc) {
      const oldId = extractId(u._id);
      const name = u.name ?? null;
      const email = u.email ?? null;
      const avatar = u.avatar ?? null;
      const now = new Date();

      const insertSql = `
        INSERT INTO "users" ("name","email","avatar","createdAt","updatedAt")
        VALUES (:name, :email, :avatar, :createdAt, :updatedAt)
        RETURNING id
      `;

      const [rows] = await sequelize.query(insertSql, {
        replacements: { name, email, avatar, createdAt: now, updatedAt: now },
        transaction,
      });
      const newId = rows[0].id;
      userMap[oldId] = newId;
    }

    for (const a of areasSrc) {
      const oldId = extractId(a._id);
      const name = a.name ?? null;
      const now = new Date();

      const insertSql = `
        INSERT INTO "areas" ("name","createdAt","updatedAt")
        VALUES (:name, :createdAt, :updatedAt)
        RETURNING id
      `;
      const [rows] = await sequelize.query(insertSql, {
        replacements: { name, createdAt: now, updatedAt: now },
        transaction,
      });
      const newId = rows[0].id;
      areaMap[oldId] = newId;
      areaMap[`name:${name}`] = newId;
    }

    for (const c of categoriesSrc) {
      const oldId = extractId(c._id);
      const name = c.name ?? null;
      const now = new Date();

      const insertSql = `
        INSERT INTO "categories" ("name","createdAt","updatedAt")
        VALUES (:name, :createdAt, :updatedAt)
        RETURNING id
      `;
      const [rows] = await sequelize.query(insertSql, {
        replacements: { name, createdAt: now, updatedAt: now },
        transaction,
      });
      const newId = rows[0].id;
      categoryMap[oldId] = newId;
      categoryMap[`name:${name}`] = newId;
    }

    for (const ing of ingredientsSrc) {
      const oldId = extractId(ing._id ?? ing.id);
      const name = ing.name ?? null;
      const description = ing.desc ?? ing.description ?? null;
      const img = ing.img ?? null;
      const now = new Date();

      const insertSql = `
        INSERT INTO "ingredients" ("name","description","img","createdAt","updatedAt")
        VALUES (:name, :description, :img, :createdAt, :updatedAt)
        RETURNING id
      `;
      const [rows] = await sequelize.query(insertSql, {
        replacements: { name, description, img, createdAt: now, updatedAt: now },
        transaction,
      });
      const newId = rows[0].id;
      ingredientMap[oldId] = newId;
      ingredientMap[`name:${name}`] = newId;
    }

    if (testimonialsSrc && Array.isArray(testimonialsSrc)) {
      for (const t of testimonialsSrc) {
        const ownerOld = extractId(t.owner?._id ?? t.owner);
        let ownerId = null;
        if (ownerOld && userMap[ownerOld]) ownerId = userMap[ownerOld];

        const testimonial = t.testimonial ?? null;
        const now = new Date();

        const insertSql = `
          INSERT INTO "testimonials" ("ownerId","testimonial","createdAt","updatedAt")
          VALUES (:ownerId, :testimonial, :createdAt, :updatedAt)
        `;
        await sequelize.query(insertSql, {
          replacements: { ownerId, testimonial, createdAt: now, updatedAt: now },
          transaction,
        });
      }
    }

    async function ensureAreaByName(name) {
      const key = `name:${name}`;
      if (areaMap[key]) return areaMap[key];

      const now = new Date();
      const [rows] = await sequelize.query(
        `
        INSERT INTO "areas" ("name","createdAt","updatedAt")
        VALUES (:name, :createdAt, :updatedAt)
        RETURNING id
        `,
        { replacements: { name, createdAt: now, updatedAt: now }, transaction }
      );
      const newId = rows[0].id;
      areaMap[key] = newId;
      return newId;
    }

    async function ensureCategoryByName(name) {
      const key = `name:${name}`;
      if (categoryMap[key]) return categoryMap[key];

      const now = new Date();
      const [rows] = await sequelize.query(
        `
        INSERT INTO "categories" ("name","createdAt","updatedAt")
        VALUES (:name, :createdAt, :updatedAt)
        RETURNING id
        `,
        { replacements: { name, createdAt: now, updatedAt: now }, transaction }
      );
      const newId = rows[0].id;
      categoryMap[key] = newId;
      return newId;
    }

    for (const r of recipesSrc) {
      const title = r.title ?? null;
      const description = r.description ?? null;
      const thumb = r.thumb ?? null;
      const time = r.time ? parseInt(String(r.time), 10) || null : null;
      const instructions = r.instructions ?? null;

      const ownerOld = extractId(r.owner?._id ?? r.owner);
      const ownerId = ownerOld ? userMap[ownerOld] : null;

      let areaId = null;
      if (r.area) {
        if (typeof r.area === 'string') {
          areaId = await ensureAreaByName(r.area);
        } else {
          const areaOld = extractId(r.area?._id ?? r.area);
          if (areaOld) areaId = areaMap[areaOld];
        }
      }

      let categoryId = null;
      if (r.category) {
        if (typeof r.category === 'string') {
          categoryId = await ensureCategoryByName(r.category);
        } else {
          const catOld = extractId(r.category?._id ?? r.category);
          if (catOld) categoryId = categoryMap[catOld];
        }
      }

      const now = new Date();

      const insertRecipeSql = `
        INSERT INTO "recipes" ("title","description","thumb","time","instructions","ownerId","areaId","categoryId","createdAt","updatedAt")
        VALUES (:title,:description,:thumb,:time,:instructions,:ownerId,:areaId,:categoryId,:createdAt,:updatedAt)
        RETURNING id
      `;
      const [recipeRows] = await sequelize.query(insertRecipeSql, {
        replacements: {
          title,
          description,
          thumb,
          time,
          instructions,
          ownerId,
          areaId,
          categoryId,
          createdAt: now,
          updatedAt: now,
        },
        transaction,
      });

      const recipeId = recipeRows[0].id;

      if (Array.isArray(r.ingredients)) {
        for (const ri of r.ingredients) {
          const oldIngId = extractId(ri.id ?? ri._id);
          const measure = ri.measure ?? null;
          const ingredientId = ingredientMap[oldIngId];

          if (!ingredientId) {
            throw new Error(
              `Missing ingredient mapping for recipe "${title}". Ingredient old id "${oldIngId}" not found in ingredients.json`
            );
          }

          if (recipeIngredientsHasCreatedAt || recipeIngredientsHasUpdatedAt) {
            const cols = ['"recipeId"', '"ingredientId"', '"measure"'];
            const vals = [':recipeId', ':ingredientId', ':measure'];
            const repls = { recipeId, ingredientId, measure };

            if (recipeIngredientsHasCreatedAt) {
              cols.push('"createdAt"');
              vals.push(':createdAt');
              repls.createdAt = now;
            }
            if (recipeIngredientsHasUpdatedAt) {
              cols.push('"updatedAt"');
              vals.push(':updatedAt');
              repls.updatedAt = now;
            }

            const insertRiSql = `
              INSERT INTO "recipe_ingredients" (${cols.join(',')})
              VALUES (${vals.join(',')})
              ON CONFLICT DO NOTHING
            `;
            await sequelize.query(insertRiSql, { replacements: repls, transaction });
          } else {
            const insertRiSql = `
              INSERT INTO "recipe_ingredients" ("recipeId","ingredientId","measure")
              VALUES (:recipeId, :ingredientId, :measure)
              ON CONFLICT DO NOTHING
            `;
            await sequelize.query(insertRiSql, {
              replacements: { recipeId, ingredientId, measure },
              transaction,
            });
          }
        }
      }
    }

    for (const u of usersSrc) {
      const followerOld = extractId(u._id);
      const followerId = userMap[followerOld];

      if (Array.isArray(u.followers)) {
        for (const fo of u.followers) {
          const foOld = extractId(fo);
          const followingId = userMap[followerOld];
          const followerUserId = userMap[foOld];
          if (followerUserId && followingId) {
            if (userFollowersHasCreatedAt || userFollowersHasUpdatedAt) {
              const cols = ['"followerId"', '"followingId"'];
              const vals = [':followerId', ':followingId'];
              const repls = { followerId: followerUserId, followingId };

              const now = new Date();
              if (userFollowersHasCreatedAt) {
                cols.push('"createdAt"');
                vals.push(':createdAt');
                repls.createdAt = now;
              }
              if (userFollowersHasUpdatedAt) {
                cols.push('"updatedAt"');
                vals.push(':updatedAt');
                repls.updatedAt = now;
              }

              const insertSql = `
                INSERT INTO "user_followers" (${cols.join(',')})
                VALUES (${vals.join(',')})
                ON CONFLICT DO NOTHING
              `;
              await sequelize.query(insertSql, { replacements: repls, transaction });
            } else {
              const insertSql = `
                INSERT INTO "user_followers" ("followerId","followingId")
                VALUES (:followerId, :followingId)
                ON CONFLICT DO NOTHING
              `;
              await sequelize.query(insertSql, {
                replacements: { followerId: followerUserId, followingId },
                transaction,
              });
            }
          }
        }
      }

      if (Array.isArray(u.following)) {
        for (const followTarget of u.following) {
          const targetOld = extractId(followTarget);
          const followingId = userMap[targetOld];
          const followerIdVal = followerId;
          if (followerIdVal && followingId) {
            if (userFollowersHasCreatedAt || userFollowersHasUpdatedAt) {
              const cols = ['"followerId"', '"followingId"'];
              const vals = [':followerId', ':followingId'];
              const repls = { followerId: followerIdVal, followingId };

              const now = new Date();
              if (userFollowersHasCreatedAt) {
                cols.push('"createdAt"');
                vals.push(':createdAt');
                repls.createdAt = now;
              }
              if (userFollowersHasUpdatedAt) {
                cols.push('"updatedAt"');
                vals.push(':updatedAt');
                repls.updatedAt = now;
              }

              const insertSql = `
                INSERT INTO "user_followers" (${cols.join(',')})
                VALUES (${vals.join(',')})
                ON CONFLICT DO NOTHING
              `;
              await sequelize.query(insertSql, { replacements: repls, transaction });
            } else {
              const insertSql = `
                INSERT INTO "user_followers" ("followerId","followingId")
                VALUES (:followerId, :followingId)
                ON CONFLICT DO NOTHING
              `;
              await sequelize.query(insertSql, {
                replacements: { followerId: followerIdVal, followingId },
                transaction,
              });
            }
          }
        }
      }
    }

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}

export async function down({ context }) {
  const sequelize = context.sequelize ?? context.queryInterface?.sequelize;
  const queryInterface = context.queryInterface ?? (sequelize && sequelize.getQueryInterface && sequelize.getQueryInterface());
  if (!sequelize || !queryInterface) {
    throw new Error('Migration context does not contain sequelize or queryInterface.');
  }

  const transaction = await sequelize.transaction();
  try {
    const [
      usersSrc,
      areasSrc,
      categoriesSrc,
      ingredientsSrc,
      recipesSrc,
      testimonialsSrc,
    ] = await Promise.all([
      readSeed('users.json'),
      readSeed('areas.json'),
      readSeed('categories.json'),
      readSeed('ingredients.json'),
      readSeed('recipes.json'),
      readSeed('testimonials.json'),
    ]);

    const userEmails = usersSrc.map((u) => u.email).filter(Boolean);
    const areaNames = areasSrc.map((a) => a.name).filter(Boolean);
    const categoryNames = categoriesSrc.map((c) => c.name).filter(Boolean);
    const ingredientNames = ingredientsSrc.map((i) => i.name).filter(Boolean);
    const recipeTitles = recipesSrc.map((r) => r.title).filter(Boolean);
    const testimonialTexts = testimonialsSrc.map((t) => t.testimonial).filter(Boolean);

    if (userEmails.length) {
      await sequelize.query(
        `
        DELETE FROM "user_followers"
        WHERE followerId IN (SELECT id FROM "users" WHERE email = ANY(:userEmails))
           OR followingId IN (SELECT id FROM "users" WHERE email = ANY(:userEmails))
      `,
        { replacements: { userEmails }, transaction }
      );
    }

    if (recipeTitles.length) {
      await sequelize.query(
        `
        DELETE FROM "recipe_ingredients"
        WHERE recipeId IN (SELECT id FROM "recipes" WHERE title = ANY(:recipeTitles))
      `,
        { replacements: { recipeTitles }, transaction }
      );
    }

    if (testimonialTexts.length) {
      await sequelize.query(
        `
        DELETE FROM "testimonials" WHERE testimonial = ANY(:testimonialTexts)
      `,
        { replacements: { testimonialTexts }, transaction }
      );
    }

    if (recipeTitles.length) {
      await sequelize.query(
        `
        DELETE FROM "recipes" WHERE title = ANY(:recipeTitles)
      `,
        { replacements: { recipeTitles }, transaction }
      );
    }

    if (ingredientNames.length) {
      await sequelize.query(
        `
        DELETE FROM "ingredients" WHERE name = ANY(:ingredientNames)
      `,
        { replacements: { ingredientNames }, transaction }
      );
    }

    if (categoryNames.length) {
      await sequelize.query(
        `
        DELETE FROM "categories" WHERE name = ANY(:categoryNames)
      `,
        { replacements: { categoryNames }, transaction }
      );
    }

    if (areaNames.length) {
      await sequelize.query(
        `
        DELETE FROM "areas" WHERE name = ANY(:areaNames)
      `,
        { replacements: { areaNames }, transaction }
      );
    }

    if (userEmails.length) {
      await sequelize.query(
        `
        DELETE FROM "users" WHERE email = ANY(:userEmails)
      `,
        { replacements: { userEmails }, transaction }
      );
    }

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}
