import { NavLink } from 'react-router-dom';
import styles from './AppNav.module.css';
export default function AppNav (){
    return(
        <div className={styles.nav}>
            <ul>
                <li>
                    <NavLink to="cites">Cites</NavLink>
                </li>
                <li>
                    <NavLink to="countries">Countries</NavLink>
                </li>
            </ul>
        </div>
    )
}