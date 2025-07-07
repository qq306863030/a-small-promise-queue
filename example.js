const QueueTool = require('./lib/a-small-promise-queue.cjs.js')

function testEvent(index, time = 2000, opt) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`test ${index} done`)
            resolve("ok")
        }, time)
    })
}

const q = new QueueTool.SmallPromiseQueue({
    maxSize: 20,
    isSkipError: false,
    maxConcurrenceCount: 1, // 最大并发数设置为1
    taskEndCallBack: () => {
        console.log('task end') // 任务结束执行回调函数
    }
})


q.add((opt) => {
    return testEvent(1, 2000, opt)
}, {
    isSkipError: true, // 自动跳过错误
    timeout: 1000, // 设置超时时间为1秒
    errorCallBack: (err) => {
        console.log('exec error:', err)
    },
})

q.add((opt) => {
    return testEvent(3, 1500, opt)
}, {
    successCallBack: (res) => {
        console.log('exec success:', res)
    },
})

q.add(async (opt) => {
    await testEvent(4, 1000, opt)
})
q.add(async (opt) => {
    await testEvent(5, 1000, opt)
})
q.add(async (opt) => {
    await testEvent(6, 1000, opt)
})
q.add(async (opt) => {
    await testEvent(7, 1000, opt)
})
