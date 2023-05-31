export class UpdatePaymentRequest {
    constructor(
        public readonly orderId: number,
        public readonly userId: number,
        public price: number,
    ) {}

}
