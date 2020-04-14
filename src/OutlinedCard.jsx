import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    root: {
      minWidth: 275,
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
  });

const OutlinedCard = ({ label, value }) => {
    const classes = useStyles();
  
    return (
      <Card className={classes.root} variant="outlined">
        <CardContent>
          <Typography className={classes.title} color="textSecondary" gutterBottom>
            {label}
          </Typography>
          <Typography variant="h5" component="h2">
            {value}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">See list by countries</Button>
        </CardActions>
      </Card>
    );
}

export default OutlinedCard;