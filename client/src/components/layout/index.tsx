import { Outlet } from "react-router-dom";
import TopMenu from "../Top-Menu";
import { FaInstagram, FaTwitter, FaCcVisa, FaCcMastercard } from "react-icons/fa";
import { SiEllo, SiPix } from "react-icons/si";

export function Layout() {
    return (
        <div style={layoutWrapperStyle}>
            <TopMenu />

            <main style={mainContentStyle}>
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}

function Footer() {
    return (
        <footer style={footerFullWidthStyle}>
            <div style={footerInnerContainerStyle}>

                <div style={copyrightStyle}>
                    <span style={{ fontWeight: 700, letterSpacing: ".5px" }}>
                        NBA Store Oficial
                    </span>{" "}
                    &copy; {new Date().getFullYear()}
                    <br />
                    <span style={{ fontSize: "0.93rem", opacity: 0.9 }}>
                        Desenvolvido por Ana Luisa Dariva
                    </span>
                </div>

                <div style={linksContainerStyle}>
                    <div style={iconGroupStyle}>
                        <span style={labelStyle}>Aceitamos:</span>
                        <FaCcVisa title="Visa" size="2rem" />
                        <FaCcMastercard title="Mastercard" size="2rem" />
                        <SiEllo title="Elo" size="1.8rem" />
                        <SiPix title="Pix" size="1.6rem" />
                    </div>
                    <div style={iconGroupStyle}>
                        <span style={labelStyle}>Siga-nos:</span>
                        <a href="#" style={socialLinkStyle}><FaInstagram size="1.8rem" /></a>
                        <a href="#" style={socialLinkStyle}><FaTwitter size="1.8rem" /></a>
                    </div>
                </div>

            </div>
        </footer>
    );
}


const layoutWrapperStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
};

const mainContentStyle: React.CSSProperties = {
    flex: 1,
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 24px",
    boxSizing: "border-box",
};


const footerFullWidthStyle: React.CSSProperties = {
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
    marginTop: "auto",
    boxSizing: "border-box",
};


const footerInnerContainerStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 24px",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "24px",
    boxSizing: "border-box",
};


const copyrightStyle: React.CSSProperties = { textAlign: "left", lineHeight: "1.5" };
const linksContainerStyle: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: "30px", justifyContent: "center" };
const iconGroupStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: "12px" };
const labelStyle: React.CSSProperties = { fontWeight: 600, marginRight: "8px", fontSize: "0.95rem" };
const socialLinkStyle: React.CSSProperties = { color: "#fff", display: "flex", alignItems: "center" };