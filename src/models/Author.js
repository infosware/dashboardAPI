import { Model, STRING, INTEGER } from 'sequelize';
import sequelize from '../config/db';

export default class Author extends Model {}
Author.init({
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: STRING,
  },
  age: {
    type: INTEGER,
  },
  email: {
    type: STRING,
  },
  country: {
    type: STRING,
  },
}, {
  sequelize,
  modelName: 'Author',
});
