var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Config: () => Config,
  apply: () => apply,
  name: () => name
});
module.exports = __toCommonJS(src_exports);
var import_koishi = require("koishi");

// src/main.js
async function getGroupRoleId(targetRole, groupId, apiKey) {
  let response = await fetch(`https://apis.roblox.com/cloud/v2/groups/${groupId}/roles?maxPageSize=20`, {
    method: "GET",
    headers: {
      "x-api-key": apiKey
    }
  });
  let data = await response.json();
  let pageToken = data.nextPageToken || 1;
  let currentPage = data.groupRoles || [];
  while (pageToken) {
    if (!currentPage || !Array.isArray(currentPage)) break;
    for (let role of currentPage) {
      if (role.rank === Number(targetRole)) {
        return Number(role.id);
      }
    }
    if (pageToken === 1) {
      pageToken = 0;
      continue;
    }
    ;
    let newResponse = await fetch(`https://apis.roblox.com/cloud/v2/groups/${groupId}/roles?maxPageSize=20&pageToken=${pageToken}`, {
      method: "GET",
      headers: {
        "x-api-key": apiKey
      }
    });
    let newData = await newResponse.json();
    pageToken = newData.nextPageToken || 1;
    currentPage = newData.groupRoles;
  }
}
__name(getGroupRoleId, "getGroupRoleId");
async function getUserMembershipId(targetUserId, groupId, apiKey) {
  let response = await fetch(`https://apis.roblox.com/cloud/v2/groups/${groupId}/memberships?maxPageSize=50`, {
    method: "GET",
    headers: {
      "x-api-key": apiKey
    }
  });
  console.log(response.status !== 200 ? String(response.Status) + response.statusText : "Request ok. Code 200.");
  let data = await response.json();
  if (response.status !== 200) {
    console.log(data.message);
  }
  ;
  let pageToken = data.nextPageToken || 1;
  let currentPage = data.groupMemberships;
  while (pageToken) {
    for (let membership of currentPage) {
      if (!membership.user || !membership.path) {
        continue;
      }
      ;
      let splitted = membership.user.split("/");
      let userId = splitted[splitted.length - 1];
      if (userId == targetUserId) {
        let splitted2 = membership.path.split("/");
        let membershipId = splitted2[splitted2.length - 1];
        let splitted22 = membership.role.split("/");
        let roleid = splitted22[splitted22.length - 1];
        console.log(membershipId, roleid);
        return { membershipId, roleid };
      }
    }
    if (pageToken === 1) {
      pageToken = 0;
      continue;
    }
    ;
    let newResponse = await fetch(`https://apis.roblox.com/cloud/v2/groups/${groupId}/memberships?maxPageSize=50&pageToken=${pageToken}`, {
      method: "GET",
      headers: {
        "x-api-key": apiKey
      }
    });
    if (!newResponse.ok) {
      warn("Failed to retrieve subsequent pages. Error code:", newResponse.status);
      break;
    }
    ;
    let newData = await newResponse.json();
    pageToken = newData.nextPageToken || 1;
    currentPage = newData.groupMemberships;
  }
}
__name(getUserMembershipId, "getUserMembershipId");
async function updateUserRole(targetRoleId, targetMembershipId, groupId, apiKey) {
  let response2 = await fetch(`https://apis.roblox.com/cloud/v2/groups/${groupId}/memberships/${targetMembershipId}:assignRole`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey
    },
    body: JSON.stringify({
      "role": `groups/${groupId}/roles/${targetRoleId}`
    })
  });
  let data2 = await response2.json();
  if (response2.status !== 200) {
    return "调整失败,报错:" + data2.message;
  } else {
    return "调整成功，请检查群组";
  }
  ;
}
__name(updateUserRole, "updateUserRole");
async function isaddroleupdateUserRole(targetRoleId, targetMembershipId, groupId, apiKey, roleid) {
  let response = await fetch(`https://apis.roblox.com/cloud/v2/groups/${groupId}/memberships/${targetMembershipId}:unassignRole`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey
    },
    body: JSON.stringify({
      "role": `groups/${groupId}/roles/${roleid}`
    })
  });
  let response2 = await fetch(`https://apis.roblox.com/cloud/v2/groups/${groupId}/memberships/${targetMembershipId}:assignRole`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey
    },
    body: JSON.stringify({
      "role": `groups/${groupId}/roles/${targetRoleId}`
    })
  });
  let data2 = await response2.json();
  console.log(data2);
  if (response2.status !== 200) {
    return "调整失败,报错:" + data2.message;
  } else {
    return "调整成功，请检查群组";
  }
  ;
}
__name(isaddroleupdateUserRole, "isaddroleupdateUserRole");
async function updateRoleProcess(userId, roleName, groupId, apiKey) {
  if (!userId || !roleName || !groupId) {
    console.log("参数无效:", { userId, roleName, groupId, apiKey });
    return "调整失败,参数无效";
  }
  let roleId = await getGroupRoleId(roleName, groupId, apiKey);
  let membershipId = await getUserMembershipId(userId, groupId, apiKey);
  console.log(membershipId.membershipId, membershipId.roleid, roleId);
  let g = await isaddroleupdateUserRole(roleId, membershipId.membershipId, groupId, apiKey, membershipId.roleid);
  return g;
}
__name(updateRoleProcess, "updateRoleProcess");
async function isaddroleupdateRoleProcess(userId, roleName, groupId, apiKey) {
  if (!userId || !roleName || !groupId) {
    console.log("参数无效:", { userId, roleName, groupId, apiKey });
    return "调整失败,参数无效";
  }
  console.log(groupId);
  let roleId = await getGroupRoleId(roleName, groupId, apiKey);
  let membershipId = await getUserMembershipId(userId, groupId, apiKey);
  console.log(membershipId.membershipId, membershipId.roleid);
  let g = await updateUserRole(roleId, membershipId.membershipId, groupId, apiKey);
  return g;
}
__name(isaddroleupdateRoleProcess, "isaddroleupdateRoleProcess");

