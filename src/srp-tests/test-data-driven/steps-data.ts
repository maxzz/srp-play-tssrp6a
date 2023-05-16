type Step = {
    break?: string;
    end?: string;
    code?: string;
    fakecode?: boolean;
    return?: string;
    request?: string;
    send?: string[];
    reply?: string;
}

export const steps: Step[] = [
    {
      break: "Registration phase",
    },
    {
      end: "browser",
      code:
    `import {
      createVerifierAndSalt,
      SRPClientSession,
      SRPParameters,
      SRPRoutines
    } from "tssrp6a";`,
      fakecode: true,
    },
    {
      end: "browser",
      code:
    `const parameters = new SRPParameters();
    const routines = new SRPRoutines(parameters);`,
      return: 'routines',
    },
    {
      end: "browser",
      code:
    `const username = "hello@world.org";`,
      return: `username`
    },
    {
      end: "browser",
      code:
    `let password = "passw0rd";
    const saltAndVerifier = await createVerifierAndSalt(
        routines,
        username,
        password,
    );`,
      return: `saltAndVerifier`
    },
    {
      end: "browser",
      code:
    `const s = saltAndVerifier.s;`,
      return: `s`
    },
    {
      end: "browser",
      code:
    `const v = saltAndVerifier.v;`,
      return: `v`
    },
    {
      request: "signup",
      send: ["username", "s", "v"]
    },
    {
      end: "server",
      code:
    `// save by id (username): salt (s), verifier (v)
    const db = {[username]: [s, v]};
    `,
      return: 'db'
    },
    {
      break: "Login phase",
    },
    
    {
      end: "browser",
      code:
    `const client = new SRPClientSession(new SRPRoutines(new SRPParameters()));`,
      return: `client`
    },
    {
      end: "server",
      code:
    `import {
      SRPParameters,
      SRPRoutines,
      SRPServerSession
    } from "../dist/esm/index.js";`,
      fakecode: true,
    },
    {
      end: "browser",
      code:
    `const step1 = await client.step1(username, "passw0rd");`,
      return: `step1`
    },
    {
      request: "challenge",
      send: ["username"]
    },
    {
      end: "server",
      code:
    `const server = new SRPServerSession(new SRPRoutines(new SRPParameters()));`,
      return: `server`
    },
    {
      end: "server",
      code:
    `
    const [s, v] = db[username];
    const serverStep1 = await server.step1(username, s, v);`,
      return: `serverStep1`
    },
    {
      end: "server",
      code:
    `const s = serverStep1.s;`,
      return: `s`
    },
    {
      end: "server",
      code:
    `const B = serverStep1.B;`,
      return: `B`
    },
    {
      reply: "challenge",
      send: ["s", "B"]
    },
    {
      end: "browser",
      code:
    `const step2 = await step1.step2(s, B);`,
      return: `step2`
    },
    {
      end: "browser",
      code:
    `const A = step2.A;`,
      return: `A`
    },
    {
      end: "browser",
      code:
    `const M1 = step2.M1;`,
      return: `M1`
    },
    
    {
      request: "proof",
      send: ["A", "M1"]
    },
    {
      end: "server",
      code:
    `const M2 = await serverStep1.step2(A, M1);
    // client has logged in without sending password`,
      return: `M2`
    },
    {
      reply: "proof",
      send: ["M2"],
    },
    {
      end: "browser",
      code:
    `const step3 = await step2.step3(M2);
    window.TEST_PASSED = window.TEST_PASSED === null ? true : window.TEST_PASSED;
    // client has verified server`,
      return: `step3`
    },
    {
      break: "Browser has logged in without sending password",
    },
];
