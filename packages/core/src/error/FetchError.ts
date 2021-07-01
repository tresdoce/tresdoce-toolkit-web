export class FetchError extends Error {
    static CANCEL = 'cancel-request';

    type = null;
    baseError = null;

    constructor(ctx) {
        super(ctx);
        this.type = ctx.type;
        this.baseError = ctx.baseError;
    }
}
