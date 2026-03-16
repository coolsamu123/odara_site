import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleAuthSuccess } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const userJson = searchParams.get('user');

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        localStorage.setItem('odara_token', token);
        localStorage.setItem('odara_user', JSON.stringify(user));
        handleAuthSuccess(user);
      } catch {
        // ignore parse errors
      }
    }

    navigate('/', { replace: true });
  }, [searchParams, navigate, handleAuthSuccess]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="text-odara-muted">Signing you in...</p>
    </div>
  );
};

export default AuthCallbackPage;
