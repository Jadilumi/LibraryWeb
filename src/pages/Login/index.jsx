import {Button, Checkbox, Label, TextInput} from "flowbite-react";
import {useState} from "react";
import {z} from 'zod';
import {IoEyeOffOutline, IoEyeOutline} from "react-icons/io5";
import {Link, useNavigate} from "react-router-dom";
import leftImageLogin from '../../assets/left-image-login.jpg';
import Loading from "../../components/Loading/index.jsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {HiMail} from "react-icons/hi";
import {RiLockPasswordLine} from "react-icons/ri";
import {useAuth} from "../../service/auth/AuthContext/index.jsx";
import axios from "axios";


export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const {login} = useAuth();

    const navigate = useNavigate();

    const createLoginFromSchema = z.object({
        email: z.string().email({message: "E-mail é obrigatório!"}).min(1, {message: "E-mail é obrigatório!"}),
        password: z.string().min(1, {message: "A senha é obrigatória!"})
    })

    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: zodResolver(createLoginFromSchema),
    });

    const handleLogin = async (data) => {
        await axios.post('https://libraryapi-production-b14d.up.railway.app/auth/login', data).then((r) => {
            if (r.status === 200) {
                login(r.data.token);
                navigate("/in/books")
            }
        })
    }


    if (isLoading) {
        return <Loading message={"Carregando"}/>
    }

    return (
        <div className={`flex items-center justify-center w-screen h-screen`}>
            <div className={`w-1/2 h-full hidden md:block`}>
                <img className={`bg-cover w-full h-full`} src={leftImageLogin} alt={"Imagem biblioteca"}/>
            </div>
            <div
                className={`md:w-1/2 p-5 h-full flex items-center justify-center md:justify-start md:bg-gray-100 rounded-md md:shadow-md md:shadow-gray-500`}>
                <form className={`w-96 p-5 md:p-0`} method={"POST"}
                      onSubmit={handleSubmit(handleLogin)}>
                    <div className={`mb-10 text-center md:text-left`}>
                        <span className={`text-3xl`}>Login</span>
                    </div>
                    <div className={`flex flex-col gap-y-5 w-full`}>
                        <div className={`mb-2 block w-full`}>
                            <Label className={`text-lg ml-1`} value={`E-mail`}/>
                            <TextInput placeholder={"email@email.com"}
                                       icon={HiMail}
                                       {...register('email')}
                                       type={`email`}
                            />

                            {errors.email && <p className={`text-[#FF0000]`}>{errors.email.message}</p>}
                        </div>

                        <div className={`flex flex-col w-full`}>
                            <Label className={`text-lg ml-1`} value={`Senha`}/>
                            <div className={`flex flex-col md:flex-row gap-x-3 items-center w-full`}>
                                <div className={`w-full`}>
                                    <TextInput {...register('password')}
                                               className={`md:w-96`}
                                               icon={RiLockPasswordLine}
                                               placeholder={"*********"}
                                               type={`${showPassword ? 'text' : 'password'}`}
                                    />
                                    {errors.password && <p className={`text-[#FF0000]`}>{errors.password.message}</p>}
                                </div>
                                <div className={`-ml-5 mt-1 hidden md:block`}>
                                    <Button color={"transparent"} className={`flex items-center text-black`}
                                            onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <IoEyeOffOutline size={25} fill={`#000`}/> :
                                            <IoEyeOutline size={25} fill={`#000`}/>}
                                    </Button>
                                </div>
                                <div className={`flex justify-start w-full items-center mt-3 ml-3 md:hidden`}>
                                    <Checkbox checked={showPassword}
                                              onChange={(e) => setShowPassword(e.target.checked)}/>
                                    <span className={`ml-3`}>Mostrar senha</span>
                                </div>
                            </div>
                        </div>
                        <div className={`flex justify-end`}>
                            <Link className={`text-blue-600 underline`}>
                                Esqueceu a senha?
                            </Link>
                        </div>
                        <div className={`flex justify-center md:justify-start`}>
                            <Button type={`submit`} className={`bg-indigo-500 w-36`}>
                                <span className={`text-lg`}>Entrar</span>
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
