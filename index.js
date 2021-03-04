const express = require("express");

const mysql = require("mysql");

const cors = require("cors");

const dotenv = require('dotenv');

const jwt = require("jsonwebtoken");

const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const upload = require("express-fileupload");

const app = express();
app.use( bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(cors());
app.use(upload());

const middleware = ()=>{

}

const conn = mysql.createConnection({
	user:'sujay_php',
	database:'user_login',
	host:'localhost',
	password:'Sujay@1234'
});
conn.connect((err)=>{
	if(err)console.log("database is not connectd");
	else console.log("database is connected");
	app.listen(3000, ()=>{console.log("server started at port 3000")});
})


app.get("/", (req, res)=>{
	res.sendFile(__dirname + "/html/index.html");
});
app.get("/user", (req, res)=>{
	console.log(req);
	res.sendFile(__dirname + "/html/index2.html");
})
app.get("/dob", (req, res)=>{
	console.log(req);
	res.sendFile(__dirname + "/html/index3.html");
})

app.post("/api/insertdob", (req, res)=>{
	let email = req.body.email;
	let dob = req.body.dob;
	let query = `insert into dob(email, dob)values('${email}', '${dob}');`;
	conn.query(query, (err, result)=>{
		if(err){
			console.log(err);
		}
		else{
			res.status(200);
		}
	});
})
app.post("/api/createuser", (req, res)=>{
	let name = req.body.name;
	let email = req.body.email;
	let password = req.body.password;
	password = bcrypt.hashSync(password, 8);

	let query = `select * from users where email = '${email}';`;
	conn.query(query, (err, result)=>{
		if (result.length == 0){
			let q = `insert into users(name, email, password) values('${name}', '${email}', '${password}');`;
			conn.query(q, (err, result)=>{
				if(err){
					console.log(err);
					res.status(500).end();
				}else{
					let token = jwt.sign({name:name, email:email }, "sujay", {
      					expiresIn: 86400 
    					});

					res.status(201).send({ auth: true, token: token });
				}
			})

		}else{
			res.json({"status":"user already exists"}).status(302);
		}
	})
})

app.post("/", (req, res)=>{
	console.log(req.files, req.body.dob);
	if(req.files){
		let file = req.files.file;
		let name = file.name;
		file.mv("./uploads/"+name, (err)=>{
			if(err){
				console.log(err);
			}else{
				res.send("Success Image uploaded");
			}
		})
	}
})