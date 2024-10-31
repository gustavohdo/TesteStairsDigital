"use client"

import { useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useState } from "react";

export default function EditPage({ params } : { params : { id: string }}) {

    const [formData, setFormData] = useState({name: "", value: "", status: ""});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter()

    const id = React.use(params).id;


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/items/${id}`);
                if(!response.ok) {
                    throw new Error("Falha ao carregar o item");
                }

                const data = await response.json();
                console.log(data)
                setFormData({name: data.item.name, value: data.item.value, status: data.item.status});

            } catch (error) {
                setError("Falha ao carregar item")
            }
        }
        fetchData();
    }, []);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((prevData) => (
            {
                ...prevData,
                [e.target.name]: e.target.value,
            }
        ))
    }

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.value) {
            setError("Por favor preencha todas as informações!");
            return;
        }

        const dataToSend = {
            ...formData,
            value: parseFloat(formData.value),
            status: formData.status === "true",
        };

        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch(`/api/items/${id}`, {
                method: "PUT", 
                headers: {
                'Content-type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
        });

        if (!response.ok) {
            throw new Error("Falha ao criar um novo item");
        }
        router.push("/");

        } catch (error) {
            console.log(error);
            setError("Houve algum problema com a criação do item!");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center place-content-center bg-blue-500 bg-opacity-50">
            <h2 className="text-2xl font-bold my-8">Edite o item</h2>

            <form onSubmit={handleSubmit} className="flex gap-3 flex-col w-11/12 p-5">
                <input 
                    type="text" 
                    name="name" 
                    className="py-1 px-4 border rounded-md" 
                    placeholder="Nome" 
                    value={formData.name}
                    onChange={handleInputChange}
                />
                <input 
                    type="number" 
                    min="0.00" 
                    step="0.01" 
                    name="value" 
                    className="py-1 px-4 border rounded-md" 
                    placeholder="Preço" 
                    value={formData.value}
                    onChange={handleInputChange}
                />
                

                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Selecione o Status do Item
                </label>

                <select 
                    id="status" 
                    name="status"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={formData.status}
                    onChange={handleInputChange}
                >
                    <option value="">Selecione</option>
                    <option value="true">Ativo</option>
                    <option value="false">Inativo</option>
                </select>

                <button className="bg-black text-white mt-5 px-4 py-1 rounded-md cursor-pointer">
                    {isLoading ? "Atualizando..." : "Atualizar Item"}
                </button>

            </form>
        </div>
    )
}