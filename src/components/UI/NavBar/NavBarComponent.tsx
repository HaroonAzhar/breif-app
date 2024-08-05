import React, {useContext, useState} from "react";
import {AppBar, Button, Hidden, IconButton, Menu, MenuItem, Toolbar, useMediaQuery } from "@material-ui/core";
import logo from "../../../assets/logo.png";
import styles from "./styles.module.css";
import {Link, useHistory, useLocation} from "react-router-dom";
import classNames from "classnames";
import UserContext from "../../../Context/UserContext";
import MenuIcon from '@material-ui/icons/Menu';

export function NavBarComponent() {
    const history = useHistory();
    const location = useLocation();
    const isMobile = useMediaQuery('(max-width: 1000px)');

    const {user} = useContext(UserContext);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const navItems = [
        {
            id: 0,
            name: "Home",
            link: "/"
        },
        {
            id: 1,
            name: "News",
            link: "/news"
        },
        // {
        //     id: 2,
        //     name: "Start Now",
        //     link: "/form"
        // },
        {
            id: 2,
            name: "Pricing",
            link: "/pricing"
        },
        {
            id: 3,
            name: "How it Works",
            link: "/about"
        }
    ];

    const [selectedLink, setSelectedLink] = useState(navItems.find(item => item.link === location.pathname)?.id || 0);

    const handleRedirect = (link: any) => {
        setSelectedLink(link.id);
        setTimeout(() => history.push(link.link), 500);
    }

    const handleNavItemClick = (link: any) => {
        setAnchorEl(null);
        setSelectedLink(link.id);
    }

    return <div>
        <AppBar position="fixed" style={{background: "#FF5757", boxShadow: "none"}}>
            <Toolbar>
                <img
                    src={logo}
                    className={styles.logo}
                    alt='logo'
                    onClick={() => handleRedirect({id: 0, link: "/"})}
                />


                <div className={styles.rightBox} style={!isMobile ? {display: "flex"} : {}}>
                    <Hidden mdDown>
                        <div className={styles.links} style={{color: "#FFFFFF"}}>
                            {
                                navItems.map(item =>
                                    <Link key={item.id} to={item.link} onClick={() => handleNavItemClick(item)}
                                          className={classNames(styles.navItem, selectedLink === item.id && styles.selectedNavItem)}>
                                        {item.name}
                                    </Link>)
                            }
                        </div>
                    </Hidden>


                    <Hidden lgUp>
                        <IconButton style={{color: "white"}} color="primary" aria-label="Menu" component="span" onClick={handleClick}>
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            keepMounted={false}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            onClick={handleClose}
                        >
                            {navItems.map((item, i) => 
                            <MenuItem key={i} onClick={() => history.push(item.link)}>
                                {item.name}
                            </MenuItem>)}
                        </Menu>
                    </Hidden>


                    {!user && <Button color={"primary"} style={{color: "white", borderColor: "white"}} variant={"outlined"} onClick={() => history.push("/login")}>Sign in / Sign up</Button>}

                    {user && <Button color={"primary"} style={{color: "white", borderColor: "white"}} variant={"outlined"} onClick={() => history.push("/dashboard")}>Account</Button>}
                </div>
            </Toolbar>
        </AppBar>
    </div>
}
