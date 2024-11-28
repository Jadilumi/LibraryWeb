import React, {useState} from 'react';
import {Navbar, TextInput, Dropdown, Avatar} from 'flowbite-react';
import {
    HiSearch,
    HiHome,
    HiBookOpen,
    HiUsers,
    HiClipboardList,
    HiCurrencyDollar,
    HiChartBar,
    HiCog
} from 'react-icons/hi';

import Logo from "../../assets/img-logo.jpg"
import {IoPerson} from "react-icons/io5";
import {useLocation} from "react-router-dom";
import {useAuth} from "../../service/auth/AuthContext/index.jsx";

export default function NavBar() {

    const location = useLocation();

    const {logout} = useAuth();


    return (
        <Navbar fluid className="bg-blue-900 rounded-b-md">
            <Navbar.Brand href="/dashboard">
                <img src={Logo} className="mr-3 h-6 sm:h-9" alt="Library Logo"/>
                <span className="self-center whitespace-nowrap text-xl font-semibold text-white">
          Portal do Bibliotecário
        </span>
            </Navbar.Brand>
            <div className="flex md:order-2">
                <Dropdown
                    arrowIcon={true}
                    inline
                    label={
                        <Avatar alt="Librarian settings" img={IoPerson} size={"sm"} color={"success"} bordered
                                className={`h-10 w-14 text-white`} rounded/>
                    }
                >
                    <Dropdown.Header>
                        <span className="block text-sm">Jane Smith</span>
                        <span className="block truncate text-sm font-medium">jane.smith@library.com</span>
                    </Dropdown.Header>
                    <Dropdown.Divider/>
                    <Dropdown.Item onClick={logout}>Sair</Dropdown.Item>
                </Dropdown>
                <Navbar.Toggle/>
            </div>
            <Navbar.Collapse>
                <Navbar.Link href="/in/books" active={location.pathname === "/books"}
                             className="text-white hover:text-white">
                    <div className="flex items-center">
                        <HiBookOpen className="mr-2"/>
                        Livros
                    </div>
                </Navbar.Link>

                <Navbar.Link href="/in/clients" active={location.pathname === "/clients"}
                             className="text-white hover:text-white">
                    <div className="flex items-center">
                        <HiUsers className="mr-2"/>
                        Clientes
                    </div>
                </Navbar.Link>

                <Navbar.Link href="/in/loans" active={location.pathname === "/dashboard"}
                             className={`text-white hover:text-white`}>
                    <div className="flex items-center">
                        <HiHome className="mr-2"/>
                        Empréstimos
                    </div>
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    )
}