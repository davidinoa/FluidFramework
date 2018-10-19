import { ICommit } from "@prague/gitresources";
import * as loader from "@prague/loader-web";
import { createReplayDocumentService } from "@prague/replay-socket-storage";
import {
    createDocumentService,
    DefaultErrorTracking,
    TokenService,
} from "@prague/socket-storage";
import { BrowserErrorTrackingService } from "./errorTracking";

export async function initialize(
    version: ICommit,
    token: string,
    config: any,
    chaincode: string,
    npm: string,
    from: number,
    to: number) {

    const errorService = config.trackError
        ? new BrowserErrorTrackingService()
        : new DefaultErrorTracking();

    const replay = from >= 0 && to >= 0;
    const documentServices = replay
        ? createReplayDocumentService(document.location.origin, from, to)
        : createDocumentService(
            document.location.origin,
            config.blobStorageUrl,
            errorService);

    loader.run(token, null, false, documentServices, new TokenService(), version, true, chaincode, npm)
        .catch((error) => console.error(error));
}
