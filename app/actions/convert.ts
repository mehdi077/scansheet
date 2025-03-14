"use server"

import { Mistral } from '@mistralai/mistralai';
import sharp from 'sharp';

const apiKey = process.env.MISTRAL_API_KEY;
const client = new Mistral({apiKey: apiKey});

// Number of vertical parts to split the image into
const VERTICAL_SPLITS = 1;

// Delay function for rate limiting (Mistral allows 1 request per second)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function splitImage(imageUrl: string, numParts: number): Promise<string[]> {
    console.log(`🔄 Starting image split process into ${numParts} parts...`);
    
    // Fetch the image
    console.log('📥 Fetching image from URL...');
    const response = await fetch(imageUrl);
    const imageBuffer = await response.arrayBuffer();
    console.log(`✅ Image fetched successfully (${(imageBuffer.byteLength / 1024).toFixed(2)} KB)`);

    // Get image metadata
    console.log('📏 Getting image dimensions...');
    const metadata = await sharp(imageBuffer).metadata();
    if (!metadata.height || !metadata.width) {
        throw new Error("Could not get image dimensions");
    }
    console.log(`📐 Image dimensions: ${metadata.width}x${metadata.height} pixels`);

    const partHeight = Math.floor(metadata.height / numParts);
    const parts: string[] = [];

    // Split the image into parts
    console.log('✂️ Starting to split image...');
    for (let i = 0; i < numParts; i++) {
        const top = i * partHeight;
        const height = i === numParts - 1 ? metadata.height - top : partHeight;
        
        console.log(`   🔹 Processing part ${i + 1}/${numParts} (height: ${height}px, starting at: ${top}px)`);
        
        const partBuffer = await sharp(imageBuffer)
            .extract({ left: 0, top, width: metadata.width, height })
            .toBuffer();

        // Convert to base64
        const base64 = `data:image/jpeg;base64,${partBuffer.toString('base64')}`;
        parts.push(base64);
        console.log(`   ✅ Part ${i + 1} processed successfully`);
    }

    console.log('🎉 Image splitting completed successfully');
    return parts;
}

async function processImagePart(partUrl: string, index: number, total: number): Promise<string> {
    console.log(`   🔸 Processing part ${index + 1}/${total}...`);
    console.time(`   ⏱️ Part ${index + 1} processing time`);
    
    // Add delay before API request (Mistral allows 1 request per second)
    console.log(`   ⏳ Waiting 1.5 seconds before processing part ${index + 1} (rate limit compliance)...`);
    await delay(1500); // 1.5 seconds to be safe
    
    try {
    const chatResponse = await client.chat.complete({
        model: "pixtral-12b-2409",
        messages: [
            {
                role: "system",
                content: [
                    {
                        type: "text",
                        text: "Extract the text elements from the image as described by the user, and return the result formatted as a comma-separated table. Preserve new lines and structure the table to match the visible assumed table layout precisely, |  all other text that seems to not be a table must be joined and included at the end of table in thier own rows, do not leave any visiable text not extracted."
                    }
                ]
            },
            {
                role: "user",
                content: [
                    {
                        type: "text",
                            text: "Extract all text from the image and format it as a comma-separated table, preserving new lines and matching the assumed table structure exactly. Do this precisely and without deviation."
                    },
                    {
                        type: "image_url",
                            imageUrl: partUrl
                    }
                ]
            }
        ]
    });
    
        const result = typeof chatResponse.choices?.[0]?.message?.content === 'string' 
            ? chatResponse.choices[0].message.content 
            : "";
        console.timeEnd(`   ⏱️ Part ${index + 1} processing time`);
        console.log(`   ✅ Part ${index + 1} completed (${result.length} characters extracted)`);
        return result;
    } catch (error) {
        console.error(`   ❌ Error processing part ${index + 1}:`, error);
        throw error;
    }
}

export async function processImage(imageUrl: string) {
    console.log('\n📝 Starting image processing...');
    console.time('⏱️ Total processing time');
    
    try {
        // Split the image into parts
        console.log(`\n📑 Phase 1: Splitting image into ${VERTICAL_SPLITS} parts`);
        const imageParts = await splitImage(imageUrl, VERTICAL_SPLITS);
        console.log('✅ Image splitting completed');
        
        // Process each part sequentially to respect rate limits
        console.log('\n🔍 Phase 2: Processing individual parts with Mistral AI (sequential processing)');
        const results: string[] = [];
        
        for (let i = 0; i < imageParts.length; i++) {
            try {
                const result = await processImagePart(imageParts[i], i, imageParts.length);
                results.push(result);
            } catch {
                console.error(`\n❌ Failed to process part ${i + 1}. Retrying in 5 seconds...`);
                await delay(5000); // Wait 5 seconds before retry
                try {
                    const result = await processImagePart(imageParts[i], i, imageParts.length);
                    results.push(result);
                } catch {
                    console.error(`\n❌ Retry failed for part ${i + 1}. Skipping this part.`);
                }
            }
        }

        // Join all results
        console.log('\n📋 Phase 3: Combining results');
        const validResults = results.filter(result => result.length > 0);
        console.log(`   📊 Stats: ${validResults.length}/${results.length} parts contained text`);
        
        const combinedResult = validResults.join('\n');
        console.log(`   📝 Final text length: ${combinedResult.length} characters`);
        
        console.timeEnd('⏱️ Total processing time');
        console.log('🎉 Processing completed successfully\n');
        
        return combinedResult || "No text was extracted from the image";

    } catch (error) {
        console.error('\n❌ Error during processing:', error);
        console.timeEnd('⏱️ Total processing time');
        return "Error processing image: " + (error as Error).message;
    }
}
