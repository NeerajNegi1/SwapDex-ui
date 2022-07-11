import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { showSnackbar } from 'src/app/store/actions/ui.actions';

@Injectable({
  providedIn: 'root',
})
export class SnackbarToggleService {
  constructor(private store: Store<any>) {}

  snackbarToggle(message: string) {
    this.store.dispatch(showSnackbar({ state: true, message }));

    setTimeout(() => {
      this.store.dispatch(showSnackbar({ state: false, message: '' }));
    }, 5000);
  }

  closeSnackbar() {
    this.store.dispatch(showSnackbar({ state: false, message: '' }));
  }
}
