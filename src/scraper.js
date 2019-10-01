const siteUrl = "https://www.letras.com/jose-jose/";
const baseURL = "https://www.letras.com/";
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require('fs');

const { convertLyricsToFile } = require('./converter');

const lyricDivSelector = 'div.cnt-letra p';
const lyricTitleSelector = '.cnt-head_title h1';

const fetchData = async () => {
    try{
        const result = await axios.get(siteUrl);
        return cheerio.load(result.data);
    }
    catch( error ){
        console.error('Something went wrong with the request')
        console.error(error);
    }
};

/**
 * This method gets the List of the songs based on the isTop20 value
 * 
 * @param { Boolean } isTop20 
 */
const getAvailableSongList = async ( isTop20 ) => {
    try {
        const $ =  await fetchData();

        const querySearch = !isTop20 ? '.cnt-list--alp > ul.cnt-list >li'  : 'ol.cnt-list.cnt-list--num.cnt-list--col2 > li';

        const listTracks = $( querySearch );

        let tracksObjects = new Object; 
        Object.keys(listTracks).forEach( ( key, idx ) => {
            let item = listTracks[key];
            let obj = { };
            if(  item.children &&  typeof item.children != 'function' && item.children.length > 0){
                item.children.forEach( ch => {
                    if( ch.type === 'tag' && ch.name === 'a'){
                        obj.name  = cheerio(ch).attr('title');
                        obj.path  = cheerio(ch).attr('href');
                        obj.id    = cheerio(ch).attr('href').split('/')[2];
                        obj.filename= cheerio(ch).attr('title').split('/')[0].replace(/ /g,'_').toLowerCase();
                    }
                } );
                tracksObjects[ idx ] = obj ;           
            }
        });
        return tracksObjects
    }
    catch( error ){
        console.error( error);
         return error
    }
}

/**
 * This Method fetch the lyrics of every item in the list 
 * @param {Object} lyricsObj 
 */
const fetchLyricsList = async ( lyricsObj ) => {
    try{
        Object.keys( lyricsObj ).forEach( key => {
            let lyricData = { data: [] };
            (async () => {
                try{
                    let lyric = lyricsObj[key];
                    console.log('Lyric:', lyric);
                    let $lyric = await fetchLyric( lyric );
                    if( typeof $lyric == 'function' ){

                        if( fs.existsSync(`./data/lyrics/${lyric.filename}.json`) ){
                            console.log( 'File '+ lyric.filename + ' already exist');
                            return new Error('File '+ lyric.filename + ' already exist');
                        }
                        else {
                            let lyricsParragraphs = $lyric( lyricDivSelector );
                            let lyricTitle = $lyric( lyricTitleSelector ).text();
                            lyricData['title'] = lyricTitle;
                            Object.keys( lyricsParragraphs ).forEach( key => {
                                if( lyricsParragraphs[key].name === 'p' ){
                                    lyricData.filename = lyric.filename;
                                    lyricData.id       = lyric.id;
                                    lyricData.data     = [...lyricData.data, cheerio(lyricsParragraphs[key]).text()+' ']
                                }
                            } )

                            let resultLyric  = await convertLyricsToFile( lyricData );
                            console.log( resultLyric.message );
                            return resultLyric
                        }
                    }
                    else{
                        return new Error('Lyric is not a function');
                    }                    
                }
                catch(err){
                    console.error(err);
                    return new Error('Error fetching lyrics');
                }
                
            })()
        } );
    }
    catch( error ){
        console.error( error );
    }
   
}

const fetchLyric = async ( lyric ) => {
    console.log(lyric);
    try{
        let completeLyricPath = `${baseURL}${lyric.path}`
        const result = await axios.get( completeLyricPath );
        return  cheerio.load( result.data );
    }
    catch(err){
        console.error(lyric, 'Lyric not found!');
        return err
    }
};

module.exports = { getAvailableSongList, fetchLyricsList };