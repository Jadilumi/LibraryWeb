import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Button, Label, Table, TextInput} from "flowbite-react";
import {FaArrowDown} from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";

export default function ClientForm() {

    const {clientId} = useParams();
    const [client, setClient] = useState({
        document: "",
        name: "",
        loans: []
    })

    const navigate = useNavigate();

    const formatter = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    const handleLineLoanClick = (loanId) => {
        navigate(`/in/loans/edit/${bookId}/${loanId}`);
    }

    const axiosInstance = axios.create({
        baseURL: 'https://libraryapi-production-b14d.up.railway.app',
    });

    const getToken = () => {
        const token = sessionStorage.getItem("jwtToken");
        return token ? `Bearer ${token}` : null;
    };

    const fetchClient = async (clientId) => {
        const response = await axiosInstance.get(`/clients/get/id/${clientId}`, {
            headers: {
                Authorization: getToken()
            }
        })
        return response.data;
    };

    useEffect(() => {
        const fetchData = async () => {
            if (clientId) {
                const clientData = await fetchClient(clientId);
                setClient(clientData);
            }
        };

        fetchData().catch((error) => {
            console.error("Erro ao buscar dados:", error);
        });
    }, [clientId]);

    const handleSave = async (e) => {
        e.preventDefault()
        if (clientId) {
            await axiosInstance.put(`/clients/edit/${clientId}`, client, {
                headers: {
                    Authorization: getToken()
                }
            }).then((r) => {
                if (r.status === 202) {
                    Swal.fire({
                        title: "Cliente editado com sucesso!"
                    }).then((r) => {
                        navigate(`/in/clients/edit/${clientId}`)
                    })
                }
            })
        } else {
            await axiosInstance.post("/clients", client, {
                headers: {
                    Authorization: getToken()
                }
            }).then((r) => {
                Swal.fire({
                    title: "Cliente salvo com sucesso!"
                }).then((r) => {
                    navigate(`/in/clients`)
                })
            })
        }
    }

    const handleInputChange = (field, value) => {
        setClient((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    return (
        <div className={`p-5`}>
            <div className={`mb-10 flex justify-center`}>
                <span className={`text-3xl`}>
                    {clientId ? "Editar Cliente" : "Cadastrar Cliente"}
                </span>
            </div>

            <div>
                <form method={"POST"} onSubmit={handleSave}>
                    <div className={`flex justify-between`}>
                        <div>
                            <Link to={"/in/clients"}>
                                <Button color={"blue"} className="">
                                    <div className={"flex items-center"}>
                                        <FaArrowDown className={"rotate-90 mr-3"}/>
                                    </div>
                                    Voltar para Clientes cadastrados
                                </Button>
                            </Link>
                        </div>
                        <div className={`flex gap-x-5`}>
                            {clientId &&
                                <Button onClick={() => {
                                    Swal.fire({
                                        title: "Cuidado!",
                                        text: "Você tem certeza que deseja deletar esse cliente?\nIsso apagará também os empréstimos relacionados a ele!",
                                        showDenyButton: true,
                                        confirmButtonText: "Sim",
                                        denyButtonText: "Não",
                                    }).then((r) => {
                                            if (r.isConfirmed) {
                                                axiosInstance.delete(`/clients/del/${clientId}`, {
                                                    headers: {
                                                        Authorization: getToken()
                                                    }
                                                }).then((r) => {

                                                }).catch((e) => {
                                                    navigate(`/in/clients`)
                                                })
                                            }
                                        }
                                    )
                                }
                                } color={`failure`}>
                                    Deletar Cliente
                                </Button>}
                            <Button color={"success"} type={`submit`}>
                                Salvar Cliente
                            </Button>
                        </div>
                    </div>

                    <div className={`w-full flex-wrap justify-start flex gap-5 mt-10`}>
                        <div className={`w-96`}>
                            <div>
                                <Label className={`mb-1 ml-1`} value={`Documento de Identificação`}/>
                            </div>
                            <TextInput
                                className={``}
                                id={"document"}
                                value={client.document}
                                onChange={(e) => handleInputChange(e.target.id, e.target.value)}
                            />
                        </div>

                        <div className={`w-96`}>
                            <div>
                                <Label className={`mb-1 ml-1`} value={`Nome do Cliente`}/>
                            </div>
                            <TextInput
                                id={"name"}
                                className={``}
                                value={client.name}
                                onChange={(e) => handleInputChange(e.target.id, e.target.value)}
                            />
                        </div>
                    </div>


                </form>
            </div>

            {clientId &&
                <div>
                    <div className={`h-[1px] bg-black mt-5 mb-5`}/>

                    <div className={``}>
                        <div className={`flex justify-between`}>
                            <div>
                       <span className={`text-3xl`}>
                         Empréstimos
                       </span>
                            </div>
                        </div>

                        <div className={`mt-5 mb-5`}>
                            <Table hoverable>
                                <Table.Head>
                                    <Table.HeadCell>Ínicio do Emprestimo</Table.HeadCell>
                                    <Table.HeadCell>Data de retorno Estimada</Table.HeadCell>
                                    <Table.HeadCell>Custo total do Empréstimo</Table.HeadCell>
                                    <Table.HeadCell>Status do Empréstimo</Table.HeadCell>
                                </Table.Head>
                                <Table.Body>
                                    {client.loans.map((loan, index) => (
                                        <Table.Row key={index}
                                                   className="text-black cursor-pointer border-b-[1px] border-gray-300 hover:bg-gray-200"
                                                   onClick={() => handleLineLoanClick(loan.loanId)}>
                                            <Table.Cell
                                                className="">
                                                {new Date(loan.loanStartDate).toLocaleString("pt-BR")}
                                            </Table.Cell>
                                            <Table.Cell>{new Date(loan.estimateLoanReturnDate).toLocaleDateString("pt-BR")}</Table.Cell>
                                            <Table.Cell>{formatter.format(loan.totalLoanCost)}</Table.Cell>
                                            <Table.Cell>{loan.loanStatus}</Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
