import WebsiteController from '../controllers/website.controller';

module.exports = [
  {
    path: '/api/websites',
    method: 'GET',
    handler: WebsiteController.findAll,
  },
  {
    path: '/api/websites/{id}',
    method: 'GET',
    handler: WebsiteController.findByPk,
  },
  {
    path: '/api/websites',
    method: 'POST',
    handler: WebsiteController.create,
  },
  {
    path: '/api/websites/{id}',
    method: 'PUT',
    handler: WebsiteController.update,
  },
  {
    path: '/api/websites/{id}',
    method: 'DELETE',
    handler: WebsiteController.delete,
  },
];
