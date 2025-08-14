import mongoose from "mongoose";
import { generateTest, getFileContent } from "../../common/utils";
import { Test } from "../../database/models/tests.model";

export const getTest = async (
  userId: mongoose.Types.ObjectId,
  repo: string
) => {
  const test = await Test.findOne({ user: userId, repo });
  if (!test) return { error: "No Test Generated" };
  return {
    repo: test.repo,
    filePaths: test.filePaths,
    test_response: JSON.parse(test.test_response),
  };
};

export const createTest = async (
  owner: string,
  repo: string,
  filePaths: string[],
  userId: mongoose.Types.ObjectId,
  accessToken: string
) => {
  const test = new Test({
    name: "test",
    repo,
    user: userId,
    filePaths,
    test_response: "",
  });
  const contents = await Promise.all(
    filePaths.map(
      async (filePath) =>
        await getFileContent(owner, repo, filePath, accessToken)
    )
  );

  const combinedContent = contents
    .reduce(
      (acc, file) => acc + `\n\n// File: ${file.path}\n\n${file.content}`,
      ""
    )
    .trim();
  const response = await generateTest(combinedContent);
  if (response.choices.length === 0 || !response.choices[0].message.content) {
    return { error: "Error generating test" };
  }
  test.test_response = response.choices[0].message.content;
  try {
    const testJson = JSON.parse(response.choices[0].message.content);
    await test.save();
    return {
      repo: test.repo,
      filePaths: test.filePaths,
      test_response: testJson,
    };
  } catch (error) {
    console.error(error);
    return { error: "Error generating test" };
  }
};
