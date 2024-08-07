import { formatDate } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/storage.service';
import { AuthService } from 'src/app/auth.service';
import { Observable, range } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-ring',
  templateUrl: './ring.component.html',
  styleUrls: ['./ring.component.css'],
})
export class RingComponent implements OnInit {

  ringForm: FormGroup
  user: any
  newForm: boolean
  SmsTextBody: any
  time = new Date()
  requestType: any
  asNew: boolean = false
  tableBody: any
  smsBody: any
  word: string = ' Узловой сайт '
  selectedRegion: string = ''
  filteredOptionsReason: Observable<string[]>;
  filteredOptionsDesc: Observable<string[]>;
  
  regionCity: any = [
    'в городе Андижан', 'в городе Ханабад', 'в городе Бухара', 'в городе Каган', 'в городе Джизак',
    'в городе Фергана', 'в городе Коканд', 'в городе Кувасай', 'в городе Маргилан', 'в городе Ургенч',
    'в городе Хива', 'в городе Нукус', 'в городе Карши', 'в городе Шахрисабз', 'в городе Наманган', 'в городе Навои',
    'в городе Зарафшан', 'в городе Газган', 'в городе Самарканд', 'в городе Каттакурган', 'в городе Гулистан', 
    'в городе Ширин','в городе Янгиер', 'в городе Термез', 'в городе Чирчик', 'в городе Алмалык', 'в городе Ангрен', 
    'в городе Янгиюль', 'в городе Бекабад', 'в городе Ахангаран',

  ]

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
    { value: 'ПР', viewValue: 'ПР' },
    { value: 'Провайдер', viewValue: 'Провайдер' },
    { value: 'Выясняется', viewValue: 'Выясняется' },
  ];

  responsible_report: { value: string; viewValue: string }[] = [
    { value: 'Другие ЗО', viewValue: 'Другие ЗО' },
    { value: 'Эксплуатация', viewValue: 'Эксплуатация' },
    { value: 'Выясняется', viewValue: 'Выясняется' },
  ];

  region = [
    { value: '', display: '' },
    { value: 'Андижан', display: 'Андижане' },
    { value: 'Бухара', display: 'Бухаре' },
    { value: 'Джизак', display: 'Джизаке' },
    { value: 'Фергана', display: 'Фергане' },
    { value: 'Сырдарья', display: 'Сырдарье' },
    { value: 'Кашкадарья', display: 'Кашкадарье' },
    { value: 'Наманган', display: 'Намангане' },
    { value: 'Навои', display: 'Навои' },
    { value: 'Каракалпакстан', display: 'Каракалпакстане' },
    { value: 'Самарканд', display: 'Самарканде' },
    { value: 'г.Ташкент', display: 'г.Ташкенте' },
    { value: 'Ташкент.обл', display: 'Ташкентской области' },
    { value: 'Сурхандарья', display: 'Сурхандарье' },
    { value: 'Хорезм', display: 'Хорезме' },
  ];

  category: { value: string; viewValue: string }[] = [
    { value: 'AC/DC breaker', viewValue: 'AC/DC breaker' },
    { value: 'Bad RX level', viewValue: 'Bad RX level' },
    { value: 'High Temp', viewValue: 'High Temp' },
    { value: 'Incorrect work', viewValue: 'Incorrect work' },
    { value: 'Leased Line', viewValue: 'Leased Line' },
    { value: 'Low voltage', viewValue: 'Low voltage' },
    { value: 'Power', viewValue: 'Power' },
    { value: 'TI_DNO', viewValue: 'TI_DNO' },
    { value: 'TI_ESO', viewValue: 'TI_ESO' },
    { value: 'TI_MW', viewValue: 'TI_MW' },
    { value: 'TI_FLM', viewValue: 'TI_FLM' },
    { value: 'TI_SAQ', viewValue: 'TI_SAQ' },
    { value: 'TI_SDH', viewValue: 'TI_SDH' },
    { value: 'Unplanned work', viewValue: 'Unplanned work' },
    { value: 'WB', viewValue: 'WB' },
    { value: 'Выясняется', viewValue: 'Выясняется ' },
  ];

  optionsReason: string[] = [

  ];

  optionsDesc: string[] = [

  ];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog) {

    this.ringForm = this.formBuilder.group({
      'AddOrCor': [null],
      'level': ['', Validators.required],
      'categories_report': ['', Validators.required],
      'responsible_report': ['', Validators.required],
      'reason': ['', Validators.required],
      'problem': ['', Validators.required],
      'startTime': ['', Validators.required],
      'endTime': ['', this.endTimeValidation],
      'region': [this.region[0], Validators.required],
      'desc': [''],
      'informed': ['', Validators.required],
      'category': ['', Validators.required],
      'powerOffTime': [''],
      'effect': [''],
    })

    this.filteredOptionsReason = this.ringForm.controls.reason.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.optionsReason))
    )

    this.filteredOptionsDesc = this.ringForm.controls.desc.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.optionsDesc))
    )
  }

  private _filter(value: string, options: string[]): string[] {
    const filterValue = value.toLocaleLowerCase()
    return options.filter(option => option.toLocaleLowerCase().includes(filterValue))
  }

  setDefault() {
    if (this.ringForm.value.level == 'P1' || this.ringForm.value.level == 'P2' ||
      this.ringForm.value.level == 'P3' || this.ringForm.value.level == 'P4' || this.ringForm.value.level == 'P5') {
      this.ringForm.value.categories_report = 'ПР'
    }
  }

  endTimeValidation(control: any) {
    let endTime = new Date(control.value)
    const formGroup = control?.parent;
    if (formGroup) {
      const startTime = formGroup.get('startTime')
      const startTimeSelected = new Date(startTime.value)
      const difference = endTime.getTime() - startTimeSelected.getTime()
      if (difference < 0) {
        return { timeValid: true }
      } else {
        return null
      }
    }
    return null
  }

  OnSelectRegion(event: MatSelectChange) {
    console.log(event.value);
  }

  ngOnInit(): void {

    // get Current user
    this.authService.getUser()
      .subscribe(result => {
        this.user = result
      })

    if (this.route.snapshot.params.id == null) {
      this.newForm = true

    } else {
      this.newForm = false
      let endTimeForUpdate: any
      let power_off_time: any

      if (this.route.snapshot.url.toString().includes('update')) {
        this.asNew = true
      }

      this.authService.getSms(this.route.snapshot.params.id)
        .subscribe((result) => {

          const selectedOptionReg = this.region.find(region => region.value === result['region'])
          this.selectedRegion = selectedOptionReg ? selectedOptionReg.display : ''


          if (result['end_time'] == null || this.asNew == true) {
            endTimeForUpdate = (result['end_time'], 'yyyy-MM-ddTHH:mm', '')
          } else {
            endTimeForUpdate = formatDate(result['end_time'], 'yyyy-MM-ddTHH:mm', 'en')
          }
          if (result['power_off_time'] == null) {
            power_off_time = (result['power_off_time'], 'yyyy-MM-ddTHH:mm', '')
            console.log(power_off_time);

          } else {
            power_off_time = formatDate(result['power_off_time'], 'yyyy-MM-ddTHH:mm', 'en')
            console.log(power_off_time);
          }
          this.ringForm = this.formBuilder.group({
            'AddOrCor': [null],
            'level': [result['level'], Validators.required],
            'categories_report': [result['category'], Validators.required],
            'responsible_report': [result['responsible_area'], Validators.required],
            'reason': [result['reason'], Validators.required],
            'startTime': [formatDate(result['start_time'], 'yyyy-MM-ddTHH:mm', 'en'), Validators.required],
            'endTime': [endTimeForUpdate, this.endTimeValidation],
            'region': [result['region'], Validators.required],
            'desc': [result['description']],
            'problem': [result['problem']],
            'effect': [result['influence']],
            'sender': [result['sender']],
            'informed': [result['informed']],
            'category': [result['category_for_hub']],
            'powerOffTime': [power_off_time],

          })

        })
    }
  }

  tableSendBody() {

    this.tableBody = {
      'type': 'RING',
      'level': this.ringForm.value.level,
      'category': this.ringForm.value.categories_report,
      'responsible_area': this.ringForm.value.responsible_report,
      'problem': this.ringForm.value.problem,
      'reason': this.ringForm.value.reason,
      'start_time': this.ringForm.value.startTime,
      'region': this.ringForm.value.region,
      'category_for_hub': this.ringForm.value.category,
      'description': this.ringForm.value.desc,
      'informed': this.ringForm.value.informed,
      'influence': this.ringForm.value.effect,
      'sender': this.user?.username,
      'effect': 'С влиянием',

    }

    if (this.ringForm.value.endTime !== '') {
      this.tableBody.end_time = this.ringForm.value.endTime
    } else {
      this.tableBody.end_time = null
    }
    if (this.ringForm.value.powerOffTime !== '') {
      this.tableBody.power_off_time = this.ringForm.value.powerOffTime
    } else {

      this.tableBody.power_off_time = null
    }
  }

  smsSendBody(id?: number) {

    let addWord = this.storageService.additionWord(this.ringForm.value.level)

    let powerOffTime = this.ringForm.value.powerOffTime == '' ? 'Н\Д' : this.ringForm.value.powerOffTime.replace("T", " ")

    this.SmsTextBody =
      `${this.ringForm.value.level.replace('P', 'П') + ' ' + this.requestType}\n` +
      `${(this.ringForm.value.AddOrCor != null || this.ringForm.value.AddOrCor != undefined) ? '(' + this.ringForm.value.AddOrCor + ')\n' : ''}` +
      `${this.ringForm.value.problem}\n` +
      `${'Причина: ' + this.ringForm.value.reason}\n` +
      `${'Эффект: ' + this.ringForm.value.effect}\n` +
      `${this.requestType !== 'Проблема' ? 'Описание: ' + this.ringForm.value.desc + '\n' : ''}` +
      `${'Оповещен: ' + this.ringForm.value.informed}\n` +
      `${'Время отключения ЭП: ' + powerOffTime}\n` +
      `${'Начало: ' + this.ringForm.value.startTime.replace("T", " ")}\n` +
      `${this.requestType !== 'Проблема' ? 'Конец: ' + this.ringForm.value.endTime.replace("T", " ") + '\n' : ''}` +
      `${'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name}\n` +
      `${addWord}`

    let smsType
    smsType = this.storageService.SmsType(this.requestType, this.ringForm.value.AddOrCor, false)


    this.smsBody = {
      'source_addr': 'ncc-rn',
      'network': ['RN'],
      'criteria': [this.ringForm.value.level.replace('P', 'A')],
      'notification': ['Hub'],
      'sms_text': this.SmsTextBody,
      'region': [this.ringForm.value.region],
      'alarmreport_id': id,
      'sms_type': smsType
    }
  }

  updateData() {

    this.tableSendBody()

    this.authService.updateSms(this.route.snapshot.params.id, this.tableBody)
      .subscribe((result) => {
        console.log(result);
        this.snackBar.open('Обновлено', '', { duration: 10000 })
      }, error => {
        console.log(error);
        this.snackBar.open('Ошибка при обновлении', '', { duration: 10000 })
      })
  }

  createData() {
    console.log(this.ringForm.value.powerOffTime);

    this.tableSendBody()

    this.authService.postData(this.tableBody)
      .subscribe((res) => {
        console.log(res);
        this.snackBar.open('Добавлен в таблицу', '', { duration: 10000 })
      }, error => {
        console.log(error);
        this.snackBar.open("Ошибка", '', { duration: 10000 })
      })
  }

  sendButton() {
    this.authService.sendSms(this.smsBody)
      .subscribe(res => {
        console.log(res);
        this.snackBar.open('Сообщения отправлено', '', { duration: 10000 })
        this.router.navigate(['/senderHome'])
      }, error => {
        console.log(error);
        this.snackBar.open("Ошибка", '', { duration: 10000 })
      })
  }

  onSubmitButtonProblem(smsType: string) {
    this.requestType = smsType

    const dialogRef = this.dialog.open(areYouSure);

    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {

        if (this.newForm == false && this.asNew == false) {
          this.tableSendBody()

          this.authService.updateSms(this.route.snapshot.params.id, this.tableBody)
            .subscribe((result: any) => {
              this.snackBar.open('Обновлено', '', { duration: 10000 })
              this.smsSendBody(result.id)
              this.sendButton()
            }, error => {
              this.snackBar.open('Ошибка при обновлении', '', { duration: 10000 })
            })
        } else {
          this.tableSendBody()

          this.authService.postData(this.tableBody)
            .subscribe((res) => {
              this.snackBar.open('Добавлен в таблицу', '', { duration: 10000 })
              this.smsSendBody(res.id)
              this.sendButton()
            }, error => {
              console.log(error);
              this.snackBar.open("Ошибка", '', { duration: 10000 })
            })
        }
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