import { z } from "zod";
import { BoardRole } from "../../../db"

// Preprocess to uppercase input string before validating enum
const boardRoleEnum = z.preprocess(
    (val) => {
        if (typeof val === "string") return val.toUpperCase();
        return val;
    },
    z.enum(["OWNER", "EDITOR", "VIEWER", "MEMBER"])
).transform((val) => val as BoardRole) // cast to BoardRole;

export const inviteMemberSchema = z.object({
    userId: z.string().uuid({ message: "Invalid user ID" }),
    role: boardRoleEnum.default("MEMBER")
});
export const updateMemberRoleSchema = z.object({
    role: boardRoleEnum,
});
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>
export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>