import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
    user: any;
    children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ user, children }) => {
    return user ? <>{children}</> : <Navigate to="/" replace />;
};

export default PrivateRoute;
