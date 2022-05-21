const router = require("express").Router();
const userDAO = require("../dao/userDAO");

router.post("/login", async (req, res) => {
  const user = req.body;
  const response = await userDAO.selectUser(user);
  res.json(response);
});

router.post("/register", async (req, res) => {
  const newUser = req.body;
  const response = await userDAO.createUser(newUser);
  res.json(response);
});

router.post("/update", async (req, res) => {
  const userID = req.body.id;
  const updateValue = req.body.user;
  const response = await userDAO.updateUser(userID, updateValue);
  res.json(response);
});

module.exports = router;
