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

@Component({
  selector: 'app-mass-power',
  templateUrl: './mass-power.component.html',
  styleUrls: ['./mass-power.component.css'],
})
export class MassPowerComponent implements OnInit {

  massPowerForm: FormGroup
  user: any
  newForm: boolean
  SmsTextBody: any
  time = new Date()
  requestType: any
  tableBody: any
  smsBody: any
  word: string = ' Узловой сайт '
  idAlarmReport: any
  filteredOptionsReason: Observable<string[]>;

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

  district: { value: string; viewValue: string }[] = [
    { value: 'Аккурган', viewValue: 'Аккурган' },
    { value: 'Ахангаран', viewValue: 'Ахангаран' },
    { value: 'Бекабад', viewValue: 'Бекабад' },
    { value: 'Бустонлик', viewValue: 'Бустонлик' },
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
    { value: 'Алмалык', viewValue: 'Алмалык' },
    { value: 'Чирчик', viewValue: 'Чирчик' },
    { value: 'Ангрен', viewValue: 'Ангрен' },
    { value: 'Нурафшон', viewValue: 'Нурафшон' },
    { value: 'Чимбай', viewValue: 'Чимбай' },

  ]

  dist = {
    'Аккурган': 'Аккурганском районе',
    'Ахангаран': 'Ахангаранском районе',
    'Бекабад': 'Бекабадском районе',
    'Бустонлик': 'Бустанликском районе',
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
    'Алмалык': 'Алмалыкском районе',
    'Чирчик': 'город Чирчик',
    'Ангрен': 'Ангренском районе',
    'Нурафшон': 'город Нурафшон',
    'Чимбай': 'Чимбайском районе',
    '': ''
  }

