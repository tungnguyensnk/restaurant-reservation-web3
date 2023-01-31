import React from "react";
import styles from "./buffetItem.module.css";

type ItemProps = {
    text: string,
    image?: string,
    height?: string,
    width?: string,
    click?: { func: Function, params: any[], callback?: Function },
    active?: string[]

}
export const BuffetItem: React.FC<ItemProps> = (props: ItemProps) => {
    return (
        <div className={styles.item + " " + (props.active?.includes(props.text) && styles.selected)}
             style={{height: props.height, width: props.width}}
             onClick={e => {
                 e.preventDefault();
                 if (props.click?.func)
                     if (props.click.callback)
                         props.click.func(...props.click.params).then(props.click.callback);
                     else
                         props.click.func(...props.click.params);
             }}>
            <img src={props.image} alt={props.text} className={styles.image}/>
            <p className={styles.text}>Buffet<br/>{props.text}</p>
        </div>
    )
};

export default BuffetItem;