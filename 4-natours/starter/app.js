const fs = require('fs');
const express = require('express');

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Load tours from JSON file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`),
);

//  GET all tours
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
  const id = Number(req.params.id); // convert string to number

  // hanapin yung tour na may same id
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found',
    });
  }

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

// POST new tour
app.post('/api/v1/tours', (req, res) => {
  console.log('BODY:', req.body);
  console.log('HEADERS:', req.headers);

  // Create new ID
  const newId = tours.length ? tours[tours.length - 1].id + 1 : 1;

  // Merge ID with request body
  const newTour = { id: newId, ...req.body };

  // Add to tours array
  tours.push(newTour);

  // Write updated tours to JSON file
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours, null, 2), //  convert array to JSON string
    (err) => {
      if (err) {
        return res
          .status(500)
          .json({ status: 'error', message: 'Could not save tour' });
      }

      // Send response AFTER file is written
      res.status(201).json({
        status: 'success',
        data: { tour: newTour },
      });
    },
  );
});

//  404 handler (always last)
app.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Route ${req.originalUrl} not found`,
  });
});

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`App running on ${port}...`);
});
