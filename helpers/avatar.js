const { APP_HOST, APP_PORT = 3000 } = process.env;

export const getAvatarUrl = (filename) =>
  `${APP_HOST}:${APP_PORT}/avatars/${filename}`;

export const getDefaultAvatarUrl = () => getAvatarUrl("default.jpg");
