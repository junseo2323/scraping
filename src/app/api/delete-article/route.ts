import { Db } from "@/utils/database";
import { ObjectId } from "mongodb";

interface RequestBody {
    _id?: string;
}

export async function DELETE(request: Request) {
    const db = await Db.connect();

    try {
        // Parse the URL or request body for the tagname
        const requestBody: RequestBody = await request.json();
        const { _id } = requestBody;

        if (!_id) {
            return new Response('Missing tagname parameter.', { status: 400 });
        }

        let objectId;
        try {
            objectId = new ObjectId(_id);
        } catch (error) {
            return new Response('Invalid _id parameter.', { status: 400 });
        }


        // Delete the document with the specified tagname
        const result = await db.collection('article').deleteOne({ _id:objectId });

        if (result.deletedCount === 0) {
            return new Response('No document found with the specified articleurl.', { status: 404 });
        }

        // Return a success response
        return new Response('Document deleted successfully.', { status: 200 });

    } catch (error) {
        console.error('Error connecting to database or performing operations:', error);
        return new Response('Error connecting to database', { status: 500 });
    }
}