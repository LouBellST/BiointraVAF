import * as React from 'react'
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

import '../style/moduleCard.css'

const DemoPaper = styled(Paper)(({ theme }) => ({
  width: 120,
  height: 120,
  padding: theme.spacing(2),
  ...theme.typography.body2,
  textAlign: 'center',
}));

export default function ModuleCard(props) {
  const color = props.color ? props.color : "#fff"
  const boxShadow = props.boxShadow ? props.boxShadow : 2
  return (
      <DemoPaper square={false} elevation={20} className="moduleCard" sx={{ textAlign: 'center', bgcolor: '#fff2', backdropFilter: 'blur(4px)', boxShadow: boxShadow, borderRadius: 3, color: color, fontSize: props.fontsize, border: 'solid 1px #fff2', '&:hover': {bgcolor: '#fff1'}, display: 'flex', flexDirection: 'column', justifyContent: `${props.style}` }}>{props.text}</DemoPaper>
  );
}
