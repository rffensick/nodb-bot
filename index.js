require('dotenv').config()

const Telegraf = require('telegraf')
const { ProjectsBundle } = require('gitlab')

const bot = new Telegraf(process.env.BOT_TOKEN)

const apiGitLab = new ProjectsBundle({
  url: process.env.GIT_LAB_URL, // Defaults to http://gitlab.com
  token: process.env.GIT_LAB_TOKEN // Can be created in your profile.
})

bot.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log('Response time %sms', ms)
})

bot.start(ctx => ctx.reply('Welcome!'))
bot.help(ctx => ctx.reply('Send me a sticker'))
bot.command('users', async ctx => {
  const projects = await apiGitLab.Projects.search('nodb')
  let result = ''
  projects.forEach((project, index) => {
    result += `Проект ${index + 1}\t`
    Object.keys(project).map(key => {
      result += `
        ${key}: ${project[key]}
      `
    })
  })
  ctx.reply(result)
})
bot.hears('hi', ctx => ctx.reply('Hey there'))
bot.startPolling()
