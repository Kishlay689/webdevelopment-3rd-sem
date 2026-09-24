const fs=require('fs');
//UPDATE
fs.writeFile('example.txt','this is an updated file ',(err)=>{
    if(err) throw err;
    console.log('File overwritten(updated)!');
});
