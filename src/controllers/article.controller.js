/* eslint-disable function-paren-newline */
/* eslint-disable camelcase */
/* eslint-disable object-curly-newline */
import Boom from '@hapi/boom';
import Joi from '@hapi/joi';
import { Op } from 'sequelize';
import Author from '../models/Author';
import Article from '../models/Article';
import searchBy from '../utils/searchBy';
import paginate from '../utils/paginate';
import orderBy from '../utils/orderBy';

const articleSchema = Joi.object({
  title: Joi.string().required(),
  text: Joi.string().required(),
  author: Joi.number().integer().required(),
  publication_date: Joi.date().required(),
});

export default class ArticleController {
  static async findAll (request, h) {
    const searchByTerm = searchBy(request.query);
    const paginationOptions = paginate(request.query);
    const orderByOptions = orderBy(request.query);

    const whereClause = searchByTerm === null ? {} : {
      [Op.or]: [
        { title: { [Op.iLike]: searchByTerm } },
      ],
    };

    try {
      const articlesInfo = await Article.findAndCountAll({
        where: whereClause,
        ...paginationOptions,
        include: [ Author ],
        order: [ orderByOptions ],
      });

      return h.response(articlesInfo);
    } catch (err) {
      return Boom.badRequest(err);
    }
  }

  static async findByPk (request, h) {
    const articleId = Number.parseInt(request.params.id, 10);

    if (Number.isNaN(articleId)) {
      return Boom.badRequest('Article Id is not a number');
    }

    try {
      const article = await Article.findByPk(articleId, { include: [ Author ] });

      return h.response(article);
    } catch (err) {
      return Boom.badRequest(err);
    }
  }

  static async create (request, h) {
    const { title, text, author, publication_date } = request.payload;

    // do validation with Joi
    const { error } = articleSchema.validate({
      title,
      text,
      author,
      publication_date,
    });

    if (error) {
      return Boom.badRequest(error);
    }

    try {
      const newArticle = await Article.create({
        title,
        text,
        author,
        publication_date,
      });

      return h.response(newArticle).code(201);
    } catch (err) {
      return Boom.badRequest(err);
    }
  }

  static async update (request, h) {
    const { title, text, author, publication_date } = request.payload;
    const articleId = Number.parseInt(request.params.id, 10);

    if (Number.isNaN(articleId)) {
      return Boom.badRequest('Article Id is not a number');
    }

    // do validation with Joi
    const { error } = articleSchema.validate({
      title,
      text,
      author,
      publication_date,
    });

    if (error) {
      return Boom.badRequest(error);
    }

    try {
      await Article.update({
        title,
        text,
        author,
        publication_date,
      },
      {
        where: { id: articleId },
      });

      return h.response().code(204);
    } catch (err) {
      return Boom.internal(err);
    }
  }

  static async delete (request, h) {
    const articleId = Number.parseInt(request.params.id, 10);

    if (Number.isNaN(articleId)) {
      return Boom.badRequest('Article Id is not a number');
    }

    try {
      const article = await Article.findByPk(articleId);

      if (!article) {
        return Boom.badRequest('Article not found for deletion');
      }

      await article.destroy();

      return h.response().code(204);
    } catch (err) {
      return Boom.internal(err);
    }
  }
}
