import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideIconsModule } from '../../lucide.module';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        LucideIconsModule
    ],
    templateUrl: './contact.html',
    styleUrls: ['./contact.css']
})
export class ContactComponent {
    contactForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.contactForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', Validators.required],
            service: ['', Validators.required],
            message: ['', Validators.required],
        });
    }

    onSubmit(event: Event) {
        if (this.contactForm.valid) {
            (event.target as HTMLFormElement).submit();
        }
    }
}