import {Link, useNavigate, useParams} from "react-router-dom";
import {Button, FileInput, Label, Select, Table, Textarea, TextInput} from "flowbite-react";
import {FaArrowDown} from "react-icons/fa";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useState} from "react";
import Loading from "../../../components/Loading/index.jsx";
import {CurrencyInput} from "react-currency-mask";
import axios from "axios";
import * as loans from "zod";
import Swal from "sweetalert2";

export default function BookForm() {

    const {bookId} = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [loans, setLoans] = useState([{}]);
    const navigate = useNavigate();

    const sanitizeAndTransformValue = (val) => {
        if (typeof val === "number") {
            return val; // Se já for número, retorna diretamente
        }

        if (typeof val === "string") {
            let sanitizedValue = val.replace(/R\$\s?/, "").trim();
            sanitizedValue = sanitizedValue.replace(/\./g, "");
            sanitizedValue = sanitizedValue.replace(",", ".");

            const parsedValue = parseFloat(sanitizedValue);
            return !isNaN(parsedValue) && parsedValue > 0
                ? parsedValue
                : NaN;
        }

        return NaN;
    };

    const createBookFromSchema = z.object({
        title: z.string().min(1, {message: "O Título é obrigatório!"}),
        author: z.string().min(1, {message: "O nome do autor é obrigatório!"}),
        publisher: z.string().min(1, {message: "O nome da editora é obrigatório!"}),
        genre: z.string(),
        language: z.string(),
        synopsis: z.string(),
        edition: z.string(),
        pricePerDay: z.preprocess(
            (val) => String(val), // Converte qualquer valor para string
            z.string()
                .min(1, {message: "O preço por dia é obrigatório!"})
                .refine((val) => !isNaN(sanitizeAndTransformValue(val)), {
                    message: "O preço por dia deve ser um número válido no formato correto!",
                })
                .transform(sanitizeAndTransformValue)
        ),
        availableStock: z.preprocess(
            (val) => String(val),
            z.string()
                .min(1, {message: "O Estoque é obrigatório!"})
                .refine((val) => !isNaN(sanitizeAndTransformValue(val)), {
                    message: "O estoque deve ser um número válido no formato correto!",
                })
                .transform(sanitizeAndTransformValue)
        ),
        publishYear: z.preprocess(
            (val) => String(val),
            z.string()
                .min(1, {message: "A data de publicação é obrigatória!"})
                .refine((val) => !isNaN(sanitizeAndTransformValue(val)), {
                    message: "A data de publicação deve ser um número válido no formato correto!",
                })
                .transform(sanitizeAndTransformValue)
        ),
        purchaseCost: z.preprocess(
            (val) => String(val),
            z.string()
                .min(1, {message: "O custo de aquisição é obrigatório!"})
                .refine((val) => !isNaN(sanitizeAndTransformValue(val)), {
                    message: "O custo de aquisição deve ser um número válido no formato correto!",
                })
                .transform(sanitizeAndTransformValue)
        ),
        createdAt: z.string().optional(),
        updatedAt: z.string().optional(),
        availabilityStatus: z.boolean().optional(),
        totalProfit: z.number().optional(),
    });

    const saveBookSchema = createBookFromSchema.omit({
        createdAt: true,
        updatedAt: true,
        availabilityStatus: true,
        totalProfit: true,
    });

    const inputsFields = [
        {
            isRequired: true,
            labelName: "Título",
            id: "title",
            type: "text",
        },
        {
            isRequired: true,
            labelName: "Autor",
            id: "author",
            type: "text",

        },
        {
            isRequired: true,
            labelName: "Editora",
            id: "publisher",
            type: "text",

        },
        {
            isRequired: false,
            labelName: "Idioma",
            id: "language",
            type: "text",

        },
        {
            isRequired: false,
            labelName: "Edição",
            id: "edition",
            type: "text",
        },
        {
            isRequired: false,
            labelName: "Ano de Publicação",
            id: "publishYear",
            type: "number",

        }, {
            isRequired: true,
            labelName: "Estoque disponível",
            id: "availableStock",
            type: "number",

        }
    ]

    const genders = [
        "ACADEMICO",
        "LITERATURA_FICCIONAL",
        "LITERATURA_NAO_FICCIONAL",
        "REFERENCIA",
        "HQ",
        "MANGA",
        "MANUAL",
        "TECNICO",
        "LIVRO_INFANTIL",
        "JOVEM_ADULTO",
        "RELIGIOSO",
        "LIVRO_DIDATICO",
        "DICIONARIO",
        "ENCICLOPEDIA",
        "REVISTA_CIENTIFICA",
        "REVISTA",
        "ANTOLOGIA",
        "COLETANEA_DE_CONTOS",
        "MEMORIAS",
        "BIOGRAFIA",
        "ROMANCE",
        "FICCAO",
        "NAO_FICCAO",
        "MISTERIO",
        "FANTASIA",
        "FICCAO_CIENTIFICA",
        "AUTOBIOGRAFIA",
        "HISTORIA",
        "POESIA",
        "ROMANCE_AMOROSO",
        "SUSPENSE",
        "TERROR",
        "AUTO_AJUDA",
        "FILOSOFIA",
        "RELIGIAO",
        "VIAGEM",
        "CULINARIA",
        "ARTE",
        "CIENCIA",
        "NEGOCIOS",
        "INFANTIL",
        "EDUCACAO",
        "DRAMA",
        "AVENTURA",
        "CLASSICO",
        "ROMANCE_GRAFICO",
        "ENSAIO"
    ]

    const {register, watch, handleSubmit, setValue, formState: {errors}} = useForm({
        resolver: zodResolver(createBookFromSchema)
    });

    const axiosInstance = axios.create({
        baseURL: 'https://libraryapi-production-b14d.up.railway.app',
    });

    const getToken = () => {
        const token = sessionStorage.getItem("jwtToken");
        return token ? `Bearer ${token}` : null;
    };


    const handleDeleteBook = async () => {
        await axiosInstance.delete(`/books/${bookId}`, {
            headers: {
                Authorization: getToken()
            }
        }).then((r) => {

        }).catch((e) => {
            if (e.status === 410) {
                Swal.fire({
                    title: "Livro deletado com sucesso!",
                    confirmButtonText: "Ok"
                }).then((r) => {
                    navigate("/in/books")
                })
            }
        })
    }

    const handleSave = async (data) => {

        const filteredData = saveBookSchema.parse(data);

        const form = new FormData();

        form.append("data", JSON.stringify(filteredData));

        if (bookId) {
            await axiosInstance.put(`/books/${bookId}`, form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: getToken()
                }
            }).then((r) => {
                Swal.fire({
                    title: "Livro editado com sucesso!"
                })
                navigate(`/in/books/edit/${bookId}`)
            })
        } else {
            await axiosInstance.post(`/books`, form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: getToken()
                }
            }).then((r) => {
                Swal.fire({
                    title: "Livro criado com sucesso!"
                })
                navigate(`/in/books`)
            })
        }
    }

    if (isLoading) {
        return <Loading message={"Carregando"}/>
    }

    useEffect(() => {
        if (bookId) {
            setIsLoading(true)
            const fetchBook = async () => {
                await axiosInstance.get(`/books/${bookId}`, {
                    headers: {
                        Authorization: getToken()
                    }
                }).then((r) => {
                    setValue("title", r.data.title);
                    setValue("author", r.data.author);
                    setValue("publisher", r.data.publisher)
                    setValue("genre", r.data.genre);
                    setValue("language", r.data.language);
                    setValue("synopsis", r.data.synopsis);
                    setValue("edition", r.data.edition);
                    setValue("pricePerDay", r.data.pricePerDay);
                    setValue("availableStock", r.data.availableStock);
                    setValue("publishYear", r.data.publishYear);
                    setValue("purchaseCost", r.data.purchaseCost);
                    setValue("availabilityStatus", r.data.availabilityStatus);
                    setValue("createdAt", r.data.createdAt);
                    setValue("updatedAt", r.data.updatedAt);
                    setValue("totalProfit", r.data.totalProfit);
                    setLoans(r.data.loans);
                }).catch((e) => {
                    console.error(e);
                }).finally(() => {
                    setIsLoading(false);
                })
            }
            fetchBook();
            setIsLoading(false);
        }

    }, [bookId])

    const formatter = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    const handleLineLoanClick = (loanId) => {
        navigate(`/in/loans/edit/${bookId}/${loanId}`);
    }

    return (
        <div className={`flex flex-col gap-y-3 p-5`}>
            <div className={`flex justify-center`}>
                <span className={`text-3xl`}>{bookId ? "Editar Livro" : "Cadastrar Livro"}</span>
            </div>

            <div className={`bg-gray-50 w-full p-2 rounded`}>
                <form method={`POST`} onSubmit={handleSubmit(handleSave)}>
                    <div className={`flex justify-between`}>
                        <div>
                            <Link to={"/in/books"}>
                                <Button color={"blue"} className="">
                                    <div className={"flex items-center"}>
                                        <FaArrowDown className={"rotate-90 mr-3"}/>
                                    </div>
                                    Voltar para Livros cadastrados
                                </Button>
                            </Link>
                        </div>
                        <div className={`flex gap-x-5`}>
                            {bookId &&
                                <Button onClick={() => {
                                    Swal.fire({
                                        title: "Cuidado!",
                                        text: "Você tem certeza que deseja apagar esse livro?\nIsso apagará também os empréstimos relacionados a ele!",
                                        showDenyButton: true,
                                        confirmButtonText: "Sim",
                                        denyButtonText: "Não",
                                    }).then((r) => {
                                        if (r.isConfirmed) {
                                            handleDeleteBook();
                                        }
                                    })
                                }} color={`failure`}>
                                    Deletar Livro
                                </Button>}
                            <Button color={"success"} type={`submit`}>
                                Salvar Livro
                            </Button>
                        </div>
                    </div>
                    {/*Aqui vai ficar a imagem... pensar como fazer*/}
                    <div className={`flex flex-wrap gap-5 mt-5`}>
                        {inputsFields.map((input, index) => (
                            <div className={`w-80`} key={index}>
                                <div className="mb-1 ml-1 block">
                                    <Label htmlFor={input.id}
                                           value={<span>{input.labelName} {input.isRequired ? <span
                                               title={"Campo obrigatório"}
                                               className={`text-[#FF0000]`}>*</span> : ""}</span>}/>
                                </div>
                                <TextInput
                                    id={input.id}
                                    placeholder={input.labelName}
                                    {...register(input.id)}
                                    type={input.type} sizing="md"/>
                                {errors[input.id] && <p className={`text-[#FF0000]`}>{errors[input.id].message}</p>}
                            </div>
                        ))}
                        <div className={`w-80`}>
                            <div className="mb-1 ml-1 block">
                                <Label htmlFor="pricePerDay"
                                       value={<span>Preço por dia <span
                                           title={"Campo obrigatório"}
                                           className={`text-[#FF0000]`}>*</span></span>}/>
                            </div>
                            <CurrencyInput
                                decimalslimit={2}
                                prefix="R$ "
                                {...register("pricePerDay")}
                                defaultValue={watch("pricePerDay")}
                                InputElement={<TextInput
                                    id={"pricePerDay"}
                                    placeholder="R$ 123,45"
                                    type={"text"} sizing="md"/>}
                            />
                            {errors.pricePerDay && <p className={`text-[#FF0000]`}>{errors.pricePerDay.message}</p>}
                        </div>
                        <div className={`w-80`}>
                            <div className="mb-1 ml-1 block">
                                <Label htmlFor="purchaseCost"
                                       value={<span>Custo de Aquisição <span
                                           title={"Campo obrigatório"}
                                           className={`text-[#FF0000]`}>*</span></span>}/>
                            </div>
                            <CurrencyInput
                                decimalslimit={2}
                                prefix="R$ "
                                {...register("purchaseCost")}
                                defaultValue={watch("purchaseCost")}
                                InputElement={<TextInput
                                    id={"purchaseCost"}
                                    placeholder="R$ 123,45"
                                    type={"text"} sizing="md"/>}
                            />
                            {errors.purchaseCost && <p className={`text-[#FF0000]`}>{errors.purchaseCost.message}</p>}
                        </div>
                        <div className={`w-80`}>
                            <div className="mb-1 ml-1 block">
                                <Label htmlFor="genre" value="Selecione o Gênero"/>
                            </div>
                            <Select id="genre" {...register("genre")} required>
                                {genders.map((genero, index) => (
                                    <option key={index} value={genero}>{genero}</option>
                                ))}
                            </Select>
                        </div>
                    </div>
                    <div className={`w-full mt-5`}>
                        <div className="mb-1 ml-1 block">
                            <Label htmlFor="synopsis"
                                   value={<span>Sinópse</span>}/>
                        </div>
                        <Textarea
                            placeholder="Sinópse"
                            {...register("synopsis")}
                            type="text" sizing="md"/>
                    </div>
                </form>

                {bookId &&
                    <div>
                        <div className={`h-[1px] bg-black mt-5 mb-5`}/>

                        <div className={`mt-5`}>
                            <div className={`flex flex-wrap gap-5`}>
                                <div className={`w-80`}>
                                    <div className="mb-1 ml-1 block">
                                        <Label htmlFor="synopsis"
                                               value={<span>Status de Disponibilidade</span>}/>
                                    </div>
                                    <TextInput
                                        value={watch("availabilityStatus") ? "Disponível" : "Indisponível"}
                                        disabled
                                        type="text" sizing="md"/>
                                </div>

                                <div className={`w-80`}>
                                    <div className="mb-1 ml-1 block">
                                        <Label htmlFor="synopsis"
                                               value={<span>Lucro Total</span>}/>
                                    </div>
                                    <TextInput
                                        value={formatter.format(watch("totalProfit"))}
                                        disabled
                                        type="text" sizing="md"/>
                                </div>

                                <div className={`w-80`}>
                                    <div className="mb-1 ml-1 block">
                                        <Label htmlFor="synopsis"
                                               value={<span>Criado em</span>}/>
                                    </div>
                                    <TextInput
                                        value={new Date(watch("createdAt")).toLocaleString("pt-BR")}
                                        disabled
                                        type="text" sizing="md"/>
                                </div>

                                <div className={`w-80`}>
                                    <div className="mb-1 ml-1 block">
                                        <Label htmlFor="synopsis"
                                               value={<span>Atualizado em</span>}/>
                                    </div>
                                    <TextInput
                                        value={new Date(watch("updatedAt")).toLocaleString("pt-BR")}
                                        disabled
                                        type="text" sizing="md"/>
                                </div>
                            </div>
                        </div>

                        <div className={`h-[1px] bg-black mt-5 mb-5`}/>

                        <div className={``}>
                            <div className={`flex justify-between`}>
                                <div>
                                    <span className={`text-3xl`}>
                                        Empréstimos
                                    </span>
                                </div>

                                <div>
                                    <Button onClick={() => {
                                        navigate(`/in/loans/add`, {state: {bookId}})
                                    }} color={"blue"} className={``}>
                                        Novo Empréstimo
                                    </Button>
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
                                        {loans.map((loan, index) => (
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
        </div>
    )
}
