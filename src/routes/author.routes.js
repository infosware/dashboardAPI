import AuthorController from '../controllers/author.controller';

module.exports = [
  {
    path: '/api/authors',
    method: 'GET',
    handler: AuthorController.findAll,
  },
  {
    path: '/api/authors/{id}',
    method: 'GET',
    handler: AuthorController.findByPk,
  },
  {
    path: '/api/authors',
    method: 'POST',
    handler: AuthorController.create,
  },
  {
    path: '/api/authors/{id}',
    method: 'PUT',
    handler: AuthorController.update,
  },
  {
    path: '/api/authors/{id}',
    method: 'DELETE',
    handler: AuthorController.delete,
  },
];
