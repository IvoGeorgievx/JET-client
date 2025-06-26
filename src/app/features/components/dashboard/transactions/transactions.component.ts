import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CategoryStore } from '@core/store/category.store';
import { TransactionStore } from '@core/store/transaction.store';
import {
  TransactionPeriod,
  TransactionType,
} from '@shared/types/transaction.type';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

interface ITransactionForm {
  amount: FormControl<number>;
  description: FormControl<string>;
  type: FormControl<TransactionType>;
  categoryId: FormControl<string>;
}

@Component({
  selector: 'jet-transactions',
  imports: [ReactiveFormsModule, CommonModule, ModalComponent],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class TransactionsComponent implements OnInit {
  readonly transactionStore = inject(TransactionStore);
  readonly categoryStore = inject(CategoryStore);
  overallTransactions = this.transactionStore.overallTransactions;

  protected showModal = false;

  readonly transactionType = TransactionType;
  readonly transactionPeriod = TransactionPeriod;

  protected transactionForm: FormGroup<ITransactionForm>;

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.transactionForm = new FormGroup<ITransactionForm>({
      amount: new FormControl(0, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(0.01)],
      }),
      description: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(255)],
      }),
      type: new FormControl(TransactionType.INCOME, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      categoryId: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  createTransaction() {
    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched();
      return;
    }

    const payload = this.transactionForm.getRawValue();
    if (!payload.categoryId) {
      this.transactionForm.get('categoryId')?.setErrors({ required: true });
      return;
    }
    this.transactionStore.createTransaction({
      ...payload,
    });
    this.transactionForm.reset();
    this.showModal = false;
  }

  changeTransactionPeriod(event: Event) {
    const period = (event.target as HTMLSelectElement)
      .value as TransactionPeriod;

    this.transactionStore.getOverallTransactions(period);
  }
  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
}
