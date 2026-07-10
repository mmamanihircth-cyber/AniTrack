import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./ProfileScreen.css";

const ProfileScreen = () => {

    const { userData, logout } = useContext(AuthContext);

    return (
        <main className="profile-page">

            <section className="profile-container">

                <h1 className="profile-title">
                    Mi Perfil
                </h1>

                <div className="profile-user">

                    <h2>{userData?.nombre}</h2>

                    <p>{userData?.email}</p>

                </div>

            </section>

        </main>
    );
};

export { ProfileScreen };