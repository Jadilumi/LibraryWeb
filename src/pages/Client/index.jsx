import Table from "../../components/Table/index.jsx";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useQuery} from "@tanstack/react-query";
import Loading from "../../components/Loading/index.jsx";
import {useState} from "react";
import {Button} from "flowbite-react";
import {FaArrowAltCircleLeft, FaArrowAltCircleRight} from "react-icons/fa";

export default function Client() {

    const headers = ["ID", "Doc.", "Nome"];
    const headerMapping = {
        clientId: "ID",
        document: "Doc.",
        name: "Nome",
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

    const fetchClients = async () => {
        const params = new URLSearchParams({
            page: actualPage,
            size: actualSize,
        });

        const response = await axiosInstance.get(`/clients/get/all?${params.toString()}`, {
            headers: {
                Authorization: getToken()
            }
        })
        return response.data;
    }

    const handleLineClick = (data) => {
        navigate(`/in/clients/edit/${data.clientId}`);
    }

    const {data, error, isLoading, isError, refetch} = useQuery({
        queryKey: ['clients'],
        queryFn: () => fetchClients(),
        keepPreviousData: true,
    });

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

    return (
        <div>
            <Table
                headers={headers}
                headerMapping={headerMapping}
                titlePage={"Clientes Cadastrados"}
                handleLineClick={handleLineClick}
                data={data.content}
                addButtonLink={"/in/clients/add"}
                addButtonMessage={"Adicionar novo Cliente"}
                hasAddButton={true}
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