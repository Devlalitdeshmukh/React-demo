function Footer({ companyName}) {

    return (
        <footer style={{ margin:"10px", padding:"10px", background:"#eee" }}>
            <p>© {new Date().getFullYear()} {companyName} - All Rights Reserved. </p>
        </footer>
    );
}

export default Footer;