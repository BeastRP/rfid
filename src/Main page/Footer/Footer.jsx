import React from 'react';
import "./Footer.css";
// Імпорт використаних зображень
import logoImg from "../../images/logo.png";
import twitterImg from "../../images/social/twitter.png";
import facebookImg from "../../images/social/facebook.png";
import pinterestImg from "../../images/social/pinterest.png";
import instagramImg from "../../images/social/instagram.png";


import {Button} from "@mui/material";
import {grey} from "@mui/material/colors";

const Footer = () => {
    return (
        <footer className="footer">
            <img className="logo_class" src={logoImg} alt="backgroundImg"/>
            <div className="social-block">
                <h6>Відстежуйте нас у соціальних мережах</h6>
                <div className="social-list">
                    <Button className="twitterBtn" sx={{width: '50px', height: '48px'}}>
                        <img src={twitterImg} alt="twitterImage"/>
                    </Button>
                    <Button className="facebookBtn" sx={{width: '50px', height: '48px'}}>
                        <img src={facebookImg} alt="facebookImage"/>
                    </Button>
                    <Button className="pinterestBtn" sx={{width: '50px', height: '48px'}}>
                        <img src={pinterestImg} alt="pinterestImage"/>
                    </Button>
                    <Button className="instagramBtn" sx={{width: '50px', height: '48px'}}>
                        <img src={instagramImg} alt="instagramImage"/>
                    </Button>
                </div>
            </div>
        </footer>
    );
}

export default Footer;