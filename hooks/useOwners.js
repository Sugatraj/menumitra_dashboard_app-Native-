import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ownerService } from '../services/ownerService';

export const useOwners = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOwners = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ownerService.getAllOwners();
      setOwners(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadOwners();
    }, [loadOwners])
  );

  return { owners, loading, error, refreshOwners: loadOwners };
}; 