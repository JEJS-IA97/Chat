import { useState } from 'react';
import { API_URL } from '../config/env';

export const AuthPage = ({ onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ nombre: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMsg('');

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/registro';
        const url = `${API_URL}${endpoint}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(isLogin 
                    ? { email: formData.email, password: formData.password }
                    : formData
                )
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Ocurrió un error');
            }

            if (isLogin) {
                onLoginSuccess(data.token, data.usuario);
            } else {
                setSuccessMsg('Cuenta creada con éxito. Ahora puedes iniciar sesión.');
                setIsLogin(true);
                setFormData({ nombre: '', email: '', password: '' });
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-[30px] bg-slate-50">
            <div className="w-full max-w-[450px] rounded-2xl border-2 border-[#d1dbe4] bg-white p-8 shadow-sm">
                
                <div className="text-center mb-8">
                    <p className="text-[28px] font-bold text-[#477ea0]">
                        {isLogin ? 'Bienvenido de vuelta' : 'Crear nueva cuenta'}
                    </p>
                    <p className="mt-2 text-[14px] text-slate-500">
                        {isLogin 
                            ? 'Ingresa tus credenciales para continuar' 
                            : 'Únete para empezar a chatear'}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-[13px] text-center">
                        {error}
                    </div>
                )}

                {successMsg && (
                    <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-600 text-[13px] text-center">
                        {successMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {!isLogin && (
                        <div className="flex flex-col gap-1">
                            <label className="text-[13px] font-bold text-slate-700 ml-1">Nombre</label>
                            <input
                                data-testid="nombre-input"
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                placeholder="Ej: Oswaldo"
                                required={!isLogin}
                                className="w-full rounded-xl border-2 border-[#d1dbe4] bg-slate-50 px-4 py-3 text-[14px] text-slate-700 outline-none transition-colors focus:border-[#6daad7] focus:bg-white"
                            />
                        </div>
                    )}

                    <div className="flex flex-col gap-1">
                        <label className="text-[13px] font-bold text-slate-700 ml-1">Correo Electrónico</label>
                        <input
                            data-testid="email-input"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="tu@correo.com"
                            required
                            className="w-full rounded-xl border-2 border-[#d1dbe4] bg-slate-50 px-4 py-3 text-[14px] text-slate-700 outline-none transition-colors focus:border-[#6daad7] focus:bg-white"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[13px] font-bold text-slate-700 ml-1">Contraseña</label>
                        <input
                            data-testid="password-input"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                            className="w-full rounded-xl border-2 border-[#d1dbe4] bg-slate-50 px-4 py-3 text-[14px] text-slate-700 outline-none transition-colors focus:border-[#6daad7] focus:bg-white"
                        />
                    </div>

                    <button
                        type="submit"
                        data-testid="submit-button"
                        disabled={loading}
                        className={`mt-4 w-full rounded-xl bg-[#6daad7] px-4 py-3 text-[16px] font-bold text-white transition-colors 
                            ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#477ea0] cursor-pointer'}`}
                    >
                        {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
                    </button>
                </form>

                <div className="mt-6 border-t border-[#d1dbe4] pt-6 text-center">
                    <p className="text-[14px] text-slate-600">
                        {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
                        <button
                            type="button"
                            data-testid="register-button"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                                setSuccessMsg('');
                            }}
                            className="ml-2 font-bold text-[#6daad7] hover:text-[#477ea0] cursor-pointer"
                        >
                            {isLogin ? 'Regístrate aquí' : 'Inicia Sesión'}
                        </button>
                    </p>
                </div>

            </div>
        </div>
    );
};
