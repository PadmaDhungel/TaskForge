import request from "supertest";
import app from "../../../src/app";
import prisma from "../../../src/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cleanDatabase } from "../../helpers/dbCleanup";
import { BoardRole } from "@prisma/client";

describe("BoardMember Routes - Negative Cases", () => {
    let token: string;
    let userId: string;
    let boardId: string;

    beforeAll(async () => {
        process.env.JWT_SECRET = "verysecret";
    });

    beforeEach(async () => {
        await cleanDatabase();

        const password = await bcrypt.hash("Password123!", 10);
        const user = await prisma.user.create({
            data: { email: "owner@example.com", password, name: "Owner User" },
        });
        userId = user.id;

        const board = await prisma.board.create({
            data: {
                name: "Owner Board",
                members: { create: { userId, role: BoardRole.OWNER } },
            },
        });
        boardId = board.id;

        token = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "1h" });
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it("should not allow inviting the same user twice", async () => {
        const res = await request(app)
            .post(`/api/v1/boards/${boardId}/members`)
            .set("Authorization", `Bearer ${token}`)
            .send({ userId, role: "MEMBER" });

        expect(res.statusCode).toBe(409);
        expect(res.body.error).toMatch(/already a member/i);
    });

    it("should not allow owner to demote themselves", async () => {
        const ownerMember = await prisma.boardMember.findFirst({
            where: { boardId, userId },
        });

        const res = await request(app)
            .patch(`/api/v1/boards/${boardId}/members/${ownerMember!.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ role: "MEMBER" });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/cannot change your own role/i);
    });

    it("should return 404 if removing non-existent member", async () => {
        const fakeId = "00000000-0000-0000-0000-000000000000";

        const res = await request(app)
            .delete(`/api/v1/boards/${boardId}/members/${fakeId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.error).toMatch(/member not found/i);
    });
});
