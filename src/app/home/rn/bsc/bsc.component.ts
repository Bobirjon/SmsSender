import { formatDate } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { StorageService } from 'src/app/storage.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


@Component({
  selector: 'app-bsc',
  templateUrl: './bsc.component.html',
  styleUrls: ['./bsc.component.css']
})
export class BscComponent implements OnInit {

  bscForm: FormGroup
  user: any
  newForm: boolean
  SmsTextBody: any
  time = new Date()
  requestType: any
  tableBody: any    
  smsBody: any
  idAlarmReport: any
  filteredOptionsProblem: Observable<string[]>;
  filteredOptionsReason: Observable<string[]>;
  filteredOptionsEffect: Observable<string[]>;

  level: { value: string; viewValue: string }[] = [
    { value: 'A1', viewValue: 'A1' },
    { value: 'A2', viewValue: 'A2' },
    { value: 'A3', viewValue: 'A3' },
    { value: 'A4', viewValue: 'A4' },
    { value: 'A5', viewValue: 'A5' },
    { value: 'P1', viewValue: 'П1' },
    { value: 'P2', viewValue: 'П2' },
    { value: 'P3', viewValue: 'П3' },
    { value: 'P4', viewValue: 'П4' },
    { value: 'P5', viewValue: 'П5' },
  ];
  
  categories_report: { value: string; viewValue: string }[] = [
    { value: 'Тех проблема', viewValue: 'Тех проблема' },
    { value: 'ЭС и Клим', viewValue: 'ЭС и Клим' },
    { value: 'Провайдер', viewValue: 'Провайдер' },
    { value: 'ПР', viewValue: 'ПР' },
    { value: 'Выясняется', viewValue: 'Выясняется' },
  ];
  responsible_report: { value: string; viewValue: string }[] = [
    { value: 'Другие ЗО', viewValue: 'Другие ЗО' },
    { value: 'Эксплуатация', viewValue: 'Эксплуатация' },
    { value: 'Выясняется', viewValue: 'Выясняется' },
  ];
  effect_option: { value: string; viewValue: string }[] = [
    { value: 'С влиянием', viewValue: 'С влиянием' },
    { value: 'Без влияния', viewValue: 'Без влияния' }
  ];
  category: { value: string; viewValue: string }[] = [
    { value: 'wb', viewValue: 'wb' },
    { value: 'fault', viewValue: 'fault' },
    { value: 'no', viewValue: 'no' }
  ];
  region: { value: string; viewValue: string }[] = [
    { value: 'Андижан', viewValue: 'Андижан' },
    { value: 'Бухара', viewValue: 'Бухара' },
    { value: 'Джизак', viewValue: 'Джизак' },
    { value: 'Фергана', viewValue: 'Фергана' },
    { value: 'Сырдарья', viewValue: 'Сырдарья' },
    { value: 'Кашкадарья', viewValue: 'Кашкадарья' },
    { value: 'Наманган', viewValue: 'Наманган' },
    { value: 'Навои', viewValue: 'Навои' },
    { value: 'Каракалпакстан', viewValue: 'Каракалпакстан' },
    { value: 'Самарканд', viewValue: 'Самарканд' },
    { value: 'г.Ташкент', viewValue: 'г.Ташкент' },
    { value: 'Ташкент.обл', viewValue: 'Ташкент.обл' },
    { value: 'Сурхандарья', viewValue: 'Сурхандарья' },
    { value: 'Хорезм', viewValue: 'Хорезм' },
  ];

  optionsProblem: string[] = [
    'Некорректная состояние платы ',
    'Плата',
    'Потеря',
  ];

  optionsReason: string[] = [
    'Из-за неисправности платы ',
    'В связи с плановыми работами',
    'Выясняется',
  ];

