const express =require('express');
const mysql =require('mysql');   // mysql npm package import kia
// usage of mysql npm package this is already written on npm website
const app =express();
//ek error show hota so this pacakge needed
const cors =require('cors');
app.use(cors());

app.use(express.json());

const db = mysql.createConnection({                         

  host     : 'localhost',
  user     : 'root',
  password : 'Sneha',
  database : 'travel',
  
});
db.connect((err)=> {
  if(err){
    console.log("not connected");

  }
  else{
    console.log("Mysql connected");
    
  }
});
// route se humne ek path de dia to access the data of backend
  
app.get('/place', (req, res) => {
  const city = req.query.city;
  const interest = req.query.interest;

  const query = "SELECT * FROM place WHERE city = ? AND category = ?";
  db.query(query, [city, interest], (err, results) => {
    if (err) {
      res.status(500).send("error");
    } else {
      res.json(results);
    }
  });
});


app.listen(3000,()=>{
  console.log('server runing on port 3000');
});