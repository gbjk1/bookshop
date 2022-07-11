const { Router } = require('express');
const controller = require('../controllers/book-controller');

const routes = Router();

routes.get('/categories', controller.getCategories);
routes.get('/categories/:category/books', controller.getCategoryBooks);
routes.get('/books/:id', controller.getBook);
routes.post('/categories/:category/books', controller.createBook);
routes.put('/books/:id', controller.updateBook);
routes.delete('/books/:id', controller.deleteBook);


module.exports = routes;
