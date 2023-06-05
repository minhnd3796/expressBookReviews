const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username, "password":password});
      return res.status(200).json({message: "Customer successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "Customer already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

const getBooks = async (res) => {
    try {
        await res.send(books);
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    getBooks(res);
});

var getISBN = function(isbn) {
    return new Promise((resolve, reject) => {
        try {
            book = books[isbn];
            resolve(book);
        } catch {err} {
            reject(err)
        }
    })
};

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  getISBN(isbn).then(
      (book) => res.send(book),
      (err) => console.log("Cannot find book.")
  );
});

const getAuthor = async (req, res) => {
    try {
        const author = req.params.author;
        const book_values = Object.values(books);
        let filtered_books = book_values.filter((book) => book.author === author);
        await res.send(filtered_books);
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    getAuthor(req, res);
});

const getTitle = async (req, res) => {
    try {
        const title = req.params.title;
        const book_values = Object.values(books);
        let filtered_books = book_values.filter((book) => book.title === title);
        await res.send(filtered_books);
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    getTitle(req, res);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  let reviews = books[isbn].reviews;
  res.send(reviews);
});

module.exports.general = public_users;
