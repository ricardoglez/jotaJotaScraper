const lorca  = require('lorca-nlp');
const fs  = require('fs');
const util = require('util');
const API = require('./api/API');

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

const getLyricsData = ( lyric ) => {
    let processedLyrics = [];
    return new Promise ( ( resolve, reject ) => {
        let idx = 0;
            readFile( `./data/lyrics/${lyric}`, 'utf-8')
            .then( responseL => {
                let parsedData = JSON.parse( responseL );
                let obj={ name: lyric, parragraphs: { }, id: parsedData.id };
                let idx = 0;
                for( const p of parsedData.data ) {

                    let pStemmed =  lorca(p).words().stem().get();
                    let par = { 
                        index: idx,
                        string: p,
                        sentiment: lorca( p ).sentiment(),
                    }
                    obj.parragraphs[idx] = par;
                    processedLyrics.push(obj)
                    idx ++;
                };
               
                resolve({ success: true , data: obj });

            } )
            .catch( error => {
                console.error( error );
            });
        //     idx ++;

        // }
    } )
}

const init = () => {
    console.log('Initilize Analysis...');
    
    getLyricsList()
     .then( response => {
        if( response.success ){
            for( const l of response.data){
                getLyricsData( l )
                .then( responseData => {
                    API.storeLyric(responseData)
                    .then( response =>{
                        console.log('RRESPONSE Success' );
                    })
                    .catch(error => {
                        console.error('ERROR');
                })

                } )
                .catch( error => {
                    console.error(error);
                    throw error
                } )
            }
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