// src/tg.js
async function getUserMembershipId2(targetUserId, groupId, apiKey) {
  let response = await fetch(`https://apis.roblox.com/cloud/v2/groups/${groupId}/join-requests?maxPageSize=10`, {
    method: "GET",
    headers: {
      "x-api-key": apiKey
    }
  });
  console.log(response.status !== 200 ? String(response.Status) + response.statusText : "Request ok. Code 200.");
  let data = await response.json();
  if (response.status !== 200) {
    console.log(data.message);
  }
  ;
  let pageToken = data.nextPageToken || 1;
  let currentPage = data.groupJoinRequests;
  console.log(currentPage);
  while (pageToken) {
    for (let membership of currentPage) {
      if (!membership.user || !membership.path) {
        continue;
      }
      ;
      let splitted = membership.user.split("/");
      let userId = splitted[splitted.length - 1];
      if (userId == targetUserId) {
        let splitted2 = membership.path.split("/");
        let membershipId = splitted2[splitted2.length - 1];
        return membershipId;
      }
    }
    if (pageToken === 1) {
      pageToken = 0;
      continue;
    }
    ;
    let newResponse = await fetch(`https://apis.roblox.com/cloud/v2/groups/${groupId}/memberships?maxPageSize=50&pageToken=${pageToken}`, {
      method: "GET",
      headers: {
        "x-api-key": apiKey
      }
    });
    if (!newResponse.ok) {
      warn("Failed to retrieve subsequent pages. Error code:", newResponse.status);
      break;
    }
    ;
    let newData = await newResponse.json();
    pageToken = newData.nextPageToken || 1;
    currentPage = newData.groupMemberships;
  }
}
__name(getUserMembershipId2, "getUserMembershipId");
async function updateUserRole2(targetMembershipId, groupId, apiKey) {
  let response = await fetch(`https://apis.roblox.com/cloud/v2/groups/${groupId}/join-requests/${targetMembershipId}:accept`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey
    },
    body: JSON.stringify({
      "role": `groups/${groupId}/join-requests/${targetMembershipId}`
    })
  });
  let data = await response.json();
  if (response.status !== 200) {
    return "通过失败,报错" + data.message;
  } else {
    return "通过成功，请检查群组";
  }
  ;
}
__name(updateUserRole2, "updateUserRole");
async function updateRoleProcesss(userId, groupId, apiKey) {
  let membershipId = await getUserMembershipId2(userId, groupId, apiKey);
  let g = await updateUserRole2(userId, groupId, apiKey);
  return g;
}
__name(updateRoleProcesss, "updateRoleProcesss");

