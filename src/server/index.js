const mongoose = require('mongoose');
const mongoOptions = {  useNewUrlParser: true ,  useUnifiedTopology: true };
const Lyrics = require('./models/Lyrics');

mongoose.connect( 'mongodb://admin:jotaJota2@ds331548.mlab.com:31548/jotal_jota_lyrics',  mongoOptions );

mongoose.connection.once('open', () => {
 console.log('connected to db!');
});

const hapi = require('hapi');

const server = hapi.server({
    port: 4000,
    host: 'localhost'
});



const init = async () => {
    server.route([{
        method: 'GET',
        path:'/',
        handler: function(reques, reply){
            return '<h1>My home Route</h1>'
        }
    },
    {
        method: 'GET',
        path:'/api/v1/lyrics',
        handler: ( req, reply) => {
            return Lyrics.find()
        }
    },
    {
        method: 'POST',
        path:'/api/v1/lyrics',
        handler: ( req, reply )=> {
            console.log('-------Server Logs-------', req.payload );
            const { parragraphs, name, id  } = req.payload;
            const lyric = new Lyrics({
                parragraphs, name,id
            })
            return lyric.save()
        }
    }]
    );

    await server.start();
    console.log('Server running at: ', server.info.uri);
}

init();