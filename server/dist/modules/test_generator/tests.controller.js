var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as testService from "./tests.service";
import { User } from "../../database/models/user.model";
import { decrypt } from "../../common/utils";
export const getTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.session.userId;
    const repo = req.params.repo;
    const data = yield testService.getTest(userId, repo);
    if ("error" in data)
        return res.json(data);
    return res.status(200).json(data);
});
export const createTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findById(req.session.userId);
    if (!user)
        return res.status(404).send("User not found");
    const owner = req.params.owner;
    const repo = req.params.repo;
    const filePaths = req.body.filePaths;
    const data = yield testService.createTest(owner, repo, filePaths, user._id, decrypt(user.githubAccessToken));
    return res.json(data);
});
