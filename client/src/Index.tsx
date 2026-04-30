import {type JSX} from "react";

function nustiu(){
    console.log("asdf")
}

export default function App(): JSX.Element {
    return (
        <div>
            <form onSubmit={nustiu}>
            <label>
                Email
            </label>
                <input type={"text"} placeholder={"Enter email"}/>
                <label>
                    Password
                </label>
            <input type={"text"} placeholder={"Enter password"}/>
            </form>
            <button type={"submit"}>Register</button>
        </div>
    )
}