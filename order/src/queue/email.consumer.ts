import { Process, Processor } from "@nestjs/bull";
import { MailService } from "../mail/mail.service";
import { Job } from "bull";

@Processor('email')
export class EmailConsumer {
    constructor(
        private mailService: MailService
    ) {}

    @Process('send-email')
    sendEmail(job: Job<unknown>) {
        console.log(job.data);
        this.mailService.sendEmail(job.data);
    }
}