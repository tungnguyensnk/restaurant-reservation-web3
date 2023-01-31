import React from "react";
import styles from "./button.module.css";

type ButtonProps = {
    text: string,
    height?: string,
    width?: string,
    href?: string,
    click?: { func: Function, params: any[], callback?: Function },

}
export const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
    return (
        <div className={styles.buttonWrapper}>
            <button
                className={styles.button}
                style={{height: props.height, width: props.width}}
                onClick={e => {
                    e.preventDefault();
                    if (props.click?.func)
                        if (props.click.callback)
                            props.click.func(...props.click.params).then(props.click.callback);
                        else
                            props.click.func(...props.click.params);

                    props.href && window.location.replace(props.href);
                }}
            >
                {props.text}
            </button>
        </div>
    )
};