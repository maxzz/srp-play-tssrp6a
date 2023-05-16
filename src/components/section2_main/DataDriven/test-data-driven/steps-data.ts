type Step = {
    phase?: string;

    runAt?: 'browser' | 'server';

    fakecode?: boolean;
    code?: string;
    returnVars?: string;
    
    request?: string;
    send?: string[];
    reply?: string;
}

export const steps: Step[] = [
    //============================================
    {
      phase: "Registration phase",
    },
    //============================================
    {
      runAt: "browser",
      code: `import {createVerifierAndSalt, SRPClientSession, SRPParameters, SRPRoutines} from "tssrp6a";`,
      fakecode: true,
    },
    {
      runAt: "browser",
      code: `const parameters = new SRPParameters(); const routines = new SRPRoutines(parameters);`,
      returnVars: 'routines',
    },
    {
      runAt: "browser",
      code: `const username = "hello@world.org";`,
      returnVars: `username`
    },
    {
      runAt: "browser",
      code: `let password = "passw0rd"; const saltAndVerifier = await createVerifierAndSalt(routines, username, password);`,
      returnVars: `saltAndVerifier`
    },
    {
      runAt: "browser",
      code: `const s = saltAndVerifier.s;`,
      returnVars: `s`
    },
    {
      runAt: "browser",
      code: `const v = saltAndVerifier.v;`,
      returnVars: `v`
    },

    //============================================
    {
      request: "signup",
      send: ["username", "s", "v"]
    },
    //============================================

    {
      runAt: "server",
      code: `/* save by id (username): salt (s), verifier (v) */ const db = {[username]: [s, v]};`,
      returnVars: 'db'
    },

    //============================================
    {
      phase: "Login phase",
    },
    //============================================
    {
      runAt: "browser",
      code: `const client = new SRPClientSession(new SRPRoutines(new SRPParameters()));`,
      returnVars: `client`
    },
    //-------------------------
    {
      runAt: "server",
      code: `import {SRPParameters, SRPRoutines, SRPServerSession} from "tssrp6a";`,
      fakecode: true,
    },
    //-------------------------
    {
      runAt: "browser",
      code: `const step1 = await client.step1(username, "passw0rd");`,
      returnVars: `step1`
    },

    //============================================
    {
      request: "challenge",
      send: ["username"]
    },
    //============================================
    {
      runAt: "server",
      code: `const server = new SRPServerSession(new SRPRoutines(new SRPParameters()));`,
      returnVars: `server`
    },
    //-------------------------
    {
      runAt: "server",
      code: `const [s, v] = db[username]; const serverStep1 = await server.step1(username, s, v);`,
      returnVars: `serverStep1`
    },
    {
      runAt: "server",
      code: `const s = serverStep1.s;`,
      returnVars: `s`
    },
    {
      runAt: "server",
      code: `const B = serverStep1.B;`,
      returnVars: `B`
    },
    //-------------------------
    {
      reply: "challenge",
      send: ["s", "B"]
    },
    //-------------------------
    {
      runAt: "browser",
      code: `const step2 = await step1.step2(s, B);`,
      returnVars: `step2`
    },
    {
      runAt: "browser",
      code: `const A = step2.A;`,
      returnVars: `A`
    },
    {
      runAt: "browser",
      code: `const M1 = step2.M1;`,
      returnVars: `M1`
    },
    //-------------------------
    {
      request: "proof",
      send: ["A", "M1"]
    },
    //-------------------------
    {
      runAt: "server",
      code: `const M2 = await serverStep1.step2(A, M1); /* client has logged in without sending password */`,
      returnVars: `M2`
    },
    //-------------------------
    {
      reply: "proof",
      send: ["M2"],
    },
    //-------------------------
    {
      runAt: "browser",
      code: `const step3 = await step2.step3(M2); window.TEST_PASSED = window.TEST_PASSED === null ? true : window.TEST_PASSED; /* client has verified server */`,
      returnVars: `step3`
    },
    //-------------------------
    {
      phase: "Browser has logged in without sending password",
    },
];
