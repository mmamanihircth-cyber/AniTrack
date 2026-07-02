import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router'; 
import useForm from '../../hooks/useForm';
import useRequest from '../../hooks/useRequest';
import { register } from '../../services/authService'; 
import '../LoginScreen/LoginScreen.css'; 

export const RegisterScreen = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const {
        sendRequest: sendRequestRegister,
        loading: registerLoading,
        error: registerError,
        box_response: registerResponse
    } = useRequest();

    // 🌟 Sincronizado con tu backend: desestructurás { name, email, password }
    const initial_form_state = {
        name: '',
        email: '',
        password: ''
    };

    function onSubmit(formData) {
    sendRequestRegister(() =>
        register(formData.name, formData.email, formData.password)
    );
}

    useEffect(() => {
        if (registerResponse?.ok) {
            navigate('/login'); 
        }
    }, [registerResponse, navigate]);

    const { formState, handleChange, handleSubmit } = useForm(initial_form_state, onSubmit);

    return (
        <div className="login-page-container">
            <Link to="/home" className="back-home-btn">
                ← Home
            </Link>

            <div className="login-card">
                <div className="login-logo">
                    <h1>
                        Ani<span>Track</span>
                    </h1>
                    <p>Create your account to start tracking</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    {registerError && !registerLoading && (
                        <div className="login-error-msg">
                            {registerError}
                        </div>
                    )}

                    {/* Full Name */}
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            className="login-input"
                            value={formState.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="login-input"
                            value={formState.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-wrapper">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                className="login-input"
                                value={formState.password}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? '🙈' : '👁'}
                            </button>
                        </div>
                    </div>

                    <button
                        className="btn-primary"
                        type="submit"
                        disabled={registerLoading || registerResponse?.ok}
                    >
                        {registerLoading ? 'Creating account...' : 'Register'}
                    </button>
                </form>

                <div className="login-footer">
                    <span>Already have an account?</span>
                    <button className="signup-btn" onClick={() => navigate('/login')}>
                        Sign In
                    </button>
                </div>
            </div>
        </div>
    );
};
