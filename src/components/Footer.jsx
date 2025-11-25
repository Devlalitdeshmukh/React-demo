function Footer({ companyName}) {

    return (
        <footer className="bg-dark text-light py-4 mt-5">
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <h5>
                            <i className="bi bi-building me-2"></i>
                            {companyName}
                        </h5>
                        <p className="text-muted1 text-light small text-start">
                            Providing excellent services since {new Date().getFullYear() - 5}
                        </p>
                    </div>
                    <div className="col-md-6 text-md-end">
                        <p className="mb-1">© {new Date().getFullYear()} {companyName} - All Rights Reserved.</p>
                        <p className="text-muted1 text-light small mb-0">
                            <i className="bi bi-telephone me-2"></i> +1 (555) 123-4567
                            <span className="mx-3">|</span>
                            <i className="bi bi-envelope me-2"></i> info@{companyName.toLowerCase().replace(/\s+/g, '')}.com
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;