// src/tgs.js
async function getUserMembershipId3(targetUserId, groupId, apiKey) {
  let response = await fetch(`https://apis.roblox.com/cloud/v2/groups/${groupId}/join-requests?maxPageSize=10`, {
    method: "GET",
    headers: {
      "x-api-key": apiKey
    }
  });
  console.log(response.status !== 200 ? String(response.Status) + response.statusText : "OK");
  let data = await response.json();
  if (response.status !== 200) {
    console.log(data.message);
  }
  ;
  let pageToken = data.nextPageToken || 1;
  let currentPage = data.groupJoinRequests;
  while (pageToken) {
    for (let membership of currentPage) {
      if (!membership.user || !membership.path) {
        continue;
      }
      ;
      let splitted = membership.user.split("/");
      let userId = splitted[splitted.length - 1];
      if (userId == targetUserId) {
        let splitted2 = membership.path.split("/");
        let membershipId = splitted2[splitted2.length - 1];
        return membershipId;
      }
    }
    if (pageToken === 1) {
      pageToken = 0;
      continue;
    }
    ;
    let newResponse = await fetch(`https://apis.roblox.com/cloud/v2/groups/${groupId}/memberships?maxPageSize=50&pageToken=${pageToken}`, {
      method: "GET",
      headers: {
        "x-api-key": apiKey
      }
    });
    if (!newResponse.ok) {
      warn("Failed to retrieve subsequent pages. Error code:", newResponse.status);
      break;
    }
    ;
    let newData = await newResponse.json();
    pageToken = newData.nextPageToken || 1;
    currentPage = newData.groupMemberships;
  }
}
__name(getUserMembershipId3, "getUserMembershipId");
async function updateUserRole3(targetMembershipId, groupId, apiKey) {
  let response = await fetch(`https://apis.roblox.com/cloud/v2/groups/${groupId}/join-requests/${targetMembershipId}:decline`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey
    },
    body: JSON.stringify({
      "role": `groups/${groupId}/join-requests/${targetMembershipId}`
    })
  });
  let data = await response.json();
  if (response.status !== 200) {
    return "拒绝失败,报错" + data.message;
  } else {
    return "拒绝成功，请检查群组";
  }
  ;
}
__name(updateUserRole3, "updateUserRole");
async function updateRoleProces(userId, groupId, apiKey) {
  let membershipId = await getUserMembershipId3(userId, groupId, apiKey);
  let g = await updateUserRole3(membershipId, groupId, apiKey);
  return g;
}
__name(updateRoleProces, "updateRoleProces");

// src/get.js
async function GetUser(user_id, apiKey) {
  let response = await fetch(`https://apis.roblox.com/cloud/v2/users/${user_id}`, {
    method: "GET",
    headers: {
      "x-api-key": apiKey
    }
  });
  let s = await fetch(`https://apis.roblox.com/cloud/v2/users/${user_id}:generateThumbnail`, {
    method: "GET",
    headers: {
      "x-api-key": apiKey
    }
  });
  let f = await fetch(`https://friends.roblox.com/v1/users/${user_id}/friends/count`, {
    method: "GET",
    headers: {
      "x-api-key": apiKey
    }
  });
  console.log(response.status !== 200 ? String(response.Status) + response.statusText : "OK");
  let data = await response.json();
  let sa = await s.json();
  let fs = await f.json();
  if (response.status !== 200) {
    console.log(data.message);
  }
  ;
  let ver = "";
  if (data.idVerified) {
    ver = "是";
  } else {
    ver = "否";
  }
  let pr = "";
  if (data.premium) {
    pr = "是";
  } else {
    pr = "否";
  }
  let xx = "玩家用户名:\n" + data.name + "\n玩家昵称:\n" + data.displayName + "\n玩家简介:\n" + data.about + "\n创建时间:\n" + data.createTime + "\n用户语言:\n" + data.locale + "\n是否验证:\n" + ver + "\n是否拥有Premium:\n" + pr + "\n拥有好友位数:\n" + fs.count + "位\n";
  return xx;
}
__name(GetUser, "GetUser");

