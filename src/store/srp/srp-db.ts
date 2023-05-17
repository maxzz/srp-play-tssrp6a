import { proxy } from "valtio";

export type User = {
    salt: bigint;
    verifier: bigint;
};

export const usersDB = proxy<User[]>([]);
