import React from "react";
import styles from "./navbar.module.css";
import Link from "./components/link";

type NavbarProps = {
    links: [
        ...{
            name: string,
            link: string
        }[]
    ]

}
export const Navbar: React.FC<NavbarProps> = (props: NavbarProps) => {
    return (
        <>
            <div className={styles.navbar}>
                <div className={styles.options}>
                    {props.links.map((link) => {
                        return (
                            <Link name={link.name} link={link.link} key={link.name}/>
                        )
                    })}
                </div>
            </div>
            <svg className={styles.svg}>
                <g className={styles.topBars} strokeWidth="4">
                    <path className={styles.bar + " " + styles.bar1} d="M 0,20 H 40"/>
                    <path className={styles.bar + " " + styles.bar2} d="M 0,29 H 40"/>
                </g>
            </svg>
            <div className={styles.menuClickArea}
                 onClick={() => {
                     document.getElementsByClassName(styles.navbar)[0].classList.toggle(styles.active);
                     document.getElementsByClassName(styles.topBars)[0].classList.toggle(styles.activeTopBars);
                     document.getElementsByClassName(styles.bar1)[0].classList.toggle(styles.activeBar1);
                     document.getElementsByClassName(styles.bar2)[0].classList.toggle(styles.activeBar2);
                 }}></div>
        </>
    )
};

export default Navbar;