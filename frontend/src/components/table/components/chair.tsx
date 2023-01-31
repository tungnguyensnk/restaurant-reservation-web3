import React from "react";
import styles from "./chair.module.css";

type ChairProps = {
    top?: string,
    left?: string,
    right?: string,
    bottom?: string,
    size?: string,
    height?: string,
    width?: string,

}
export const Chair: React.FC<ChairProps> = (props: ChairProps) => {
    return (
        <div className={styles.chairWrapper}
             style={{
                 top: props.top,
                 left: props.left,
                 right: props.right,
                 bottom: props.bottom,
                 height: props.height || props.size,
                 width: props.width || props.size
             }}>
            <div className={styles.chair}/>
        </div>
    )
};

export default Chair;