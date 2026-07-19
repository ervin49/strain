import {type FormEvent, type SyntheticEvent, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios, {AxiosError, type AxiosResponse} from "axios";
import {useAuth} from "../AuthContext.tsx";
import {api} from "../axios.tsx";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const {login} = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e: SyntheticEvent<HTMLFormElement>){
        e.preventDefault();
        setError("");

        try {
            const response = await api.post("/login", {
                email,
                password
            });
            console.log(response);
            login();
            navigate("/dashboard");
        } catch(err: any){
            console.error(err);
            if(err.response && err.response.status === 400){
                setError(err.response.data);
            }
            else {
                setError("Unexpected error");
            }
        }
    }

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center p-3">
            <div className="container card shadow p-4" style={{ maxWidth: 500 }}>
                <h2 className="mb-4 text-center">Sign in</h2>
                {error.length > 0 && (
                    <div className="alert alert-danger rounded-3" role="alert">
                        <ul className="mb-0 ps-3">
                            <li >{error}</li>
                        </ul>
                    </div>
                )}
                <form
                    method="post"
                    className="d-flex flex-column gap-3"
                    onSubmit={handleSubmit}
                >
                    <div>
                        <label className="form-label" htmlFor="email">
                            Email
                        </label>
                        <input
                            placeholder="Email"
                            className="form-control"
                            id="email"
                            required={true}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="form-label" htmlFor="password">
                            Password
                        </label>
                        <input
                            placeholder="Password"
                            type="password"
                            className="form-control"
                            id="password"
                            required={true}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <Link
                            type="button"
                            className="btn"
                            to="location.href='/change-password'"
                        >Forgot password?</Link>
                    </div>
                    <div className="d-flex flex-column gap-2">
                        <div className="col-12">
                            <button type="submit" className="btn btn-primary w-100 rounded-4 mb-2">
                                Sign in
                            </button>
                            <Link to="/register" className="btn btn-secondary w-100 rounded-4">
                                Don't have an account yet?{" "}
                                <span><u>Register</u></span>
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>

    )
};