import * as React from 'react'
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';

import '../style/accueil.css'
import ModuleCard from './ModuleCard'
import InfoCard from './Card'
import SearchBar from './SearchBar'
import bin from '../ressources/bin.png'

import axios from 'axios';

function Accueil(props) {

  const [listeServices, setListeServices] = React.useState([]);
  const [q, setQ] = React.useState("");   // query de la barre de recherche d'ajout de favoris
  const [open, setOpen] = React.useState(false);  // drawer
  const [count, setCount] = React.useState(2);  // pour ralentir les refresh avec useEffect
  const [modifierIcons, setModifierIcons] = React.useState('none');  // icone de loupe qui s'affiche ou non quand on clique dessus
  const [toggleCount, setToggleCount] = React.useState(1);  // toggle pour afficher et masquer les icones de modification (bin et edit logo) 
  const [toggleCountInput, setToggleCountInput] = React.useState(1);  // toggle a passer dans l'info card pour toggle l'affichage de l'input pour entrer un nouveau message d'info
  const [modifierText, setModifierText] = React.useState('Modifier');
  const [listeFavoris, setListeFavoris] = React.useState([]);



  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleNewFav = (newFav) => async () => {
    try{
      await axios.post(`http://localhost:8080/favoris/${props.user.nom}/${newFav._id}`);
      setCount(count + 1);
    }catch(e){
      console.log(e);
    }
  };

  const handleSupprFav = (newFav) => async () => {
    try{
      await axios.post(`http://localhost:8080/favoris/${props.user.nom}/${newFav._id}/delete`);
      setCount(count + 1);
    }catch(e){
      console.log(e);
    }
  };

  const toggleModifier = () => () => {
    setToggleCount(toggleCount + 1);

    if(toggleCount % 2 === 0){
      setModifierIcons('none');
      setModifierText('Modifier');
      setToggleCountInput(1);
    }
    else{
      setModifierIcons('block');
      setModifierText('terminer');
    }
  }

  const fetchData = async () => {
    try{
      const myData = await axios.get('http://localhost:8080/services').then((res) => res.data);
      setListeServices(myData);
      const success = await axios.get(`http://localhost:8080/user/${props.user.nom}`).then((res) => res.data);
      setListeFavoris(success.favoris);
    }catch(e){
      console.log(e);
    }
  }


  
  React.useEffect(() => {
    fetchData();
  }, [count])
  

  
  const DrawerList = (
    <Box sx={{ backgroundAttachment: 'fixed', overflowY: 'scroll', height: '100%', textAlign: 'center', width: 400, display: 'flex', flexDirection: 'column', bgcolor: '#fff', color: '#333', pt: 2 }} role="presentation" >
      
      <h1>Services</h1>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', mb: 3}}>
        <SearchBar placeH="Service" q={q} setQ={setQ}/>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap' }} onClick={toggleDrawer(false)}>
        {listeServices == null ? "" : listeServices.map((service, index) => {
          if(q === "" || service.nom.toLowerCase().includes(q.toLowerCase()) ) {
          return (
            <Box onClick={handleNewFav(service)}>
              <ModuleCard key={index} text={service.nom.toUpperCase()} style="flex-end" color="#333" boxShadow={5} fontsize={13} />
            </Box>
          )}
        })}
      </Box>

    </Box>
  );


  return (   
    <div className="accueil">
      <div className="card">
        <div className="modifierContainer">
          <InfoCard toggleCount={toggleCountInput} setToggleCount={setToggleCountInput} user={props.user} display={modifierIcons} />
          <Button onClick={toggleModifier()} className="modifier" sx={{ mt: 5, mx: 0, color: '#fff'}}>{modifierText}</Button>
        </div>
      </div>

      
      <h1 className="bienvenue">Bienvenue {props.user.nom} !</h1>
      <h1 className="favorisTitle">Favoris</h1>

      <div className="elementsAccueil">
        <div className="listeModulesAccueil">
          {listeFavoris == null ? "" : listeFavoris.map((service, index) => (
                <div className="favLink">
                  <a href={service.lien} target="_blank" rel="noopener noreferrer">
                    <ModuleCard key={index} text={service.nom.toUpperCase()} style="flex-end" fontsize={13} />
                  </a>
                  <Button sx={{ position: 'absolute', top: '25px', right: '10px', display: `${modifierIcons}` }} onClick={handleSupprFav(service)} className="deleteFav"><img src={bin} alt="" /></Button>
                </div>
              
              )
          )}
          <Box onClick={toggleDrawer(true)} >
            <ModuleCard key={"add"} text={"+"} style="center" fontsize={40}/>
          </Box>
        </div>

        <Drawer anchor='right' open={open} onClose={toggleDrawer(false)}>
          {DrawerList}
        </Drawer>
        
      </div>
    </div>
  )
}

export default Accueil