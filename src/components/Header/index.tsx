import { ReactNode } from 'react';
import logoImg from '../../assets/images/logo.svg';

import './style.scss';

type HeaderProps = {
    children?: ReactNode;
}

export function Header({children}: HeaderProps) {
    return(
        <header>
            <div className="content">
                <img src={logoImg} alt="Letmeask" />
                <div>
                    { children }
                </div>
            </div>
        </header>
    );
}