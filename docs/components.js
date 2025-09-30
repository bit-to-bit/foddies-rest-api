/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Area:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 11
 *         name:
 *           type: string
 *           example: American
 *     AreasData:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Area'
 *         total:
 *           type: integer
 *           example: 27
 *         page:
 *           type: integer
 *           example: 1
 *         totalPages:
 *           type: integer
 *           example: 3
 *         limit:
 *           type: integer
 *           example: 10
 *     AreasResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           example: 200
 *         message:
 *           type: string
 *           example: Areas retrieved successfully
 *         data:
 *           $ref: '#/components/schemas/AreasData'
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           example: Test
 *         email:
 *           type: string
 *           format: email
 *           example: test@zxc.com
 *         password:
 *           type: string
 *           format: password
 *           example: admin123
 *     RegisterResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 12
 *             name:
 *               type: string
 *               example: Test
 *             email:
 *               type: string
 *               format: email
 *               example: test@zxc.com
 *             avatar:
 *               type: string
 *               format: uri
 *               example: https://s.gravatar.com/avatar/45a191ecff2ed6216d27a42962b8bbf5?s=100&r=x&d=retro
 *             createdAt:
 *               type: string
 *               format: date-time
 *               example: 2025-09-30T20:55:29.974Z
 *             updatedAt:
 *               type: string
 *               format: date-time
 *               example: 2025-09-30T20:55:30.031Z
 *             token:
 *               type: string
 *               description: Duplicates top-level token as returned by the service.
 *               example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: test@zxc.com
 *         password:
 *           type: string
 *           format: password
 *           example: admin123
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 12
 *             name:
 *               type: string
 *               example: Test
 *             email:
 *               type: string
 *               format: email
 *               example: test@zxc.com
 *             avatar:
 *               type: string
 *               format: uri
 *               example: https://s.gravatar.com/avatar/45a191ecff2ed6216d27a42962b8bbf5?s=100&r=x&d=retro
 *             token:
 *               type: string
 *               description: Duplicates top-level token as returned by the service.
 *               example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *             createdAt:
 *               type: string
 *               format: date-time
 *               example: 2025-09-30T20:55:29.974Z
 *             updatedAt:
 *               type: string
 *               format: date-time
 *               example: 2025-09-30T20:55:58.561Z
 *     LogoutResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 7
 *         message:
 *           type: string
 *           example: Logout is successfully!
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *     Category:
 *       type: object
 *       required:
 *         - id
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           example: 5
 *         name:
 *           type: string
 *           example: Beef
 *     Ingredient:
 *       type: object
 *       required:
 *         - id
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           example: 35
 *         name:
 *           type: string
 *           example: Ackee
 *         description:
 *           type: string
 *           example: A fruit that is native to West Africa ...
 *         img:
 *           type: string
 *           format: uri
 *           example: https://ftp.goit.study/img/so-yummy/ingredients/640c2dd963a319ea671e383b.png
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 6
 *         name:
 *           type: string
 *           example: Test
 *         email:
 *           type: string
 *           format: email
 *           example: test@zxc.com
 *         avatar:
 *           type: string
 *           format: uri
 *           nullable: true
 *         recipesAmount:
 *           type: integer
 *           example: 0
 *         favoriteRecipesAmount:
 *           type: integer
 *           example: 0
 *         followersAmount:
 *           type: integer
 *           example: 0
 *         followingsAmount:
 *           type: integer
 *           example: 0
 *     Follower:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 6
 *         name:
 *           type: string
 *           example: Test
 *         email:
 *           type: string
 *           format: email
 *           example: test@zxc.com
 *         avatar:
 *           type: string
 *           format: uri
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-09-27T17:01:46.081Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2025-09-28T17:22:24.987Z
 *         userFollower:
 *           type: object
 *           properties:
 *             followerId:
 *               type: integer
 *               example: 6
 *             followingId:
 *               type: integer
 *               example: 2
 *     FollowingsResponse:
 *       type: object
 *       properties:
 *         followings:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Follower'
 *         total:
 *           type: integer
 *           example: 1
 *         page:
 *           type: integer
 *           example: 1
 *         limit:
 *           type: integer
 *           example: 8
 *         totalPages:
 *           type: integer
 *           example: 1
 *     FollowersResponse:
 *       type: object
 *       properties:
 *         followers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Follower'
 *         total:
 *           type: integer
 *           example: 1
 *         page:
 *           type: integer
 *           example: 1
 *         limit:
 *           type: integer
 *           example: 8
 *         totalPages:
 *           type: integer
 *           example: 1
 *     SubscribeResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Subscribed successfully
 *     Testimonial:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 2
 *         testimonial:
 *           type: string
 *           example: "Foodies is a must-have for any home cook! ..."
 *         authorName:
 *           type: string
 *           example: Anonymous
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-09-27T16:52:55.931Z
 *     TestimonialsData:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Testimonial'
 *         total:
 *           type: integer
 *           example: 3
 *         page:
 *           type: integer
 *           example: 1
 *         totalPages:
 *           type: integer
 *           example: 3
 *         limit:
 *           type: integer
 *           example: 1
 *     TestimonialsResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           example: 200
 *         message:
 *           type: string
 *           example: Testimonials retrieved successfully
 *         data:
 *           $ref: '#/components/schemas/TestimonialsData'
 *     Recipe:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - description
 *         - thumb
 *         - time
 *         - instructions
 *         - ownerId
 *         - areaId
 *         - categoryId
 *       properties:
 *         id:
 *           type: integer
 *           example: 285
 *         title:
 *           type: string
 *           example: Fennel Dauphinoise
 *         description:
 *           type: string
 *           example: A French potato gratin dish made with layers of thinly sliced potatoes, cream, and fennel.
 *         thumb:
 *           type: string
 *           format: uri
 *           example: https://ftp.goit.study/img/so-yummy/preview/Fennel%20Dauphinoise.jpg
 *         time:
 *           type: integer
 *           example: 50
 *         instructions:
 *           type: string
 *           example: Heat oven to 180C/160C fan/gas 4...
 *         ownerId:
 *           type: integer
 *           example: 1
 *         areaId:
 *           type: integer
 *           example: 9
 *         categoryId:
 *           type: integer
 *           example: 13
 *         category:
 *           $ref: '#/components/schemas/Category'
 *         area:
 *           $ref: '#/components/schemas/Area'
 *         ingredients:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Ingredient'
 *         owner:
 *           $ref: '#/components/schemas/User'
 *     CreateRecipeRequest:
 *       type: object
 *       required:
 *         - title
 *         - categoryId
 *         - ownerId
 *         - areaId
 *         - instructions
 *         - description
 *         - thumb
 *         - time
 *         - ingredients
 *       properties:
 *         title:
 *           type: string
 *           example: My Awesome Recipe
 *         description:
 *           type: string
 *           example: This is an easy and delicious recipe that is great for all occasions.
 *         thumb:
 *           type: string
 *           format: uri
 *           example: https://example.com/images/my-recipe-thumbnail.jpg
 *         time:
 *           type: integer
 *           example: 60
 *         instructions:
 *           type: string
 *           example: First, preheat the oven. Next, mix the ingredients. Finally, bake for 30 minutes.
 *         ownerId:
 *           type: integer
 *           example: 6
 *         areaId:
 *           type: integer
 *           example: 1
 *         categoryId:
 *           type: integer
 *           example: 1
 *         ingredients:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - ingredientId
 *               - measure
 *             properties:
 *               ingredientId:
 *                 type: integer
 *                 example: 1
 *               measure:
 *                 type: string
 *                 example: 1 cup
 *     Favorite:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         userId:
 *           type: integer
 *           example: 7
 *         recipeId:
 *           type: integer
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-09-29T18:02:26.485Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2025-09-29T18:02:26.485Z
 *   responses:
 *     BadRequest:
 *       description: Invalid input data
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *           examples:
 *             BadRequestExample:
 *               value:
 *                 message: Validation error
 *     Unauthorized:
 *       description: Invalid credentials
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *           examples:
 *             UnauthorizedExample:
 *               value:
 *                 message: Email or password is wrong
 *     NotFound:
 *       description: Resource not found
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *           examples:
 *             NotFoundExample:
 *               value:
 *                 message: Resource not found
 *     InternalServerError:
 *       description: Internal server error
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *           examples:
 *             InternalServerErrorExample:
 *               value:
 *                 message: Internal server error
 */
