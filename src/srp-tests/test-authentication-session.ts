import { SRPRoutines, createVerifierAndSalt, SRPClientSession, SRPServerSession, SRPParameters } from "tssrp6a";
import { generateRandomString, stringToArrayBuffer } from "tssrp6a/dist/utils";

const testParameters = new SRPParameters();

class SRP6aRoutines extends SRPRoutines {
    public computeIdentityHash(I: string, P: string): Promise<ArrayBuffer> {
        return this.hash(stringToArrayBuffer(`${I}:${P}`));
    }
}

const srp6aRoutines = new SRP6aRoutines(testParameters);

export async function testClientServerTogrther() {
    const testUsername = generateRandomString(10);
    const testPassword = generateRandomString(15);

    console.log(`1: user:${testUsername}, password:${testPassword}`);

    // Sign up
    // salt and verifier are generated by client during signup
    // verifier is read from server storage for server.step1
    const { s: salt, v: verifier } = await createVerifierAndSalt(srp6aRoutines, testUsername, testPassword);

    // Sign in
    const srp6aClient = await new SRPClientSession(srp6aRoutines).step1(testUsername, testPassword);

    // server gets identifier from client, salt+verifier from db (from signup)
    const server = await new SRPServerSession(srp6aRoutines).step1(testUsername, salt, verifier);

    // client gets challenge B from server step1 and sends prove M1 to server
    const srp6aClient_step2 = await srp6aClient.step2(salt, server.B);

    // servers checks client prove M1 and sends server prove M2 to client
    const serverM2 = await server.step2(srp6aClient_step2.A, srp6aClient_step2.M1);

    // client ensures server identity
    await srp6aClient_step2.step3(serverM2);

    //
    const clientSharedKey = srp6aClient_step2.S;
    const clientM1 = srp6aClient_step2.M1;

    const serverSharedKey = await server.sessionKey(srp6aClient_step2.A);

    console.log(`2: user:${testUsername}, password:${testPassword}, \nsalt: ${salt}`);
    console.log({clientM1, serverM2});
    console.log({clientSharedKey, serverSharedKey});
}
