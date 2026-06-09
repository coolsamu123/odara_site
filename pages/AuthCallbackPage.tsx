import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { handleAuthSuccess } = useAuth();

  useEffect(() => {
    // The backend returns token/user in the URL *fragment* (after #), which the
    // browser never sends to the server — so the JWT stays out of access logs.
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const token = params.get('token');
    const userJson = params.get('user');

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

    // replace:true drops the token-bearing URL from history.
    navigate('/', { replace: true });
  }, [navigate, handleAuthSuccess]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="text-odara-muted">Signing you in...</p>
    </div>
  );
};

export default AuthCallbackPage;
