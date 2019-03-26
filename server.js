const express = require('express');
const cors = require('cors');

const postsRouter = require('./routers/posts-router.js')
const usersRouter = require('./routers/users-router.js')

const server = express();

const punctilious = (req,res,next) => {
  let { name } = req.body;

  if (!name) {
    console.log("Nameless.")
    next();
  } else {
    if (name.charAt(0).search(/a-z/)) {
      let capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
      req.body.name = capitalizedName;
      console.log(req.body);
      next();
    } else {
      next();
    }
  }
};

server.use(express.json());
server.use(cors());
server.use(punctilious);

server.use('/api/posts', postsRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.send(`
    <h1>Are you ready to POST?</h1>
  `);
});

module.exports = server;