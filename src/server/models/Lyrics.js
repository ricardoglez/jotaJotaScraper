const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LyricsSchema = new Schema({ 
    name        : String,
    parragraphs : Object ,
    id           : Number,
});

module.exports = mongoose.model( 'Lyrics', LyricsSchema );