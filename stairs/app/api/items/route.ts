import client from "@/lib/appwrite_client";
import { Databases, ID, Query } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);


// Criando Item
async function createItem(data:{name: string, value: number, status: boolean}) {
    try {
        const response = await database.createDocument(process.env.NEXT_PUBLIC_APPWRITE_DB as string, "items", ID.unique(), data)
        return response
    } catch (error) {
        console.error("Erro ao inserir novo item", error)
        throw new Error("Problemas ao criar um novo item")
    }
}

// Consultar Itens
async function fetchItens() {
    try {
        const response = await database.listDocuments(process.env.NEXT_PUBLIC_APPWRITE_DB as string, "items", [Query.orderDesc("$createdAt")])
        return response.documents
    } catch (error) {
        console.error("Erro ao consultar itens", error)
        throw new Error("Problemas ao consultar itens")
    }
}

// Editando Itens
export async function POST(req: Request) {
    try {
        const {name, value, status} = await req.json();
        const data = {name, value, status};
        const response = await createItem(data);
        return NextResponse.json({message: "Item criado!"})
        
    } catch (error) {
        return NextResponse.json({error: "Erro ao editar item"}, {status: 500});
    }
}


export async function GET() {
    try {
        const items = await fetchItens();
        return NextResponse.json(items)
    } catch (error) {
        return NextResponse.json({error: "Erro ao consultar itens"}, {status: 500})
    }
}