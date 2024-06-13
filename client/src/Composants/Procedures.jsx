import * as React from 'react'

import '../style/procedures.css'

import CustomizedMenus from './Groupes'
import ModuleCard from './ModuleCard'
import SearchBar from './SearchBar'

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import bin from '../ressources/bin.png'

import axios from 'axios';

function Procedures(props) {

  const listeFilters = ["Stagiaire", "Matériel"];
  const [listeProcedures, setListeProcedures] = React.useState([]);
  const [filter, setFilter] = React.useState("Stagiaire");
  const [q, setQ] = React.useState("");
  const [afficherBin, setAfficherBin] = React.useState('none');
  const [count, setCount] = React.useState(0);
  const [textSuppr, setTextSuppr] = React.useState("Supprimer");
  const [refresh, setRefresh] = React.useState(0);

  const toggleAffichage = () => {
    setCount(count + 1);

    if(count%2 == 0){
      setAfficherBin('block');
      setTextSuppr("Terminer");
    }else{
      setAfficherBin('none');
      setTextSuppr("Supprimer");
    }
  }

  const handleSupprProcedure = async (pdf) => {
    try{
      await axios.post(`http://localhost:8080/files/${pdf}/delete`);
      setRefresh(refresh + 1);
    }catch(e){
      console.log(e);
    }
  }

  const fecthData = async () => {
    try{
      const result = await axios.get('http://localhost:8080/files').then((res) => res.data);
      setListeProcedures(result.data);
    } catch(e){
      console.log(e);
    }
  }

  React.useEffect(() => {
    fecthData();
  }, [refresh])
  

  
  const boutonsAdmin = (props.user.admin) ? (
    <div className="BoutonsModifs">
      <Button onClick={() => {if(props.user.admin){props.setActiveSection(5)}else{alert("Vous n'avez pas la permission.")} } } sx={{my: 2, ml: 2, border: '1px solid #fff1', bgcolor: '#fff2', backdropFilter: 'blur(4px)', color: '#fff', boxShadow: 2, '&:hover': {border: '1px solid #fff1', bgcolor: '#fff1', color: '#fff'}}} variant="outlined">Ajouter une Procédure</Button>
      <Button onClick={() => {if(props.user.admin){toggleAffichage()}else{alert("Vous n'avez pas la permission.")} } } sx={{my: 2, ml: 2, border: '1px solid #fff1', bgcolor: '#fff2', backdropFilter: 'blur(4px)', color: '#fff', boxShadow: 2, '&:hover': {border: '1px solid #fff1', bgcolor: '#fff1', color: '#fff'}}} variant="outlined">{textSuppr}</Button>
    </div>
  ) : null;
  
  return (   
    <div className="container">
      <div className="procedures">
        <h1 className="proceduresLabels">Procédures</h1>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
          <CustomizedMenus id={1} filter={filter} setFilter={setFilter} />
          <SearchBar placeH="Procédure" q={q} setQ={setQ}/>
        </Box>
        {boutonsAdmin}
        
        <div className="listeProcedures">
          {listeProcedures == null ? "" : listeProcedures.map((p, index) => {
            if(p.groupe.toLowerCase() === filter.toLocaleLowerCase() && (q === "" || p.title.toLowerCase().includes(q.toLowerCase()) ) ){
            return (
              <div className="procedureContainer">
                <a href={`http://localhost:8080/files/${p.pdf}`} target="_blank"  rel="noreferrer">
                  <ModuleCard key={index} text={p.title.toUpperCase()} style="flex-end" fontsize={12} />
                </a>
                <Button sx={{ position: 'absolute', top: '25px', right: '10px', display: `${afficherBin}` }} onClick={() => handleSupprProcedure(p.pdf)} className="deleteFav"><img src={bin} alt="" /></Button>   
              </div>
            )}
          })}
        </div>


      </div>   
    </div> 
  )
}

export default Procedures