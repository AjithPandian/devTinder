const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Vanakam da mapla, Madurai la irundhu !!!");
});

app.use("/hello", (req, res) => {
  res.send("Hello from /hello route!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
