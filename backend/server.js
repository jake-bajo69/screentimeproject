const path = require('path')
const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT || 5000
const app = express();
app.use(cors())

connectDB()

app.use('/api/apps', require('./routes/appRoutes'))

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')))
  
    app.get('*', (req, res) =>
      res.sendFile(
        path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
      )
    )
} else {
    app.get('/', (req, res) => res.send('Please set to production'))
}

const server = app.listen(port, function() {
    console.log(`Server started on port ${port}`)
})

io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:3000",
      // credentials: true,
    },
  });

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
  
    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id);
    });
});
