// 1. Build an API to let clients perform CRUD operations on `users` and `posts`.
// 1. Add an endpoint to retrieve the list of `posts` for a `user`.
// 1. Write custom `middleware` to ensure that the user's `name` is upper-cased before the request reaches the `POST` or `PUT` _route handlers_.
// 1. Use `Express Routers` to organize the endpoints. You can optionally move and rename `postDb.js` and `userDb.js` to place it next to the corresponding router.

const express = require("express");

const Posts = require('../data/helpers/postDb.js');

const router = express.Router();

// Schema:
//   "id": 14,
//   "text": "Is it secret?! Is it safe?!",
//   "user_id": 5

// Crud
router.post('/', async (req, res) => {
  const { user_id, text } = req.body;
  
  if ( !user_id || !text ) {

    res.status(400).json({
     errorMessage: "Please provide text for the post."
   })

  } else {

    try {
      const post = await Posts.insert({ user_id, text });
      res.status(201).json(post);
    } catch(error) {
      res.status(500).json({
        error: "There was an error while saving the post to the database."
      });
    }

  }
});


// cRud
router.get('/', async (req, res) => {

  try {
    const posts = await Posts.get();

    res.status(200).json(posts);

  } catch(error) {
    res.status(500).json({ 
      error: "The posts could not be retrieved."
    });
  }
});

// cRud
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const post = await Posts.getById(id);

    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        error: "The post could not be found."
      });
    }

  } catch(error) {
    res.status(500).json({
      error: "Error retrieving post."
    });
  }
});


// crUd
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { user_id, text } = req.body;
  
  if ( !user_id || !text ) {

    res.status(400).json({
     errorMessage: "Please provide title and contents for the post."
    })
  } else {

    try {
      const update = await Posts.update(id, { user_id, text });

      if (update > 0) {
        const post = await Posts.getById(id);
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: "The post with the specified ID does not exist."
        });
      }

    } catch(error) {
      res.status(500).json({
        error: "The post information could not be modified."
      })
    }

  }
});

// cruD
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPost = await Posts.getById(id);

    if (deletedPost) {

      try {
        const postDeletion = await Posts.remove(id);

        postDeletion
        ? res.status(206).json(deletedPost)
        : res.status(500).json({ error: "The post could not be removed." })

      } catch {
        res.status(500).json({
          error: "The post could not be removed."
        })
      }

    } else {
      res.status(404).json({
        message: "The post with the specified ID does not exist."
      })
    }

  } catch(error) {
    res.status(500).json({
      error: "Error while finding the post."
    })
  }

});

module.exports = router;