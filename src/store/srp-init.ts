import { SRPParameters, SRPRoutines } from "tssrp6a";
import { stringToArrayBuffer } from "tssrp6a/dist/utils";

const testParameters = new SRPParameters();

class SRP6aRoutines extends SRPRoutines {
    public computeIdentityHash(I: string, P: string): Promise<ArrayBuffer> {
        return this.hash(stringToArrayBuffer(`${I}:${P}`));
    }
}

export const srp6aRoutines = new SRP6aRoutines(testParameters);
