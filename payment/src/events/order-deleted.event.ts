enum Status {
    CREATED = 'created', 
    CONFIRMED = 'confirmed',
    CANCELED = 'canceled',
    DELIVERED = 'delivered'
}

export class OrderDeletedEvent {
    constructor(
        public readonly orderId: number,
        public readonly userId: number,
        public readonly price: number,
        public readonly status: Status,
    ) {}
}