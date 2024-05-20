'use strict'

const { executePGDatabaseQuery } = require("../../utils/executeDatabaseQuery/executePGDatabaseQuery")

const testPGQuery = async () => {
  console.log('work pg test')
  try {
    const command = 'SELECT "id", "password", "last_login", "is_superuser", "username", "first_name", "last_name", "email" FROM "auth_user";'
    const result = await executePGDatabaseQuery(command)
    console.log(result)
  } catch (error) {
    console.log(error)
  }
}

const testPGQuery2 = () => {
    console.log('work pg test')
    const command = 'SELECT "id", "password", "last_login", "is_superuser", "username", "first_name", "last_name", "email" FROM "auth_user";'
    executePGDatabaseQuery(command)
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        console.log(error);
      });
  }

module.exports = {
  testPGQuery,
  testPGQuery2,
}
