const mysql= require('mysql');
const express=require('express');

var app=express();
const bodyparser= require('body-parser')

//app.use(bodyparser.json())

const urlencodedParser= bodyparser.urlencoded({extended:false})

const db= mysql.createConnection({
    host:"my-database-2.ckzhctwng9de.us-east-1.rds.amazonaws.com",
    port:"3306",
    user:"admin",
    password:"admin123",
    database:"complaints"
})

db.connect((err)=>{
    if(!err){
        console.log('DB connection succeded')
    }else{
        console.log('connection failed')
    }
})

app.listen(5000,()=>{
    console.log('server started on 3306 ')

})


app.set('view engine','ejs')

/*app.get('/',(req,res)=>{
    console.log('hi')
    let sql= "SHOW TABLES"
    db.query(sql,(err,result)=>{
        if(!err){
            console.log(result)
            res.send('displaying tables')
        }else{
            console.log(err)
        }
    })
})

app.get('/table',(req,res)=>{
    let sql="CREATE TABLE user (id int AUTO_INCREMENT,fullname VARCHAR(50),password VARCHAR(20),type VARCHAR(40), PRIMARY KEY(id))"
    db.query(sql,(err,result)=>{
        if(!err){
            console.log('table created')
        }else{
            console.log(err)
        }
    })

})

app.get('/comTable',(req,res)=>{
    let sql="CREATE TABLE complaints (com_id int AUTO_INCREMENT,user_id int,name VARCHAR(50),complaint VARCHAR(1000),solution VARCHAR(1000),PRIMARY KEY(com_id), FOREIGN KEY(user_id) REFERENCES user(id))"
    db.query(sql,(err,result)=>{
        if(!err){
            console.log(result)
            res.send(result)
        }else{
            console.log(err)
        }
    })
})*/

app.get('',(req,res)=>{
    res.render('register')
})

app.get('/insertData',(req,res)=>{
    let sql="INSERT INTO user (id,fullname,password,type) values (2,'Ruchi','123456','customer')"
    db.query(sql,(err,result)=>{
        if(!err){
            console.log(result)
         
        }else{
            console.log(err)
        }
    })
})


app.get('/showData',(req,res)=>{
    let sql="SELECT * FROM complaints"
    db.query(sql,(err,rows,fields)=>{
        if(!err){
            console.log(rows)
            sub='YASHU'
            res.render('list' ,{rows: rows})
        }else{
            console.log(err)
        }
    })
})

app.post('/complaint',urlencodedParser,(req,res)=>{
    let data=req.body;
    var idsql;
    console.log(req.body)
    db.query("SELECT id FROM user where fullname= ?",[data.name],(err,result)=>{
        if(!err){
            idsql=result;

        }else{
            console.log(err)
        }
    })
    var sql="INSERT INTO complaints (user_id,name,complaint,solution) VALUES (?,?,?,?)"

    db.query(sql,[idsql,data.name,data.complaint,data.solution],(err,result)=>{
        if(!err){
            console.log(result)
            const alert='your complaint is registered. We will fix it soon'
            res.render('complaint',{alert:alert})
        }else{
            console.log(err)
        }
    })

})

app.post('/login',urlencodedParser,(req,res)=>{
    var data=req.body;
    let sql='SELECT * FROM user WHERE fullname=? AND password=?;'
    console.log(data.fullname,data.password)
    db.query(sql,[data.fullname,data.password],(err,result)=>{
        if(!err){
            if(result.length<=0){
                res.send("error: login again")

            }else{
                console.log("hello",result[0].type)
                if(result[0].type=="service"){
                    let sql_list="SELECT * FROM complaints"
                    db.query(sql_list,(err,rows,fields)=>{
                        if(!err){
                            console.log(rows)
                            sub='YASHU'
                            res.render('list' ,{rows: rows})
                        }else{
                            console.log(err)
                        }
                    })
                }else{
                    const alert=''
                    res.render('complaint',{alert:alert})
                }
            }
            
        }else{
            console.log(err)
        }
    })
})