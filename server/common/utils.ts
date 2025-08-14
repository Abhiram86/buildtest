import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function getFileContent(
  owner: string,
  repo: string,
  path: string,
  accessToken: string
) {
  const resp = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );
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

export async function generateTest(query: string) {
  return groq.chat.completions.create({
    model: "moonshotai/kimi-k2-instruct",
    messages: [
      { role: "system", content: process.env.SYSTEM_PROMPT! },
      {
        role: "user",
        content:
          "Generate a test suite well formatted in markdown for the following code: " +
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
              description:
                "Clear natural-language and strong explanation of what the tests cover and why specific cases/assertions were chosen. Can be multiple paragraphs, bullet points, or a short summary.",
            },
            test_suite: {
              type: "object",
              description:
                "The generated test suite, containing the programming language, testing framework, and complete code snippet.",
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
                  description:
                    "The complete test code in the specified language/framework, as a single snippet.",
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
