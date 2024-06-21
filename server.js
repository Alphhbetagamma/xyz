"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const PORT = 3000;
app.use(body_parser_1.default.json());
let submissions = [];
app.get('/ping', (req, res) => {
    res.json({ message: 'pong' });
});
app.post('/submit', (req, res) => {
    const { name, email, phone, github_link, stopwatch_time } = req.body;
    submissions.push({ name, email, phone, github_link, stopwatch_time });
    fs_1.default.writeFileSync('db.json', JSON.stringify(submissions, null, 2));
    res.json({ message: 'Submission received' });
});
app.get('/read', (req, res) => {
    const index = Number(req.query.index);
    if (index >= 0 && index < submissions.length) {
        res.json(submissions[index]);
    }
    else {
        res.status(404).json({ message: 'Submission not found' });
    }
});
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
