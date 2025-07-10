const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://pavan:pavan123@cluster0.1x8opxh.mongodb.net/auth?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to Database");
});