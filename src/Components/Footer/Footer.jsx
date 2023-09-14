import React from 'react';
import footerImg from "./footerlogo.png";
import "./Footer.css"
export default function Footer() {
    return (
        <main className="Footer_main">
            <br />
            <img src={footerImg} alt="" />
            <h3>
                ~ Reactjs + Firebase assignment ~
            </h3>
            <small>Submitted by <a href="http://ankitsinghchauhan.tech/">Ankit Singh Chauhan</a></small>
        </main>
    )
}
