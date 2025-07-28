import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchCompras, fetchSesionGroups, fetchArriendos } from '../api';

/**
 * Custom hook to manage client-related data: compras, sesion groups, and arriendos.
 * Ensures robustness by handling loading states, errors, stale requests, and empty data.
 */
export const useClientData = () => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [compras, setCompras] = useState([]);
  const [sesionGroups, setSesionGroups] = useState([]);
  const [arriendos, setArriendos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ref to track the latest request and avoid race conditions
  const requestIdRef = useRef(0);

  /** Filters an array of items by the current client ID, safely handling nulls. */
  const filterByClient = useCallback((data, clientId) => {
    if (!Array.isArray(data)) return [];
    return data.filter(item => item.cliente && Number(item.cliente.id_cliente) === Number(clientId));
  }, []);

  /**
   * Fetches all client-related data in parallel, filters by clientId,
   * handles loading/error states, and avoids setting stale responses.
   */
  const fetchClientData = useCallback(async (clientId) => {
    if (!clientId) {
      // Clear any previous data if clientId is invalid
      setCompras([]);
      setSesionGroups([]);
      setArriendos([]);
      return;
    }

    const currentRequestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    // Clear previous data to avoid showing stale entries
    setCompras([]);
    setSesionGroups([]);
    setArriendos([]);

    try {
      const [comprasData, sesionGroupsData, arriendosData] = await Promise.all([
        fetchCompras(clientId),
        fetchSesionGroups(clientId),
        fetchArriendos(clientId)
      ]);

      // If another request started, ignore this result
      if (currentRequestId !== requestIdRef.current) return;

      setCompras(filterByClient(comprasData, clientId));
      setSesionGroups(filterByClient(sesionGroupsData, clientId));
      setArriendos(filterByClient(arriendosData, clientId));
    } catch (err) {
      console.error('Error fetching client data:', err);
      setError(err?.message || 'Error fetching client data. Please try again.');
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [filterByClient]);

  return {
    selectedClient,
    setSelectedClient,
    compras,
    sesionGroups,
    arriendos,
    loading,
    error,
    fetchClientData
  };
};
