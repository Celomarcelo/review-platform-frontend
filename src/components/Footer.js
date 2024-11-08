import React from 'react';

function Footer() {
    return (
        <footer className="bg-dark text-center text-lg-start mt-auto">
            <div className="text-center p-3 text-light">
                &copy; {new Date().getFullYear()} Books&Films. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;