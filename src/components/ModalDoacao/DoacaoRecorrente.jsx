import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import FormDoacaoRecorrente from './FormDoacaoRecorrente';

import axios from 'axios';

const AuthContainer = ({isMobile}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [login, setLogin] = useState({
        email: "",
        password: "",
    });

    const handleLogin = (login) => {
        axios
            .post(
                "https://amigosdacasa.org.br/gerenciador-doacoes-amigosdacasa/login_site/login.php",
                {
                    email: login.email,
                    password: login.password,
                }
            )
            .then((response) => {
                if (response.data.success === 1) {
                    setIsLoggedIn(true);
                    localStorage.setItem("loginToken", response.data.token);
                } else {
                    console.log("Falha no login:", response.data.message);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleShowRegister = () => {
        setShowRegister(true);
    };

    const handleShowLogin = () => {
        setShowRegister(false);
    };

    if (isLoggedIn) {
        return <FormDoacaoRecorrente isMobile={isMobile} />;
    }

    const handleChangeLogin = (e) => {
        setLogin({
            ...login,
            [e.target.name]: e.target.value,
        });
    }

    return (
        <div>
            {showRegister ? (
                <RegisterForm handleShowLogin={handleShowLogin} isMobile={isMobile} />
            ) : (
                <LoginForm
                    handleLogin={handleLogin}
                    handleShowRegister={handleShowRegister}
                    handleChangeLogin={handleChangeLogin}
                />
            )}
        </div>
    );
};

export default AuthContainer;
