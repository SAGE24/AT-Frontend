import { NavLink } from 'react-router-dom';

const Navbar = () => {
    const activeStyle = 'underline underline-offset-4'

    return (
        <nav className='flex justify-between items-center fixed z-10 top-0 w-full py-5 px-8 text-sm font-light'>
            <ul className='flex items-center gap-3 text-lg'>
                <li className="font-semibold">
                    <NavLink to="/">Inicio</NavLink>
                </li>
                <li>
                    <NavLink to="/reservation" className={({isActive}) => isActive ? activeStyle : undefined} >Reservación</NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;