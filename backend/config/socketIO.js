const socketIO = require('socket.io')

const InitializeSocket = () => {
    const io = socketIO(8080, {
        cors : {
            origin:[
                "http://localhost:5000",
                "http://localhost:3000",]
        }
    })
    
    io.on("connection", socket => {
        console.log(socket.id)
    })
    
    return io
}   

module.exports = InitializeSocket