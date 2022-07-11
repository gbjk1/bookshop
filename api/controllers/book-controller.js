const model = require("../models/book-model");

class BookController {
    static MANDATORY = ["title", "cover", "price", "description", "isbn"];

    getCategories(req, res) {
        res.send(model.getCategories());
    }

    getCategoryBooks(req, res) {
        res.send(model.getBooks(req.params.category));
    }

    getBook(req, res) {
        const book = model.getBook(req.params.id);
        if (book) {
            res.send(book);
        } else {
            res.status(404).send(`Book with id ${req.params.id} not found.`);
        }
    }

    checkBookProperties(res, book, id) {
        let result = true;

        const mandatoryNames = [...BookController.MANDATORY];

        if (id) {
            mandatoryNames.push("id");
        }

        const containedNames = mandatoryNames.filter(c => c in book);
        if (containedNames.length < mandatoryNames.length) {
            const necessary = mandatoryNames.join(", ");
            const contained = containedNames.length === 0 ? "none of those" : "only " + containedNames.join(", ");
            res.status(400).send(`Book data must include ${necessary}, but ${contained} present.`);
            result = false;
        }

        // If id given, check if it matches the one in the book
        if (id && result) {
            if (book.id !== id) {
                res.status(400).send(`Book data can only be updated if the id in the path (${id}) and the id in the body (${book.id}) match.`);
                result = false;
            }
        }

        return result;
    }

    createBook = (req, res) => {
        //Add the book given in the request to the model
        const categoryString = req.params.category;

        const book = req.body;

        try {
            const category = model.resolveCategory(categoryString);

            if(this.checkBookProperties(res, book)) {
                res.send(model.createBook(category, book));
            }
        } catch (error) {
            res.status(404).send('Category does not exist, book cannot be created.')
        }
    }

    updateBook = (req, res) => {
        //Add the book given in the request to the model
        const id = parseInt(req.params.id);

        if(!model.getBook(id)) {
            res.status(404).send('This book does not exist.');
        } else {
            const book = req.body;
            if(this.checkBookProperties(res, book, id)) {
                model.updateBook(id, book);
                res.sendStatus(200);
            }
        }
    }

    deleteBook(req, res) {
        //Delete the given book from the model
        const id = parseInt(req.params.id);

        if (!model.getBook(id)) {
            res.status(404).send('This book does not exist.');
        } else {
            model.deleteBook(id);
            res.sendStatus(204);
        }
    }
}

module.exports = new BookController();
