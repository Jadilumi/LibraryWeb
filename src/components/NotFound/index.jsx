import {Button} from "flowbite-react";
import {Link} from "react-router-dom";
import {FaSearchLocation} from "react-icons/fa";

export default function NotFound() {
    return (
        <div className={`flex justify-center items-center h-screen bg-gray-300`}>
            <div className={`flex flex-col gap-y-5`}>
                <div className={`flex justify-center`}>
                    <FaSearchLocation size={100} fill={"#8B4513"}/>
                </div>
                <div className={`flex justify-center`}>
                   <span className={`text-5xl text-[#00BFFF]`}>
                       404
                   </span>
                </div>
                <div>
                    <span className={`text-3xl`}>
                        Parece que nos perdemos no caminho...
                    </span>
                </div>
                <div className={`flex justify-center`}>
                    <Link to={`/`} className={`border-2 border-gray-500 p-3 rounded bg-emerald-600 text-white`}>Voltar a
                        página
                        principal</Link>
                </div>
            </div>
        </div>
    )
}