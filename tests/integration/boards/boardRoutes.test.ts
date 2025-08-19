import request from "supertest";
import app from "../../../src/app";
import prisma from "../../../src/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cleanDatabase } from "../../helpers/dbCleanup";

describe("Board Routes", () => {
    let token: string;
    let userId: string;

    beforeAll(async () => {
        process.env.JWT_SECRET = "verysecret";
    });

    beforeEach(async () => {
        await cleanDatabase();
        const password = await bcrypt.hash("TestPassword123!", 10);
        const user = await prisma.user.create({
            data: {
                email: "boarduser@example.com",
                password,
                name: "Board Tester",
            },
        });
        userId = user.id;
        token = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "1h" });
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe("POST /api/v1/boards", () => {
        it("should create a new board", async () => {
            const res = await request(app)
                .post("/api/v1/boards")
                .set("Authorization", `Bearer ${token}`)
                .send({ name: "Test Board", description: "A sample board" });


            expect(res.statusCode).toBe(201);
            expect(res.body.board).toHaveProperty("id");
            expect(res.body.board.name).toBe("Test Board");
        });
    });

    describe("GET /api/v1/boards", () => {
        it("should list boards for the user", async () => {
            const board = await prisma.board.create({ data: { name: "User's Board" } });
            await prisma.boardMember.create({ data: { boardId: board.id, userId, role: "owner" } });

            const res = await request(app)
                .get("/api/v1/boards")
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.boards)).toBe(true);
            expect(res.body.boards.length).toBeGreaterThan(0);
        });
    });

    describe("GET /api/v1/boards/:id", () => {
        it("should return board details", async () => {
            const board = await prisma.board.create({ data: { name: "Board Details", description: "Detail test" } });
            await prisma.boardMember.create({ data: { boardId: board.id, userId, role: "owner" } });

            const res = await request(app)
                .get(`/api/v1/boards/${board.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.board.name).toBe("Board Details");
        });

        it("should return 404 if board not found", async () => {
            const res = await request(app)
                .get("/api/v1/boards/nonexistent-id")
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(404);
            expect(res.body.error).toMatch(/not found/i);
        });
    });

    describe("PATCH /api/v1/boards/:id", () => {
        it("should update board details", async () => {
            const board = await prisma.board.create({ data: { name: "Old Name" } });
            await prisma.boardMember.create({ data: { boardId: board.id, userId, role: "owner" } });

            const res = await request(app)
                .patch(`/api/v1/boards/${board.id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ name: "Updated Name" });

            expect(res.statusCode).toBe(200);
            expect(res.body.board.name).toBe("Updated Name");
        });
    });

    describe("DELETE /api/v1/boards/:id", () => {
        it("should delete board", async () => {
            const board = await prisma.board.create({ data: { name: "Delete Me" } });
            await prisma.boardMember.create({ data: { boardId: board.id, userId, role: "owner" } });

            const res = await request(app)
                .delete(`/api/v1/boards/${board.id}`)
                .set("Authorization", `Bearer ${token}`);
            expect(res.statusCode).toBe(204);
        });
    });
});
