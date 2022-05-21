const { from } = require("../DB/connection");
const database = require("../DB/connection");
const user_group = {
  user_id: 0,
  group_id: 0,
  owner: true,
  maintainer: false,
  reviewer: false,
};

module.exports = {
  selectUser: async (user) => {
    try {
      console.log(user);
      const userdata = await database
        .select()
        .where({
          username: user.username,
        })
        .from("users");
      console.log(userdata[0]);
      if (userdata.length === 0 || !userdata[0].active)
        return { status: "User non-existant", code: 404 };
      if (userdata[0].password !== user.password)
        return { status: "Wrong username or password", code: 406 };
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
          "tasks.archived"
        )
        .where((builder) => builder.whereIn("group_tasks.group_id", groups));
      console.log("taskdata", taskdata);
      return {
        id: userdata[0].id,
        username: userdata[0].username,
        displayName: userdata[0].display_name,
        range: userdata[0].range,
        collaborators: [],
        groups: groupdata,
        activities: taskdata,
        status: "User found successful",
        code: 200,
      };
    } catch (error) {
      console.log(error);
      return { status: "Database error", code: 500 };
    }
  },

  createUser: async (user) => {
    try {
      console.log("trying to access db");
      const userdata = await database
        .select()
        .where("username", user.username)
        .from("users");
      if (userdata.length !== 0)
        return { status: "Username already exists", code: 406 };
      const userID = await database.insert(user, "id").into("users");
      const groupID = await database
        .insert({ name: "All" }, "id")
        .into("groups");
      user_group.group_id = groupID[0].id;
      user_group.user_id = userID[0].id;
      await database.insert(user_group).into("user_groups");
      console.log("Successfully added to db");
      return {
        id: userID[0].id,
        status: "User created successful",
        code: 200,
      };
    } catch (error) {
      return { status: "Database error", code: 500 };
    }
  },

  updateUser: async (id, value) => {
    try {
      const userdata = await database.select().where("id", id).from("users");
      if (userdata.length === 0 && userdata[0].active)
        return { status: "User non-existant", code: 404 };
      await database("users").where("id", id).update({...value, "modified_on": new Date()});
      return { status: "User updated successful", code: 200 };
    } catch (error) {
      return { status: "Database error", code: 500 };
    }
  },
};
