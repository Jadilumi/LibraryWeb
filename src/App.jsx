import Loading from "./components/Loading/index.jsx";
import {Route, Routes} from "react-router-dom";
import PublicRoute from "./service/auth/PublicRoute/index.jsx";
import NotFound from "./components/NotFound/index.jsx";
import Login from "./pages/Login/index.jsx";
import NavBar from "./components/Navbar/index.jsx";
import Book from "./pages/Book/index.jsx";
import Client from "./pages/Client/index.jsx";
import Loan from "./pages/Loan/index.jsx";
import BookForm from "./pages/Book/BookForm/index.jsx";
import LoanForm from "./pages/Loan/LoanForm/index.jsx";
import ProtectedRoute from "./service/auth/ProtectedRoute/index.jsx";
import ClientForm from "./pages/Client/ClientForm/index.jsx";

function App() {
    return (
        <div className={`h-screen flex flex-col`}>
            <Routes>
                <Route path={"/"} element={
                    <PublicRoute>
                        <Login/>
                    </PublicRoute>
                }/>

                <Route path={"/in/books"} element={
                    <ProtectedRoute>
                        <NavBar/>
                        <Book/>
                    </ProtectedRoute>
                }/>

                <Route path={"/in/books/add"} element={
                    <ProtectedRoute>
                        <NavBar/>
                        <BookForm/>
                    </ProtectedRoute>
                }/>

                <Route path={"/in/books/edit/:bookId"} element={
                    <ProtectedRoute>
                        <NavBar/>
                        <BookForm/>
                    </ProtectedRoute>
                }/>

                <Route path={"/in/clients"} element={
                    <ProtectedRoute>
                        <NavBar/>
                        <Client/>
                    </ProtectedRoute>
                }/>

                <Route path={"/in/clients/add"} element={
                    <ProtectedRoute>
                        <NavBar/>
                        <ClientForm/>
                    </ProtectedRoute>
                }/>

                <Route path={"/in/clients/edit/:clientId"} element={
                    <ProtectedRoute>
                        <NavBar/>
                        <ClientForm/>
                    </ProtectedRoute>
                }/>

                <Route path={"/in/loans"} element={
                    <ProtectedRoute>
                        <NavBar/>
                        <Loan/>
                    </ProtectedRoute>
                }/>

                <Route path={"/in/loans/add"} element={
                    <ProtectedRoute>
                        <NavBar/>
                        <LoanForm/>
                    </ProtectedRoute>
                }/>

                <Route path={"/in/loans/edit/:bookId/:loanId"} element={
                    <ProtectedRoute>
                        <NavBar/>
                        <LoanForm/>
                    </ProtectedRoute>
                }/>

                <Route path={"*"} element={
                    <NotFound/>
                }/>
            </Routes>
        </div>
    )
}

export default App
