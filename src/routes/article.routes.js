import ArticleController from '../controllers/article.controller';

module.exports = [
  {
    path: '/api/articles',
    method: 'GET',
    handler: ArticleController.findAll,
  },
  {
    path: '/api/articles/{id}',
    method: 'GET',
    handler: ArticleController.findByPk,
  },
  {
    path: '/api/articles',
    method: 'POST',
    handler: ArticleController.create,
  },
  {
    path: '/api/articles/{id}',
    method: 'PUT',
    handler: ArticleController.update,
  },
  {
    path: '/api/articles/{id}',
    method: 'DELETE',
    handler: ArticleController.delete,
  },
];