// src/index.ts
var import_path = require("path");
var name = "roblox-group-rankup";
var Config = import_koishi.Schema.intersect([
  import_koishi.Schema.object({
    Groupid: import_koishi.Schema.string().description("填写你的Roblox群组ID"),
    Apikey: import_koishi.Schema.string().description("填写你的Roblox **个人账号** 的 API Key"),
    IsGroup: import_koishi.Schema.boolean().description("是否开启多群组模式?").default(false)
  })
]);
function apply(ctx, config) {
  ctx.inject(["console"], (ctx2) => {
    ctx2.console.addEntry({
      dev: (0, import_path.resolve)(__dirname, "../client/index.ts"),
      prod: (0, import_path.resolve)(__dirname, "../dist")
    });
  });
  if (config.IsGroup = false) {
    ctx.command("升级等级 <userid> <description> <isaddrole:string> 升级某个用户在某个群组中的等级").action(async ({ session }, userid, description, isaddrole) => {
      console.log(isaddrole);
      if (isaddrole = "yes") {
        const g = await updateRoleProcess(userid, description, config.Groupid, config.Apikey);
        if (session) {
          session.send(g);
        }
      } else {
        const g = await isaddroleupdateRoleProcess(userid, description, config.Groupid, config.Apikey);
        if (session) {
          session.send(g);
        }
      }
    });
    ctx.command("通过申请 <userid> 通过某个用户在某个群组中的申请").action(async ({ session }, userid) => {
      const g = await updateRoleProcesss(userid, config.Groupid, config.Apikey);
      if (session) {
        session.send(g);
      }
    });
    ctx.command("拒绝申请 <userid> 拒绝某个用户在某个群组中的申请").action(async ({ session }, userid) => {
      const g = await updateRoleProces(userid, config.Groupid, config.Apikey);
      if (session) {
        session.send(g);
      }
    });
    ctx.command("读取玩家信息 <userid> 列出某个用户的信息").action(async ({ session }, userid) => {
      const g = await GetUser(userid, config.Apikey);
      if (session) {
        session.send(g);
      }
    });
  } else {
    ctx.command("升级等级 <userid> <description> <isaddrole:string> <Groupid> 升级某个用户在某个群组中的等级").action(async ({ session }, userid, description, isaddrole, Groupid) => {
      console.log(isaddrole);
      if (isaddrole === "yes") {
        const g = await updateRoleProcess(userid, description, Groupid, config.Apikey);
        if (session) {
          session.send(g);
        }
      } else {
        const g = await isaddroleupdateRoleProcess(userid, description, Groupid, config.Apikey);
        if (session) {
          session.send(g);
        }
      }
    });
    ctx.command("通过申请 <userid> <Groupid> 通过某个用户在某个群组中的申请").action(async ({ session }, userid, Groupid) => {
      const g = await updateRoleProcesss(userid, Groupid, config.Apikey);
      if (session) {
        session.send(g);
      }
    });
    ctx.command("拒绝申请 <userid> <Groupid> 拒绝某个用户在某个群组中的申请").action(async ({ session }, userid, Groupid) => {
      const g = await updateRoleProces(userid, Groupid, config.Apikey);
      if (session) {
        session.send(g);
      }
    });
    ctx.command("读取玩家信息 <userid> 列出某个用户的信息").action(async ({ session }, userid) => {
      const g = await GetUser(userid, config.Apikey);
      if (session) {
        session.send(g);
      }
    });
  }
}
__name(apply, "apply");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Config,
  apply,
  name
});
