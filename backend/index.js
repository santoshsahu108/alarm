var express = require("express");
var cors = require("cors");

var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });



fs.writeFileSync("data.json", "[]");

app.use(cors());


const port = 3000;

app.get("/getalarm", (req, res) => {
  const data = fs.readFileSync("data.json", { encoding: "utf8", flag: "r" });
  res.send(data);
});

app.post("/setalarm", urlencodedParser, function (req, res) {
   const bb =  setAlarm(req,res)
  res.send(bb)
});

app.post("/updatealarm",urlencodedParser, function (req, res) {
  const cc =  updateAlarm(req,res)
  res.send(cc)
});

app.get("/ringalarm",urlencodedParser, function (req, res) {
  let a = false
  const zeroFill = n => {
    return ('0' + n).slice(-2);
  }
  const now = new Date();

			// Format date as in mm/dd/aaaa hh:ii:ss
			const dateTime = zeroFill(now.getHours()) + ':' + zeroFill(now.getMinutes()) + ':' + zeroFill(now.getSeconds());
  

 const data = fs.readFileSync("data.json", { encoding: "utf8", flag: "r" });
 const arr = JSON.parse(data);
    for (let index = 0; index < arr.length; index++) {
      console.log("AAAAAAAAAaaaaaaaaaa",dateTime,Object.values(arr[index])[0])
      if(dateTime === Object.values(arr[index])[0]){
        a = true
 
      }
    }
    console.log(a)
    res.send(a)
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


function setAlarm(req,res){
  const data = fs.readFileSync("data.json", { encoding: "utf8", flag: "r" });
    const arr = JSON.parse(data);
    var count = arr.length + 1;
    console.log("SSSSSSSSSSSSSSS", req.body.alarm);

   console.log("arr.length - ",arr.length)
  console.log("array stored alarm",arr)
    for (let index = 0; index < arr.length; index++) {

        console.log("count",  count);
        console.log("arr -> index ",index)
       

      if (req.body.alarm == Object.values(arr[index])[0]) {
        return ("alarm already set...!!");
        // res.end()
      } 
    }
    if(count> 1){
         // Prepare output in JSON format
         console.log("in else")
         let obj = {};
         let keys = `alarm_no_${count}`;
        
     
         response = Object.defineProperty(obj, keys, {
           value: req.body.alarm,
           writable: true,
           enumerable: true,
           configurable: true,
         });
         arr.push(response);
         console.log(arr);
         
         //    res.end("Alarm set for "+JSON.stringify(response.setAlarm));
         fs.writeFileSync("data.json", JSON.stringify(arr));
         return ("Alarm set for " + JSON.stringify(response));
    }
    if(count === 1){
        let obj = {};
        let keys = `alarm_no_${count}`;
        
    
        response = Object.defineProperty(obj, keys, {
          value: req.body.alarm,
          writable: true,
          enumerable: true,
          configurable: true,
        });
        arr.push(response);
        console.log(arr);
       
        //    res.end("Alarm set for "+JSON.stringify(response.setAlarm));
        fs.writeFileSync("data.json", JSON.stringify(arr));
        return ("Alarm set for " + JSON.stringify(response));
        
    }
}

function updateAlarm(req,res){
  console.log("In update alarm function")
  const data = fs.readFileSync("data.json", { encoding: "utf8", flag: "r" });
    const arr = JSON.parse(data);
    const newArr = []
    let toReturn = "" 
    for (let index = 0; index < arr.length; index++) {
      if(req.body.alarmName === Object.keys(arr[index])[0]){
        console.log(Object.keys(arr[index])[0],Object.values(arr[index])[0],req.body.alarmTime)
        let obj = {};
        arr[index] =  Object.defineProperty(obj,req.body.alarmName , {
          value: req.body.alarmTime,
          writable: true,
          enumerable: true,
          configurable: true,
        });
        console.log("aaaaaaaaaaaaaaaar",arr[index])
        
        newArr.push(arr[index])
        const a = "alarm got changed to --"+Object.values(arr[index])[0]
        console.log("a",a)
        toReturn =  a
      }else{
        newArr.push(arr[index])
        toReturn = "Alarm not present for given name !!!!!"
        
      }
      
      
    }
    if(arr.length == 0){
      return "no alarm present in record"
    }
    fs.writeFileSync("data.json", JSON.stringify(newArr));
    return toReturn
    

}