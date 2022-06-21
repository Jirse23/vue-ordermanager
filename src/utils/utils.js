//公共的函数工具js文件

// 获取中国地区时间
export let getChinatime = (utctime) => {
    //传入字符串或者对象
    let date = (typeof utctime == 'string' ? new Date(utctime) : utctime)
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
}