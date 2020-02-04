/* eslint-disable camelcase */
/* eslint-disable function-paren-newline */
/* eslint-disable object-curly-newline */
import Boom from '@hapi/boom';
import Joi from '@hapi/joi';
import { Op } from 'sequelize';
import Website from '../models/Website';
import Article from '../models/Article';
import searchBy from '../utils/searchBy';
import paginate from '../utils/paginate';
import orderBy from '../utils/orderBy';

const websiteSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  url: Joi.string().uri().required(),
  visitors_count: Joi.number(),
});

export default class WebsiteController {
  static async findAll (request, h) {
    const searchByTerm = searchBy(request.query);
    const paginationOptions = paginate(request.query);
    const orderByOptions = orderBy(request.query);

    const whereClause = searchByTerm === null ? {} : {
      [Op.or]: [
        { title: { [Op.iLike]: searchByTerm } },
        { description: { [Op.iLike]: searchByTerm } },
      ],
    };

    try {
      const websitesInfo = await Website.findAndCountAll({
        where: whereClause,
        ...paginationOptions,
        order: [ orderByOptions ],
      });

      return h.response(websitesInfo);
    } catch (err) {
      return Boom.badRequest(err);
    }
  }

  static async findByPk (request, h) {
    const websiteId = Number.parseInt(request.params.id, 10);

    if (Number.isNaN(websiteId)) {
      return Boom.badRequest('Website Id is not a number');
    }

    try {
      const website = await Website.findByPk(websiteId, { include: [ Article ] });

      return h.response(website);
    } catch (err) {
      return Boom.badRequest(err);
    }
  }

  static async create (request, h) {
    const { title, description, url, visitors_count } = request.payload;

    // do validation with Joi
    const { error } = websiteSchema.validate({
      title,
      description,
      url,
      visitors_count,
    });

    if (error) {
      return Boom.badRequest(error);
    }

    try {
      const newWebsite = await Website.create({
        title,
        description,
        url,
        visitors_count,
      });

      return h.response(newWebsite).code(201);
    } catch (err) {
      return Boom.badRequest(err);
    }
  }

  static async update (request, h) {
    const { title, description, url, visitors_count } = request.payload;
    const websiteId = Number.parseInt(request.params.id, 10);

    if (Number.isNaN(websiteId)) {
      return Boom.badRequest('Website Id is not a number');
    }

    // do validation with Joi
    const { error } = websiteSchema.validate({
      title,
      description,
      url,
      visitors_count,
    });

    if (error) {
      return Boom.badRequest(error);
    }

    try {
      await Website.update({
        title,
        description,
        url,
        visitors_count,
      },
      {
        where: { id: websiteId },
      });

      return h.response().code(204);
    } catch (err) {
      return Boom.internal(err);
    }
  }

  static async delete (request, h) {
    const websiteId = Number.parseInt(request.params.id, 10);

    if (Number.isNaN(websiteId)) {
      return Boom.badRequest('Website Id is not a number');
    }

    try {
      const website = await Website.findByPk(websiteId);

      if (!website) {
        return Boom.badRequest('Website not found for deletion');
      }

      await website.destroy();

      return h.response().code(204);
    } catch (err) {
      return Boom.internal(err);
    }
  }
}
