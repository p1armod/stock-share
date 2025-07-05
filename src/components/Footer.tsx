import {Link} from "react-router-dom";
const Footer = () => {
    return (
        <footer>
            <div className="flex justify-between items-center p-4 border-t border-gray-200">
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/contact">Contact</Link>
            </div>
        </footer>
    )
}

export default Footer