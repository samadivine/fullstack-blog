const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const authRoute = require("./route/auth");
const UserRoute = require("./route/users");
const PostRoute = require("./route/posts");
const CategoriesRoute = require("./route/categories");
const multer = require("multer");
const path = require("path");

dotenv.config();

const app = express();
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));

mongoose
  .connect(process.env.MONGO_DB_URL)
  .then((result) => {
    app.listen(process.env.PORT || 5000, () => {
      console.log("App started");
    });
  })
  .catch((err) => {
    console.log(err);
  });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("file has been uploaded");
});

app.use("/api/auth", authRoute);
app.use("/api/users", UserRoute);
app.use("/api/posts", PostRoute);
app.use("/api/categories", CategoriesRoute);
