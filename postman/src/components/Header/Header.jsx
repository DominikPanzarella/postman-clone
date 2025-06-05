import { makeStyles } from "@mui/styles";
import { AppBar, Toolbar } from "@mui/material";
import logo from "../../assets/http-hub-logo.svg";

const useStyles = makeStyles({
    logo: {
        width: 100,
        padding: 5
    },
    navbar: {
        background: ['#000', '!important'],
        position: ['static', '!important'],
        height: [50, '!important']
    }
})

const Header = () => {
    const classes = useStyles();

    return (
        <div style={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
            <img src={logo} alt="logo" className={classes.logo} />
            <div style={{ marginLeft: 15 }}>
                <h1 style={{ margin: 0 }}>PostmanWrapper</h1>
            </div>
        </div>
    );
}

export default Header;