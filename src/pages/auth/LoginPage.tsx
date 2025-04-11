import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomInput from '../../components/Input';
import InputActionButton from '../../components/InputActionButton';
import CustomAlert from '../../components/Alert';
import { useAuth } from '../../context/AuthContext';
import { CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  useEffect(() => {
    if (location.state && (location.state as any).success) {
      setSuccess((location.state as any).success);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError(err.message || 'Erro ao efetuar login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <CustomAlert message={error} severity="error" />}
      {success && <CustomAlert message={success} severity="success" />}
      <form onSubmit={handleSubmit}>
        <CustomInput
          label="Email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />
        <CustomInput
          label="Senha"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
        />
        <div className="mt-4">
          <InputActionButton
            type="submit"
            disabled={loading}
            label={loading ? '' : 'Entrar'}
            startIcon={loading ? <CircularProgress size={24} sx={{ color: theme.palette.primary.dark }} /> : undefined}
            fullWidth
          />
        </div>
      </form>
      <div className="mt-4">
        <p>
          Não tem uma conta?{' '}
          <span className="text-blue-500 cursor-pointer" onClick={() => navigate('/auth/register')}>
            Cadastre-se
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
