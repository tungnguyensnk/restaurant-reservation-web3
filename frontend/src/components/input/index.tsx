import React from "react";
import styles from "./input.module.css";

type InputProps = {
    text?: string,
    placeholder?: string,
    height?: string,
    width?: string,
    type?: string,
    id?: string,
    onInput?: (event: React.FormEvent<HTMLInputElement>) => void

}
export const Input: React.FC<InputProps> = (props: InputProps) => {
    return (
        <div className={styles.inputWrapper}>
            <input type={props.type} placeholder={props.placeholder} style={{height: props.height, width: props.width}}
                   value={props.text} id={props.id} onInput={props.onInput} className={styles.input}/>
        </div>
    )
};

export default Input;