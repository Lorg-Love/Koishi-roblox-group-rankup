export async function GetUser(user_id,apiKey) {
    let response = await fetch(`https://apis.roblox.com/cloud/v2/users/${user_id}`, {
        method: "GET",
        headers: {
            "x-api-key": apiKey
        }
    });
    let s = await fetch(`https://apis.roblox.com/cloud/v2/users/${user_id}:generateThumbnail`,{
        method: "GET",
        headers: {
            "x-api-key": apiKey
        }
    });
        let f = await fetch(`https://friends.roblox.com/v1/users/${user_id}/friends/count`,{
        method: "GET",
        headers: {
            "x-api-key": apiKey
        }
    });
    //https://friends.roblox.com/v1/my/friends/count
    console.log(response.status!==200?String(response.Status) + response.statusText:"OK");
    let data = await response.json();
    let sa = await s.json();
    let fs = await f.json();

    if (response.status !== 200) {
        console.log(data.message);
    };

   let ver = ""
   if (data.idVerified) {
    ver = "是"
   }else{
    ver = "否"
   }
   let pr = ""

      if (data.premium) {
    pr = "是"
   }else{
    pr = "否"
   }

   // console.log(fs)
    let xx = "玩家用户名:\n"+data.name+"\n玩家昵称:\n"+data.displayName+"\n玩家简介:\n"+data.about+"\n创建时间:\n"+data.createTime+"\n用户语言:\n"+data.locale+"\n是否验证:\n"+ver+"\n是否拥有Premium:\n"+pr+"\n拥有好友位数:\n"+fs.count+"位\n"
    return xx
};
