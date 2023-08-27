const express = require("express");
const bodyParser = require("body-parser");
const personRoutes = require("./routes/personRoutes.js");
const sequelize = require("./database/database.js");

const app = express();
const PORT = process.env.PORT || 5001;
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

sequelize.sync().then(() => {
    console.log("Database synced");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
});

app.use('/api/person', personRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

