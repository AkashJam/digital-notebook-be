const router = require("express").Router();
const groupDAO = require("../dao/groupDAO");

router.get("/:id", async (req, res) => {
  const userID = req.params.id;
  console.log(userID)
  const response = await groupDAO.selectGroups(userID);
  res.json(response);
});

router.post("/add", async (req, res) => {
  const userID = req.body.id;
  const newGroup = req.body.group;
  const response = await groupDAO.createGroup(userID, newGroup);
  res.json(response);
});

router.post("/addUser", async (req, res) => {
  const groupID = req.body.id;
  const user = req.body.user;
  const response = await groupDAO.addUserGroup(groupID, user);
  res.json(response);
});

router.post("/update", async (req, res) => {
  const groupID = req.body.id;
  const updateValue = req.body.group;
  const response = await groupDAO.updateGroup(groupID, updateValue);
  res.json(response);
});

router.post("/updateUser", async (req, res) => {
  const groupID = req.body.id;
  const user = req.body.user;
  const group = req.body.group;
  const response = await groupDAO.updateUserGroup(groupID, user, group);
  res.json(response);
});


module.exports = router;
