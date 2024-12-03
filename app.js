const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'public' , '/views/index.html');
  
  res.sendFile(filePath, (err) => {
    if (err) {
      console.log('Error sending the file:', err);
      res.status(500).send('Internal Server Error');
    }
  });
});


const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on localhost:${PORT}`);
});
