import {Button, TextInput} from "flowbite-react";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {IoIosSearch} from "react-icons/io";
import {useState} from "react";

const invertMapping = (headerMapping) =>
    Object.fromEntries(Object.entries(headerMapping).map(([key, value]) => [value, key]));

export default function Table({
                                  data = [{}],
                                  headers = [],
                                  headerMapping = {},
                                  handleLineClick,
                                  addButtonMessage = "Botão ADD",
                                  addButtonLink = "#",
                                  titlePage = "title",
                                  handleClickOnSearch,
                                  hasAddButton = false,
                                  hasSearchField = false
                              }) {
    const invertedHeaderMapping = invertMapping(headerMapping);

    const isBase64Image = (value) => {
        return typeof value === "string" && /^([A-Za-z0-9+/=]+)$/.test(value.trim()) && value.length > 100;
    };

    const createImageUrl = (base64String) => {
        return `data:image/png;base64,${base64String}`;
    };

    const [searchValue, setSearchValue] = useState("");

    return (
        <>
            <div className={"flex"}>
                <div className={`flex-1 w-full p-4`}>
                    <div className={"w-full text-center text-4xl mb-10"}>
                        {titlePage}
                    </div>
                    <div className="container mx-auto p-6 bg-gray-50 max-h-full">
                        <div className="bg-white rounded-lg shadow">
                            <div className="flex items-center justify-between p-4 border-b">
                                {hasAddButton &&
                                    <Link to={addButtonLink}>
                                        <Button className="bg-blue-600 text-white">+ {addButtonMessage}</Button>
                                    </Link>
                                }
                                {hasSearchField &&
                                    <div className={`flex gap-x-3`}>
                                        <div>
                                            <TextInput id="input-gray" onChange={(e) => setSearchValue(e.target.value)}
                                                       placeholder="Buscar por Titulo" className={`w-96`}
                                                       required color="gray"/>
                                        </div>
                                        <div className={`flex items-center cursor-pointer bg-gray-500 rounded p-2`}>
                                            <IoIosSearch className={``} fill={"#FFF"} size={20}
                                                         onClick={() => handleClickOnSearch(searchValue)}/>
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="p-4">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                        <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {headers.map((header, index) => (
                                                <th key={index} className="p-4">
                                                    {headerMapping[header] || header}
                                                </th>
                                            ))}
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {data.map((data2, index) => (
                                            <tr
                                                key={data2.id || index}
                                                className="border-t cursor-pointer hover:bg-gray-300 hover:duration-300"
                                                onClick={() => handleLineClick(data2)}
                                            >
                                                {headers.map((header, i) => (
                                                    <td key={i} className="p-4">
                                                        {isBase64Image(data2[invertedHeaderMapping[header]]) ? (
                                                            <img
                                                                src={createImageUrl(
                                                                    data2[invertedHeaderMapping[header]]
                                                                )}
                                                                alt="Imagem"
                                                                className="w-[40px] h-[40px] rounded"
                                                            />
                                                        ) : (
                                                            data2[invertedHeaderMapping[header]] || ""
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
