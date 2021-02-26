const express = require('express')
const app = express()
const port = 3000
const mysql = require('mysql')
const pool = mysql.createPool({
    host: 'dbNode',
    user: 'root',
    password: 'root',
    database: 'nodedb',
    charset: 'utf8'
}); 
 
 
var html ='<html><head><title>Full Cycle Rocks!</title></head><body><h1>Full Cycle Rocks!</h1>{${table}}</body></html>';
 
function setResHtml(sql, cb){
    pool.getConnection((err, con)=>{
    if(err) throw err;

    con.query(sql, (err, res, cols)=>{
      if(err) throw err;

      var table ='';  

      for(var i=0; i<res.length; i++){
        table +='<tr><td>'+ res[i].id +'</td><td>'+ res[i].name +'</td></tr>';
      }
      table ='<table border="1"><tr><th>Nr.</th><th>Name</th></tr>'+ table +'</table>';

      con.release(); 

      return cb(table);
    });
  });
}

let sql ='SELECT id,name FROM people ORDER BY name';

app.get('/',(req,res) =>{
    setResHtml(sql, resql=>{
        html = html.replace('{${table}}', resql); 
        res.write(html, 'utf-8');
        res.end();
      });
})
 
app.listen(port , ()=> console.log('rodando na porta ' + port))