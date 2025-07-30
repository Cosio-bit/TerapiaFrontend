// src/providers/QueryProvider.jsx
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Crear el cliente de React Query con configuración optimizada
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tiempo de vida en caché (5 minutos)
      staleTime: 5 * 60 * 1000,
      // Tiempo antes de eliminar del cache (10 minutos)
      cacheTime: 10 * 60 * 1000,
      // Reintentos en caso de error
      retry: 1,
      // No refetch automático al cambiar de ventana
      refetchOnWindowFocus: false,
      // Refetch solo cuando sea necesario
      refetchOnMount: 'always',
    },
    mutations: {
      // Reintentos para mutaciones
      retry: 1,
    },
  },
});

export const QueryProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Herramientas de desarrollo solo en modo desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
};

export default QueryProvider;

// Hook personalizado para acceder al query client
export const useQueryClient = () => {
  return queryClient;
};