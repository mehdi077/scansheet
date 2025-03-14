"use server"

import { Mistral } from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY;
const client = new Mistral({apiKey: apiKey});

export async function processImage(imageUrl: string) {

    

    const chatResponse = await client.chat.complete({
        model: "pixtral-large-2411",
        messages: [
            {
                role: "system",
                content: [
                    {
                        type: "text",
                        text: "Extract the text elements from the image as described by the user, and return the result formatted as a pipe-separated table (using | as separator). Preserve new lines and structure the table to match the visible assumed table layout precisely. All other text that seems to not be a table must be joined and included at the end of table in their own rows, do not leave any visible text not extracted."
                    }
                ]
            },
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: "Extract all text from the image and format it as a pipe-separated table (using | as separator), preserving new lines and matching the assumed table structure exactly. Do this precisely and without deviation."
                    },
                    {
                        type: "image_url",
                        imageUrl: imageUrl
                    }
                ]
            }
        ]
    });
    
    // console.log("JSON:", chatResponse.choices[0].message.content);
    // return ocrResponse.pages[0].markdown;
    if (chatResponse.choices) {
        return chatResponse.choices[0].message.content;
    } else {
        return "No response from the model";
    }

}
