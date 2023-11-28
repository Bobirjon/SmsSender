import { formatDate } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, NgForm } from '@angular/forms';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { StorageService } from 'src/app/storage.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-chronic',
  templateUrl: './chronic.component.html',
  styleUrls: ['./chronic.component.css']
})

export class ChronicComponent implements OnInit {

  chronicForm: FormGroup
  preview = false
  previewResheniya = false
  user: any
  newForm: boolean
  criteria_list: any
  criteria: any
  SmsTextBody: any
  time = new Date()
  requestType: any
  tableBody: any
  smsBody: any
  word: string = ' Узловой сайт '
  idAlarmReport: any
  filteredOptionsReason: Observable<string[]>;

  level: { value: string; viewValue: string }[] = [
    { value: 'A5', viewValue: 'A5' },
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
    { value: 'TI_SAQ', viewValue: 'TI_SAQ' },
    { value: 'TI_FLM', viewValue: 'TI_FLM' },
    { value: 'TI_SDH', viewValue: 'TI_SDH' },
    { value: 'Unplanned work', viewValue: 'Unplanned work' },
    { value: 'WB', viewValue: 'WB' },
    { value: 'Выясняется', viewValue: 'Выясняется ' },
  ];
  region: { value: string; viewValue: string }[] = [
    { value: 'Андижан', viewValue: 'Андижане' },
    { value: 'Бухара', viewValue: 'Бухаре' },
    { value: 'Джизак', viewValue: 'Джизаке' },
    { value: 'Фергана', viewValue: 'Фергане' },
    { value: 'Сырдарья', viewValue: 'Сырдарье' },
    { value: 'Кашкадарья', viewValue: 'Кашкадарье' },
    { value: 'Наманган', viewValue: 'Намангане' },
    { value: 'Навои', viewValue: 'Навои' },
    { value: 'Каракалпакстан', viewValue: 'Каракалпакстане' },
    { value: 'Самарканд', viewValue: 'Самарканде' },
    { value: 'г.Ташкент', viewValue: 'г.Ташкенте' },
    { value: 'Ташкент.обл', viewValue: 'Ташкентской области' },
    { value: 'Сурхандарья', viewValue: 'Сурхандарье' },
    { value: 'Хорезм', viewValue: 'Хорезме' },
  ];

  regions = {
    'Андижан': 'Андижане',
    'Бухара': 'Бухаре',
    'Джизак': 'Джизаке',
    'Фергана': 'Фергане',
    'Сырдарья': 'Сырдарье',
    'Кашкадарья': 'Кашкадарье',
    'Наманган': 'Намангане',
    'Навои': 'Навои',
    'Каракалпакстан': 'Каракалпакстане',
    'Самарканд': 'Самарканде',
    'г.Ташкент': 'г.Ташкент',
    'Ташкент.обл': 'Ташкентской области',
    'Сурхандарья': 'Сурхандарье',
    'Хорезм': 'Хорезме',
    '': ''
  }

  chronicHours: number[] = [12, 24, 36, 48]

  district: { value: string; viewValue: string }[] = [
    { value: 'Аккурган', viewValue: 'Аккурган' },
    { value: 'Ахангаран', viewValue: 'Ахангаран' },
    { value: 'Бекабад', viewValue: 'Бекабад' },
    { value: 'Бустанлик', viewValue: 'Бустанлик' },
    { value: 'Бука', viewValue: 'Бука' },
    { value: 'Зангиота', viewValue: 'Зангиота' },
    { value: 'Кибрай', viewValue: 'Кибрай' },
    { value: 'Куйичирчик', viewValue: 'Куйичирчик' },
    { value: 'Паркент', viewValue: 'Паркент' },
    { value: 'Пскент', viewValue: 'Пскент' },
    { value: 'Ташкент', viewValue: 'Ташкент' },
    { value: 'Уртачирчик', viewValue: 'Уртачирчик' },
    { value: 'Чиназ', viewValue: 'Чиназ' },
    { value: 'Юкоричирчик', viewValue: 'Юкоричирчик' },
    { value: 'Янгиюль', viewValue: 'Янгиюль' },
    { value: 'Алмалик', viewValue: 'Алмалик' },
    { value: 'Чирчик', viewValue: 'Чирчик' },
    { value: 'Ангрен', viewValue: 'Ангрен' },
    { value: 'Нурафшон', viewValue: 'Нурафшон' },
    { value: 'Чимбай', viewValue: 'Чимбай' },
    { value: '', viewValue: '' }

  ]

