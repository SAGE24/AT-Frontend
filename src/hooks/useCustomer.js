import { useState } from 'react';
import { searchByDocument } from './../services/customerService';

const useCustomer = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSearchByDocument = async (document) => {
    try {
      const response = await searchByDocument(document);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleSearchByDocument, loading, error };
};

export default useCustomer;