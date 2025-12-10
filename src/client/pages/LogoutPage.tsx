import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from 'modelence/client';

export default function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    logout().then(() => {
      navigate('/login', { replace: true });
    });
  }, [navigate]);

  return null;
}

