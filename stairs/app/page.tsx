"use client"

import Link from "next/link";
import { useEffect, useState } from "react";

interface IItens {
  $id: string;
  name: string;
  value: number;
  status: boolean;
}

export default function Home() {

  const [itens, setItens] = useState<IItens[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItens = async() => {
      setIsLoading(true);
      try {
        const response = await fetch('api/items');
        if(!response.ok) {
          throw new Error("Problemas ao carregar os itens")
        }

        const data = await response.json();
        setItens(data);
      } catch (error) {
          console.log("Erro:", error)
          setError("Problemas ao carregar os itens, por favor tente novamente")
      } finally {
        setIsLoading(false);
      }
    }

    fetchItens();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`api/items/${id}`, {method: "DELETE"});
      setItens((prevItens) => prevItens?.filter(
        (i) => i.$id !== id
      ))
    } catch (error) {
      setError("Problemas ao excluir o item, por favor tente novamente")
    }
  }

  return (
    <div className="flex flex-col items-center place-content-center bg-blue-500 bg-opacity-50">
      
    {error && <p className="py-4 text-red-500" > {error} </p>}

      <Link href={"/create"}>
        <button className="bg-blue-200 hover:bg-blue-700 px-4 py-2 rounded uppercase text-sm font-bold tracking-widest m-4">
          + Adicionar Item
        </button>
      </Link>
      { isLoading ? (
          <p>Carregando itens...</p>
        ) : itens?.length > 0 ?(
          itens?.map((item) => (
            <div className="my-2 p-4 rounded-md border-b leading-5 bg-white bg-opacity-30 w-11/12" key={item.$id}>
              <div className="font-bold text-xl">
                {item.name}
              </div>
              <div>
                R$ {item.value.toFixed(2).replace('.', ',')}
              </div>
              <div>
                {item.status ? <p className="font-bold text-green-800">Ativo</p> : <p className="text-black-800">Inativo</p>}
              </div>
              <div className="flex gap-4 mt-4 justify-end">
                <Link href={`/edit/${item.$id}`}>
                  <button className="bg-slate-200 px-4 py-2 rounded-md uppercase text-sm font-bold tracking-widest">Editar</button>
                </Link>
                <button onClick={() => handleDelete(item.$id)} className="bg-red-500 text-white px-4 py-2 rounded-md uppercase text-sm font-bold tracking-widest">Excluir</button>
              </div>
            </div>
          ))
      ): ( <p>Ainda não há itens adicionados!</p>) }
    
    </div>
  );
}
