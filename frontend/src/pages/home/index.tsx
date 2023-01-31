import React, {useState, useEffect, useRef} from 'react';
import {getAccount} from "../../utils/account";
import {getName} from "../../services/NameService";
import {CircleTable, LongTable} from "../../components/table";
import Navbar from "../../components/navbar";
import styles from "./home.module.css";
import BuffetItem from "./components/BuffetItem";
import images from "../../assets/images";
import {Button} from "../../components/button";

const Home: React.FC = () => {
    const [name, setName] = useState<string>("");
    const [buffet, setBuffet] = useState<string>("");
    let bonus = useRef<string[]>([]);
    const [total, setTotal] = useState<number>(0);
    const listBuffet: string[] = ["Fast", "Deluxe", "Premium", "Fast", "Deluxe", "Premium"];
    const listBonus: string[] = ["Nước ngọt", "Bia rượu", "Hải sản"];
    const [ok, setOk] = useState<boolean>(false);
    const [state, setState] = useState<any>({
        buffet: false,
        bonus: false
    });
    const init = async () => {
        console.log(await getAccount());
        const _name = await getName();
        setName(_name);
        console.log(_name);
    }

    const activeBuffet = () => {
        setState({
            buffet: !state.buffet,
            bonus: state.buffet
        })
    }

    const activeBonus = () => {
        setState({
            buffet: true,
            bonus: !state.bonus
        })
    }

    const choiceBuffet = (index: number) => {
        setState({
            buffet: true,
            bonus: false
        })
        setBuffet(listBuffet[index]);
    }

    const selectBonus = (index: number) => {
        if (bonus.current.includes(listBonus[index])) {
            bonus.current = bonus.current.filter((item) => item !== listBonus[index]);
            setTotal(total - 1);
        } else {
            bonus.current.push(listBonus[index]);
            setTotal(total + 1);
        }
    }

    const book = () => {
        setState({
            buffet: true,
            bonus: true
        });
        setOk(true);
        console.log("buffet: ", buffet);
        console.log("bonus: ", bonus.current);
    }
    const getBonus = () => {
        return bonus.current;
    }
    useEffect(() => {
        (async () => {
            await init();
        })();
    }, []);

    return (
        <div className={styles.homeWrapper}>
            <Navbar links={[
                {
                    name: "Home",
                    link: "/"
                },
                {
                    name: "About",
                    link: "/about"
                }
            ]}/>
            <h3 className={styles.textIndex}>{name.substring(0, 20)}</h3>
            {!ok &&
                <>
                    <div className={styles.buffetSelect + " " + (!state.buffet && styles.active)}>
                        <h3 className={styles.textIndex} onClick={activeBuffet}>Chọn gói {buffet}</h3>
                        <div className={styles.buffetSelectWrapper}>
                            {listBuffet.map((e, index) => {
                                return (
                                    <BuffetItem text={e}
                                                image={images.buffet_deluxe}
                                                height={"140px"} width={"90px"}
                                                key={index}
                                                active={[buffet]}
                                                click={{func: choiceBuffet, params: [index]}}/>
                                );
                            })}
                        </div>
                    </div>
                    <div className={styles.bonusSelect + " " + (buffet !== "" && !state.bonus && styles.active)}>
                        <h3 className={styles.textIndex} onClick={activeBonus}>Chọn
                            bonus {bonus.current.join(", ")}</h3>
                        <div className={styles.buffetSelectWrapper}>
                            {listBonus.map((bonus, index) => {
                                return (
                                    <BuffetItem text={bonus}
                                                image={images.buffet_deluxe}
                                                height={"140px"} width={"90px"}
                                                key={index}
                                                active={getBonus()}
                                                click={{func: selectBonus, params: [index]}}/>
                                );
                            })}
                        </div>
                        <Button text={"Đặt bàn"} height={"40px"} width={"100px"}
                                click={{
                                    func: book, params: []
                                }}/>
                    </div>
                </>
            }
            <div className={styles.tableSelect + " " + (ok && styles.activeTable)}>
                <h3 className={styles.textIndex}>Chọn bàn</h3>
                <div className={styles.tableSelectWrapper}>
                    <LongTable height={"160px"} width={"80px"} id={"1"} amount={8}
                               click={{
                                   func: (id: number) => console.log("click ", id),
                                   params: [1]
                               }}/>
                    <CircleTable size={"80px"} id={"2"} amount={4}
                                 click={{
                                     func: (id: number) => console.log("click ", id),
                                     params: [2]
                                 }}/>
                </div>
            </div>
            {/*<LongTable height={"160px"} width={"80px"} id={"1"} amount={8}/>*/}
            {/*<CircleTable size={"80px"} id={"2"} amount={4}/>*/}
        </div>
    );
}

export default Home;