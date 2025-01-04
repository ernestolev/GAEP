import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendSignInLinkToEmail, signInWithEmailLink, isSignInWithEmailLink } from 'firebase/auth';
import { auth } from '../../firebase';
import './Login.modules.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const actionCodeSettings = {
        url: 'http://localhost:3000/finishSignUp', // URL de redireccionamiento
        handleCodeInApp: true,
    };

    const handleSendLink = async (e) => {
        e.preventDefault();
        try {
            await sendSignInLinkToEmail(auth, email, actionCodeSettings);
            window.localStorage.setItem('emailForSignIn', email);
            alert('Enlace de inicio de sesión enviado. Revisa tu correo electrónico.');
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSignInWithEmailLink = async () => {
        if (isSignInWithEmailLink(auth, window.location.href)) {
            let email = window.localStorage.getItem('emailForSignIn');
            if (!email) {
                email = window.prompt('Por favor, proporciona tu correo electrónico para confirmar.');
            }
            try {
                await signInWithEmailLink(auth, email, window.location.href);
                window.localStorage.removeItem('emailForSignIn');
                navigate('/admin'); // Redirigir a la página Admin
            } catch (error) {
                setError(error.message);
            }
        }
    };

    React.useEffect(() => {
        handleSignInWithEmailLink();
    }, []);

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSendLink}>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit">Enviar enlace de inicio de sesión</button>
            </form>
        </div>
    );
};

export default Login;