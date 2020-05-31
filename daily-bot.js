const schedule = require('node-schedule')

const {
	log,
} = require('wechaty')

const dailyMsg = `Daily Message, which will be sent on 5:00pm everyday`

const jobs = [
	{
		room_id: "xxxxxxxxxxx@chatroom",
		room_name: "chatRoomName1",
		trigger: '0 0 17 * * *',
		messages: [dailyMsg]
	},
    {
        room_id: "xxxxxxxxxxx@chatroom",
        room_name: "chatRoomName2",
        trigger: '0 0 17 * * *',
        messages: [dailyMsg]
    }
]

async function doJob(bot, job) {
	console.log("run job", JSON.stringify(job))
	let room = await bot.Room.load(job.room_id)
	if (!room) {
		log.error("room not found: ", job.room_id)
		return
	}
	room.sync()
	for (msg of job.messages) {
		log.info("send msg", msg)
		await room.say(msg);
	}
}

// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    │
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)


// 创建微信每日说定时任务
async function initDailyJob(bot) {
	console.log(`init daily jobs`)
	for (job of jobs) {
		log.info("schedule job", JSON.stringify(job))
		schedule.scheduleJob(job.trigger, async function(bot, job) {
			doJob(bot, job)
		}.bind(null, bot, job))
	}
}

module.exports = {
	initDailyJob
}
