import request from "supertest";
import app from "../../../src/app";
import prisma, { BoardRole } from "../../../src/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cleanDatabase } from "../../helpers/dbCleanup";

describe("Board Routes - Security", () => {
    let token: string;
    let userId: string;

    beforeEach(async () => {
        await cleanDatabase();
        const password = await bcrypt.hash("pass", 10);
        const user = await prisma.user.create({
            data: { email: "secure@example.com", password, name: "Sec Tester" },
        });
        userId = user.id;
        token = jwt.sign({ userId }, process.env.JWT_SECRET || "verysecret", { expiresIn: "1h" });
    });

    it("should return 401 if no token is provided", async () => {
        const res = await request(app).get("/api/v1/boards");
        expect(res.statusCode).toBe(401);
    });

    it("should return 401 for invalid token", async () => {
        const res = await request(app)
            .get("/api/v1/boards")
            .set("Authorization", `Bearer invalid.token.here`);
        expect(res.statusCode).toBe(401);
    });

    it("should return 403 if user is not a board member", async () => {
        const stranger = await prisma.user.create({
            data: { email: "stranger@example.com", password: await bcrypt.hash("pass", 10), name: "Stranger" },
        });
        const strangerToken = jwt.sign({ userId: stranger.id }, process.env.JWT_SECRET!, { expiresIn: "1h" });

        const board = await prisma.board.create({ data: { name: "Private Board" } });

        const res = await request(app)
            .get(`/api/v1/boards/${board.id}`)
            .set("Authorization", `Bearer ${strangerToken}`);

        expect(res.statusCode).toBe(403);
    });

    it("should return 403 if non-owner tries to delete board", async () => {
        const member = await prisma.user.create({
            data: { email: "member@example.com", password: await bcrypt.hash("pass", 10), name: "Member" },
        });
        const memberToken = jwt.sign({ userId: member.id }, process.env.JWT_SECRET!, { expiresIn: "1h" });

        const board = await prisma.board.create({ data: { name: "Owned Board" } });
        await prisma.boardMember.create({ data: { boardId: board.id, userId: member.id, role: BoardRole.MEMBER } });

        const res = await request(app)
            .delete(`/api/v1/boards/${board.id}`)
            .set("Authorization", `Bearer ${memberToken}`);

        expect(res.statusCode).toBe(403);
    });

    it("should return 404 when deleting an already deleted board", async () => {
        const board = await prisma.board.create({ data: { name: "Temp Board" } });
        await prisma.boardMember.create({ data: { boardId: board.id, userId, role: BoardRole.OWNER } });

        await request(app).delete(`/api/v1/boards/${board.id}`).set("Authorization", `Bearer ${token}`);
        const res = await request(app).delete(`/api/v1/boards/${board.id}`).set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
    });
});
