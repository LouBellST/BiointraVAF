const express = require('express');
const app = express()
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser')
const { authenticateUser, getUser } = require('./ldap.js');


app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use("/files", express.static("files"))



// ------ db connection

const mongoURI = 'mongodb://127.0.0.1:27017/biomaps';
mongoose.connect(mongoURI)
.then(() => {
	console.log("CONNECTION OPEN")
})
.catch(err => {
	console.log("ERROR");
	console.log(err)
})



// ------ files storage

const storage = multer.diskStorage({
	destination: function(req, file, cb){
		cb(null, "./files");
	},
	filename: function(req, file, cb){
		const uniqueSuffix = Date.now();
		cb(null, uniqueSuffix + file.originalname);
	}
});
const upload = multer({ storage: storage });



// ------ schemas

const { serviceSchema, userSchema, infoSchema, filesSchema } = require('./Schemas.js')

const Service = mongoose.model('Service', serviceSchema);
const User = mongoose.model('User', userSchema);
const Info = mongoose.model('Info', infoSchema);
const Files = mongoose.model('Files', filesSchema);



// ------ getters

app.get('/user/:userNom', async (req, res) => {
	const { userNom } = req.params;
	const user = await User.findOne({nom: userNom})
	res.send(user);
})

app.get('/services', async (req, res) => {
	const allServices = await Service.find();
	res.send(allServices)
})


app.get('/infos', async (req, res) => {
	const information = await Info.find();
	res.send(information)
})


app.get('/files', async (req, res) => {
	try{
		Files.find().then((data) => {
			res.send({ status: "ok", data: data });
		})
	}catch(e){
		res.json({ status: e })	}
})



// ------ setters

app.post('/upload', upload.single('file'), async (req, res) => {
	console.log(req.file);
	const { title, groupe } = req.body;
	const { filename } = req.file;
	try{
		await Files.create({ title: title, pdf: filename, groupe: groupe });
		res.send({ status: "ok" })
	}catch(e){
		console.log("erreur upload file API" + e)
		res.json({ status: e })
	}
})

app.post('/files/:pdf/delete', async (req, res) => {
	const { pdf } = req.params;
	try{ 
		await Files.deleteOne({ pdf: pdf });
		res.send({ status: "ok" })
	}catch(e){
		console.log("erreur upload file API" + e)
		res.json({ status: e })
	}
})

app.post('/infos', async (req, res) => {
	const { value } = req.body;
	await Info.findOneAndUpdate({name: "infoName"}, {info: value})
	res.send("new info")
})

app.post('/favoris/:userNom/:id', async (req, res) =>{
	const { userNom,id } = req.params;
	let newFav = await Service.findOne({_id: id})
	let user = await User.findOne({nom: userNom})
	const isIn = user.favoris.some(f => f.nom === newFav.nom);
	if(!isIn){
		await User.findOneAndUpdate({nom: userNom}, {$push: {favoris: newFav}})
		res.send("new favorite added");
	}else{
		res.send("new favorite not added");
	}
})

app.post('/favoris/:userNom/:id/delete', async (req, res) =>{
	const { userNom,id } = req.params;
	let fav = await Service.findOne({_id: id})
	await User.findOneAndUpdate({nom: userNom}, {$pull: {favoris: fav}})
	res.send("favorite deleted");
})


app.post('/auth', async (req, res) =>{
	const { username, password } = req.body;
	try{	
		let userObject = await User.find({mail: username, mdp: password});
		res.send([true, userObject])
	}catch(e){
		res.json({ status: e })
	}

	/*
	const { username, password } = req.body;
	try{	
		let auth = await authenticateUser(username, password)
		if(auth){
			let user = await getUser(username, password)
			const isAdmin = user.attributes.length == 3 ? true : false
			console.log(isAdmin)
			user = user.attributes[0].values[0];

			let userInDB = await User.find({nom: user});
			if(!userInDB.length){
				await User.create({nom: user, admin: isAdmin, favoris: []})
			}

			let userObject = await User.find({nom: user});
			res.send([auth, userObject])
		}else{
			res.send([auth, null])
		}
	}catch(e){
		res.json({ status: e })
	}
	*/
})

app.post('/newService', async (req, res) => {
	const { nom, lien, groupe } = req.body;
	try{
		await Service.create({nom: nom, lien: lien, groupe: groupe});
		res.send("Service créé")
	}catch(e){
		res.json({ status: e })
	}
})

app.post('/delete/:id', async (req, res) =>{
	const { id } = req.params;
	try{
		const service = await Service.findOne({_id: id});
		const users = await User.find();
		for(let user of users){
			const isIn = user.favoris.some(f => f.nom.toLowerCase() === service.nom.toLowerCase());
			if (isIn){
				const favorisAEnlever = user.favoris.find(f => f.nom.toLowerCase() === service.nom.toLowerCase());
				await User.findOneAndUpdate(user, {$pull: { favoris: { nom: favorisAEnlever.nom } }})
			}
		}
		await Service.deleteOne({_id: id});
		res.send(true)
	}catch(e){
		res.json({ status: e })
	}
})



app.listen(8080, () => {
	console.log('server listening on port 8080');
})