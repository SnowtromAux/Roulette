// Import express
const express = require('express');
const path = require('path');

// Create an Express application
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  // Specify the path of the HTML file
  const filePath = path.join(__dirname, 'public' , '/views/index.html');
  
  // Send the HTML file as the response
  res.sendFile(filePath, (err) => {
    if (err) {
      console.log('Error sending the file:', err);
      res.status(500).send('Internal Server Error');
    }
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
