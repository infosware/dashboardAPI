/* eslint-disable object-curly-newline */
import { Model, STRING, INTEGER, DATE } from 'sequelize';
import sequelize from '../config/db';
import Author from './Author';

export default class Article extends Model {}
Article.init({
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: STRING,
  },
  text: {
    type: STRING,
  },
  author: {
    type: INTEGER,
  },
  publication_date: {
    type: DATE,
  },
}, {
  sequelize,
  modelName: 'Article',
});

Article.belongsTo(Author, {
  foreignKey: 'author',
});
