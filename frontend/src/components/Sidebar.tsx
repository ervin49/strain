import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true
});

function Item({pathName} : {pathName: string}){
    const currentURI: string = window.location.pathname;
    const isActive: boolean = currentURI === `/${pathName.toLowerCase()}`;
    const path: string = "/src/assets/sidebar-icons/" + pathName.toLowerCase();

    const imageSrc: string = isActive ? `${path}-active.png` : `${path}.png`;

    return (
        <>
            <li className="nav-item">
                <Link
                    to={'/' + pathName.toLowerCase()}
                    className={`nav-link d-flex align-items-center gap-1 text-white ${isActive ? 'active' : ''}`}
                >
                    <img
                        src={imageSrc}
                        alt={pathName}
                        width={20}
                        height={20}
                    />
                    {pathName}
                </Link>
            </li>
        </>
    );
}

export default function Sidebar() {
    const [image, setImage] = useState();
    useEffect(() => {
        const getProfilePicture = async () => {
            try {
                const response = await API.get("http://localhost:8080/profile-picture");
                setImage(response.data)
            }catch (error){
                console.error(error)
            }
        }
        getProfilePicture();
    }, []);
    return (
        <>
            <aside className="d-flex flex-nowrap vh-100">
                <div
                    className="d-flex flex-column flex-shrink-0 p-3"
                    style={{width: 256, backgroundColor: "#111313"}}
                >
                    <Link to="/dashboard">
                        <img src="/src/assets/sidebar-icons/strain-logo.png" alt="strain" width={150}/>
                    </Link>
                    <ul className="nav nav-pills flex-column mb-auto gap-2">
                        <Item
                            pathName="Dashboard"
                        />
                        <Item
                            pathName="Routines"
                        />
                        <Item
                            pathName="Profile"
                        />
                        <Item
                            pathName="Settings"
                        />
                    </ul>
                    <hr/>
                    <div className="dropdown">
                        <Link
                            to="#"
                            className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <img
                                alt="Profile picture"
                                width={32}
                                height={32}
                                className="rounded-circle me-2"
                                src={image}
                            />
                        </Link>
                        <ul
                            className="dropdown-menu dropdown-menu-dark text-small shadow"
                            style={{}}
                        >
                            <li>
                                <a className="dropdown-item">
                                    Profile
                                </a>
                            </li>
                            <li>
                                <hr className="dropdown-divider opacity-100"/>
                            </li>
                            <li>
                                <Link
                                    to="/logout"
                                    className="dropdown-item">
                                    Sign out
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </aside>
        </>
    )
}