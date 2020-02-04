import { Model, STRING, INTEGER } from 'sequelize';
import sequelize from '../config/db';
import Article from './Article';

export default class Website extends Model {}
Website.init({
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: STRING,
  },
  description: {
    type: STRING,
  },
  url: {
    type: STRING,
  },
  visitors_count: {
    type: INTEGER,
  },
}, {
  sequelize,
  modelName: 'Website',
});

Website.belongsToMany(Article, { through: 'Articles_Websites', foreignKey: 'website_id' });
Article.belongsToMany(Website, { through: 'Articles_Websites', foreignKey: 'article_id' });
