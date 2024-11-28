import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import Table from "../../components/Table/index.jsx";
import {useQuery} from "@tanstack/react-query";
import Loading from "../../components/Loading/index.jsx";
import {Button} from "flowbite-react";
import {FaArrowAltCircleLeft, FaArrowAltCircleRight} from "react-icons/fa";

export default function Loan() {

    const headers = ["Dia de Ínicio", "Data estimada de Retorno", "Título", "Custo Total"];
    const headerMapping = {
        loanStartDate: "Dia de Ínicio",
        estimateLoanReturnDate: "Data estimada de Retorno",
        bookTitle: "Título",
        totalLoanCost: "Custo Total",
    }
    const [actualPage, setPage] = useState(0);
    const [actualSize, setSize] = useState(10);
    const navigate = useNavigate();

    const axiosInstance = axios.create({
        baseURL: 'https://libraryapi-production-b14d.up.railway.app',
    });

    const getToken = () => {
        const token = sessionStorage.getItem("jwtToken");
        return token ? `Bearer ${token}` : null;
    };

    const fetchLoans = async () => {
        const params = new URLSearchParams({
            page: actualPage,
            size: actualSize,
        });

        const response = await axiosInstance.get(`/loans/view/all?${params.toString()}`, {
            headers: {
                Authorization: getToken()
            }
        })
        return response.data;
    }

    const {data, error, isLoading, isError, refetch} = useQuery({
        queryKey: ['loans'],
        queryFn: () => fetchLoans(),
        keepPreviousData: true,
    });

    const handleLineClick = (data) => {
        navigate(`/in/loans/edit/${data.loanId}`);
    }


    const handleNextPage = () => {
        setPage((prev) => prev + 1);
    };

    const handlePreviousPage = () => {
        setPage((prev) => Math.max(prev - 1, 0)); // Não permite páginas negativas
    };


    if (isLoading) {
        return (
            <Loading message={"Carregando"}/>
        )
    }

    if (isError) return <p>Erro ao carregar os dados: {error.message}</p>;


    return (
        <div>
            <Table
                titlePage={"Empréstimos"}
                headers={headers}
                data={data.content}
                handleLineClick={handleLineClick}
                headerMapping={headerMapping}
            />

            <div className="flex justify-center mt-4 gap-x-10 p-5">
                <Button
                    disabled={actualPage === 0}
                    onClick={handlePreviousPage}>
                    <FaArrowAltCircleLeft/>
                </Button>
                <span>
                    Página {data.number + 1} de {data.totalPages}
                </span>
                <Button
                    disabled={actualPage + 1 >= data.totalPages}
                    onClick={handleNextPage}>
                    <FaArrowAltCircleRight/>
                </Button>
            </div>
        </div>


    )
}