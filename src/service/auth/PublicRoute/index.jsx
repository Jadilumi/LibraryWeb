import {Navigate} from 'react-router-dom';
import {useAuth} from '../AuthContext/index.jsx';

export default function PublicRoute({children}) {
    const {isAuthenticated} = useAuth();

    if (isAuthenticated) {
        return <Navigate to="/in/books"/>;
    }

    return children;
}
