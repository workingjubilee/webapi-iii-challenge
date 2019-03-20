// 1. Build an API to let clients perform CRUD operations on `users` and `posts`.
// 1. Add an endpoint to retrieve the list of `posts` for a `user`.
// 1. Write custom `middleware` to ensure that the user's `name` is upper-cased before the request reaches the `POST` or `PUT` _route handlers_.
// 1. Use `Express Routers` to organize the endpoints. You can optionally move and rename `postDb.js` and `userDb.js` to place it next to the corresponding router.

const express = require("express");

const Users = require('../data/helpers/userDb.js');

const router = express.Router();

// cRud
router.get('/', async (req, res) => {

  try {
    const posts = await Posts.find();

    res.status(200).json(posts);

  } catch(error) {
    res.status(500).json({ 
      error: "The posts could not be retrieved."
    });
  }
});


module.exports = router;