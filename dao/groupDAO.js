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
      const userdata = await database("users")
        .join("user_groups", "users.id", "=", "user_groups.user_id")
        .select("username", "owner")
        .where("user_groups.group_id", id)
        .andWhere("user_groups.active", true);
      if (userdata.length === 0)
        return { status: "User non-existant", code: 404 };
      console.log(userdata);
      return { status: "Users found", code: 200, user: userdata };
    } catch (error) {
      return { status: "Database error", code: 500 };
    }
  },

  addUserGroup: async (id, user) => {
    try {
      const userdata = await database
        .select()
        .where({ ...user, active: true })
        .from("users");
      if (userdata.length === 0)
        return { status: "User non-existant", code: 404 };
      const groupdata = await database
        .select()
        .where({ user_id: userdata[0].id, group_id: id, active: true })
        .from("user_groups");
      console.log(groupdata);
      if (groupdata.length !== 0)
        return { status: "User already in group", code: 406 };
      user_group.user_id = userdata[0].id;
      user_group.group_id = id;
      user_group.owner = false;
      user_group.maintainer = true;
      await database.insert(user_group).into("user_groups");
      console.log("Successfully added to db");
      return {
        status: "User successful added to group",
        code: 200,
      };
    } catch (error) {
      return { status: "Database error", code: 500 };
    }
  },

  createGroup: async (id, group) => {
    try {
      console.log("Checking for user in db");
      const userdata = await database
        .select()
        .where({
          id: id,
          active: true,
        })
        .from("users");
      if (userdata.length === 0)
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
      const groupdata = await database
        .select()
        .where({
          id: id,
          active: true,
        })
        .from("groups");
      console.log(groupdata);
      if (groupdata.length === 0)
        return { status: "Group non-existant", code: 404 };
      await database("groups")
        .where("id", id)
        .update({ ...value, modified_on: new Date() });
      return { status: "Group updated successful", code: 200 };
    } catch (error) {
      return { status: "Database error", code: 500 };
    }
  },

  updateUserGroup: async (id, user, value) => {
    try {
      const userdata = await database
        .select()
        .where({ ...user, active: true })
        .from("users");
      if (userdata.length === 0)
        return { status: "User non-existant", code: 404 };
      const groupdata = await database
        .select()
        .where({ user_id: userdata[0].id, group_id: id, active: true })
        .from("user_groups");
      console.log(groupdata);
      if (groupdata.length === 0)
        return { status: "User not member of group", code: 404 };
      await database("user_groups")
        .where({ user_id: userdata[0].id, group_id: id, active: true })
        .update({ ...value, modified_on: new Date() });
      return { status: "Group member updated successful", code: 200 };
    } catch (error) {
      return { status: "Database error", code: 500 };
    }
  },
};
