const lorca = require('lorca-nlp');
const dataBOW = require('../data/bow.json');

let stringData = '';

dataBOW.forEach(  d => {
    stringData = stringData+' '+d; 
} );
var doc = lorca(stringData);

console.log( doc.sentiment() );