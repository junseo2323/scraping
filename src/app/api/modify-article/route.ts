import clientPromise from "@/utils/database";
import { ObjectId } from "mongodb";

export async function PUT(request: Request) {
    const client = await clientPromise;
    const db = client.db('scraping');
  

    try {
        // Parse the request body
        const requestBody = await request.json();
        const { _id, title, url, image, subtitle, flatform, creator, tag, like, comment } = requestBody;

        // Ensure that an ID is provided
        if (!_id) {
            return new Response('Missing article ID', { status: 400 });
        }

        // Prepare the update data
        const updateData: any = {};
        if (title) updateData.title = title;
        if (url) updateData.url = url;
        if (image) updateData.image = image;
        if (subtitle) updateData.subtitle = subtitle;
        if (flatform) updateData.flatform = flatform;
        if (creator) updateData.creator = creator;
        if (tag) updateData.tag = tag;
        if (like) updateData.like = like;
        if (comment) updateData.comment = comment;


        // Perform the update operation
        const result = await db.collection('article').updateOne(
            { _id: new ObjectId(_id) }, // Ensure this matches your database's ID type
            { $set: updateData }
        );

        // Check if the article was found and updated
        if (result.matchedCount === 0) {
            return new Response('Article not found', { status: 404 });
        }

        // Return a success response
        return new Response('Article updated successfully', {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });

    } catch (error) {
        console.error('Error connecting to database or performing operations:', error);
        return new Response('Error connecting to database', { status: 500 });
    }
}
