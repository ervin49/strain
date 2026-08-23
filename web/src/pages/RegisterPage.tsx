import {Link, useNavigate} from "react-router-dom";
import {type SyntheticEvent, useState} from "react";
import {api} from "../../../shared/axios.tsx";
import {useAuth} from "../AuthContext.tsx";
import { useUser } from "../../../shared/UserProvider.tsx";

export default function RegisterPage() {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState<string[]>([]);
    const {login} = useAuth();
    const navigate = useNavigate();
    const {refreshUser} = useUser();

    async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        setErrors([]);

        try {
            const response = await api.post("/register", {
                firstName,
                lastName,
                email,
                password
            });
            console.log(response);
            login();
            await refreshUser();
            navigate("/dashboard");
        } catch (err: any) {
            console.error("Registration error: ", err);
            if (err.response && err.response.status === 400) {
                setErrors(err.response.data)
            }
        }
    }

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center p-3">
            <div className="container card shadow p-4" style={{maxWidth: 500}}>
                <h2 className="mb-4 text-center">Sign up</h2>
                {errors.length > 0 && (
                    <div className="alert alert-danger rounded-3" role="alert">
                        <ul className="mb-0 ps-3">
                            {errors.map((err, index) => (
                                <li key={index}>{err}</li>
                            ))}
                        </ul>
                    </div>
                )}
                <form
                    method="post"
                    className="d-flex flex-column gap-3"
                    onSubmit={handleSubmit}
                >
                    <div className="row g-2">
                        <div className="col-6">
                            <label htmlFor="first-name" className="form-label">
                                First Name
                            </label>
                            <input
                                placeholder="First name"
                                className="form-control"
                                id="first-name"
                                required={true}
                                value={firstName}
                                onChange={e => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="col-6">
                            <label htmlFor="last-name" className="form-label">
                                Last Name
                            </label>
                            <input
                                placeholder="Last name"
                                className="form-control"
                                id="last-name"
                                required={true}
                                value={lastName}
                                onChange={e => setLastName(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            placeholder="Email"
                            type="email"
                            className="form-control"
                            id="email"
                            required={true}
                            value={email}
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
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="d-flex flex-column gap-2 mt-2">
                        <button
                            className="btn btn-primary rounded-4 w-100"
                            type="submit"
                        >
                            Sign up
                        </button>
                        <Link to="/login" className="btn btn-secondary rounded-4 w-100">
                            I already have an account
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}