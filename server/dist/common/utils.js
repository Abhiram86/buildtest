"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTest = exports.getFileContent = exports.decrypt = exports.encrypt = void 0;
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const dotenv_1 = __importDefault(require("dotenv"));
const crypto_1 = __importDefault(require("crypto"));
dotenv_1.default.config();
const groq = new groq_sdk_1.default({
    apiKey: process.env.GROQ_API_KEY,
});
function encrypt(text) {
    const iv = crypto_1.default.randomBytes(Number(process.env.IV_LENGTH));
    const cipher = crypto_1.default.createCipheriv("aes-256-gcm", Buffer.from(process.env.ENCRYPTION_KEY, "base64"), iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    const authTag = cipher.getAuthTag().toString("hex");
    return `${iv.toString("hex")}:${encrypted}:${authTag}`;
}
exports.encrypt = encrypt;
function decrypt(encryptedData) {
    const [ivHex, encrypted, authTagHex] = encryptedData.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const decipher = crypto_1.default.createDecipheriv("aes-256-gcm", Buffer.from(process.env.ENCRYPTION_KEY, "base64"), iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}
exports.decrypt = decrypt;
function getFileContent(owner, repo, path, accessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const resp = yield fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
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
        const text = yield resp.text();
        return {
            path,
            content: text,
        };
    });
}
exports.getFileContent = getFileContent;
function generateTest(query) {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}
exports.generateTest = generateTest;
