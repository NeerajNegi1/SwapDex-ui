import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { SnackbarToggleService } from 'src/app/service/snackbar/snackbar-toggle.service';
import allImages from 'src/assets/allImages';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss'],
})
export class SnackbarComponent implements OnInit {
  closeImg: string = allImages.closeImg;

  isSnackbar: any = {
    state: false,
    message: '',
  };
  uiStore: any;

  constructor(
    private store: Store<any>,
    private _snackbarService: SnackbarToggleService
  ) {}

  ngOnInit(): void {
    this.uiStore = this.store.select('ui').subscribe((data) => {
      this.isSnackbar = data.snackbar;
    });
  }
  closeSnackbar() {
    this._snackbarService.closeSnackbar();
  }
}
