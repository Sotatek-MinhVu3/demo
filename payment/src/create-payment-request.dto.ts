export class CreatePaymentRequest {
    constructor(
        public readonly userId: number,
        public readonly orderId: number,
        public price: number,
    ) {}

}
