async function getGroupRoleId(targetRole, groupId, apiKey) {
    let response = await fetch(`https://apis.roblox.com/cloud/v2/groups/${groupId}/roles?maxPageSize=20`, {
        method: "GET",
        headers: {
            "x-api-key": apiKey
        }
    });

    let data = await response.json();
   // console.log(data);
    let pageToken = data.nextPageToken || 1;
    let currentPage = data.groupRoles;

    while (pageToken) {
        for (let role of currentPage) { //check each role's ID
            if (role.rank === Number(targetRole)) { //if it's the role we want
                //console.log(role);
                return Number(role.id); //return that reference
            }
        }
        if (pageToken === 1) {
            pageToken = 0;
            continue;
        };

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
};

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
    };

    let pageToken = data.nextPageToken || 1;
    let currentPage = data.groupMemberships;

    while (pageToken) {
        for (let membership of currentPage) {
            if (!membership.user || !membership.path) { continue; };

            //check to see if it's the UserId of the user we want
            let splitted = membership.user.split("/");
            let userId = splitted[splitted.length - 1];

            if (userId == targetUserId) {
                //the UserIds match! Now, return the membership ID
                let splitted = membership.path.split("/");
                let membershipId = splitted[splitted.length - 1];
                let splitted2 = membership.role.split("/");
                let roleid = splitted2[splitted2.length - 1];
                console.log(membershipId, roleid);
                return { membershipId, roleid }
            }
        }

        if (pageToken === 1) {
            pageToken = 0;
            continue;
        };

        //membership not found on this page, let's advance to the next one
        let newResponse = await fetch(`https://apis.roblox.com/cloud/v2/groups/${groupId}/memberships?maxPageSize=50&pageToken=${pageToken}`, {
            method: "GET",
            headers: {
                "x-api-key": apiKey
            }
        });

        if (!newResponse.ok) { //if it failed for whatever reason
            warn("Failed to retrieve subsequent pages. Error code:", newResponse.status);
            break;
        };

        let newData = await newResponse.json();
        pageToken = newData.nextPageToken || 1;
        currentPage = newData.groupMemberships;
    }
};

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
    };
};

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
    };
};

export async function updateRoleProcess(userId, roleName, groupId, apiKey) {
    if (!userId || !roleName || !groupId) {
        console.log('参数无效:', { userId, roleName, groupId, apiKey });
        return "调整失败,参数无效";
    }
    let roleId = await getGroupRoleId(roleName, groupId, apiKey);
    let membershipId = await getUserMembershipId(userId, groupId, apiKey);
    console.log(membershipId.membershipId, membershipId.roleid, roleId);
    let g = await isaddroleupdateUserRole(roleId, membershipId.membershipId, groupId, apiKey, membershipId.roleid);
    return g;
};

export async function isaddroleupdateRoleProcess(userId, roleName, groupId, apiKey) {
    if (!userId || !roleName || !groupId) {
        console.log('参数无效:', { userId, roleName, groupId, apiKey });
        return "调整失败,参数无效";
    }
    console.log(groupId);
    let roleId = await getGroupRoleId(roleName, groupId, apiKey);
    let membershipId = await getUserMembershipId(userId, groupId, apiKey);
    console.log(membershipId.membershipId, membershipId.roleid);
    let g = await updateUserRole(roleId, membershipId.membershipId, groupId, apiKey);
    return g;
};
