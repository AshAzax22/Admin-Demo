import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, Loader2, Store } from 'lucide-react';
import styles from './LoginPage.module.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, user } = useAuth();
    const navigate = useNavigate();

    if (user) return <Navigate to="/" />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.blob}></div>
            <div className={styles.blob2}></div>
            
            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.logoIcon}>
                        <Store size={32} color="white" />
                    </div>
                    <h1>OmniRetail Admin</h1>
                    <p>Enter your credentials to access the dashboard</p>
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email Address</label>
                        <div className={styles.inputWrapper}>
                            <Mail size={18} className={styles.icon} />
                            <input 
                                id="email"
                                type="email" 
                                placeholder="name@company.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <div className={styles.inputWrapper}>
                            <Lock size={18} className={styles.icon} />
                            <input 
                                id="password"
                                type="password" 
                                placeholder="••••••••" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className={styles.loginBtn}
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className={styles.spinner} size={20} />
                        ) : (
                            <>
                                <LogIn size={20} />
                                <span>Sign In</span>
                            </>
                        )}
                    </button>
                </form>

                <div className={styles.footer}>
                    <p>Demo accounts: admin@demo.com / manager@demo.com</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
