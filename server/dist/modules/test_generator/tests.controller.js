"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const testService = __importStar(require("./tests.service"));
const user_model_1 = require("../../database/models/user.model");
const utils_1 = require("../../common/utils");
const getTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.session.userId;
    const repo = req.params.repo;
    const data = yield testService.getTest(userId, repo);
    if ("error" in data)
        return res.json(data);
    return res.status(200).json(data);
});
exports.getTest = getTest;
const createTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(req.session.userId);
    if (!user)
        return res.status(404).send("User not found");
    const owner = req.params.owner;
    const repo = req.params.repo;
    const filePaths = req.body.filePaths;
    const data = yield testService.createTest(owner, repo, filePaths, user._id, (0, utils_1.decrypt)(user.githubAccessToken));
    return res.json(data);
});
exports.createTest = createTest;
