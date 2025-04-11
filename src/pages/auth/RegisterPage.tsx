import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomInput from '../../components/Input';
import InputActionButton from '../../components/InputActionButton';
import CustomAlert from '../../components/Alert';
import { useAuth } from '../../context/AuthContext';
import { CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('Senhas não conferem');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError(err.message || 'Erro no cadastro');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Cadastro</h2>
      {error && <CustomAlert message={error} severity="error" />}
      <form onSubmit={handleSubmit}>
        <CustomInput
          label="Nome"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <CustomInput
          label="Confirmar Senha"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          type="password"
          required
        />
        <div className="mt-4">
          <InputActionButton
            type="submit"
            disabled={loading}
            label={loading ? '' : 'Cadastrar'}
            startIcon={loading ? <CircularProgress size={24} sx={{ color: theme.palette.primary.dark }} /> : undefined}
            fullWidth
          />
        </div>
      </form>
      <div className="mt-4">
        <p>
          Já possui conta?{' '}
          <span className="text-blue-500 cursor-pointer" onClick={() => navigate('/auth/login')}>
            Entrar
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
