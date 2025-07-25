import clientPromise from "@/utils/database";
import { Tag } from "@/utils/schema";

export async function DELETE(request: Request) {
    const client = await clientPromise;
    const db = client.db('scraping');
  
    try {
        // Parse the URL or request body for the tagname
        const url = new URL(request.url);
        const tagname = url.searchParams.get('tagname');
        const userid = url.searchParams.get('userid');

        if (!tagname || !userid) {
            return new Response('Missing tagname parameter.', { status: 400 });
        }

        // Delete the document with the specified tagname
        const result = await db.collection<Tag>('tags').deleteOne({ tagname,userid });
        console.log(result);
        if (result.deletedCount === 0) {
            return new Response('No document found with the specified tagname.', { status: 404 });
        }

        // Return a success response
        return new Response('Document deleted successfully.', { status: 200 });

    } catch (error) {
        console.error('Error connecting to database or performing operations:', error);
        return new Response('Error connecting to database', { status: 500 });
    }
}