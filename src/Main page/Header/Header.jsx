import React, {useState} from 'react';
import backgroundImg from '../../images/background.jpg';
import logoImg from '../../images/logo.png'
import './Header.css';
//Імпорт усіх використаних тегів з MaterialUI
import {
    Box,
    Button,
    createTheme,
    Divider, Drawer, Link,
    List,
    ListItem,
    ListItemIcon,
    Menu,
    MenuItem,
    ThemeProvider,
    Tooltip
} from "@mui/material";

//Імпорт усіх використаних іконок з MaterialUI
import Avatar from '@mui/material/Avatar';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import {grey, yellow} from "@mui/material/colors";
import {Logout, Settings} from "@mui/icons-material";
import * as PropTypes from "prop-types";
import LoginIcon from '@mui/icons-material/Login';
//Палітра кольорів для елементів блоків MaterialUI
const theme = createTheme({
    status: {
        danger: '#e53e3e',
    },
    palette: {
        clicked_icon: {
            main: '#000000',
            darker: '#666666',
        },
    },
});

const Header = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <div className="background">
                <div className="header">
                    <div className="header_btns">
                        <Button
                            onClick={handleDrawerOpen}
                            className="Underheader_A"
                            sx={{
                                width: '7%',
                                height: 70,
                                color: grey[600],
                            }}
                        >
                            <img className="logo_class" src={logoImg} alt="backgroundImg" />
                        </Button>
                        <Drawer
                            anchor="left"
                            open={drawerOpen}
                            onClose={handleDrawerClose}
                            sx={{ width: 200 }}
                        >
                            <List sx={{backgroundColor: grey[500]}}>
                                <ListItem>
                                    <Button
                                        className="Underheader_A"
                                        sx={{
                                            width: '100%',
                                            height: 50,
                                            color: grey[100],
                                        }}
                                    >
                                        Головна
                                    </Button>
                                </ListItem>

                                <ListItem>
                                    <Button
                                        className="Underheader_A"
                                        sx={{
                                            width: '100%',
                                            height: 50,
                                            color: grey[100],
                                        }}
                                    >
                                        Можливості
                                    </Button>
                                </ListItem>
                                <ListItem>
                                    <Button
                                        className="Underheader_A"
                                        sx={{
                                            width: '100%',
                                            height: 50,
                                            color: grey[100],
                                        }}
                                    >
                                        Підписка
                                    </Button>
                                </ListItem>
                                <ListItem>
                                    <Button
                                        className="Underheader_A"
                                        sx={{
                                            width: '100%',
                                            height: 50,
                                            color: grey[100],
                                        }}
                                    >
                                        Політика
                                    </Button>
                                </ListItem>
                                <ListItem>
                                    <Button
                                        className="Underheader_A"
                                        sx={{
                                            width: '100%',
                                            height: 50,
                                            color: grey[100],
                                        }}
                                    >
                                        Підтримка
                                    </Button>
                                </ListItem>
                            </List>
                        </Drawer>
                        <Profile />
                    </div>
                </div>
                <div className="welcome">
                    <h1>Office Track Pro</h1>
                    <br />
                    <h5>Абсолютний контроль, простота ведення, вища продуктивність</h5>
                    <br />
                    <Button
                        className="more_btn"
                        variant="contained"
                        sx={{
                            maxWidth: 279,
                            height: 50,
                            color: grey[100],
                            backgroundColor: grey[700],
                        }}
                    >
                        Дізнатися більше
                    </Button>
                </div>
            </div>
        </ThemeProvider>
    );
};


const Profile = () => {
    const user_info = {
        name: 'Никита',
        surname: 'Покора',
        avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Wurst_Amadeus_2019_c.jpg/1200px-Wurst_Amadeus_2019_c.jpg'
    }
    const anonimAvatar = "https://assets.stickpng.com/images/585e4bf3cb11b227491c339a.png";
    const [anchorEl, setAnchorEl] = useState(false);
    const [isLoginOpen, setLogin] = useState(false);
    const [isRegisterOpen, setRegister] = useState(false);
    const open = anchorEl;
    const handleClick = (event) => {
        event.preventDefault();
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(false);
    };
    const handleLoginOpen = () => {
        setLogin(true);
    }
    const handleLoginClose = () => {
        setLogin(false);
    }
    const handleRegisterOpen = () => {
        setRegister(true);
    }
    const handleRegisterClose = () => {
        setRegister(false);
    }
    const [checked, setChecked] = useState(false);
    const handleCheckboxChange = (event) => {
        setChecked(event.target.checked);
    };

    const logged_in = false;
    const [isAdmin, setIsAdmin] = useState(false);
    const profile_menu_color = "444445";
    return (<>
            <Box sx={{display: 'flex', alignItems: 'center', textAlign: 'center'}}>
                <Tooltip title="Профіль">
                    <Button
                        sx={{color: grey[100], width: 70, height: 70}}
                        className="profile_icon"
                        onClick={handleClick}
                        size="small"
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Avatar sx={{ width: 50, height: 50 }} src={logged_in ? user_info.avatar : anonimAvatar}></Avatar>
                    </Button>
                </Tooltip>
            </Box>
            {logged_in ? <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            bgcolor: "#242526",
                            overflow: "visible",
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&:before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: '#ffffff',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    }}
                    transformOrigin={{horizontal: 'right', vertical: 'top'}}
                    anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                >
                    <MenuItem onClick={handleClick} sx={{color: "#F2F2F2"}}>
                        <Avatar src={user_info.avatar}/> Профіль
                    </MenuItem>
                    <Divider/>
                    <MenuItem onClick={handleClose} sx={{color: "#F2F2F2"}}>
                        <ListItemIcon>
                            <Settings fontSize="small" sx={{color: "#ffffff"}}/>
                        </ListItemIcon>
                        Налаштування
                    </MenuItem>
                    <Link to="/admin">
                        <MenuItem onClick={handleClose} sx={{color: "#F2F2F2"}}>

                            <ListItemIcon>

                                <LightbulbIcon fontSize="small" sx={{color: "#ffffff"}}/>

                            </ListItemIcon>

                            Адмін панель
                        </MenuItem>
                    </Link>

                    <MenuItem onClick={handleClose} sx={{color: "#F2F2F2"}}>
                        <ListItemIcon>
                            <Logout fontSize="small" sx={{color: "#ffffff"}}/>
                        </ListItemIcon>
                        Вийти з аккаунту
                    </MenuItem>
                </Menu>


                : <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            bgcolor: "#242526",
                            overflow: "visible",
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&:before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: '#C60801',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    }}
                    transformOrigin={{horizontal: 'right', vertical: 'top'}}
                    anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                >
                    <MenuItem onClick={handleLoginOpen} sx={{color: "#F2F2F2"}}>
                        <ListItemIcon>
                            <LoginIcon fontSize="small" sx={{color: "#8a8a8a"}}/>
                        </ListItemIcon>
                        Увійти
                    </MenuItem>
                    <MenuItem onClick={handleRegisterOpen} sx={{color: "#F2F2F2"}}>
                        <ListItemIcon>
                            <PersonAddIcon fontSize="small" sx={{color: "#9f9f9f"}}/>
                        </ListItemIcon>
                        Зареєструватися
                    </MenuItem>
                </Menu>
            }

        </>
    );
}


export default Header;