import request from "supertest";
import app from "../../../src/app";
import prisma from "../../../src/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cleanDatabase } from "../../helpers/dbCleanup";

describe("BoardMember Routes", () => {
    let token: string;
    let userId: string;
    let boardId: string;

    beforeAll(async () => {
        process.env.JWT_SECRET = "verysecret";
    });

    beforeEach(async () => {
        await cleanDatabase();
        const password = await bcrypt.hash("TestPassword123!", 10);
        const user = await prisma.user.create({
            data: {
                email: "owner@example.com",
                password,
                name: "Owner User",
            },
        });
        userId = user.id;
        token = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "1h" });

        const board = await prisma.board.create({
            data: { name: "Team Board" },
        });

        await prisma.boardMember.create({
            data: { boardId: board.id, userId, role: "owner" },
        });

        boardId = board.id;
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe("POST /api/v1/boards/:boardId/members", () => {
        it("should allow owner to invite a user to board", async () => {
            const newUser = await prisma.user.create({
                data: {
                    email: "invitee@example.com",
                    password: await bcrypt.hash("Invitee123!", 10),
                    name: "Invitee",
                },
            });

            const res = await request(app)
                .post(`/api/v1/boards/${boardId}/members`)
                .set("Authorization", `Bearer ${token}`)
                .send({ userId: newUser.id, role: "member" });

            expect(res.statusCode).toBe(201);
            expect(res.body.member).toHaveProperty("id");
            expect(res.body.member.role).toBe("member");
        });
    });

    describe("PATCH /api/v1/boards/:boardId/members/:memberId", () => {
        it("should allow owner to update member role", async () => {
            const member = await prisma.boardMember.create({
                data: { boardId, userId, role: "member" },
            });

            const res = await request(app)
                .patch(`/api/v1/boards/${boardId}/members/${member.id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ role: "editor" });

            expect(res.statusCode).toBe(200);
            expect(res.body.member.role).toBe("editor");
        });
    });

    describe("DELETE /api/v1/boards/:boardId/members/:memberId", () => {
        it("should allow owner to remove a member", async () => {
            const member = await prisma.boardMember.create({
                data: { boardId, userId, role: "member" },
            });

            const res = await request(app)
                .delete(`/api/v1/boards/${boardId}/members/${member.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(204);

            const exists = await prisma.boardMember.findUnique({ where: { id: member.id } });
            expect(exists).toBeNull();
        });
    });
});
