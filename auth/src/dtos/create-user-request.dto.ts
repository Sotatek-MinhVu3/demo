export class CreateUserRequest {
    constructor (
        public readonly userId: number,
        public readonly stripeId: string,
        public readonly email: string
    ) {}
}