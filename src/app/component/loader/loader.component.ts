import { Component, OnInit } from '@angular/core';
import allImages from 'src/assets/allImages';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  loader:String = allImages.loader;

  constructor() { }

  ngOnInit(): void {
  }

}
