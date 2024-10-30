import { Client } from "appwrite";

const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string);

export default client;