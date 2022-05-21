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
  selectGroups: async (id) => {
    try {
      const groupdata = await database("groups")
        .join("user_groups", "groups.id", "=", "user_groups.group_id")
        .select("groups.id", "name")
        .where("user_groups.user_id", id);
      if (groupdata.length === 0)
        return { status: "User non-existant", code: 404 };
      return groupdata;
    } catch (error) {
      return { status: "Database error", code: 500 };
    }
  },

  createGroup: async (id, group) => {
    try {
      console.log("Checking for user in db");
      const userdata = await database.select().where("id", id).from("users");
      if (userdata.length === 0 && userdata[0].active)
        return { status: "User non-existant", code: 404 };
      const groupID = await database.insert(group, "id").into("groups");
      user_group.user_id = id;
      user_group.group_id = groupID[0].id;
      await database.insert(user_group, "id").into("user_groups");
      console.log("Successfully added to db");
      return {
        id: groupID[0].id,
        status: "Group created successful",
        code: 200,
      };
    } catch (error) {
      return { status: "Database error", code: 500 };
    }
  },

  updateGroup: async (id, value) => {
    try {
      const groupdata = await database.select().where("id", id).from("groups");
      if (groupdata.length === 0 && groupdata[0].active)
        return { status: "Group non-existant", code: 404 };
      await database("groups").where("id", id).update({...value, "modified_on": new Date()});
      return { status: "Group updated successful", code: 200 };
    } catch (error) {
      return { status: "Database error", code: 500 };
    }
  },
};
