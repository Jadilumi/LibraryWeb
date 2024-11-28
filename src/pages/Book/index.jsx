import Table from "../../components/Table/index.jsx";
import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import Loading from "../../components/Loading/index.jsx";
import {Button, TextInput} from "flowbite-react";
import {FaArrowAltCircleLeft, FaArrowAltCircleRight} from "react-icons/fa";
import {useNavigate} from "react-router-dom";

export default function Book() {

    const headers = ["Capa", "Titulo", "Autor", "Genêro", "Estoque Disponível"];
    const headerMapping = {
        coverBookImage: "Capa",
        title: "Titulo",
        author: "Autor",
        genre: "Genêro",
        availableStock: "Estoque Disponível",
    }
    const [actualPage, setPage] = useState(0);
    const [actualSize, setSize] = useState(10);
    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();

    const axiosInstance = axios.create({
        baseURL: 'https://libraryapi-production-b14d.up.railway.app',
    });

    const getToken = () => {
        const token = sessionStorage.getItem("jwtToken");
        return token ? `Bearer ${token}` : null;
    };

    const fetchBooks = async () => {
        const params = new URLSearchParams({
            page: actualPage,
            size: actualSize,
        });

        if (searchValue && searchValue.trim() !== "") {
            params.append("title", searchValue);
        }

        const response = await axiosInstance.get(`/books?${params.toString()}`, {
            headers: {
                Authorization: getToken()
            }
        })
        return response.data;
    }

    const handleLineClick = (data) => {
        navigate(`/in/books/edit/${data.bookId}`);
    }

    const {data, error, isLoading, isError, refetch} = useQuery({
        queryKey: ['books', actualPage, searchValue],
        queryFn: () => fetchBooks(),
        keepPreviousData: true,
        enabled: searchValue !== null
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

    const handleClickOnSearch = (receivedValue) => {
        setPage(0)
        setSearchValue(receivedValue);
        refetch();
    }

    if (isError) return <p>Erro ao carregar os dados: {error.message}</p>;

    return (
        <div>
            <Table
                titlePage={"Livros"}
                addButtonMessage={"Cadastrar Livro"}
                addButtonLink={"/in/books/add"}
                headers={headers}
                data={data.content}
                handleLineClick={handleLineClick}
                headerMapping={headerMapping}
                handleClickOnSearch={handleClickOnSearch}
                hasAddButton={true}
                hasSearchField={true}
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