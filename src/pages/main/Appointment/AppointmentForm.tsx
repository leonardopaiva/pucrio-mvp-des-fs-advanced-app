import React, { useState, useEffect } from 'react';
import { Box, Button, CircularProgress, CssBaseline, FormControl, FormLabel, Grid, TextField } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { Appointment } from '../../../services/interfaces';
import { generateUniqueId } from '../../../util/functions';
import InputActionButton from '../../../components/InputActionButton';

const FormContainer = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  gap: theme.spacing(2),
}));

const validateField = (value: string, field: string): string => {
  switch (field) {
    case 'name': return value ? '' : 'Nome inválido!';
    case 'doctor': return value ? '' : 'Nome do médico inválido!';
    case 'location': return value ? '' : 'Localização inválida!';
    case 'date': return value ? '' : 'Data inválida!';
    case 'observation': return value ? '' : 'Observação inválida!';
    default: return '';
  }
};

interface AppointmentFormProps {
  initialValues: Appointment;
  mode: 'create' | 'update';
  onSubmit: (values: Appointment) => Promise<void>;
  onReset?: () => void;
  onCopy?: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ initialValues, mode, onSubmit, onReset, onCopy }) => {
  const theme = useTheme();
  const [values, setValues] = useState<Appointment>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "doctor") {
      setValues(prev => ({ ...prev, doctor: value, doctor_name: value }));
      setErrors(prev => ({ ...prev, doctor: validateField(value, "doctor") }));
    }
    else if (name === "location") {
      setValues(prev => ({ ...prev, location: value, location_name: value }));
      setErrors(prev => ({ ...prev, location: validateField(value, "location") }));
    } else {
      setValues(prev => ({ ...prev, [name]: value }));
      setErrors(prev => ({ ...prev, [name]: validateField(value, name) }));
    }
  };

  const handleInternalReset = () => {
    setValues(initialValues);
    if (onReset) onReset();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let formValid = true;
    const newErrors: Record<string, string> = {};
    ['name', 'doctor', 'location', 'date', 'observation'].forEach(field => {
      const fieldKey = field === "doctor" ? "doctor_name" : field === "location" ? "location_name" : field;
      const fieldValue = (values as any)[fieldKey] as string;
      const error = validateField(fieldValue, field);
      if (error) formValid = false;
      newErrors[field] = error;
    });
    setErrors(newErrors);
    if (!formValid) return;
    setLoading(true);
    const submission = { ...values, id: mode === 'create' ? generateUniqueId() : values.id };
    await onSubmit(submission);
    setLoading(false);
  };

  return (
    <>
      <CssBaseline />
      <FormContainer onSubmit={handleSubmit} noValidate>
        <Grid container spacing={0}>
          <Grid item xs={12} sm={6} sx={{ pr: { xs: 0, sm: '15px' }, mb: '15px' }}>
            <FormControl fullWidth>
              <FormLabel htmlFor="name">Nome</FormLabel>
              <TextField
                id="name"
                name="name"
                placeholder="Nome da consulta"
                required
                fullWidth
                variant="outlined"
                value={values.name || ''}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ mb: '15px' }}>
            <FormControl fullWidth>
              <FormLabel htmlFor="doctor">Médico</FormLabel>
              <TextField
                id="doctor"
                name="doctor"
                placeholder="Nome do médico"
                required
                fullWidth
                variant="outlined"
                value={values.doctor_name || ''}
                onChange={handleChange}
                error={!!errors.doctor}
                helperText={errors.doctor}
              />
            </FormControl>
          </Grid>
          {/* Linha 2: Localização e Data */}
          <Grid item xs={12} sm={6} sx={{ pr: { xs: 0, sm: '15px' }, mb: '15px' }}>
            <FormControl fullWidth>
              <FormLabel htmlFor="location">Localização</FormLabel>
              <TextField
                id="location"
                name="location"
                placeholder="Digite o endereço"
                required
                fullWidth
                variant="outlined"
                value={values.location_name || ''}
                onChange={handleChange}
                error={!!errors.location}
                helperText={errors.location}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ mb: '15px' }}>
            <FormControl fullWidth>
              <FormLabel htmlFor="date">Data</FormLabel>
              <TextField
                id="date"
                name="date"
                type="datetime-local"
                required
                fullWidth
                variant="outlined"
                value={values.date || ''}
                onChange={handleChange}
                error={!!errors.date}
                helperText={errors.date}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sx={{ mb: '15px' }}>
            <FormControl fullWidth>
              <FormLabel htmlFor="observation">Observação</FormLabel>
              <TextField
                id="observation"
                name="observation"
                placeholder="Observações sobre a consulta"
                required
                fullWidth
                variant="outlined"
                value={values.observation || ''}
                onChange={handleChange}
                error={!!errors.observation}
                helperText={errors.observation}
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={0} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6} sx={{ order: { xs: 1, md: 2 }, textAlign: { xs: 'center', md: 'right' }, mb: { xs: '15px', md: 0 } }}>
            <InputActionButton
              type="submit"
              label={loading ? '' : 'Enviar Formulário'}
              startIcon={loading ? <CircularProgress size={24} sx={{ color: theme.palette.primary.dark }} /> : undefined}
              disabled={loading}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ order: { xs: 2, md: 1 }, textAlign: { xs: 'center', md: 'left' } }}>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' }, pr: { xs: 0, md: '15px' } }}>
              {onReset && (
                <Button
                  type="button"
                  variant="outlined"
                  fullWidth
                  sx={{
                    backgroundColor: 'transparent',
                    borderColor: theme.palette.primary.dark,
                    color: theme.palette.primary.dark,
                    borderRadius: 1,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      borderColor: theme.palette.primary.dark,
                      color: theme.palette.primary.dark,
                    }
                  }}
                  onClick={handleInternalReset}
                >
                  Limpar formulário
                </Button>
              )}
              {onCopy && (
                <Button
                  type="button"
                  variant="outlined"
                  fullWidth
                  sx={{
                    backgroundColor: 'transparent',
                    borderColor: theme.palette.primary.dark,
                    color: theme.palette.primary.dark,
                    borderRadius: 1,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      borderColor: theme.palette.primary.dark,
                      color: theme.palette.primary.dark,
                    }
                  }}
                  onClick={onCopy}
                >
                  Copiar uma consulta da lista
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </FormContainer>
    </>
  );
};

export default AppointmentForm;
