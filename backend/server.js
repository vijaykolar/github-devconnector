const express = require("express");
const connectDB = require("./config/db");
const app = express();

const auth = require("./routes/api/auth");
const posts = require("./routes/api/posts");
const profile = require("./routes/api/profile");
const users = require("./routes/api/users");

connectDB();

app.use(express.json({ extented: false }));

app.use("/api/auth", auth);
app.use("/api/posts", posts);
app.use("/api/profile", profile);
app.use("/api/users", users);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`App is running at ${PORT}`));
