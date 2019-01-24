const express = require('express');
const {MongoClient} = require('mongodb');
const debug = require('debug')('app:adminRoutes');

const adminRouter = express.Router();

function router(nav) {
    const books = [
    {
        title: 'War and Peace',
        genre: 'Historical Fiction',
        author: 'Lev Nikolayevich Tolstoy',
        bookId: 656 ,
        read: false
    },
    {
        title: 'Les Misérbles',
        genre: 'Historical Fiction',
        author: 'Victor Hugo',
        bookId: 24280,
        read: false
    },
    {
        title: 'The Wind in the Willows',
        genre: 'Fantasy',
        author: 'Kenneth Grahame',
        read: false
    },
    {
        title: 'Life on The Mississippi',
        genre: 'History',
        author: 'Mark Twain',
        read: false
    },
    {
        title: 'Childhood',
        genre: 'Biography',
        author: 'Lev Nikolayevich Tolstoy',
        read: false
    }
];

    adminRouter.route('/')
    .get((req, res) => {
        const url = 'mongodb://localhost:27017';
        const dbName = 'LibraryApp';

        (async function mongo(){
            let client;
            try {
                client = await MongoClient.connect(url);
                debug('Connected correctly to server')

                const db = client.db(dbName);

                const response = await db.collection('books').insertMany(books);
                res.json(response);
            }
            catch(err) {
                debug(err.stack);
            }

            client.close();
        }())
    });

    return adminRouter;
}

module.exports = router;