import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import imglog from '../../assets/images/img-login.png';
import './Login.modules.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/admin'); // Redirigir a la página Admin
        } catch (error) {
            setError(error.message);
            error.message === 'Firebase: Error (auth/user-not-found).' ? setError('Usuario no encontrado') : setError('Credenciales incorrectas');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <img src={imglog} alt="" />
            <form onSubmit={handleLogin}>
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
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit">Login</button>
                <p>Volver a <a href="/">inicio</a></p>

            </form>
        </div>
    );
};

export default Login;