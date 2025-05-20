const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const PORT = 5000;


app.use(cors());
app.use(bodyParser.json());


app.post('/api/users', (req, res) => {
  const { name, phone, email, cost_price, selling_price } = req.body;

  
  if (!name || !phone || !email || cost_price == null || selling_price == null) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  const profit = selling_price - cost_price;

  const sql = 'INSERT INTO users (name, phone, email, cost_price, selling_price, profit) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [name, phone, email, cost_price, selling_price, profit], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).json({ error: 'Server error while inserting user' });
    }
    res.status(201).json({ message: 'User added successfully' });
  });
});


app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: 'Server error while fetching users' });
    }
    res.json(results);
  });
});

app.get('/api/users/check-exist', (req, res) => {
  const { phone, email } = req.query;

  if (!phone && !email) {
    return res.status(400).json({ error: 'Provide phone or email to check' });
  }

  let phoneExists = false;
  let emailExists = false;

  const checkPhone = phone
    ? new Promise((resolve, reject) => {
        db.query('SELECT 1 FROM users WHERE phone = ? LIMIT 1', [phone], (err, results) => {
          if (err) return reject(err);
          phoneExists = results.length > 0;
          resolve();
        });
      })
    : Promise.resolve();

  const checkEmail = email
    ? new Promise((resolve, reject) => {
        db.query('SELECT 1 FROM users WHERE email = ? LIMIT 1', [email], (err, results) => {
          if (err) return reject(err);
          emailExists = results.length > 0;
          resolve();
        });
      })
    : Promise.resolve();

  Promise.all([checkPhone, checkEmail])
    .then(() => {
      res.json({
        exists: phoneExists || emailExists,
        phoneExists,
        emailExists,
      });
    })
    .catch((err) => {
      console.error('Error checking user existence:', err);
      res.status(500).json({ error: 'Server error while checking existence' });
    });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
