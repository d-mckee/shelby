const express = require('express');
const app = express();
const admin = require("firebase-admin");
admin.initializeApp({
	credential: admin.credential.applicationDefault()
});
const db = admin.firestore();

// 'require's above

app.use(express.json());

app.get('/', (req, res) => {
	res.send('Hello from App Engine!');
});

// below solution is really hacky because no security protocol for entry of
// any kind of data to demo user... change in 'final' version
app.post('/submit/', (req, res) => {
	if(req.body.user == "demo"){  
		ref = db.collection("ratings").doc(Date());
		ref.set({
			user : req.body["user"],
			domain : req.body["domain"],
			datetime : Date(),
			answers : req.body["answers"]
		});
	}	
});

app.get("/user/", (req, res) => {
	ref = db.collection("users").doc(req.query.id).get()
	.then(doc => {
		if(!doc.exists) {
			res.send("Error: No user");
		} else {
			res.send(doc.data());
		}
	})
});

app.post("/user/create/", (req, res) => {
	if(typeof(req.body.user) == "string"){
		ref = db.collection("users").doc(req.body.user);
	}else{
		ref = db.collection("users").doc();
	}
	if(typeof(req.body.name) == "string"){
		ref.set({
			name : req.body.name,
			date_joined : Date(),
			affinity : {
				visual: 1,
				auditory : 1,
				verbal : 1,
				logical : 1,
				social : 1,
				solitary : 1
			},
			reports : {},
			img : req.body.img
		});
		res.send("Success!")
	}else{
		res.send("Error: No name specified!");
	}
});

// remove /test/ before 

app.get("/test/", (req, res) => {
	res.send(req.query);
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 7777;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
