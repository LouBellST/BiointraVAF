import * as React from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import CustomizedMenus from './Groupes'
import '../style/ajout_service.css'

import axios from 'axios';

function AjoutService(props) {
  const [filter, setFilter] = React.useState("Biomaps");
  const [nom, setNom] = React.useState("");
  const [lien, setLien] = React.useState("");


  const handleSubmit = async () => {
    try{
        if(nom !== "" && lien !== ""){
            const response = await axios.post(`http://localhost:8080/newService`, {nom: nom, lien: lien, groupe: filter});
            props.setActiveSection(1);
            console.log(response)
        }
    }catch(e) {
        console.log(e);
    }
  }

  return (   
    <form action="" className="container">
        <div className="formulaire">
            <h1 className="h1FormService">Nouveau Service</h1>

            <div className="inputGroupement">
                <label htmlFor="nom">Nom du service</label>
                <input placeholder='Webmail' value={nom} onChange={(e) => setNom(e.target.value)} type="text" id='nom' name="nom"/>
            </div>

            <div className="inputGroupement">
                <label htmlFor="lien">Lien du service</label>
                <input placeholder='https://webmail.fr/' value={lien} onChange={(e) => setLien(e.target.value)} type="text" id='lien' name="lien" />
            </div>

            <CustomizedMenus id={0} filter={filter} setFilter={setFilter}/>
            <div className='Boutons'>
                <Button type="submit" onClick={(e) => {e.preventDefault(); handleSubmit();}} variant="outlined" sx={{ ml: 2, my: 7, width: 155, border: '1px solid #fff', color: '#fff', boxShadow: 2, '&:hover': {border: '1px solid #fff', bgcolor: '#fff1', boxShadow: 5, color: '#fff'}}}>Enregistrer</Button>
                <Button type="submit" onClick={(e) => {e.preventDefault(); props.setActiveSection(1)}} variant="outlined" sx={{ ml: 2, my: 7, width: 155, border: '1px solid #fff', color: '#fff', boxShadow: 2, '&:hover': {border: '1px solid #fff', bgcolor: '#fff1', boxShadow: 5, color: '#fff'}}}>Annuler</Button>
            </div>
        </div>
    </form> 
  )
}

export default AjoutService