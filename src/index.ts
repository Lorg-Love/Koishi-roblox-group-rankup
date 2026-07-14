import { Bot, Context, Database, Fragment, h, Schema } from 'koishi'

import { updateRoleProcess, isaddroleupdateRoleProcess } from './main.js';
import { updateRoleProcesss } from './tg.js';
import { updateRoleProces } from './tgs.js';
import { GetUser } from './get.js';

import { } from '@koishijs/plugin-console'
import { resolve } from 'path'

export const name = 'roblox-group-rankup'

export interface Config {
  Groupid: string
  Apikey: string
  IsGroup: Boolean
}

export const Config: Schema = Schema.intersect([
  Schema.object({
    Groupid: Schema.string().description('填写你的Roblox群组ID'),
    Apikey: Schema.string().description('填写你的Roblox **个人账号** 的 API Key'),
    IsGroup: Schema.boolean().description('是否开启多群组模式?').default(false),
  })
])

export function apply(ctx: Context, config: Config) {
  ctx.inject(['console'], (ctx) => {
    ctx.console.addEntry({
      dev: resolve(__dirname, '../client/index.ts'),
      prod: resolve(__dirname, '../dist'),
    })
  })
  if (config.IsGroup = false) {
    ctx.command('升级等级 <userid> <description> <isaddrole:string> 升级某个用户在某个群组中的等级')
      .action(async ({ session }, userid, description, isaddrole) => {
        console.log(isaddrole);
        if (isaddrole = "yes") {
          const g = await updateRoleProcess(userid, description, config.Groupid, config.Apikey);
          if (session) {
            session.send(g)
          }
        }
        else {
          const g = await isaddroleupdateRoleProcess(userid, description, config.Groupid, config.Apikey);
          if (session) {
            session.send(g)
          }
        }
      });
    ctx.command('通过申请 <userid> 通过某个用户在某个群组中的申请')
      .action(async ({ session }, userid) => {
        const g = await updateRoleProcesss(userid, config.Groupid, config.Apikey);
        if (session) {
          session.send(g)
        }
      });
    ctx.command('拒绝申请 <userid> 拒绝某个用户在某个群组中的申请')
      .action(async ({ session }, userid) => {
        const g = await updateRoleProces(userid, config.Groupid, config.Apikey);
        if (session) {
          session.send(g)
        }
      });
    ctx.command('读取玩家信息 <userid> 列出某个用户的信息')
      .action(async ({ session }, userid) => {
        const g = await GetUser(userid, config.Apikey);
        if (session) {
          session.send(g)
        }
      });
  } else {
    ctx.command('升级等级 <userid> <description> <isaddrole:string> <Groupid> 升级某个用户在某个群组中的等级')
      .action(async ({ session }, userid, description, isaddrole, Groupid) => {
        console.log(isaddrole);
        if (isaddrole === "yes" ) {
          const g = await updateRoleProcess(userid, description, Groupid, config.Apikey);
          if (session) {
            session.send(g)
          }
        }
        else {
          const g = await isaddroleupdateRoleProcess(userid, description, Groupid, config.Apikey);
          if (session) {
            session.send(g)
          }
        }
      });
    ctx.command('通过申请 <userid> <Groupid> 通过某个用户在某个群组中的申请')
      .action(async ({ session }, userid, Groupid) => {
        const g = await updateRoleProcesss(userid, Groupid, config.Apikey);
        if (session) {
          session.send(g)
        }
      });
    ctx.command('拒绝申请 <userid> <Groupid> 拒绝某个用户在某个群组中的申请')
      .action(async ({ session }, userid, Groupid) => {
        const g = await updateRoleProces(userid, Groupid, config.Apikey);
        if (session) {
          session.send(g)
        }
      });
    ctx.command('读取玩家信息 <userid> 列出某个用户的信息')
      .action(async ({ session }, userid) => {
        const g = await GetUser(userid, config.Apikey);
        if (session) {
          session.send(g)
        }
      });
  }
}
