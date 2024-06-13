import * as React from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import CustomizedMenus from './Groupes'
import '../style/ajout_procedure.css'

import axios from 'axios';

function AjoutProcedure(props) {
  const [groupe, setGroupe] = React.useState("Stagiaire");
  const [title, setTitle] = React.useState("");
  const [file, setFile] = React.useState("");


  const handleSubmit = async (e) => {
    try{
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("file", file);
        formData.append("groupe", groupe);
        const result = await axios.post("http://localhost:8080/upload", formData, {
            headers: {"Content-Type":"multipart/form-data"}
        })
        console.log(result)
        props.setActiveSection(2);
    }catch(e) {
        console.log(e);
    }
  }

  return (   
    <form onSubmit={handleSubmit} className="container">
        <div className="formulaire">
            <h1 className="h1Form">Nouvelle Procédure</h1>

            <div className="inputGroupement">
                <label htmlFor="title">Nom du fichier</label>
                <input required placeholder="Achat matériel" type="title" onChange={(e) => {setTitle(e.target.value)}} id='title' name="title" />
            </div>

            <div className="inputGroupement">
                <label htmlFor="file">Fichier</label>
                <input required onChange={(e) => setFile(e.target.files[0])} type="file" id='file' name="file" />
            </div>

            <CustomizedMenus id={1} filter={groupe} setFilter={setGroupe}/>
            <div className='Boutons'>
                <Button type="submit" variant="outlined" sx={{ ml: 2, my: 7, width: 155, border: '1px solid #fff', color: '#fff', boxShadow: 2, '&:hover': {border: '1px solid #fff', bgcolor: '#fff1', boxShadow: 5, color: '#fff'}}}>Enregistrer</Button>
                <Button type="submit" onClick={(e) => {e.preventDefault(); props.setActiveSection(2)}} variant="outlined" sx={{ ml: 2, my: 7, width: 155, border: '1px solid #fff', color: '#fff', boxShadow: 2, '&:hover': {border: '1px solid #fff', bgcolor: '#fff1', boxShadow: 5, color: '#fff'}}}>Annuler</Button>
            </div>
        </div>
    </form> 
  )
}

export default AjoutProcedure