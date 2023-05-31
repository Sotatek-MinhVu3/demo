enum Status {
    CREATED = 'created', 
    CONFIRMED = 'confirmed',
    CANCELED = 'canceled',
    DELIVERED = 'delivered'
}

export class DeleteOrderRequest {
    constructor(
        public readonly status: Status,
    ) {}

}
