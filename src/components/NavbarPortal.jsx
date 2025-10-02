import ReactDOM from 'react-dom';
import Navbar from './Navbar';

export default function NavbarPortal() {
  return ReactDOM.createPortal(<Navbar />, document.getElementById('navbar-root'));
}