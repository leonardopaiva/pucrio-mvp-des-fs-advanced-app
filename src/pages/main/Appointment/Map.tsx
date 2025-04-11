import React, { useRef, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAppointments } from '../../../context/AppointmentContext';
import { Appointment } from '../../../services/interfaces';
import { format } from 'date-fns';

// Declaração global para incluir o objeto google no window
declare global {
  interface Window {
    google: any;
  }
}

// Função para carregar dinamicamente o script do Google Maps
const loadGoogleMapsScript = (callback: () => void) => {
  // Verifica se o objeto google já foi carregado
  if (typeof window.google === 'object' && typeof window.google.maps === 'object') {
    callback();
  } else {
    // Procura pela tag de script no DOM
    const existingScript = document.getElementById('googleMaps');
    if (!existingScript) {
      const script = document.createElement('script');
      // Utiliza a variável de ambiente VITE_GOOGLE_MAPS_API_KEY para a chave da API
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.id = 'googleMaps';
      script.onload = callback;
      document.body.appendChild(script);
    } else {
      existingScript.onload = callback;
    }
  }
};

const Map: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const { appointments } = useAppointments();

  // Função para inicializar o mapa e adicionar marcadores com base nos appointments
  const initMap = () => {
    if (mapRef.current && window.google) {
      // Cria o mapa centralizado no Brasil (com zoom inicial 4)
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: -14.235004, lng: -51.92528 },
        zoom: 4,
      });

      // Testa se appointments está definido
      if (!appointments) return;

      // Filtra apenas os appointments que possuem endereço definido
      const validAppointments = appointments.filter((appointment: Appointment) => appointment.location_name);

      // Para cada appointment válido, adiciona um marcador
      validAppointments.forEach((appointment: Appointment, index) => {
        const geocoder = new window.google.maps.Geocoder();
        // Utiliza o Geocoder para converter o endereço em coordenadas
        geocoder.geocode({ address: appointment.location_name }, (results: any, status: any) => {
          if (status === 'OK' && results && results[0]) {
            const marker = new window.google.maps.Marker({
              map,
              position: results[0].geometry.location,
              title: appointment.name,
            });

            // Cria uma InfoWindow com os detalhes da consulta
            const infoWindow = new window.google.maps.InfoWindow({
              content: `<div style="font-family: sans-serif; font-size: 0.9rem;">
                <strong>${appointment.name}</strong><br/>
                Doutor: ${appointment.doctor_name || appointment.doctor}<br/>
                Local: ${appointment.location_name}<br/>
                Data: ${format(new Date(appointment.date), 'MMMM dd, yyyy HH:mm')}
              </div>`,
            });

            // Abre a InfoWindow ao clicar no marcador
            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });

            // Se for o último appointment válido, centraliza e ajusta o zoom do mapa
            if (index === validAppointments.length - 1) {
              map.setCenter(results[0].geometry.location);
              map.setZoom(14);
            }
          } else {
            console.error('Erro ao converter endereço: ' + status);
          }
        });
      });
    }
  };

  // useEffect para carregar o script e depois inicializar o mapa quando os appointments mudarem
  useEffect(() => {
    loadGoogleMapsScript(() => {
      initMap();
    });
  }, [appointments]);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Mapa de Consultas
      </Typography>
      <Box
        ref={mapRef}
        sx={{
          height: '500px',
          width: '100%',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: theme.shadows[2],
        }}
      />
    </Box>
  );
};

export default Map;
