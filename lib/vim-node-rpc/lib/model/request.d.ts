import Connection from './connection';
export default class Request {
    private conn;
    private requestId;
    private pendings;
    private supportedFuncs;
    private buffered;
    constructor(conn: Connection);
    private convertArgs;
    private eval;
    private call;
    command(str: string): Promise<void>;
    callNvimFunction(method: string, args: any[]): Promise<any>;
}
