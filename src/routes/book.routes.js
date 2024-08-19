const express = require('express');
const Book = require('../models/book.model');
const router = express.Router();

//MIDDLEWARE:
const getBook = async (req, res, next) => {
    const { bookId } = req.params;

    // Validación del formato del ID
    if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json({ message: 'El ID del libro no es válido.' });
    }

    try {
        // Búsqueda del libro en la base de datos
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Libro no encontrado.' });
        }

        // Almacenar el libro en `res` para usarlo en la siguiente middleware
        res.book = book;
        next();
    } catch (error) {
        // Manejo de errores del servidor
        return res.status(500).json({ message: error.message });
    }
};

//.get() Obtener todos los libros:
router.get('/', async (req, res) => {
    try {
        const books = await Book.find({});
        console.log('GET ALL', books)
        if (books.length === 0) {
            return res.status(204).json([]);
        }
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//.post() Crear un nuevo libro:
router.post('/', async (req, res) => {
    const {title, author, publicationYear, genre, pages, price} = req?.body;
    if (!title || !author || !publicationYear || !genre || !pages || !price) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publicationYear: req.body.publicationYear,
        genre: req.body.genre,
        pages: req.body.pages,
        price: req.body.price,
    });

    try {
        const newBook = await book.save();
        console.log('POST', newBook)
        res.status(201).json(newBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//.get() Obtener un libro por ID:
router.get('/:bookId', getBook, async function (req, res) {
    res.json(res.book);
});

//.put() Actualizar un libro por ID:
router.put('/:bookId', getBook, async (req, res) => {
    const {title, author, publicationYear, genre, pages, price} = req?.body;
    if (!title ||!author ||!publicationYear ||!genre ||!pages ||!price) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    res.book.title = req.body.title;
    res.book.author = req.body.author;
    res.book.publicationYear = req.body.publicationYear;
    res.book.genre = req.body.genre;
    res.book.pages = req.body.pages;
    res.book.price = req.body.price;

    try {
        const updatedBook = await res.book.save();
        console.log('PUT', updatedBook)
        res.json(updatedBook)
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//.patch() Actualizar parcialmente un libro por ID:
router.patch('/:bookId', getBook, async (req, res) => {
    if(!req.body.title && !req.body.author && !req.body.publicationYear && !req.body.genre && !req.body.pages && !req.body.price) {
        return res.status(400).json({ message: 'Ningún campo a actualizar.' });
    }

    const {title, author, publicationYear, genre, pages, price} = req?.body;

    if (title) res.book.title = title;
    if (author) res.book.author = author;
    if (publicationYear) res.book.publicationYear = publicationYear;
    if (genre) res.book.genre = genre;
    if (pages) res.book.pages = pages;
    if (price) res.book.price = price;

    try {
        const updatedBook = await res.book.save();
        console.log('PATCH', updatedBook)
        res.json(updatedBook)
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//.delete() Eliminar un libro por ID:
router.delete('/:bookId', getBook, async (req, res) => {
    try {
        const book = res.book
        await book.deleteOne();
        console.log('DELETE', book)
        res.json({ message: 'Libro eliminado exitosamente.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Exportar el router
module.exports = router
