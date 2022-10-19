const mongoose = require("mongoose");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(require("./routes"));

mongoose.connect(
    //tells mongoose which db we want to connect to, and if doesn't exist, creates it
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/friends-again",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

// use this to log mongo queries being executed
mongoose.set("debug", true);

app.listen(PORT, () => console.log(`🌍 Connected on localhost:${PORT}`));
