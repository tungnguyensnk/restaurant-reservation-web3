import React from "react";
import {Routes, Route} from "react-router-dom";
import {Footer, Header} from "./layouts";
import {AppRoutes} from "./routes";

function App() {
    return (
        <div className="App">
            <Header/>
            <Routes>
                {AppRoutes.map((route, index) => (
                    <Route key={index} path={route.path} element={<route.element/>}/>
                ))}
            </Routes>
            <Footer/>
        </div>
    )
}

export default App;
