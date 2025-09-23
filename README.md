Для запуску застосунку створіть змінні оточення (.env):

DATABASE_DIALECT=postgres
DATABASE_NAME=db_name
DATABASE_USERNAME=db_user
DATABASE_PASSWORD=db_user_password
DATABASE_HOST=db_host
DATABASE_PORT=5432
APP_PORT=3000
JWT_SECRET=jwt_secret_key



Для перевірки здоров'я сервера, використовуйте GET метод:
http://localhost:3000/api/ping