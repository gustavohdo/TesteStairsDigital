import client from "@/lib/appwrite_client";
import { Databases } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);

// Consultar Item Específico
async function fetchItem(id: string) {
    try {
        const item = await database.getDocument(process.env.NEXT_PUBLIC_APPWRITE_DB as string, "items", id);
        return item
    } catch (error) {
        console.error("Erro ao consultar item", error)
        throw new Error("Problemas ao consultar item")
    }
}

// Excluir Item Específico
async function deleteItem(id: string) {
    try {
        const reponse = await database.deleteDocument(process.env.NEXT_PUBLIC_APPWRITE_DB as string, "items", id);
        return reponse
    } catch (error) {
        console.error("Erro ao excluir item", error)
        throw new Error("Problemas ao excluir item")
    }
}

// Atualizar Item Específico
async function updateItem(id: string, data: {name: string, value: number, status: boolean}) {
    try {
        const reponse = await database.updateDocument(process.env.NEXT_PUBLIC_APPWRITE_DB as string, "items", id, data);
        return reponse
    } catch (error) {
        console.error("Erro ao excluir item", error)
        throw new Error("Problemas ao excluir item")
    }
}


export async function GET(req: Request, { params }: { params : { id : string}}) {
    try {
        const id = params.id;
        const item = await fetchItem(id);
        return NextResponse.json({item})
    } catch (error) {
        return NextResponse.json({error: "Problemas ao consultar item"}, {status: 500})
    }
}


export async function DELETE(req: Request, { params }: { params : { id : string}}) {
    try {
        const id = params.id;
        await deleteItem(id);
        return NextResponse.json({message: "Item excluído"})
    } catch (error) {
        return NextResponse.json({error: "Problemas ao excluir item"}, {status: 500})
    }
}


export async function PUT(req: Request, { params }: { params : { id : string}}) {
    try {
        const id = params.id;
        const item = await req.json();
        await updateItem(id, item);
        return NextResponse.json({message: "Item atualizado" })
    } catch (error) {
        return NextResponse.json({error: "Problemas ao atualizar item"}, {status: 500})
    }
}