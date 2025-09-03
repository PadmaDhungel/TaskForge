import request from "supertest";
import app from "../../../src/app";
import prisma, { BoardRole } from "../../../src/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cleanDatabase } from "../../helpers/dbCleanup";

describe("BoardMember Routes", () => {
    let token: string;
    let userId: string;

    beforeAll(async () => {
        process.env.JWT_SECRET = "verysecret";
    });

    beforeEach(async () => {
        await cleanDatabase();
        // Create the common owner user once per test
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

    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe("POST /api/v1/boards/:boardId/members", () => {
        it("should allow owner to invite a user to board", async () => {
            // create board with owner
            const board = await prisma.board.create({
                data: {
                    name: "Team Board",
                    members: {
                        create: {
                            userId,
                            role: BoardRole.OWNER,
                        },
                    },
                },
            });

            // create another user to invite
            const invitedUser = await prisma.user.create({
                data: {
                    email: "invitee@example.com",
                    password: await bcrypt.hash("Password123!", 10),
                    name: "Invitee",
                },
            });

            const res = await request(app)
                .post(`/api/v1/boards/${board.id}/members`)
                .set("Authorization", `Bearer ${token}`)
                .send({ userId: invitedUser.id, role: BoardRole.MEMBER });

            expect(res.statusCode).toBe(201);
            expect(res.body.member.userId).toBe(invitedUser.id);
        });
    });

    describe("PATCH /api/v1/boards/:boardId/members/:memberId", () => {
        it("should allow owner to update member role", async () => {
            // create board with owner
            const board = await prisma.board.create({
                data: {
                    name: "Patch Test Board",
                    members: {
                        create: {
                            userId,
                            role: BoardRole.OWNER,
                        },
                    },
                },
            });
            // Create a member to update
            const memberUser = await prisma.user.create({
                data: {
                    email: "member@example.com",
                    password: await bcrypt.hash("Password123!", 10),
                    name: "Member",
                },
            });
            // create a member to update
            const member = await prisma.boardMember.create({
                data: {
                    boardId: board.id,
                    userId: memberUser.id,
                    role: BoardRole.MEMBER,
                },
            });

            const res = await request(app)
                .patch(`/api/v1/boards/${board.id}/members/${member.id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ role: BoardRole.EDITOR });

            expect(res.statusCode).toBe(200);
            expect(res.body.member.role).toBe(BoardRole.EDITOR);
        });
    });
    describe("DELETE /api/v1/boards/:boardId/members/:memberId", () => {
        it("should allow owner to remove a member", async () => {
            // create board with owner
            const board = await prisma.board.create({
                data: {
                    name: "Delete Member Board",
                    members: {
                        create: {
                            userId,
                            role: BoardRole.OWNER,
                        },
                    },
                },
            });
            // Create a member to Delete
            const memberUser = await prisma.user.create({
                data: {
                    email: "member@example.com",
                    password: await bcrypt.hash("Password123!", 10),
                    name: "Member",
                },
            });
            const member = await prisma.boardMember.create({
                data: {
                    boardId: board.id,
                    userId: memberUser.id,
                    role: BoardRole.MEMBER,
                },
            });

            const res = await request(app)
                .delete(`/api/v1/boards/${board.id}/members/${member.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(204);

            const exists = await prisma.boardMember.findUnique({ where: { id: member.id } });
            expect(exists).toBeNull();
        });
    });
});
