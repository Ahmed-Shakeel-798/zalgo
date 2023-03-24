
function asyncRead(callback) {
    setTimeout(function () {
        console.log("inside setTimout")
        // throw new Error("Some error happened")
        try{
        var json = '{"name":"John", "age":30, "car":null}'    
        var njson = {"name":"John", "age":30, "car":null};
        return callback(null, JSON.parse(njson));    
        }catch(err){
          return  callback(err);
        }
    }, 1000);
}



try{
asyncRead(function (err, result) {
    if(err){
        console.log(err);
    }
    console.log(result);
    return;
})    
}catch(err){
  console.log(err)  
} 

