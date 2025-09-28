import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { z } from "zod";
import pdf from "pdf-parse";

// Initialize OpenAI
const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.3,
  apiKey: process.env.OPENAI_API_KEY,
});

// Define structured output schema
const SummarySchema = z.object({
  summary: z.string().describe("A concise summary of the document in exactly 10 sentences or less"),
  keyPoints: z.array(z.string()).describe("3-5 key points from the document"),
  documentType: z.string().describe("Type of document (web page, PDF, etc.)"),
  wordCount: z.number().describe("Approximate word count of the original content"),
});

// Function to extract text from PDF
async function extractPdfText(buffer) {
  try {
    console.log("Extracting text from PDF, buffer size:", buffer.length);
    
    const data = await pdf(buffer);
    console.log("PDF parsed successfully, text length:", data.text.length);
    console.log("PDF pages:", data.numpages);
    console.log("PDF info:", data.info);
    
    if (!data.text || data.text.trim().length === 0) {
      throw new Error("No text content found in the PDF");
    }
    
    return data.text;
  } catch (error) {
    console.error("Error extracting PDF text:", error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}

// Function to load and process web page
async function loadWebPage(url) {
  try {
    console.log("Loading webpage:", url);
    const loader = new CheerioWebBaseLoader(url);
    const docs = await loader.load();
    
    console.log("Loaded docs:", docs.length);
    
    if (docs.length === 0) {
      throw new Error("No content found on the webpage");
    }
    
    const content = docs[0].pageContent;
    console.log("Content length:", content.length);
    
    if (!content || content.trim().length === 0) {
      throw new Error("Webpage content is empty");
    }
    
    return content;
  } catch (error) {
    console.error("Error loading webpage:", error);
    throw new Error(`Failed to load webpage content: ${error.message}`);
  }
}

// Function to split text into chunks
async function splitText(text) {
  try {
    // For smaller documents, don't chunk at all
    if (text.length < 8000) {
      console.log("Document small enough, no chunking needed");
      return [text];
    }
    
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 6000, // Increased chunk size
      chunkOverlap: 100, // Reduced overlap
    });
    
    const chunks = await splitter.splitText(text);
    console.log("Splitter created, chunks:", chunks.length);
    return chunks;
  } catch (error) {
    console.error("Error in splitText:", error);
    // Fallback: simple text splitting
    const words = text.split(/\s+/);
    const chunks = [];
    const chunkSize = 1500; // Increased chunk size
    
    for (let i = 0; i < words.length; i += chunkSize) {
      chunks.push(words.slice(i, i + chunkSize).join(' '));
    }
    
    console.log("Using fallback text splitting, chunks:", chunks.length);
    return chunks;
  }
}

