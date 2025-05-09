import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  // Estado para armazenar o valor
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Obter do localStorage pelo key
      const item = window.localStorage.getItem(key);
      // Analisar o item armazenado ou retornar initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Se ocorrer um erro, retornar initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Retorna uma vers�o encapsulada da fun��o setter do useState
  // que persiste o novo valor no localStorage.
  const setValue = (value) => {
    try {
      // Permitir que o valor seja uma fun��o para ter a mesma API que useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Salvar estado
      setStoredValue(valueToStore);
      // Salvar no localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
