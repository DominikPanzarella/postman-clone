import { Typography, Box } from "@mui/material";
import { makeStyles } from '@mui/styles';

const useStyle = makeStyles(
{
    container: {
        marginTop: 20,
        padding: 16
    },
    div:{
        width: '80%',
        padding: 10,
        background: `url(http://i.imgur.com/2cOaJ.png)`,
        backgroundAttachment: 'local',
        backgroundRepeat: 'no-repeat',
        paddingLeft: 35,
        paddingTop: 10,
        borderColor: '#ccc',
        fontFamily: 'monospace', 
        whiteSpace: 'pre-wrap',
        overflowY: 'auto', 
        height: '300px', // You can adjust the height as needed
        border: '1px solid #ccc',
    }
});

const ResponseJSON = ({data}) => {

    const classes = useStyle();

    const decodedData = atob(data);
    const jsonData = JSON.parse(decodedData);
    const json = JSON.stringify(jsonData, null,2);
      
    return (
      <Box>
          <Box
              className={classes.div}
              dangerouslySetInnerHTML={{ __html: json }}
          />
      </Box>
    );

  


};


export default ResponseJSON;