// Function to summarize content
async function summarizeContent(text, documentType) {
  try {
    console.log("Starting summarization for:", documentType);
    console.log("Text length:", text.length);
    
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured. Please add OPENAI_API_KEY to your environment variables.");
    }
    
    const chunks = await splitText(text);
    console.log("Text split into chunks:", chunks ? chunks.length : "undefined");
    console.log("First chunk preview:", chunks && chunks[0] ? chunks[0].substring(0, 200) + "..." : "No chunks available");
    
    let summaryText = "";
    let keyPoints = [];
    
    // Validate chunks
    if (!chunks || chunks.length === 0) {
      throw new Error("Failed to split text into chunks");
    }
    
          // If content is short enough, summarize directly
          if (chunks.length === 1) {
            console.log("Summarizing single chunk");
            console.log("Content preview:", text.substring(0, 200) + "...");
            
            const prompt = `Summarize this ${documentType} in exactly 10 sentences. Focus on main points and key information. Also provide 3-5 key bullet points.

${text}

Format:
SUMMARY:
[10-sentence summary]

KEY POINTS:
• [Key point 1]
• [Key point 2]
• [Key point 3]
• [Key point 4]
• [Key point 5]`;

            console.log("Calling OpenAI API...");
            const result = await llm.invoke([{ role: "user", content: prompt }]);
            const response = result.content;
            console.log("OpenAI response received");
            
            // Parse the response
            const summaryMatch = response.match(/SUMMARY:\s*([\s\S]*?)(?=KEY POINTS:|$)/);
            const keyPointsMatch = response.match(/KEY POINTS:\s*([\s\S]*?)$/);
            
            summaryText = summaryMatch ? summaryMatch[1].trim() : response;
            if (keyPointsMatch) {
              keyPoints = keyPointsMatch[1]
                .split('\n')
                .map(point => point.replace(/^[•\-\*]\s*/, '').trim())
                .filter(point => point.length > 0);
            }
            
            // Fallback: if no structured response, use the whole response as summary
            if (!summaryText || summaryText.length < 50) {
              console.log("Using fallback summary");
              summaryText = response;
              keyPoints = ["Key points could not be extracted from the response"];
            }
            
            console.log("Parsed summary:", summaryText);
            console.log("Parsed key points:", keyPoints);
          } else {
      console.log("Summarizing multiple chunks");
      // Process chunks in parallel for speed
      const chunkPromises = chunks.map(async (chunk, i) => {
        console.log(`Processing chunk ${i + 1}/${chunks.length}`);
        const chunkResult = await llm.invoke([
          {
            role: "user",
            content: `Summarize this section in 2-3 sentences:\n\n${chunk}`,
          },
        ]);
        return chunkResult.content;
      });
      
      const chunkSummaries = await Promise.all(chunkPromises);
      
      const combinedSummary = chunkSummaries.join("\n\n");
      
      const prompt = `Summarize these sections from a ${documentType} in exactly 10 sentences. Focus on main points and key information. Also provide 3-5 key bullet points.

${combinedSummary}

Format:
SUMMARY:
[10-sentence summary]

KEY POINTS:
• [Key point 1]
• [Key point 2]
• [Key point 3]
• [Key point 4]
• [Key point 5]`;

      console.log("Calling OpenAI API for final summary...");
      const result = await llm.invoke([{ role: "user", content: prompt }]);
      const response = result.content;
      console.log("OpenAI final response received");
      console.log("Raw OpenAI final response:", response);
      
      // Parse the response
      const summaryMatch = response.match(/SUMMARY:\s*([\s\S]*?)(?=KEY POINTS:|$)/);
      const keyPointsMatch = response.match(/KEY POINTS:\s*([\s\S]*?)$/);
      
      console.log("Final summary match:", summaryMatch);
      console.log("Final key points match:", keyPointsMatch);
      
      summaryText = summaryMatch ? summaryMatch[1].trim() : response;
      if (keyPointsMatch) {
        keyPoints = keyPointsMatch[1]
          .split('\n')
          .map(point => point.replace(/^[•\-\*]\s*/, '').trim())
          .filter(point => point.length > 0);
      }
      
      console.log("Final parsed summary:", summaryText);
      console.log("Final parsed key points:", keyPoints);
    }
    
    console.log("Summarization completed successfully");
    return {
      summary: summaryText,
      keyPoints: keyPoints,
      documentType: documentType,
      wordCount: text.split(/\s+/).length,
    };
  } catch (error) {
    console.error("Error in summarizeContent:", error);
    throw new Error(`Failed to generate summary: ${error.message}`);
  }
}

export async function POST(request) {
  try {
    console.log("API request received");
    const contentType = request.headers.get("content-type");
    let type, url, file;
    
    if (contentType?.includes("multipart/form-data")) {
      // Handle form data (PDF upload)
      console.log("Processing form data");
      const formData = await request.formData();
      type = formData.get("type");
      file = formData.get("file");
    } else {
      // Handle JSON (URL)
      console.log("Processing JSON data");
      const body = await request.json();
      type = body.type;
      url = body.content;
    }
    
    console.log("Request type:", type);
    console.log("URL:", url);
    
    let text = "";
    let documentType = "";
    
    if (type === "url") {
      if (!url) {
        return NextResponse.json({ error: "URL is required" }, { status: 400 });
      }
      
      console.log("Loading web page...");
      text = await loadWebPage(url);
      documentType = "web page";
    } else if (type === "pdf") {
      if (!file) {
        return NextResponse.json({ error: "PDF file is required" }, { status: 400 });
      }
      
      console.log("Processing PDF...");
      const buffer = Buffer.from(await file.arrayBuffer());
      text = await extractPdfText(buffer);
      documentType = "PDF document";
    } else {
      return NextResponse.json({ error: "Invalid type. Use 'url' or 'pdf'" }, { status: 400 });
    }
    
    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "No content found to summarize" }, { status: 400 });
    }
    
    console.log("Content loaded, starting summarization...");
    // Generate summary
    const result = await summarizeContent(text, documentType);
    
    console.log("Summarization successful, returning result");
    const response = {
      summary: result.summary || "No summary generated",
      keyPoints: result.keyPoints || [],
      documentType: result.documentType || "unknown",
      wordCount: result.wordCount || 0,
      originalLength: text.length,
    };
    
    console.log("Final response:", response);
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error("Summarization error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to summarize document" },
      { status: 500 }
    );
  }
}
