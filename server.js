const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');

dotenv.config();
const app = express();

// Middleware
app.use(cors({
  origin: 'https://todo-mern-jade-psi.vercel.app/', // The URL of your frontend
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
  app.listen(5000, () => {
    console.log('Server running on port 5000');
  });
}).catch((err) => console.log(err));
