const fs = require('fs');
const fsP = require('fs').promises;

let generalBOW = [];

const lyricsPath = './data/lyrics';

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

const extractBOW = async ( file ) => {
        return new Promise( (res, rej) => {
           
        } );    
}

const createBOW =  async ( files ) => {
    let BOW = [];
    
    await asyncForEach( files, async ( f ) => {
        let result = await fsP.readFile( lyricsPath+'/'+f , 'utf-8');
        if( JSON.parse(result).bow ){
            BOW = [...BOW, ...JSON.parse(result).bow];
        }
    } )
        
    console.log(BOW.length);
    return BOW
}        

const getFileList = (  ) => {
    fs.readdir( lyricsPath , ( err, files ) => {
        ( async() => {
            console.log('GetThe Files...');
            if( err ){ return new Error( 'Something went wrong while searching for the files...' )  }
             let result = await createBOW( files );
             console.log('REsult', result.length);
             let resultW = [...new Set(result)];
             console.log('REsultDup', resultW.length );
            fs.writeFile('./data/'+'bow.json', JSON.stringify( resultW ), ( error )=> {
                console.log('Finished');
                console.error(error);
            }  );
             //fs.writeFile( lyricsPath+'/'+'bow.json', result)
            } )()
        } );
};

const init = () => {
     getFileList();
}

init();