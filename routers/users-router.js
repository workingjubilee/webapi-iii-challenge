// 1. Build an API to let clients perform CRUD operations on `users` and `posts`.
// 1. Add an endpoint to retrieve the list of `posts` for a `user`.
// 1. Write custom `middleware` to ensure that the user's `name` is upper-cased before the request reaches the `POST` or `PUT` _route handlers_.
// 1. Use `Express Routers` to organize the endpoints. You can optionally move and rename `postDb.js` and `userDb.js` to place it next to the corresponding router.

const express = require("express");

const Users = require('../data/helpers/userDb.js');

const router = express.Router();

// Schema:
//   "id": 1, //generated
//   "name": "Frodo Baggins" //required


// Crud
router.post('/', async (req, res) => {
  const { name } = req.body;
  
  if ( !name ) {
    res.status(400).json({
     errorMessage: "Please provide a name for the user."
   })
  } else {

    try {
      const user = await Users.insert({ name });

      res.status(201).json(user);
    } catch(error) {
      res.status(500).json({
        error: "There was an error while saving the user to the database."
      });
    }

  }
});

// cRud
router.get('/', async (req, res) => {

  try {
    const users = await Users.get();

    res.status(200).json(users);

  } catch(error) {
    res.status(500).json({ 
      error: "The users could not be retrieved."
    });
  }
});

// cRud
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const user = await Users.getById(id);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({
        error: "The user could not be found."
      });
    }

  } catch(error) {
    res.status(500).json({
      error: "Error retrieving user."
    });
  }
});

// crUd
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  
  if ( !name ) {

    res.status(400).json({
     errorMessage: "Please provide title and contents for the user."
    })
  } else {

    try {
      const update = await Users.update(id, { name });

      if (update > 0) {
        const user = await Users.getById(id);
        res.status(200).json(user);
      } else {
        res.status(404).json({
          message: "The user with the specified ID does not exist."
        });
      }

    } catch(error) {
      res.status(500).json({
        error: "The user information could not be modified."
      })
    }

  }
});

// cruD
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await Users.getById(id);

    if (deletedUser.id > 0) {

      try {
        const userDeletion = await Users.remove(id);

        userDeletion
        ? res.status(206).json(deletedUser)
        : res.status(500).json({ error: "The user could not be removed." })

      } catch {

        res.status(500).json({
          error: "The user could not be removed."
        })
      }

    } else {
      res.status(404).json({
        message: "The user with the specified ID does not exist."
      })
    }

  } catch(error) {
    res.status(500).json({
      error: "Error while finding the user."
    })
  }

});

// other methods to implement: 
//   .getById(id)
//   .getUserPosts(userId)
//   .insert({user})
//   .update(id, {user})
//   .remove(id)


module.exports = router;