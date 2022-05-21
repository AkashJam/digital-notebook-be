const router = require("express").Router();
const taskDAO = require("../dao/taskDAO");

router.get("/:id", async (req, res) => {
  const userID = req.params.id;
  const response = await taskDAO.selectTasks(userID);
  res.json(response);
});

router.post("/add", async (req, res) => {
  const groupID = req.body.id;
  const newTask = req.body.task;
  console.log(groupID, newTask);
  const response = await taskDAO.createTask(groupID, newTask);
  res.json(response);
});

router.post("/update", async (req, res) => {
  console.log(req.body);
  const taskID = req.body.id;
  const updateValue = req.body.task;
  const response =
    updateValue.group_id != undefined
      ? await taskDAO.updateGroupTask(taskID, updateValue)
      : await taskDAO.updateTask(taskID, updateValue);
  res.json(response);
});

module.exports = router;
