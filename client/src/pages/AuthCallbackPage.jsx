import { useEffect, useContext, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AuthCallbackPage = () => {
  const { login, authUser } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loginCalled, setLoginCalled] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      login(token);
      setLoginCalled(true);
    } else {
      navigate('/login');
    }
    // Only run on mount
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (loginCalled && authUser) {
      navigate('/');
    }
  }, [loginCalled, authUser, navigate]);

  return <div>Loading...</div>;
};

export default AuthCallbackPage;