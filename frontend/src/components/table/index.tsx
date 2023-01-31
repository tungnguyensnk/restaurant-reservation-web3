import React from "react";
import styles from "./table.module.css";
import Chair from "./components/chair";

type TableProps = {
    id: string,
    height?: string,
    width?: string,
    size?: string,
    amount: number,
    click?: { func: Function, params: any[], callback?: Function },

}
export const LongTable: React.FC<TableProps> = (props: TableProps) => {
    let chairs: number = props.amount / 2;
    return (
        <div className={styles.tableWrapper}
             onClick={() => {
                 if (props.click?.func)
                     if (props.click.callback)
                         props.click.func(...props.click.params).then(props.click.callback);
                     else
                         props.click.func(...props.click.params);
             }}
             style={{height: props.height, width: props.width}}>
            <div className={styles.table + " " + styles.tableSquare}>
                <span>{props.id}</span>
            </div>
            {Array.from(Array(chairs).keys()).map((i) => {
                return (
                    <Chair key={i} top={`${i * 100 / chairs}%`} left={"0"} height={`${100 / chairs}%`}/>
                )
            })}
            {Array.from(Array(chairs).keys()).map((i) => {
                return (
                    <Chair key={i} top={`${i * 100 / chairs}%`} right={"0"} height={`${100 / chairs}%`}/>
                )
            })}
        </div>
    )
};

export const CircleTable: React.FC<TableProps> = (props: TableProps) => {
    let i: number = 0;
    return (
        <div className={styles.tableWrapper}
             onClick={() => {
                 if (props.click?.func)
                     if (props.click.callback)
                         props.click.func(...props.click.params).then(props.click.callback);
                     else
                         props.click.func(...props.click.params);
             }}
             style={{height: props.size, width: props.size}}>
            <div className={styles.table + " " + styles.tableCircle}>
                <span>{props.id}</span>
            </div>
            <Chair key={++i} top={"0"} width={"100%"}/>
            {
                (props.amount === 4) &&
                <>
                    <Chair key={++i} left={"0"} height={"100%"}/>
                    <Chair key={++i} right={"0"} height={"100%"}/>
                </>
            }
            <Chair key={++i} bottom={"0"} width={"100%"}/>
        </div>
    )
};

export default LongTable;