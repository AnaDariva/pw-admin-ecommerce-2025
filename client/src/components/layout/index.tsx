import {Outlet} from "react-router-dom";
import TopMenu from "../Top-Menu";

import {
    FaInstagram,
    FaTwitter,
    FaCcVisa,
    FaCcMastercard,
} from "react-icons/fa";


import {SiEllo, SiPix} from "react-icons/si";

export function Layout() {
    return (

        <>
            <TopMenu/>
            <main style={{paddingTop: "40px", minHeight: "calc(100vh - 180px)"}}>
                <Outlet/>
            </main>
            <Footer/>
        </>
    );
}

function Footer() {
    return (

        <footer style={footerStyle}>
            <div style={containerStyle}>

                <div style={copyrightStyle}>
          <span style={{fontWeight: 700, letterSpacing: ".5px"}}>
            NBA Store Oficial
          </span>{" "}
                    &copy; {new Date().getFullYear()}
                    <br/>
                    <span style={{fontSize: "0.93rem", opacity: 0.9}}>
            Desenvolvido por Ana Luisa Dariva | Projeto acadêmico sem fins
            lucrativos
          </span>
                </div>


                <div style={linksContainerStyle}>

                    <div style={iconGroupStyle}>
            <span
                style={{
                    fontWeight: 600,
                    marginRight: "12px",
                    fontSize: "0.95rem",
                }}
            >
              Aceitamos:
            </span>
                        <FaCcVisa title="Visa" size="2rem"/>
                        <FaCcMastercard title="Mastercard" size="2rem"/>
                        <SiEllo title="Elo" size="1.8rem"/>
                        <SiPix title="Pix" size="1.6rem"/>
                    </div>
                    <div style={iconGroupStyle}>
            <span
                style={{
                    fontWeight: 600,
                    marginRight: "12px",
                    fontSize: "0.95rem",
                }}
            >
              Siga-nos:
            </span>
                        <a
                            href="https://www.instagram.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={socialLinkStyle}
                            aria-label="Instagram"
                        >
                            <FaInstagram size="1.8rem"/>
                        </a>
                        <a
                            href="https://twitter.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={socialLinkStyle}
                            aria-label="Twitter/X"
                        >
                            <FaTwitter size="1.8rem"/>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

const footerStyle: React.CSSProperties = {
    width: "100vw",
    position: "relative",
    left: "50%",
    right: "50%",
    marginLeft: "-50vw",
    marginRight: "-50vw",
    background: "var(--nba-blue)",
    color: "#fff",
    padding: "40px 0",
    borderTopLeftRadius: "18px",
    borderTopRightRadius: "18px",
    boxShadow: "0 -2px 16px #0001",
    zIndex: 20,
    boxSizing: "border-box",
};


const containerStyle: React.CSSProperties = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 24px",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "24px",
};

const copyrightStyle: React.CSSProperties = {
    textAlign: "left",
};

const linksContainerStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "30px",
    justifyContent: "center",
};

const iconGroupStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
};

const socialLinkStyle: React.CSSProperties = {
    color: "#fff",
    textDecoration: "none",
    opacity: 0.9,
    display: "flex",
    alignItems: "center",
    transition: "opacity 0.2s ease-in-out",
};