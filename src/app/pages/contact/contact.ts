import {
    Component,
    OnInit,
    OnDestroy,
    NgZone,
    Inject,
    PLATFORM_ID,
  } from '@angular/core';
  import { isPlatformBrowser } from '@angular/common';
  import { RouterModule } from '@angular/router';
  import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
  import { LucideIconsModule } from '../../lucide.module';
  
  declare global {
    interface Window {
      turnstileFinished: () => void;
      turnstile: {
        render: (selector: string, options: object) => void;
        reset: (selector?: string) => void;
      };
    }
  }
  
  let turnstileScriptLoaded = false;
  
  @Component({
    selector: 'app-contact',
    standalone: true,
    imports: [
      RouterModule,
      FormsModule,
      ReactiveFormsModule,
      LucideIconsModule,
    ],
    templateUrl: './contact.html',
    styleUrls: ['./contact.css'],
  })
  export class ContactComponent implements OnInit, OnDestroy {
    contactForm: FormGroup;
  
    private turnstileVerified = false;
  
    constructor(
      private fb: FormBuilder,
      private ngZone: NgZone,
      @Inject(PLATFORM_ID) private platformId: object,
    ) {
      this.contactForm = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required],
        service: ['', Validators.required],
        message: ['', Validators.required],
      });
    }
  
    ngOnInit() {
      if (!isPlatformBrowser(this.platformId)) return;
  
      window.turnstileFinished = () => {
        this.ngZone.run(() => {
          this.turnstileVerified = true;
        });
      };
  
      if (
        !turnstileScriptLoaded &&
        !document.querySelector('script[src*="turnstile"]')
      ) {
        turnstileScriptLoaded = true;
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      } else {
        this.renderTurnstile();
      }
    }
  
    private renderTurnstile() {
      const render = () => {
        if (window.turnstile) {
          window.turnstile.render('.cf-turnstile', {
            sitekey: '0x4AAAAAADBYvtAbx5FgA50a',
            callback: () => {
              this.ngZone.run(() => {
                this.turnstileVerified = true;
              });
            },
            theme: 'light',
          });
        } else {
          setTimeout(() => render(), 100);
        }
      };
      render();
    }
  
    ngOnDestroy() {
      if (!isPlatformBrowser(this.platformId)) return;
      delete (window as any).turnstileFinished;
    }
  
    get isFormValid() {
      return this.contactForm.valid && this.turnstileVerified;
    }
  
    onSubmit(event: Event) {
      if (!this.isFormValid) return;
      (event.target as HTMLFormElement).submit();
    }
  }