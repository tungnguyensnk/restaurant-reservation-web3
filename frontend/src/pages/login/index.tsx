import React, {useState, useEffect} from 'react';
import {Button} from "../../components/button";
import styles from "./login.module.css";
import {account, getAccount, isMobileDevice} from "../../utils/account";
import {addName, getName} from "../../services/NameService";
import {Navigate} from 'react-router-dom';
import Input from "../../components/input";

const Login: React.FC = () => {
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [value, setValue] = useState<string>("");
    const init = async () => {
        await getAccount();
        if (!isMobileDevice()) {
            const _name = account;
            setName(`${_name.substring(0, 3)}...${_name.substring(_name.length - 3, _name.length)}`);
        }

        const _name = await getName();
        if (_name.length > 0)
            setIsLogin(true);
    }

    useEffect(() => {
        (async () => {
            await init();
        })();
    }, []);

    return (
        <div className={styles.loginWrapper}>
            <div className={styles.loginForm}>
                <h1>Welcome to</h1>
                <h2>R.R</h2>
                <p>Hi {name}</p>
                {isLogin ?
                    <>
                        <Navigate to={"/home"}/>
                    </> :
                    (
                        <><p>Bạn chưa đăng ký trước đây</p><p>Đăng ký ngay nào</p>
                            <form>
                                <Input placeholder={"Nhập tên của bạn"} id={"name"} type={"text"} height={"30"} width={"90%"}
                                       onInput={(e) => setValue(e.currentTarget.value)}/>
                                <Button text={"Sign In"} height={"50"} width={"50%"} click={{
                                    func: addName,
                                    params: [value],
                                    callback: () => setIsLogin(true)
                                }}/>
                            </form>
                        </>
                    )
                }
            </div>
        </div>
    );
}

export default Login;