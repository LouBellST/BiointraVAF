import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea } from '@mui/material';

import infoLogo from '../ressources/info.png'
import edit from '../ressources/edit.png'

import axios from 'axios';

// element d'information de la page d'accueil
export default function InfoCard(props) {

  const [infos, setInfos] = React.useState("Pas d'information aujourd'hui");
  const [valueInfo, setValueInfo] = React.useState("")
  const array = [<form action="" onSubmit={e => {handleSubmit(e)}}><input className="inputInfo" placeholder={infos} name='newInfo' value={valueInfo} onChange={(e) => setValueInfo(e.target.value)}/></form>, <Typography variant="body2" color="#fff9">{infos}</Typography>]
  const [refresh, setRefresh] = React.useState(0);


  const handleEdit = () => () => {
    if(props.user.admin){
      props.setToggleCount(props.toggleCount + 1);
    }else{
      alert("Vous n'avez pas les droits nécessaires.")
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      await axios.post('http://localhost:8080/infos', {value: valueInfo});
      setRefresh(refresh+1);
    }catch(e){
      console.log(e);
    }
    props.setToggleCount(props.toggleCount + 1);
  }

  const fetchData = async () => {
    try{
      const infosData = await axios.get('http://localhost:8080/infos').then((res) => res.data);;
      setInfos(infosData[0].info);
    }catch(e){
      console.log(e)
    }
  }

  React.useEffect(() => {
    fetchData();
  }, [refresh])
  

  const boutonAdmin = (props.user.admin) ? (
    <Button sx={{	position: 'absolute',top: '3px', right: '-10px', display: `${props.display}` }} onClick={handleEdit()} className="editInfo"><img src={edit} alt="" /></Button>
  ) : null;


  return (
    <Card sx={{ position: 'relative', boxShadow: 3, border: 'solid 0.5px #fff2', bgcolor: '#fff3', backdropFilter: 'blur(5px)', color: 'white', maxWidth: 345, borderRadius: 2, mx: 10, maxHeight: 400, minWidth: 350}} >
      {boutonAdmin}
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={infoLogo}
          alt="info"

          sx = {{ p: '15px 5px', objectFit: "contain"}}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Information
          </Typography>
          {array[props.toggleCount%2]}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}