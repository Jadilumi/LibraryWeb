import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import Loading from "../../../components/Loading/index.jsx";
import {Button, Label, Select, TextInput} from "flowbite-react";
import axios from "axios";
import {useQuery} from '@tanstack/react-query';
import debounce from 'lodash.debounce';
import {FaArrowDown, FaSearchengin} from "react-icons/fa";
import Swal from "sweetalert2";

export default function LoanForm() {

    const location = useLocation();
    const preSelectedBookId = location.state?.bookId || "";
    const {bookId, loanId} = useParams();
    const [loan, setLoan] = useState({
        book: {
            bookId: preSelectedBookId
        },
        estimateLoanReturnDate: "",
        interestRatePerDay: ""
    });
    const [clientDocument, setClientDocument] = useState("");
    const [client, setClient] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const [data, setData] = useState({});

    const axiosInstance = axios.create({
        baseURL: 'https://libraryapi-production-b14d.up.railway.app',
    });

    const getToken = () => {
        const token = sessionStorage.getItem("jwtToken");
        return token ? `Bearer ${token}` : null;
    };

    const fetchBooks = async (bookId) => {
        const response = await axiosInstance.get(`/books/${bookId}`, {
            headers: {
                Authorization: getToken()
            }
        })
        return response.data;
    };

    const fetchLoanById = async () => {
        const response = await axiosInstance.get(`/loans/view/${bookId}/${loanId}`, {
            headers: {
                Authorization: getToken()
            }
        })
        return response.data;
    }

    useEffect(() => {
        const fetchData = async () => {
            if (bookId && loanId) {
                const loanData = await fetchLoanById();
                setLoan(loanData);

                const booksData = await fetchBooks(bookId);
                setData(booksData);
            } else {
                const booksData = await fetchBooks(preSelectedBookId);
                setData(booksData);
            }
        };

        fetchData().catch((error) => {
            console.error("Erro ao buscar dados:", error);
        });
    }, [bookId, loanId]);

    if (isLoading) {
        return (
            <Loading message={"Carregando"}/>
        )
    }

    const navigate = useNavigate();

    const handleInputChange = (field, value) => {
        setLoan((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (loanId && bookId) {
            const updatedLoan = {
                ...loan,
                book: {
                    bookId: bookId,
                },
                client: {
                    clientId: client.clientId
                }
            };

            await axiosInstance.put(`/loans/edit/${loanId}`, updatedLoan, {
                headers: {
                    Authorization: getToken()
                }
            }).then((r) => {
                if (r.status === 200) {
                    Swal.fire({
                        title: "Empréstimo editado com sucesso!"
                    }).then((r) => {
                        navigate(`/in/books/edit/${bookId}`)
                    })
                }
            })
        } else {
            const updatedLoan = {
                ...loan,
                client: {
                    clientId: client.clientId
                }
            };
            await axiosInstance.post("/loans", updatedLoan, {
                headers: {
                    Authorization: getToken()
                }
            }).then((r) => {
                Swal.fire({
                    title: "Empréstimo salvo com sucesso!"
                }).then((r) => {
                    navigate(`/in/books/edit/${preSelectedBookId}`)
                })
            })
        }
    }

    const formatter = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    });


    return (
        <div className={`p-5`}>
            <div className={`flex justify-center mb-10 mt-3`}>
                <span className={`text-3xl`}>
                    {bookId && loanId ? "Editar Empréstimo" : "Cadastrar novo Empréstimo"}
                </span>
            </div>
            <form method={"POST"} onSubmit={handleSave}>
                <div className={`flex justify-between`}>
                    <div>
                        <Link to={"/in/books"}>
                            <Button color={"blue"} className="">
                                <div className={"flex items-center"}>
                                    <FaArrowDown className={"rotate-90 mr-3"}/>
                                </div>
                                Voltar para Livros
                            </Button>
                        </Link>
                    </div>
                    <div className={`flex gap-x-5`}>
                        {bookId && loanId &&
                            <Button onClick={() => {
                                Swal.fire({
                                    title: "Cuidado!",
                                    text: "Você tem certeza que deseja apagar esse empréstimo?",
                                    showDenyButton: true,
                                    confirmButtonText: "Sim",
                                    denyButtonText: "Não",
                                }).then((r) => {
                                    if (r.isConfirmed) {
                                        axiosInstance.delete(`/loans/del/${bookId}/${loanId}`, {
                                            headers: {
                                                Authorization: getToken()
                                            }
                                        }).then((r) => {

                                        }).catch((e) => {
                                            navigate(`/in/books/edit/${bookId}`)
                                        })
                                    }
                                })
                            }} color={`failure`}>
                                Deletar Emprestimo
                            </Button>}
                        <Button color={"success"} type={`submit`}>
                            Salvar Empréstimo
                        </Button>
                        {bookId && loanId &&
                            <Button color={"blue"} onClick={() => {
                                axiosInstance.put(`/loans/edit/${bookId}/${loanId}`, {
                                    headers: {
                                        Authorization: getToken()
                                    }
                                }).then(r => {
                                    if (r.status === 200) {
                                        Swal.fire({
                                            title: "Livro Retornado com sucesso!"
                                        })
                                    }
                                })
                            }}>
                                Devolver Livro
                            </Button>
                        }

                    </div>
                </div>
                <div className={`w-full flex-wrap justify-center flex gap-5 mt-10`}>
                    <div className={`w-96`}>
                        <div>
                            <Label className={`mb-1 ml-1`} value={`Livro`}/>
                        </div>
                        <TextInput
                            className={``}
                            value={`${data.title} - ${data.author} - ${data.edition}`}
                            disabled
                        />
                    </div>

                    <div className={`w-96`}>
                        <div>
                            <Label className={`mb-1 ml-1`} value={`Cliente`}/>
                        </div>
                        <div className={` flex gap-x-3`}>
                            <TextInput
                                className={`w-full`}
                                id={"clientDocument"}
                                value={loan.client ? loan.client.name + " - " + loan.client.document : clientDocument}
                                onChange={(e) => {
                                    setClientDocument(e.target.value)
                                }}
                                disabled={loan.client}
                            />
                            <Button onClick={() => {
                                axiosInstance.get(`/clients/get/document/${clientDocument.toString()}`, {
                                    headers: {
                                        Authorization: getToken()
                                    }
                                }).then(r => {
                                    setClient(r.data)
                                    console.log(client)

                                })
                            }} className={`flex items-center ${loan.client ? 'hidden' : 'block'}`}>
                                <FaSearchengin size={20}/>
                            </Button>
                        </div>
                    </div>

                    <div className={`w-96`}>
                        <div>
                            <Label className={`mb-1 ml-1`} value={`Data do ínicio do Empréstimo`}/>
                        </div>
                        <TextInput
                            className={``}
                            value={`${new Date().toLocaleString()}`}
                            disabled
                        />
                    </div>

                    <div className={`w-96`}>
                        <div>
                            <Label className={`mb-1 ml-1`} value={`Data de Retorno Estimado`}/>
                        </div>
                        <TextInput
                            className={``}
                            id={"estimateLoanReturnDate"}
                            value={loan.estimateLoanReturnDate}
                            onChange={(e) => handleInputChange(e.target.id, e.target.value)}
                            type={"date"}
                            required
                        />
                    </div>

                    <div className={`w-96`}>
                        <div>
                            <Label className={`mb-1 ml-1`} value={`Juros por dia de atraso (%)`}/>
                        </div>
                        <TextInput
                            className={``}
                            id={"interestRatePerDay"}
                            value={loan.interestRatePerDay}
                            type={"number"}
                            onChange={(e) => handleInputChange(e.target.id, e.target.value)}
                            required
                        />
                    </div>
                    {bookId && loanId &&
                        <div className={`flex w-full justify-center gap-5`}>
                            <div className={`w-96`}>
                                <div>
                                    <Label className={`mb-1 ml-1`} value={`Status do Empréstimo`}/>
                                </div>
                                <TextInput
                                    className={``}
                                    id={"loanStatus"}
                                    value={loan.loanStatus}
                                    type={"text"}
                                    disabled
                                />
                            </div>

                            <div className={`w-96`}>
                                <div>
                                    <Label className={`mb-1 ml-1`} value={`Custo total do Empréstimo`}/>
                                </div>
                                <TextInput
                                    className={``}
                                    id={"totalLoanCost"}
                                    value={formatter.format(loan.totalLoanCost)}
                                    disabled
                                />
                            </div>

                            <div className={`w-96`}>
                                <div>
                                    <Label className={`mb-1 ml-1`} value={`Data de retorno do Empréstimo`}/>
                                </div>
                                <TextInput
                                    className={``}
                                    id={"estimateLoanReturnDate"}
                                    value={loan.loanReturnDate === null ? "Não retornado" : new Date(loan.loanReturnDate).toLocaleDateString()}
                                    disabled
                                />
                            </div>

                            <div className={`w-96`}>
                                <div>
                                    <Label className={`mb-1 ml-1`} value={`Dias de empréstimo total`}/>
                                </div>
                                <TextInput
                                    className={``}
                                    id={"loanDays"}
                                    value={loan.loanDays}
                                    disabled
                                />
                            </div>
                        </div>
                    }
                </div>
            </form>
            <div className={`h-[1px] bg-black mt-5 mb-5`}/>
        </div>
    )
}