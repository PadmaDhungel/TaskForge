import request from "supertest";
import app from "../../../src/app";
import prisma from "../../../src/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cleanDatabase } from "../../helpers/dbCleanup";

describe("Board Routes - Validation", () => {
    let token: string;
    let userId: string;

    beforeEach(async () => {
        await cleanDatabase();
        const password = await bcrypt.hash("pass", 10);
        const user = await prisma.user.create({
            data: { email: "validate@example.com", password, name: "Validator" },
        });
        userId = user.id;
        token = jwt.sign({ userId }, process.env.JWT_SECRET || "verysecret", { expiresIn: "1h" });
    });

    it("should return 400 if name is missing", async () => {
        const res = await request(app)
            .post("/api/v1/boards")
            .set("Authorization", `Bearer ${token}`)
            .send({ description: "Missing name" });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/name/i);
    });

    it("should return 400 if PATCH has no valid fields", async () => {
        const board = await prisma.board.create({ data: { name: "Patch Test" } });
        await prisma.boardMember.create({ data: { boardId: board.id, userId, role: "owner" } });

        const res = await request(app)
            .patch(`/api/v1/boards/${board.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({});

        expect(res.statusCode).toBe(400);
    });
});
