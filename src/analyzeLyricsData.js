const lorca  = require('lorca-nlp');
const fs  = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile );
const availableLyrics = []; 

const getLyricsList = () => {
    let lyricsList = [];
    return new Promise( ( resolve, reject) => {
        fs.readdir( './data/lyrics' , 'utf-8', ( err, data ) => {
            if(err) reject( err )
            for( const lyric of data ){
                lyricsList.push( lyric );
            }
            resolve( { success: true , data: lyricsList } )
        });
    } );
}

const getLyricsData = ( lyricsList ) => {
    let processedLyrics = [];
    return new Promise ( ( resolve, reject ) => {
        for( const lyric of lyricsList ){
            readFile( `./data/lyrics/${lyric}`, 'utf-8')
            .then( responseL => {
                let obj={ lyricName: lyric, parragraphs: { }, };
                let parsedData = JSON.parse( responseL );
                let idx = 0;
                for( const p of parsedData.data ) {
                    let pStemmed =  lorca(p).words().stem().get();
                    let par = { 
                        index: idx,
                        string: pStemmed.join(' '),
                        sentiment: lorca( pStemmed.join(' ') ).sentiment(),
                    }
                    obj.parragraphs[idx] = par;
                    processedLyrics.push(obj)
                    idx ++;
                } ;
            } )
            .catch( error => {
                console.error( error );
            });
        }
        resolve('Process:', processedLyrics );
    } )
}

const init = () => {
    console.log('Initilize Analysis...');
    getLyricsList()
     .then( response => {
        if( response.success ){
            getLyricsData( response.data )
            .then( responseData => {
                console.log(responseData);
            } )
            .catch( error => {
                console.error(error);
                throw error
            } )
        }
        else {
            console.error(response);
        }
     } )
     .catch( error =>{ 
         console.error(error);
     } );
}

init();