  optionsReason: string[] = [
    'Нет питания ',
    'Проблема',
    'Выясняется',
    'В связи с плановыми работами',
    'Нет питания. Узловой сайт',
    'Нет питания. FG не завёлся. Узловой сайт',
  ];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog) {
    this.massPowerForm = this.formBuilder.group({
      'AddOrCor': [null],
      'level': ['', Validators.required],
      'categories_report': ['', Validators.required],
      'responsible_report': ['', Validators.required],
      'problem': [' 2G,  3G,  4G сайтов', Validators.required],
      'reason': ['', Validators.required],
      'startTime': ['', Validators.required],
      'region': ['', Validators.required],
      'district' : ['', Validators.required]
    })

    this.filteredOptionsReason = this.massPowerForm.controls.reason.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.optionsReason))
    )

  }

  private _filter(value: string, options: string[]): string[] {
    const filterValue = value.toLocaleLowerCase()
    return options.filter(option => option.toLocaleLowerCase().includes(filterValue))
  }

  setDefault() {
    if (this.massPowerForm.value.level == 'P1' || this.massPowerForm.value.level == 'P2' ||
      this.massPowerForm.value.level == 'P3' || this.massPowerForm.value.level == 'P4' || this.massPowerForm.value.level == 'P5') {
      this.massPowerForm.value.categories_report = 'ПР'
    }
  }

  private extractNumbersFromString(input: string): number[] {
    const numberMatches: RegExpMatchArray | null = input.match(/\d+/g)

    if (numberMatches) {
      return numberMatches.map(Number);
    } else {
      return []
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

  findAndDisplayMax() {

    const numbers: number[] = this.extractNumbersFromString(this.massPowerForm.value.problem)

    if (numbers.length > 0) {
      const maxNumber: number = Math.max(...numbers)
      console.log('Maks Номера ', maxNumber);
      if (this.massPowerForm.value.region == 'г.Ташкент' || this.massPowerForm.value.region == 'Ташкент.обл') {
        if (this.massPowerForm.value.categories_report == 'ПР') {
          if (maxNumber >= 4 && maxNumber <= 19) {
            this.massPowerForm.value.level = 'P4'
          } else if (maxNumber >= 20 && maxNumber <= 49) {
            console.log('A3');
            this.massPowerForm.value.level = 'P3'
          } else if (maxNumber >= 50) {
            console.log('A2');
            this.massPowerForm.value.level = 'P2'
          }
        } else {
          if (maxNumber >= 4 && maxNumber <= 19) {
            console.log('A4');
            this.massPowerForm.value.level = 'A4'
          } else if (maxNumber >= 20 && maxNumber <= 49) {
            console.log('A3');
            this.massPowerForm.value.level = 'A3'
          } else if (maxNumber >= 50) {
            console.log('A2');
            this.massPowerForm.value.level = 'A2'
          }
        }
      } else {
        if (this.massPowerForm.value.categories_report == 'ПР') {
          if (maxNumber > 2 && maxNumber < 10) {
            console.log('З4');
            this.massPowerForm.value.level = 'P4'
          } else if (maxNumber >= 10 && maxNumber < 30) {
            console.log('A3');
            this.massPowerForm.value.level = 'P3'
          } else if (maxNumber >= 30) {
            console.log('A2');
            this.massPowerForm.value.level = 'P2'
          }
        } else {
          if (maxNumber > 2 && maxNumber < 10) {
            console.log('A4');
            this.massPowerForm.value.level = 'A4'
          } else if (maxNumber >= 10 && maxNumber < 30) {
            console.log('A3');
            this.massPowerForm.value.level = 'A3'
          } else if (maxNumber >= 30) {
            console.log('A2');
            this.massPowerForm.value.level = 'A2'
          }
        }
      }

    } else {
      console.log('non number detexted');

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
      let district: any


      this.authService.getSms(this.route.snapshot.params.id)
        .subscribe(result => {
          if (result['district'] == null || result['district'] == undefined) {
            district = ''
          } else {
            district = result['district']
          }

          this.massPowerForm = this.formBuilder.group({
            'AddOrCor': [null],
            'level': [result['level'], Validators.required],
            'categories_report': [result['category'], Validators.required],
            'responsible_report': [result['responsible_area'], Validators.required],
            'problem': [result['hub_problem'], Validators.required],
            'reason': [result['hub_reason'], Validators.required],
            'startTime': [formatDate(result['start_time'], 'yyyy-MM-ddTHH:mm', 'en'), Validators.required],
            'region': [result['region'], Validators.required],
          })

        })
    }
  }

  tableSendBody() {

    this.tableBody = {
      'type': 'HUB',
      'level': this.massPowerForm.value.level,
      'category': this.massPowerForm.value.categories_report,
      'responsible_area': this.massPowerForm.value.responsible_report,
      'problem': this.massPowerForm.value.problem ,
      'reason': this.massPowerForm.value.reason ,
      'start_time': this.massPowerForm.value.startTime,
      'end_time': this.massPowerForm.value.startTime,
      'region': this.massPowerForm.value.region,
      'sender': this.user?.username,
    }
  }

  smsSendBody(id?: number) {

    let addWord = this.storageService.additionWord(this.massPowerForm.value.level)


    if (this.massPowerForm.value.AddOrCor == (null || undefined)) {
      this.SmsTextBody =
        this.requestType + this.massPowerForm.value.level.replace('P', 'П') + '\n' +
        this.massPowerForm.value.problem + ' не работают в ' + this.regions[this.massPowerForm.value.region] + ' ' + this.dist[this.massPowerForm.value.district] + '\n' +
        'Причина: ' + this.massPowerForm.value.reason + this.word + this.massPowerForm.value.hubSite + ' ' + this.massPowerForm.value.generator + '\n' +
        'Начало: ' + this.massPowerForm.value.startTime.replace("T", " ") + '\n' +
        'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name + '\n' +
        addWord
    } else {
      this.SmsTextBody =
        this.requestType + this.massPowerForm.value.level.replace('P', 'П') + '\n' +
        '(' + this.massPowerForm.value.AddOrCor + ')\n' +
        this.massPowerForm.value.problem + ' не работают в ' + this.regions[this.massPowerForm.value.region] + ' ' + this.dist[this.massPowerForm.value.district] + '\n' +
        'Причина: ' + this.massPowerForm.value.reason + this.word + this.massPowerForm.value.hubSite + ' ' + this.massPowerForm.value.generator + '\n' +
        'Начало: ' + this.massPowerForm.value.startTime.replace("T", " ") + '\n' +
        'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name + '\n' +
        addWord
    }

    let smsType = this.storageService.SmsType(this.requestType, this.massPowerForm.value.AddOrCor)

    this.smsBody = {
      'source_addr': 'ncc-rn',
      'network': ['RN'],
      'criteria': [this.massPowerForm.value.level.replace('P', 'A')],
      'notification': ['Hub'],
      'sms_text': this.SmsTextBody,
      'region': [this.massPowerForm.value.region],
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
        this.snackBar.open('Ошибка при обновлении', '', { duration: 10000 })
      })
  }

  createData() {


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
        this.router.navigate(['/home'])
      }, error => {
        console.log(error);
        this.snackBar.open("Ошибка", '', { duration: 10000 })
      })
  }

  onSubmitButtonProblem(smsType: string) {
    this.requestType = smsType
    this.smsSendBody()

    const dialogRef = this.dialog.open(areYouSure);

    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {

        if (this.newForm == false) {
          this.tableSendBody()

          this.authService.updateSms(this.route.snapshot.params.id, this.tableBody)
            .subscribe((result) => {
              this.snackBar.open('Обновлено', '', { duration: 10000 })

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

  onSubmitasNew(smsType: string) {
    this.requestType = smsType

    const dialogRef = this.dialog.open(areYouSure);

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.tableSendBody()

        this.authService.postData(this.tableBody)
          .subscribe((result) => {
            this.snackBar.open('Добавлен в таблицу', '', { duration: 10000 })
            this.smsSendBody(result.id)
            this.sendButton()
          }, error => {
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
    console.log(this.smsbody);

  }
}