const port = 8081
const ip = '127.0.0.1'
const serverIp = '68.183.61.94'

console.log(process.env.NODE_ENV)

export const path = `http://${process.env.NODE_ENV === 'development'? ip : serverIp}:${port}`