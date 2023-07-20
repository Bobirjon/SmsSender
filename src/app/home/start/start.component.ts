import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { StorageService } from 'src/app/storage.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {
  data: FormGroup
  level: {value: string; viewValue: string}[] = [
    {value: 'A1', viewValue: 'A1'},
    {value: 'A2', viewValue: 'A2'},
    {value: 'A3', viewValue: 'A3'},
    {value: 'A4', viewValue: 'A4'},
    {value: 'A5', viewValue: 'A5'},
    {value: 'ПР', viewValue: 'ПР'}
  ];
  categories_report: {value: string; viewValue: string}[] = [
    {value: 'Тех проблема', viewValue: 'Тех проблема'},
    {value: 'ЭС и Клим', viewValue: 'ЭС и Клим'},
    {value: 'ПР', viewValue: 'ПР'},
    {value: 'Выясняется', viewValue: 'Выясняется'},
  ];
  responsible_report: {value: string; viewValue: string}[] = [
    {value: 'Другие ЗО', viewValue: 'Другие ЗО'},
    {value: 'Эксплуатация', viewValue: 'Эксплуатация'},
    {value: 'Выясняется', viewValue: 'Выясняется'},
  ];
  effect_option: {value: string; viewValue: string}[] = [
    {value: 'С влиянием', viewValue: 'С влиянием'},
    {value: 'Без влияния', viewValue: 'Без влияния'}
  ];
  generator: {value: string; viewValue: string}[] = [
    {value: 'FG', viewValue: 'FG'},
    {value: 'Empty', viewValue: 'Empty'}
  ];


  constructor(private route: ActivatedRoute, private authService: AuthService, private formBuilder: FormBuilder) {
    this.data = this.formBuilder.group({
      type: [null],
      level: [null, Validators.required],
      categories_report: [null, Validators.required],
      responsible_report: [null, Validators.required],
      problem: [null, Validators.required],
      reason: [null, Validators.required],
      effect_option: ['Без влияния', Validators.required],
      startTime: [null, Validators.required],
      endTime: [null, Validators.required],
      region: [null, Validators.required],
      effect: [null],
      desc: [null],
      sender: [null],
      informed: [null],
    })
   }

  ngOnInit(): void {

    // this.authService.getSms(this.route.snapshot.params.id)
    //   .subscribe(result => {
    //     console.log(result);
    //   })
  }

  onSubmitForm() {

  }

}
