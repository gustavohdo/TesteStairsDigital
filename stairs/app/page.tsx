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
    <div>
      
    {error && <p className="py-4 text-red-500" > {error} </p>}

      <Link href={"/create"}>
        <button className="bg-slate-200 px-4 py-2 rounded-md uppercase text-sm font-bold tracking-widest">+ Adicionar Item</button>
      </Link>
      { isLoading ? (
          <p>Carregando itens...</p>
        ) : itens?.length > 0 ?(
          itens?.map((item) => (
            <div className="my-2 rounded-md border-b leading-9" key={item.$id}>
              <div className="font-bold">
                {item.name}
              </div>
              <div>
                R$ {item.value.toFixed(2).replace('.', ',')}
              </div>
              <div>
                {item.status ? <p>Ativo</p> : <p>Inativo</p>}
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
