let express = require('express');

let app = express();
app.use("/static", express.static("static"));

let port = 8000;
app.listen(port, function (){
    console.log("App Listening. " , port)
});
