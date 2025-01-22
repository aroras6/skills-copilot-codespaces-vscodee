// Create web server
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');
const { connect } = require('./db');

app.use(bodyParser.json());

// Create a new comment
app.post('/comments', async (req, res) => {
  const { postId, author, text } = req.body;
  const db = await connect();
  const result = await db.collection('comments').insertOne({ postId, author, text });
  res.json(result.ops[0]);
});

// Get all comments for a specific post
app.get('/comments/:postId', async (req, res) => {
  const postId = req.params.postId;
  const db = await connect();
  const comments = await db.collection('comments').find({ postId }).toArray();
  res.json(comments);
});

// Update a comment
app.put('/comments/:id', async (req, res) => {
  const id = req.params.id;
  const { author, text } = req.body;
  const db = await connect();
  const result = await db.collection('comments').findOneAndUpdate(
    { _id: ObjectId(id) },
    { $set: { author, text } },
    { returnOriginal: false }
  );
  res.json(result.value);
});
