let den = new Promise(function(resovle,reject){
    
    if(false){
        resovle("Done")
    }else{
        reject("Rejected")
    }
})

den.then((value)=>{
    console.log(value)
}).catch((error)=>{
    console.log(error)
})