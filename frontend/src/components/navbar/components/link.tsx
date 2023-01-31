import React from "react";
import styles from "./link.module.css";

type LinkProps = {
    name: string,
    link: string

}
export const Link: React.FC<LinkProps> = (props: LinkProps) => {
    return (
        <>
            <a href={props.link} className={styles.lk}>{props.name}</a>
        </>
    )
};

export default Link;