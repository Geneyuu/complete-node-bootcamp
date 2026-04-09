const fs = require('fs');
const path = require('path');

// Load tours data (ilipat dito)
const tours = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../dev-data/data/tours-simple.json')),
);

// Helper function (ilipat dito)
const saveToursToFile = (callback) => {
  fs.writeFile(
    path.join(__dirname, '../dev-data/data/tours-simple.json'),
    JSON.stringify(tours, null, 2),
    callback,
  );
};

// GET all tours
exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: { tours },
  });
};

// GET single tour
exports.getTour = (req, res) => {
  const id = Number(req.params.id);
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
};

// POST new tour
exports.createTour = (req, res) => {
  const newId = tours.length ? tours[tours.length - 1].id + 1 : 1;
  const newTour = { id: newId, ...req.body };
  tours.push(newTour);

  saveToursToFile((err) => {
    if (err) {
      return res.status(500).json({
        status: 'error',
        message: 'Could not save tour',
      });
    }
    res.status(201).json({
      status: 'success',
      data: { tour: newTour },
    });
  });
};

// PATCH update tour
exports.updateTour = (req, res) => {
  const id = Number(req.params.id);
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: `Tour with ID ${id} not found`,
    });
  }

  Object.assign(tour, req.body);

  saveToursToFile((err) => {
    if (err) {
      return res.status(500).json({
        status: 'error',
        message: 'Could not save tour',
      });
    }
    res.status(200).json({
      status: 'success',
      message: `Successfully patched the tour ${id}`,
      data: { tour },
    });
  });
};

// DELETE tour
exports.deleteTour = (req, res) => {
  const id = Number(req.params.id);
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: `No tour found with ID ${id}`,
    });
  }

  const index = tours.findIndex((el) => el.id === id);
  tours.splice(index, 1);

  saveToursToFile((err) => {
    if (err) {
      return res.status(500).json({
        status: 'error',
        message: 'Database save failed',
      });
    }
    res.status(200).json({
      status: 'success',
      message: `Tour with ID ${id} deleted successfully`,
      data: {
        deletedTour: {
          id: tour.id,
          name: tour.name,
          deletedAt: new Date().toISOString(),
        },
      },
    });
  });
};
