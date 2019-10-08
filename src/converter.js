const fs = require('fs');
const path = require('path');

const lyricsPath = './data/lyrics';

const convertListToFile = async ( data, fileName, isTop20 ) => {
    return new Promise( ( res, rej ) => {

        fileName = !fileName ? `trackNameList-${isTop20 ? 'top20' : 'complete'}`: `${ fileName }-${isTop20 ? 'top20' : 'complete'}`; 

        if( !data ){ reject( new Error('Data is not available!') ) }
        let jsonString = JSON.stringify( data );
        try{
            if( fs.existsSync( fileName ) ){
                console.log('Lyrics List File Exist!')
                fs.writeFileSync(`./data/${fileName}.json`, jsonString, 'utf-8');
                res( { success: true, message: `Data was written successfully in: /data/${fileName}.json `, newFile: fileName+'.json' } );    
            }
            else {
                console.log('Lyrics List File Doesnt Exist : (')

                fs.appendFile(`./data/${fileName}.json`, jsonString, ( err ) => {
                    console.error( err );
                    rej( err );
                });
                res( { success: true, message: `Data was written successfully in: /data/${fileName}.json `, newFile: fileName+'.json' } );
            }
            
        }
        catch(error){
            console.error(error);
            rej( error )
        }        
    });
}

const convertLyricsToFile = async ( data ) => {
    return new Promise( (res, rej ) => {
        try{
            if (!fs.existsSync( lyricsPath )){
                fs.mkdirSync(lyricsPath);
            }
            let filename = data.filename;
            data.bow = [].concat(  ...data.data.map( p => {return  p.split(' ') } ) ); 
            let jsonString = JSON.stringify( data );

                if( fs.existsSync(`./data/lyrics/${filename}`) ){
                    //File already Exist
                    rej( new Error(`File ${ filename } already exist`) );
                }
                else {
                    console.log('Write this file:',filename);
                    fs.writeFileSync(`./data/lyrics/${filename}.json`, jsonString, 'utf-8');
                    res( {success: true , message: `File ${ filename } was written successfully`} )
                }
        }
        catch( error ){
            console.error( error );
            rej( error );
        }
    } );
};

module.exports = {  convertListToFile, convertLyricsToFile };