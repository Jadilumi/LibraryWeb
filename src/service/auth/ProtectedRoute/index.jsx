import {Navigate} from 'react-router-dom';
import {useAuth} from '../AuthContext/index.jsx';
import Loading from "../../../components/Loading/index.jsx";

export default function ProtectedRoute({children}) {
    const {isAuthenticated, loading} = useAuth();

    if (loading) {
        return <Loading message={"Validando Sessão"}/>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/"/>;
    }

    return children;
}
