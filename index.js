const express = require ('express');
const server = express();
const postRoutes = require('./posts/postRoutes');

server.use(express.json());
server.use ('/api/posts', postRoutes);


server.listen(8000, () => console.log('API running on port 8000'));