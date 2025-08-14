import Groq from "groq-sdk";
import dotenv from "dotenv";
import crypto from "crypto";
dotenv.config();
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});
export function encrypt(text) {
    const iv = crypto.randomBytes(Number(process.env.IV_LENGTH));
    const cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(process.env.ENCRYPTION_KEY, "base64"), iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    const authTag = cipher.getAuthTag().toString("hex");
    return `${iv.toString("hex")}:${encrypted}:${authTag}`;
}
export function decrypt(encryptedData) {
    const [ivHex, encrypted, authTagHex] = encryptedData.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-gcm", Buffer.from(process.env.ENCRYPTION_KEY, "base64"), iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}
export async function getFileContent(owner, repo, path, accessToken) {
    const resp = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github.v3+json",
        },
    });
    if (!resp.ok) {
        console.log(resp.status, resp.statusText);
        throw new Error(resp.statusText);
    }
    const text = await resp.text();
    return {
        path,
        content: text,
    };
}
export async function generateTest(query) {
    return groq.chat.completions.create({
        model: "moonshotai/kimi-k2-instruct",
        messages: [
            { role: "system", content: process.env.SYSTEM_PROMPT },
            {
                role: "user",
                content: "Generate a test suite well formatted in markdown for the following code: " +
                    query,
            },
        ],
        response_format: {
            type: "json_schema",
            json_schema: {
                name: "test_suite_generator",
                schema: {
                    type: "object",
                    properties: {
                        description: {
                            type: "string",
                            description: "Clear natural-language and strong explanation of what the tests cover and why specific cases/assertions were chosen. Can be multiple paragraphs, bullet points, or a short summary.",
                        },
                        test_suite: {
                            type: "object",
                            description: "The generated test suite, containing the programming language, testing framework, and complete code snippet.",
                            properties: {
                                language: {
                                    type: "string",
                                    enum: [
                                        "python",
                                        "javascript",
                                        "typescript",
                                        "java",
                                        "go",
                                        "ruby",
                                        "php",
                                        "rust",
                                        "csharp",
                                        "kotlin",
                                    ],
                                },
                                framework: { type: "string" },
                                code: {
                                    type: "string",
                                    description: "The complete test code in the specified language/framework, as a single snippet.",
                                },
                            },
                            required: ["language", "framework", "code"],
                        },
                    },
                    required: ["description", "test_suite"],
                },
            },
        },
    });
}
