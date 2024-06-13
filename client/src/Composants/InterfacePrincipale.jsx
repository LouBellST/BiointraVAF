import { useState } from 'react'
import Box from '@mui/material/Box';

import '../style/interface_principale.css'
import Accueil from './Accueil'
import Services from './Services'
import Procedures from './Procedures'
import Login from './Login'
import AjoutService from './AjoutService';
import AjoutProcedure from './AjoutProcedure';


// wrap les differents elements globaux
function InterfacePrincipale(props) {
  const [procedure, setProcedure] = useState(null)

  const ecrans = [<Accueil user={props.user}/>,
  <Services user={props.user} setActiveSection={props.setActiveSection}/>, 
  <Procedures setProcedure={setProcedure} user={props.user} setActiveSection={props.setActiveSection} />, 
  <Login setUser={props.setUser} setActiveSection={props.setActiveSection} setIsConnected={props.setIsConnected} setShowDrawer={props.setShowDrawer} setShowNav={props.setShowNav} setBg={props.setBg} />,
  <AjoutService setActiveSection={props.setActiveSection}/>,
  <AjoutProcedure setActiveSection={props.setActiveSection}/>
]


  return (   
    <Box onClick={() => props.setShowInput(false)} sx={{ background: `${props.bg}` }} className="background">
      <div className="overlay">
        {ecrans[props.activeSection]}
      </div>
    </Box>
    
  )
}

export default InterfacePrincipale