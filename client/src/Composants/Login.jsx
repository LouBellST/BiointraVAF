import { useState } from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';

import '../style/login.css'
import paysage from '../ressources/paysagePetit.jpg'

import axios from 'axios';

  
function Login(props) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [incorrect, setIncorrect] = useState('none');
  const [typeInput, setTypeInput] = useState(2);

  const inputTypes = ["password", "text"];


  const authentifier = async () => {
    try{
      const auth = await axios.post('http://localhost:8080/auth', {username: username, password: password})
      console.log(auth.data)
      if(auth.data[0]){
        props.setUser(auth.data[1][0])
        handleConnection();
      }else{
        setIncorrect('block');
      }
    }catch(e){
      console.log(e);
    }
  }

  const handleConnection = () => {
    props.setIsConnected(true)
    props.setActiveSection(0);
    props.setShowNav('block');
    props.setShowDrawer('flex')
    props.setBg(`center / cover no-repeat url(${paysage})`);
  }

  return (   
      <div className="overlayLogin">
        <Box className="loginCard" sx={{ boxShadow: 20, bgcolor: '#fff2', backdropFilter: 'blur(5px)', position: 'relative' }}>

          <form className="loginForm" action="">
            <Typography sx={{mx: 'auto', mb: 2 }} variant="h4" component="div">Se connecter</Typography>

            <Typography sx={{ color: '#d00', display: `${incorrect}`, mt: 2, position: 'absolute', top: 70 }} variant="h8" component="div">Vos identifiants sont incorrects</Typography>

            <label className="labelInputs" htmlFor="id">Identifiant</label>
            <input type="text" placeholder="jeandupont@gmail.com" name="id" value={username} onChange={(e) => setUsername(e.target.value)}/>

            <label className="labelInputs" htmlFor="mdp">Mot de passe</label>
            <div className="passwordInput">
              <input type={inputTypes[typeInput%2]} placeholder="Mot de passe" name="mdp" value={password} onChange={(e) => setPassword(e.target.value)}/>
              <Button onClick={() => setTypeInput(typeInput+1)} sx={{ position: 'absolute', right: 5, top: '6px', color: 'grey' }}>afficher</Button>
            </div>
  

            <FormControlLabel
            control={
              <Checkbox sx={{color: '#ddd'}} name="resterConnecte" />
            }
            label="Se souvenir de moi" sx={{color: 'white'}}
          />
            <Button type="submit" onClick={(e) => {e.preventDefault(); authentifier();}} variant="contained" sx={{width: 200, mt: 3, mx: 'auto', p: '10px 10px', borderRadius: 10, bgcolor: '#3a86ff'}} >Se connecter</Button>
          </form>

        </Box>
      </div>
  )
}

export default Login