  optionsEffect: string[] = [
    'Нет эффект на сервис ',
    'Недоступен 3G',
  ]

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog) {
      // form creation
     this.bscForm = this.formBuilder.group({
      'AddOrCor': [null],
      'level': ['', Validators.required],
      'categories_report': ['', Validators.required],
      'responsible_report': ['', Validators.required],
      'problem': ['', Validators.required],
      'reason': ['', Validators.required],
      'effect_option': ['C Влиянием', Validators.required],
      'startTime': ['', Validators.required],
      'endTime': ['', [this.endTimeValidation]],
      'region': ['', Validators.required],
      'effect': ['', Validators.required],
      'informed': ['', Validators.required],
      'desc': ['', Validators.required],
      'sender': [''],
    })

    this.filteredOptionsProblem = this.bscForm.controls.problem.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.optionsProblem))
    )

    this.filteredOptionsReason = this.bscForm.controls.reason.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.optionsReason))
    )

    this.filteredOptionsEffect = this.bscForm.controls.effect.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.optionsEffect))
    )
  }

  private _filter(value: string, options: string[]): string[] {
    const filterValue = value.toLocaleLowerCase()
    return options.filter(option => option.toLocaleLowerCase().includes(filterValue))
  }

  setDefault() {
    if (this.bscForm.value.level == 'P1' || this.bscForm.value.level == 'P2' ||
      this.bscForm.value.level == 'P3' || this.bscForm.value.level == 'P4' || this.bscForm.value.level == 'P5') {
      this.bscForm.value.categories_report = 'ПР'
    }
  }

  endTimeValidation(control: any) {
    let endTime = new Date(control.value)
    const formGroup = control?.parent;
    if(formGroup) {
      const startTime = formGroup.get('startTime')
      const startTimeSelected = new Date(startTime.value)
      const difference = endTime.getTime() - startTimeSelected.getTime()
      if(difference < 0) {

        return { timeValid: true}
      } else {
        return null
      }
    }
    return null
  }

  ngOnInit(): void {
    // get Current user
    this.authService.getUser()
      .subscribe(result => {
        this.user = result
      })
    // is user in edit mode
    if (this.route.snapshot.params.id == (null || undefined)) {
      this.newForm = true
    } else {
      this.newForm = false
      let endTimeForUpdate: any
      this.authService.getSms(this.route.snapshot.params.id)
        .subscribe(result => {
          if (result['end_time'] == null) {
            endTimeForUpdate = (result['end_time'], 'yyyy-MM-ddTHH:mm', '')
          } else {
            endTimeForUpdate = formatDate(result['end_time'], 'yyyy-MM-ddTHH:mm', 'en')
          }
          this.bscForm = this.formBuilder.group({
            'AddOrCor': [null],
            'level': [result['level'], Validators.required],
            'categories_report': [result['category'], Validators.required],
            'responsible_report': [result['responsible_area'], Validators.required],
            'problem': [result['problem'], Validators.required],
            'reason': [result['reason'], Validators.required],
            'effect_option': [result['effect'], Validators.required],
            'startTime': [formatDate(result['start_time'], 'yyyy-MM-ddTHH:mm', 'en'), Validators.required],
            'endTime': [endTimeForUpdate, [this.endTimeValidation]],
            'region': [result['region'], Validators.required],
            'effect': [result['influence'], Validators.required],
            'informed': [result['informed'], Validators.required],
            'desc': [result['description'], Validators.required],
            'sender': [result['sender']],
          })
        })
    }
  }

  tableSendBody() {
    this.tableBody = {
      'type': 'BSC/RNC',
      'level': this.bscForm.value.level,
      'category': this.bscForm.value.categories_report,
      'responsible_area': this.bscForm.value.responsible_report,
      'problem': this.bscForm.value.problem,
      'reason': this.bscForm.value.reason,
      'effect': this.bscForm.value.effect_option,
      'influence': this.bscForm.value.effect,
      'start_time': this.bscForm.value.startTime,
      'region': this.bscForm.value.region,

      'informed': this.bscForm.value.informed,
      'description': this.bscForm.value.desc,
      'sender': this.user?.username
    }

    if (this.bscForm.value.endTime != '') {
      this.tableBody.end_time = this.bscForm.value.endTime
    }
  }

  smsSendBody(id?: number) {

    let addWord = this.storageService.additionWord(this.bscForm.value.level)

    if (this.requestType == 'Проблема') {
      if (this.bscForm.value.AddOrCor == (undefined || null)) {
        this.SmsTextBody =
          this.bscForm.value.level.replace('P', 'П') + ' BSC ' + this.requestType + ':\n' +
          this.bscForm.value.problem + '\n' +
          'Причина: ' + this.bscForm.value.reason + '\n' +
          'Эффект: ' + this.bscForm.value.effect + '\n' +
          'Начало: ' + this.bscForm.value.startTime.replace("T", " ") + '\n' +
          'Оповещен: ' + this.bscForm.value.informed + '\n' +
          'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name + '\n ' +
          addWord
      } else {
        this.SmsTextBody =
          this.bscForm.value.level.replace('P', 'П') + ' BSC ' + this.requestType + ':\n' +
          '(' + this.bscForm.value.AddOrCor + ')\n' +
          this.bscForm.value.problem + '\n' +
          'Причина: ' + this.bscForm.value.reason + '\n' +
          'Эффект: ' + this.bscForm.value.effect + '\n' +
          'Начало: ' + this.bscForm.value.startTime.replace("T", " ") + '\n' +
          'Оповещен: ' + this.bscForm.value.informed + '\n' +
          'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name + '\n '  +
          addWord
      }
    }
    else {
      if (this.bscForm.value.AddOrCor == (null || undefined)) {
        this.SmsTextBody =
          this.bscForm.value.level.replace('P', 'П') + ' BSC ' + this.requestType + ':\n' +
          this.bscForm.value.problem + '\n' +
          'Причина: ' + this.bscForm.value.reason + '\n' +
          'Эффект: ' + this.bscForm.value.effect + '\n' +
          'Описание: ' + this.bscForm.value.desc + '\n' +
          'Начало: ' + this.bscForm.value.startTime.replace("T", " ") + '\n' +
          'Конец: ' + this.bscForm.value.endTime.replace("T", " ") + '\n' +
          'Оповещен: ' + this.bscForm.value.informed + '\n' +
          'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name + '\n ' +
          addWord
      } else {
        this.SmsTextBody =
          this.bscForm.value.level.replace('P', 'П') + ' BSC ' + this.requestType + ':\n' +
          '(' + this.bscForm.value.AddOrCor + ')\n' +
          this.bscForm.value.problem + '\n' +
          'Причина: ' + this.bscForm.value.reason + '\n' +
          'Эффект: ' + this.bscForm.value.effect + '\n' +
          'Описание: ' + this.bscForm.value.desc + '\n' +
          'Начало: ' + this.bscForm.value.startTime.replace("T", " ") + '\n' +
          'Конец: ' + this.bscForm.value.endTime.replace("T", " ") + '\n' +
          'Оповещен: ' + this.bscForm.value.informed + '\n' +
          'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name + '\n ' +
          addWord
      }
    }

    let smsType = this.storageService.SmsType(this.requestType, this.bscForm.value.AddOrCor, false)
    
    this.smsBody = {
      'source_addr': 'ncc-rn',
      'network': ['RN'],
      'criteria': [this.bscForm.value.level.replace('P', 'A')],
      'notification': ['BSC/RNC'],
      'sms_text': this.SmsTextBody,
      'alarmreport_id': id,
      'sms_type': smsType
    }

    if (this.bscForm.value.region != (null || undefined)) {
      this.smsBody.region = [this.bscForm.value.region]
    }
  }

  updateData() {
    this.tableSendBody()

    this.storageService.updateData(this.route.snapshot.params.id, this.tableBody)
   
  }

  createData() {
    this.tableSendBody()
    
    this.storageService.createToTable(this.tableBody)

  }

  sendButton() {
    
    this.storageService.sendSms(this.smsBody)

  }

  onSubmitButtonProblem(smsType: string) {
    this.requestType = smsType

    this.smsSendBody()

    const dialogRef = this.dialog.open(areYouSure);

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        if (this.newForm == false) {
          this.tableSendBody()

          this.authService.updateSms(this.route.snapshot.params.id, this.tableBody)
            .subscribe((result) => {
              this.snackBar.open('Обновлено в таблице', '', { duration: 10000 })

              this.idAlarmReport = result
              this.smsSendBody(this.idAlarmReport.id)
              this.sendButton()
            }, error => {
              this.snackBar.open('Ошибка при обновлении', '', { duration: 10000 })
            })
        } else {
          this.tableSendBody()

          this.authService.postData(this.tableBody)
            .subscribe((res) => {
              console.log(res);
              this.snackBar.open('Добавлен в таблицу', '', { duration: 10000 })

              this.smsSendBody(res.id)
              this.sendButton()
            }, error => {
              console.log(error);
              this.snackBar.open("Ошибка при добавлении в таблицу ", '', { duration: 10000 })
            })
        }

      }

    })
  }

  onSubmitasNew(smsType: string) {
    this.requestType = smsType

    const dialogRef = this.dialog.open(areYouSure);

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.tableSendBody()

        this.authService.postData(this.tableBody)
          .subscribe((result) => {
            console.log(result);
            this.snackBar.open('Добавлен в таблицу', '', { duration: 10000 })
            this.smsSendBody(result.id)
            this.sendButton()
          }, error => {
            console.log(error);
            this.snackBar.open("Ошибка при добавлении в таблицу ", '', { duration: 10000 })
          })
      }
    })
  }

  forSmsTesting(smsType: string) {
    this.requestType = smsType
    this.smsSendBody()

    const dialogRef = this.dialog.open(fortesting, {
      data: { text: this.SmsTextBody }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {

      }
    })
  }
}

@Component({
  selector: 'areYouSure',
  templateUrl: 'areYouSure.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class areYouSure { }

@Component({
  selector: 'fortesting',
  templateUrl: 'fortesting.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, FormsModule],
})
export class fortesting {
  constructor(
    private authService: AuthService,
    public dialogRef: MatDialogRef<fortesting>,
    @Inject(MAT_DIALOG_DATA) public smsbody: any,
  ) { }

  onSubmit(form: NgForm) {
    let tel_list = form.value.field.split('\n')
    console.log(this.smsbody.text);

    let smsTXTBody = {
      'source_addr': 'ncc-rn',
      'sms_text': this.smsbody.text,
      'tel_number_list': tel_list,
    }

    this.authService.sendTestSMS(smsTXTBody)
      .subscribe(res => {
        console.log(res);
      })

  }
}
