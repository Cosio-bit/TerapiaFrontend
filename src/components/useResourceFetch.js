import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  getAllProductos, 
  getAllSalas, 
  getAllTerapias, 
  fetchVariantes 
} from '../api';

/**
 * Custom hook to fetch catalog resources: productos, salas, terapias, variantes.
 * Adds loading, error states, cancellation guard, and basic caching.
 */
export const useResourceFetch = (shouldFetch) => {
  const [productos, setProductos] = useState([]);
  const [salas, setSalas] = useState([]);
  const [terapias, setTerapias] = useState([]);
  const [variantes, setVariantes] = useState([]);
  const [loadingResources, setLoadingResources] = useState(false);
  const [errorResources, setErrorResources] = useState(null);

  // Simple in-memory cache to avoid re-fetching unchanged data
  const cacheRef = useRef({});
  const requestIdRef = useRef(0);

  /**
   * Fetches all catalog resources in parallel, updates state, and caches results.
   */
  const fetchAllResources = useCallback(async () => {
    const currentRequestId = ++requestIdRef.current;
    setLoadingResources(true);
    setErrorResources(null);

    try {
      const [prodData, salaData, teraData, varData] = await Promise.all([
        getAllProductos(),
        getAllSalas(),
        getAllTerapias(),
        fetchVariantes()
      ]);

      if (currentRequestId !== requestIdRef.current) return;

      setProductos(prodData || []);
      setSalas(salaData || []);
      setTerapias(teraData || []);
      setVariantes(varData || []);

      // Cache results
      cacheRef.current = { prodData, salaData, teraData, varData };
    } catch (err) {
      console.error('Error fetching resources:', err);
      setErrorResources(err?.message || 'Error loading resources.');
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setLoadingResources(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!shouldFetch) return;

    // Load from cache first if available
    if (cacheRef.current.prodData) {
      setProductos(cacheRef.current.prodData);
      setSalas(cacheRef.current.salaData);
      setTerapias(cacheRef.current.teraData);
      setVariantes(cacheRef.current.varData);
      return;
    }
    fetchAllResources();
  }, [shouldFetch, fetchAllResources]);

  return {
    productos,
    salas,
    terapias,
    variantes,
    loadingResources,
    errorResources,
    refetchResources: fetchAllResources
  };
};