  dist = {
    'Аккурган': 'Аккурганском районе',
    'Ахангаран': 'Ахангаранском районе',
    'Бекабад': 'Бекабадском районе',
    'Бустанлик': 'Бустанликском районе',
    'Бука': 'Букинском районе',
    'Зангиота': 'Зангиотинском районе',
    'Кибрай': 'Кибрайском районе',
    'Куйичирчик': 'Куйичирчикском районе',
    'Паркент': 'Паркентском районе',
    'Пскент': 'Пскентском районе',
    'Ташкент': 'Ташкентском районе',
    'Уртачирчик': 'Уртачирчикском районе',
    'Чиназ': 'Чиназском районе',
    'Юкоричирчик': 'Юкоричирчикском районе',
    'Янгиюль': 'Янгиюльском районе',
    'Алмалик': 'Алмаликском районе',
    'Чирчик': 'город Чирчик',
    'Ангрен': 'Ангренском районе',
    'Нурафшон': 'город Нурафшон',
    'Чимбай': 'Чимбайском районе',
    '': ''
  }

  optionsReason: string[] = [
    'Выясняется ',
    'В связи с плановыми работами',
    'Проблема',
    'Нет питание',
    'Арендодатель отключил питание',
  ];


  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog) {
  
        this.chronicForm = this.formBuilder.group({
          'AddOrCor': [null],
          'level': ['', Validators.required],
          'categories_report': ['', Validators.required],
          'responsible_report': ['', Validators.required],
          'reason': ['', Validators.required],
          'startTime': ['', Validators.required],
          'endTime': [''],
          'region': ['', Validators.required],
          'siteName': [''],
          'time': [''],
          'hubSite': [''],
          'informed': [''],
          'desc': [''],
          'category': [''],
          'sender': [''],
          'district': ['']
        })

    this.filteredOptionsReason = this.chronicForm.controls.reason.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.optionsReason))
    )
  }

  private _filter(value: string, options: string[]): string[] {
    const filterValue = value.toLocaleLowerCase()
    return options.filter(option => option.toLocaleLowerCase().includes(filterValue))
  }

  
  setDefault() {
    if (this.chronicForm.value.level == 'P1' || this.chronicForm.value.level == 'P2' ||
      this.chronicForm.value.level == 'P3' || this.chronicForm.value.level == 'P4' || this.chronicForm.value.level == 'P5') {
      this.chronicForm.value.categories_report = 'ПР'
    }
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
      let district: any
      this.authService.getSms(this.route.snapshot.params.id)
        .subscribe(result => {

          if (result['end_time'] == null) {
            endTimeForUpdate = (result['end_time'], 'yyyy-MM-ddTHH:mm', '')
          } else {
            endTimeForUpdate = formatDate(result['end_time'], 'yyyy-MM-ddTHH:mm', 'en')
          }
          if (result['district'] == null || result['district'] == undefined) {
            district = ''
          } else {
            district = result['district']
          }
          this.chronicForm = this.formBuilder.group({
            'AddOrCor': [null],
            'level': [result['level'], Validators.required],
            'categories_report': [result['category'], Validators.required],
            'responsible_report': [result['responsible_area'], Validators.required],
            'problem': [result['problem'], Validators.required],
            'reason': [result['hub_reason'], Validators.required],
            'startTime': [formatDate(result['start_time'], 'yyyy-MM-ddTHH:mm', 'en'), Validators.required],
            'endTime': [endTimeForUpdate],
            'region': [result['region'], Validators.required],
            'siteName': [result['chronic_site']],
            'district': [district],
            'time': [result['chronic_hours']],
            'hubSite': [result['hub_site']],
            'informed': [result['informed']],
            'desc': [result['description']],
            'category': [result['category_for_hub']],
            'sender': [result['sender']]
          })
        })
    }
  }

  tableSendBody() {
    this.tableBody = {
      'type': 'CHRONIC',
      'level': this.chronicForm.value.level,
      'category': this.chronicForm.value.categories_report,
      'responsible_area': this.chronicForm.value.responsible_report,
      'problem': this.chronicForm.value.siteName + ' - сайт не работает в ' + this.regions[this.chronicForm.value.region] + ' ' + this.dist[this.chronicForm.value.district] +
        ' более ' + this.chronicForm.value.time + '  часов с  ' + this.chronicForm.value.startTime.replace("T", " "),

      'reason': this.chronicForm.value.reason + ' ' + this.chronicForm.value.hubSite,
      'hub_reason': this.chronicForm.value.reason,
      'effect': 'С влиянием',
      'start_time': this.chronicForm.value.startTime,
      // 'end_time': this.chronicForm.value.endTime,
      'region': this.chronicForm.value.region,
      'district': this.chronicForm.value.district,
      'chronic_hours': this.chronicForm.value.time,
      'hub_site': this.chronicForm.value.hubSite,
      'chronic_site': this.chronicForm.value.siteName,
      'category_for_hub': this.chronicForm.value.category,
      'description': this.chronicForm.value.desc,
      'informed': this.chronicForm.value.informed,
      'influence': this.chronicForm.value.effect,
      'sender': this.user?.username
    }

    if (this.chronicForm.value.endTime !== '') {
      this.tableBody.end_time = this.chronicForm.value.endTime
    }

    if ((this.chronicForm.value.hubSite == '') || (this.chronicForm.value.hubSite == undefined)) {
      this.word = ' '
    } else {
      this.word = ' Узловой сайт '
    }
  }

  smsSendBody(id?: number) {
    let addWord = this.storageService.additionWord(this.chronicForm.value.level)

    if ((this.chronicForm.value.hubSite == '') || (this.chronicForm.value.hubSite == undefined)) {
      this.word = ' '
    } else {
      this.word = ' Узловой сайт '
    }


    if (this.requestType == 'Проблема') {
      if (this.chronicForm.value.AddOrCor == (undefined || null)) {
        this.SmsTextBody =
          this.chronicForm.value.level.replace('P', 'П') + ' ' + ' Хронический сайт Проблема: \n' +
          this.chronicForm.value.siteName + ' - сайт не работает в ' + this.regions[this.chronicForm.value.region] + ' ' +
          this.dist[this.chronicForm.value.district] + ' более ' + this.chronicForm.value.time + '  часов с  ' + this.chronicForm.value.startTime.replace("T", " ") + '\n' +
          'Причина: ' + this.chronicForm.value.reason + this.word + this.chronicForm.value.hubSite + '\n' +
          'Оповещен: ' + this.chronicForm.value.informed + '\n' +
          'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name + '\n' + 
          addWord
      } else {
        this.SmsTextBody =
          this.chronicForm.value.level.replace('P', 'П') + ' ' + ' Хронический сайт Проблема: \n' +
          '(' + this.chronicForm.value.AddOrCor + ') \n' +
          this.chronicForm.value.siteName + ' - сайт не работает в ' + this.regions[this.chronicForm.value.region] + ' ' +
          this.dist[this.chronicForm.value.district] + ' более ' + this.chronicForm.value.time + '  часов с  ' + this.chronicForm.value.startTime.replace("T", " ") + '\n' +
          'Причина: ' + this.chronicForm.value.reason + this.word + this.chronicForm.value.hubSite + '\n' +
          'Оповещен: ' + this.chronicForm.value.informed + '\n' +
          'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name + '\n' + 
          addWord
      }
    }
    else {
      if (this.chronicForm.value.AddOrCor == (null || undefined)) {
        this.SmsTextBody =
          this.chronicForm.value.level.replace('P', 'П') + ' Хронический сайт ' + this.requestType + '\n' +
          this.chronicForm.value.siteName + ' - сайт не работал в ' + this.regions[this.chronicForm.value.region] + ' ' +
          this.dist[this.chronicForm.value.district] + ' с ' + this.chronicForm.value.startTime.replace("T", " ") +
          ' по ' + this.chronicForm.value.endTime.replace("T", " ") + '\n' +
          'Причина: ' + this.chronicForm.value.reason + this.word + this.chronicForm.value.hubSite + '\n' +
          'Описание: ' + this.chronicForm.value.desc + ' \n' +
          'Оповещен: ' + this.chronicForm.value.informed + '\n' +
          'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name + '\n' + 
          addWord
      } else {
        this.SmsTextBody =
          this.chronicForm.value.level.replace('P', 'П') + ' Хронический сайт ' + this.requestType + '\n' +
          '(' + this.chronicForm.value.AddOrCor + ') \n' +
          this.chronicForm.value.siteName + ' - сайт не работал в ' + this.regions[this.chronicForm.value.region] + ' ' +
          this.dist[this.chronicForm.value.district] + ' с  ' + this.chronicForm.value.startTime.replace("T", " ") +
          ' по ' + this.chronicForm.value.endTime.replace("T", " ") + '\n' +
          'Причина: ' + this.chronicForm.value.reason + this.word + this.chronicForm.value.hubSite + '\n' +
          'Описание: ' + this.chronicForm.value.desc + ' \n' +
          'Оповещен: ' + this.chronicForm.value.informed + '\n' +
          'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name + '\n' + 
          addWord
      }
    }

    this.smsBody = {
      'source_addr': 'ncc-rn',
      'network': ['RN'],
      'criteria': [this.chronicForm.value.level.replace('P', 'A')],
      'notification': ['Chronic'],
      'sms_text': this.SmsTextBody,
      'region': [this.chronicForm.value.region],
      'alarmreport_id': id
    }
  }

  updateData() {
    this.tableSendBody()

    this.storageService.updateData(this.route.snapshot.params.id, this.tableBody)
    // this.authService.updateSms(this.route.snapshot.params.id, this.tableBody)
    //   .subscribe((result) => {
    //     console.log(result);
    //     this.snackBar.open('Обновлено', '', { duration: 10000 })
    //   }, error => {
    //     this.snackBar.open('Ошибка при обновлении', '', { duration: 10000 })
    //   })
  }

  createData() {
    this.tableSendBody()

    this.storageService.createToTable(this.tableBody)
    // this.authService.postData(this.tableBody)
    //   .subscribe((res) => {
    //     console.log(res);
    //     this.snackBar.open('Добавлен в таблицу', '', { duration: 10000 })
    //   }, error => {
    //     console.log(error);
    //     this.snackBar.open("Ошибка", '', { duration: 10000 })
    //   })
  }

  sendButton() {
    this.storageService.sendSms(this.smsBody)

    // this.authService.sendSms(this.smsBody)
    //       .subscribe(res => {
    //         console.log(res);
    //         this.snackBar.open('Сообщения отправлено', '', { duration: 10000 })
    //         this.router.navigate(['/home'])
    //       }, error => {
    //         console.log(error);
    //         this.snackBar.open("Ошибка", '', { duration: 10000 })
    //       })
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
              console.log(result);
              this.idAlarmReport = result
              console.log(this.idAlarmReport.id);

              this.snackBar.open('Обновлено', '', { duration: 10000 })
              this.smsSendBody(this.idAlarmReport.id)
              this.sendButton()
              console.log('ok workung id is', this.idAlarmReport.id);
            }, error => {
              this.snackBar.open('Ошибка при обновлении', '', { duration: 10000 })
            })
        } else {
          this.tableSendBody()

          this.authService.postData(this.tableBody)
            .subscribe((res) => {
              console.log(result);
              this.snackBar.open('Добавлен в таблицу', '', { duration: 10000 })
              this.smsSendBody(result.id)
              this.sendButton()
              console.log('ok workung id is', result.id)
            }, error => {
              console.log(error);
              this.snackBar.open("Ошибка", '', { duration: 10000 })
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
            this.snackBar.open("Ошибка", '', { duration: 10000 })
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