import * as testService from "./tests.service.js";
import { User } from "../../database/models/user.model.js";
import { decrypt } from "../../common/utils.js";
export const getTest = async (req, res) => {
    const userId = req.session.userId;
    const repo = req.params.repo;
    const data = await testService.getTest(userId, repo);
    if ("error" in data)
        return res.json(data);
    return res.status(200).json(data);
};
export const createTest = async (req, res) => {
    const user = await User.findById(req.session.userId);
    if (!user)
        return res.status(404).send("User not found");
    const owner = req.params.owner;
    const repo = req.params.repo;
    const filePaths = req.body.filePaths;
    const data = await testService.createTest(owner, repo, filePaths, user._id, decrypt(user.githubAccessToken));
    return res.json(data);
};
