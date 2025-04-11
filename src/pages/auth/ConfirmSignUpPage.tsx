import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomInput from '../../components/Input';
import InputActionButton from '../../components/InputActionButton';
import CustomAlert from '../../components/Alert';
import { useAuth } from '../../context/AuthContext';
import { CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const ConfirmSignUpPage: React.FC = () => {
  const { confirmSignUp } = useAuth();
  const [email, setEmail] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(null);
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
    setLoading(true);
    try {
      await confirmSignUp(email, confirmationCode);
      navigate('/login', { state: { success: "Confirmação realizada com sucesso! Agora faça login." } });
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError(err.message || 'Erro na confirmação');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Confirmação de Cadastro</h2>
      {success && <CustomAlert message={success} severity="success" />}
      {error && <CustomAlert message={error} severity="error" />}
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
          label="Código de Confirmação"
          name="confirmationCode"
          value={confirmationCode}
          onChange={(e) => setConfirmationCode(e.target.value)}
          required
        />
        <div className="mt-4">
          <InputActionButton
            type="submit"
            disabled={loading}
            label={loading ? '' : 'Confirmar Cadastro'}
            startIcon={loading ? <CircularProgress size={24} sx={{ color: theme.palette.primary.dark }} /> : undefined}
            fullWidth
          />
        </div>
      </form>
    </div>
  );
};

export default ConfirmSignUpPage;
