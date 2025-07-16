// src/hooks/useAuth.js
import { useSelector } from 'react-redux';

export default function useAuth() {
  const { token, userData } = useSelector((state) => state.auth);
  return { token, userData };
}
