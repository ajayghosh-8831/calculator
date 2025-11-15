import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProbabilityService, ProbabilityRequest, ProbabilityResponse } from './probability.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.html'
})
export class AppComponent {

  functions = [
    { name: 'CombinedWith', label: 'CombinedWith: P(A)*P(B)' },
    { name: 'Either', label: 'Either: P(A) + P(B) – P(A)*P(B)' }
  ];

  result: number | null = null;
  error: string | null = null;
  private fb!: FormBuilder;
  form!: FormGroup;

  constructor(fb: FormBuilder, private probabilityService: ProbabilityService) { this.fb = fb; }
   ngOnInit() {
    this.form = this.fb.group({
      probabilityA: ['', [Validators.required, Validators.min(0), Validators.max(1)]],
      probabilityB: ['', [Validators.required, Validators.min(0), Validators.max(1)]],
      operation: ['CombinedWith', Validators.required]
    });
  }


  onSubmit() {
    this.result = null;
    this.error = null;

    if (this.form.invalid) {
      this.error = 'Please enter valid probabilities between 0 and 1.';
      return;
    }

    const probabilityA = Number(this.form.value.probabilityA);
    const probabilityB = Number(this.form.value.probabilityB);
    const operation = this.form.value.operation;

    if (Number.isNaN(probabilityA) || Number.isNaN(probabilityB)) {
      this.error = 'Please enter valid numeric probabilities.';
      return;
    }

    const request: ProbabilityRequest = {
      pA: probabilityA,
      pB: probabilityB,
      operation: operation
    };

    console.log('Sending probability request:', request);

    this.probabilityService.calculate(request).subscribe({
      next: (response: ProbabilityResponse) => {
        console.log('Received response:', response);
        this.result = response.result;
      },
      error: (err) => {
        console.error('API error response:', err);
        // Prefer a helpful message from server if available
        if (err && err.error) {
          // If backend returned JSON with a message, display it
          if (typeof err.error === 'string') {
            this.error = err.error;
          } else if (err.error.message) {
            this.error = err.error.message;
          } else {
            // Fallback to status text / code
            this.error = `Server returned ${err.status}: ${err.statusText || 'Bad Request'}`;
          }
        } else {
          this.error = 'Error calculating probabilities';
        }
      }
    });
  }

  clear() {
    // Reset the form values to defaults and clear UI state
    if (this.form) {
      this.form.reset({ probabilityA: '', probabilityB: '', operation: 'CombinedWith' });
      this.form.markAsPristine();
      this.form.markAsUntouched();
    }
    this.result = null;
    this.error = null;
  }
}