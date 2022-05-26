const express = require("express");
const mongoose = require("mongoose");
//require("dotenv").config();

const dotenv = require("dotenv");
dotenv.config({ path: '.env' });
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./routes");
const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 8000;
const URI = process.env.MONGO_URL;
mongoose.connect(
  URI,
  {
    useNewUrlParser: true,

    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("Connected to the mongo db");
  }
);

app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server is up and running on PORT ${PORT}`);
});
