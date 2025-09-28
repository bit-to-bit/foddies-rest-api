import express from "express";

import usersControllers from "../controllers/usersControllers.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

const usersRouter = express.Router();
usersRouter.use(authenticate);

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
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
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *     SubscribeResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Subscribed successfully
 *   responses:
 *     Unauthorized:
 *       description: Unauthorized - invalid or missing token
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *           examples:
 *             UnauthorizedExample:
 *               value:
 *                 message: Unauthorized
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

/**
 * @openapi
 * /api/users/me:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get current user
 *     description: Returns the currently authenticated user's profile.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Current user retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
usersRouter.get("/me", usersControllers.getCurrent);

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user by id
 *     description: Returns a user's public profile by their ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user to get
 *         schema:
 *           type: integer
 *           example: 3
 *     responses:
 *       '200':
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
usersRouter.get("/:id", usersControllers.getUserDetails);

/**
 * @openapi
 * /api/users/me/avatar:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update current user's avatar
 *     description: Upload a new avatar image for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: The avatar image file to upload
 *     responses:
 *       '200':
 *         description: Avatar updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 avatar:
 *                   type: string
 *                   format: uri
 *                   example: https://example.com/avatar.jpeg
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
usersRouter.patch(
  "/me/avatar",
  upload.single("avatar"),
  usersControllers.updateAvatar
);

/**
 * @openapi
 * /api/users/{id}/followers:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get followers of a user
 *     description: Returns a paginated list of followers for the given user ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user whose followers are being requested
 *         schema:
 *           type: integer
 *           example: 2
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number for pagination
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Number of results per page
 *         schema:
 *           type: integer
 *           example: 8
 *     responses:
 *       '200':
 *         description: Followers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FollowersResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
usersRouter.get("/:id/followers", usersControllers.getFollowers);

/**
 * @openapi
 * /api/users/me/followings:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get followings of current user
 *     description: Returns a paginated list of users that the authenticated user is following.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number for pagination
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Number of results per page
 *         schema:
 *           type: integer
 *           example: 8
 *     responses:
 *       '200':
 *         description: Followings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FollowingsResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
usersRouter.get("/me/followings", usersControllers.getFollowings);

/**
 * @openapi
 * /api/users/{id}/subscribe:
 *   post:
 *     tags:
 *       - Users
 *     summary: Subscribe to a user
 *     description: Allows the authenticated user to subscribe (follow) another user by their ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user to subscribe to
 *         schema:
 *           type: integer
 *           example: 2
 *     responses:
 *       '200':
 *         description: Subscribed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubscribeResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
usersRouter.post("/:id/subscribe", usersControllers.subscribe);

/**
 * @openapi
 * /api/users/{id}/unsubscribe:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Unsubscribe from a user
 *     description: Allows the authenticated user to unsubscribe (unfollow) another user by their ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user to unsubscribe from
 *         schema:
 *           type: integer
 *           example: 2
 *     responses:
 *       '204':
 *         description: Unsubscribed successfully (no content)
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
usersRouter.delete("/:id/unsubscribe", usersControllers.unsubscribe);

export default usersRouter;
