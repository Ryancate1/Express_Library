const {MongoClient, ObjectID} = require('mongodb');
const debug = require('debug')('app:bookController');

function bookController(bookService, nav) {

    // Get List of Books
    function getIndex(req, res) {
        const url = 'mongodb://localhost:27017';
        const dbName = 'LibraryApp';

        (async function mongo() {
            let client;
            try {
                client = await MongoClient.connect(url);
                debug('Connected correctly to server')

                const db = client.db(dbName);

                const col = await db.collection('books');
                const books = await col.find().toArray();

                res.render('bookListView', {
                    title: 'Library',
                    nav,
                    books
                });
            } catch (err) {
                debug(err.stack);
            }

            client.close();
        }());
    }

    // Get Book from ID
    function getById(req, res) {

        const { id } = req.params;
        const url = 'mongodb://localhost:27017';
        const dbName = 'LibraryApp';

        (async function mongo() {
            let client;
            try {
                client = await MongoClient.connect(url);
                debug('Connected correctly to server')

                const db = client.db(dbName);
                const col = await db.collection('books');
                const book = await col.findOne({
                    _id: new ObjectID(id)
                });
                debug(book);

                book.details = await bookService.getBookById(book.bookId);

                res.render('bookView', {
                    title: 'Library',
                    nav,
                    book
                });
            } catch (err) {
                debug(err.stack);
            }
        }());

    }

    // Authenticates User
    function middleware(req, res, next) {
        if (req.user) {
            next();
        } else {
            res.redirect('/');
        }
    }

    return {
        getIndex,
        getById,
        middleware
    }

}

module.exports = bookController;