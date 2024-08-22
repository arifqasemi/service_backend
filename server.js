const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { Room } = require('./models');
const { Messages } = require('./models')
const app = express();
const server = createServer(app);
const io = new Server(server);
const cors = require('cors');

io.on('connection', (socket) => {

    socket.on('chats',({userId})=>{
        console.log(userId)

        Messages.count({where:{receiver_id:userId,seen:0}})
        .then((count)=>{
            console.log(`Number of unread messages: ${count}`);
            io.emit('chats',{count});
        }).catch((er)=>{

        })

        io.emit('chats',{});

    })
    // console.log(socket.id,'a server is connected');

    // create room event
    socket.on('createRoom',({senderId,receiverId})=>{
        const roomId = randomInt();
        Room.create({senderId,receiverId,message:'some message'}).then((room)=>{
            console.log('room created')

        }).catch((err)=>{
            console.log(err)
        })

    })


    // on join room event

    socket.on('joinRoom', ({ roomId,userId}) => {
        console.log('userId is this one',userId)
        socket.join(roomId);
        io.to(roomId).emit('message',`a user has joined the room ${roomId}.`);
        Room.findOne({ where: { id: roomId} })
            .then((result) => {
                if (result) {

        //             // console.log(result.id)
                    socket.join(result.id)
                    Messages.findAll({where:{roomId:roomId,receiver_id:userId}}).then((allmessage) =>{
                        allmessage.forEach(message => {
                            message.seen = true
                            message.save()
                            
                        });
                        
                        

                    }).catch((er)=>{
                        console.log(er)
                        console.log('no message found')

                    })
                    
                    io.to(roomId).emit('message', `a user has joined the room ${socket.id} from database.`);


                } else {
                    Room.create({sender:senderId,receiver:receiverId,message:'some message'}).then((room)=>{
                        console.log('room created')
            
                    }).catch((err)=>{
                        console.log(err)
                    })
                }

            }).catch((er) => {

                console.log('not found')
                console.log(er)
            })


    });

    //   on send message event

    socket.on('sendMessage', ({ roomId, message, senderId,receiver_id }) => {
        console.log('receiver id',receiver_id)
        Messages.create({ roomId: roomId, sender_id: senderId, message, seen: false ,receiver_id:receiver_id})
            .then((re) => {
                // console.log(re)

            }).catch((e) => {
                console.log(e)
            })
        io.to(roomId).emit('message', {message,senderId});
    });




    socket.on('chatMessage', (message) => {
        console.log(message);
    });


    socket.on('disconnected', () => {
        console.log('it is disconnected')
    })
});
app.use(cors());

app.get('/rooms', (req, res) => {
    res.send('it is working,cors,  msql2 is installed, sequelizze and websocket is ')

    // Room.findAll().then((result) => {
    //     // console.log(result)
    //     res.send(result)

    // }).catch((er) => {
    //     console.log(er)
    // })


});

// Start the server
const PORT = process.env.PORT || 8181;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
