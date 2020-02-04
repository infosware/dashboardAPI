/* eslint-disable function-paren-newline */
/* eslint-disable object-curly-newline */
import Boom from '@hapi/boom';
import Joi from '@hapi/joi';
import { Op } from 'sequelize';
import Author from '../models/Author';
import Article from '../models/Article';
import searchBy from '../utils/searchBy';
import paginate from '../utils/paginate';
import orderBy from '../utils/orderBy';

const authorSchema = Joi.object({
  name: Joi.string().required(),
  age: Joi.number().integer().required(),
  email: Joi.string().email().required(),
  country: Joi.string().required(),
});

export default class AuthorController {
  static async findAll (request, h) {
    const searchByTerm = searchBy(request.query);
    const paginationOptions = paginate(request.query);
    const orderByOptions = orderBy(request.query);

    const whereClause = searchByTerm === null ? {} : {
      [Op.or]: [
        { name: { [Op.iLike]: searchByTerm } },
        { email: { [Op.iLike]: searchByTerm } },
      ],
    };

    try {
      const authorsInfo = await Author.findAndCountAll({
        where: whereClause,
        ...paginationOptions,
        order: [ orderByOptions ],
      });

      return h.response(authorsInfo);
    } catch (err) {
      return Boom.badRequest(err);
    }
  }

  static async findByPk (request, h) {
    const authorId = Number.parseInt(request.params.id, 10);

    if (Number.isNaN(authorId)) {
      return Boom.badRequest('Author Id is not a number');
    }

    try {
      const author = await Author.findByPk(authorId);

      return h.response(author);
    } catch (err) {
      return Boom.badRequest(err);
    }
  }

  static async create (request, h) {
    const { name, age, email, country } = request.payload;

    // do validation with Joi
    const { error } = authorSchema.validate({
      name,
      age,
      email,
      country,
    });

    if (error) {
      return Boom.badRequest(error);
    }

    try {
      const newAuthor = await Author.create({ name, age, email, country });

      return h.response(newAuthor).code(201);
    } catch (err) {
      return Boom.internal(err);
    }
  }

  static async update (request, h) {
    const { name, age, email, country } = request.payload;
    const authorId = Number.parseInt(request.params.id, 10);

    if (Number.isNaN(authorId)) {
      return Boom.badRequest('Author Id is not a number');
    }

    // do validation with Joi
    const { error } = authorSchema.validate({
      name,
      age,
      email,
      country,
    });

    if (error) {
      return Boom.badRequest(error);
    }

    try {
      await Author.update({
        name,
        age,
        email,
        country,
      },
      {
        where: { id: authorId },
      });

      return h.response().code(204);
    } catch (err) {
      return Boom.internal(err);
    }
  }

  static async delete (request, h) {
    const authorId = Number.parseInt(request.params.id, 10);

    if (Number.isNaN(authorId)) {
      return Boom.badRequest('Author Id is not a number');
    }

    try {
      const author = await Author.findByPk(authorId);

      if (!author) {
        return Boom.badRequest('Author not found for deletion');
      }

      // Check for Articles of this author
      const linkedArticlesCount = await Article.count({ where: { author: authorId } });

      if (linkedArticlesCount > 0) {
        return Boom.badRequest('Author has published articles. Please delete them first.');
      }

      await author.destroy();

      return h.response().code(204);
    } catch (err) {
      return Boom.internal(err);
    }
  }
}
