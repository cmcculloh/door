import { FC } from "react";
import Link from 'next/link';

const Header: FC = () => {
    let isChecked = false;
    const closeMenu = () => {
        isChecked = false;
    };

    return (
		<header>
			<div className="topnav">
				<nav>
					<h1>Daily Reading</h1>
					<input id="menu__toggle" type="checkbox" checked={isChecked} />
					<label className="menu__btn" htmlFor="menu__toggle">
						<span />
					</label>

					<ul className="menu__box">
						<li>
							<Link className="menu__item" href="/" onClick={closeMenu}>
								Home
							</Link>
						</li>
						<li>
							<Link className="menu__item" href="/about" onClick={closeMenu}>
								About
							</Link>
						</li>
						<li>
							<Link className="menu__item" href="/contact" onClick={closeMenu}>
								Contact
							</Link>
						</li>
					</ul>
				</nav>
			</div>
		</header>
    );
};

export default Header;