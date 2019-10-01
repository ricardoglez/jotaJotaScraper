const { getAvailableSongList, fetchLyricsList } = require('./src/scraper');
const { convertListToFile } = require('./src/converter');
const fs = require('fs');

let isTop20 = true;

let dataFolder = './data';


//TODO Handle files from the cli
// Add params:
// * File name
// * Type of List
const init = async () => {

    let availableFiles = null;
    
    fs.readdir(dataFolder, (err, files) => {
        if( err || files.length < 1 || !files ){
            (async () => {
                console.log('Get Song List...');
                let availableList = await getAvailableSongList( isTop20 );
                if( availableList ){
                    try{
                        let resultConvert = await convertListToFile( availableList, null, isTop20 );
                        console.log(resultConvert.message);
                        console.log(resultConvert);
                        if( resultConvert.success){
                            fs.readFile( `${ dataFolder }/${resultConvert.newFile}`, 'utf-8', ( err, data ) => {
                                if( err ){  console.error(err); }
                                console.log( data );
                                let parsedJSON = JSON.parse( data );
                                console.log(resultConvert.newFile, ' file Loaded...');
                                fetchLyricsList( parsedJSON );
                              });
                        }
                    }
                    catch( error ){
                        console.error(error);
                    }
                }
            })()
        }
        else {            
              availableFiles = files;
              console.log('Data Files exist!', availableFiles);
              let firstFile = availableFiles.find( d => {
                    if( d.includes('.json') ){
                        return d
                    }
                });

                if( firstFile != -1){
                    console.log( firstFile , 'Load This file...');
                    fs.readFile( `${ dataFolder }/${firstFile}`, 'utf-8', ( err, data ) => {
                        if( err ){  console.error(err); }
                        console.log('File Loaded');
                        let parsedJSON = JSON.parse(data);
                        fetchLyricsList( parsedJSON );
                    });
                }
                else {
                    console.error( 'The file ', firstFile,' doesnt exist' );
                }
        }
      });    
}

init();


