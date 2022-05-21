const { from } = require("../DB/connection");
const database = require("../DB/connection");

module.exports = {
  selectTasks: async (id) => {
    try {
      const userdata = await database.select().where("id", id).from("users");
      if (userdata.length !== 0 && userdata[0].active) {
        console.log(userdata[0]);
        const groupdata = await database("groups")
          .join("user_groups", "groups.id", "=", "user_groups.group_id")
          .select("groups.id", "groups.name")
          .where("user_groups.user_id", userdata[0].id);
        console.log("groupdata", groupdata);
        const groups = groupdata.map((group) => group.id);
        console.log("groups", groups);
        const taskdata = await database("tasks")
          .join("group_tasks", "tasks.id", "=", "group_tasks.task_id")
          .select(
            "tasks.id",
            "group_tasks.group_id",
            "tasks.description",
            "tasks.datetime",
            "tasks.location",
            "tasks.notify",
            "tasks.completed",
            "tasks.archived",
          )
          .where((builder) => builder.whereIn("group_tasks.group_id", groups));
        console.log("taskdata", taskdata);
        return {
          groups: groupdata,
          activities: taskdata,
        };
      } else return { status: "User non-existant" };
    } catch (error) {
      console.log(error);
      return { status: "Database error", code: 500 };
    }
  },

  createTask: async (id, task) => {
    try {
      console.log("Checking for group in db");
      const groupdata = await database.select().where("id", id).from("groups");
      if (groupdata.length === 0 && groupdata[0].active)
        return { status: "Group non-existant", code: 404 };
      const taskID = await database.insert(task, "id").into("tasks");
      const group_task = { task_id: taskID[0].id, group_id: id };
      await database.insert(group_task, "id").into("group_tasks");
      console.log("Successfully added to db");
      return {
        id: taskID[0].id,
        status: "Task created successful",
        code: 200,
      };
    } catch (error) {
      console.log(error);
      return { status: "Database error", code: 500 };
    }
  },

  updateTask: async (id, value) => {
    try {
      const taskdata = await database.select().where("id", id).from("tasks");
      if (taskdata.length === 0 && taskdata[0].active)
        return { status: "Task non-existant", code: 404 };
      await database("tasks").where("id", id).update({...value, "modified_on": new Date()});
      return { status: "Task updated successful", code: 200 };
    } catch (error) {
      console.log(error);
      return { status: "Database error", code: 500 };
    }
  },

  updateGroupTask: async (id, value) => {
    try {
      const taskdata = await database.select().where("id", id).from("tasks");
      if (taskdata.length === 0 && taskdata[0].active)
        return { status: "Task non-existant", code: 404 };
      await database("group_tasks").where("task_id", id).update({...value, "modified_on": new Date()});
      return { status: "Group changed successful", code: 200 };
    } catch (error) {
      console.log(error);
      return { status: "Database error", code: 500 };
    }
  },
};
