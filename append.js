const fs=require('fs');
//UPDATE (append)
fs.appendFile('example.txt','this is an appended line ',(err)=>{
    if(err) throw err;
    console.log('File updated (appended)!');
});
    console.log('1:synchronous compressDeflate.start);
   