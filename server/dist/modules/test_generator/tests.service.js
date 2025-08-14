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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTest = exports.getTest = void 0;
const utils_1 = require("../../common/utils");
const tests_model_1 = require("../../database/models/tests.model");
const getTest = (userId, repo) => __awaiter(void 0, void 0, void 0, function* () {
    const test = yield tests_model_1.Test.findOne({ user: userId, repo });
    if (!test)
        return { error: "No Test Generated" };
    return {
        repo: test.repo,
        filePaths: test.filePaths,
        test_response: JSON.parse(test.test_response),
    };
});
exports.getTest = getTest;
const createTest = (owner, repo, filePaths, userId, accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTest = yield tests_model_1.Test.findOne({ user: userId, repo });
    const contents = yield Promise.all(filePaths.map((filePath) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, utils_1.getFileContent)(owner, repo, filePath, accessToken); })));
    const combinedContent = contents
        .reduce((acc, file) => acc + `\n\n// File: ${file.path}\n\n${file.content}`, "")
        .trim();
    const response = yield (0, utils_1.generateTest)(combinedContent);
    if (response.choices.length === 0 || !response.choices[0].message.content) {
        return { error: "Error generating test" };
    }
    if (existingTest) {
        try {
            const testJson = JSON.parse(response.choices[0].message.content);
            existingTest.test_response = testJson;
            yield existingTest.save();
            return {
                repo: existingTest.repo,
                filePaths: existingTest.filePaths,
                test_response: testJson,
            };
        }
        catch (error) {
            console.error(error);
            return { error: "Error generating test" };
        }
    }
    const test = new tests_model_1.Test({
        name: "test",
        repo,
        user: userId,
        filePaths,
        test_response: "",
    });
    test.test_response = response.choices[0].message.content;
    try {
        const testJson = JSON.parse(response.choices[0].message.content);
        yield test.save();
        return {
            repo: test.repo,
            filePaths: test.filePaths,
            test_response: testJson,
        };
    }
    catch (error) {
        console.error(error);
        return { error: "Error generating test" };
    }
});
exports.createTest = createTest;
