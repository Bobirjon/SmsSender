import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { StorageService } from 'src/app/storage.service';

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

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog) {
    this.createForm()
  }

  setDefault() {
    if (this.bscForm.value.level == 'P1' || this.bscForm.value.level == 'P2' ||
      this.bscForm.value.level == 'P3' || this.bscForm.value.level == 'P4' || this.bscForm.value.level == 'P5') {
      this.bscForm.value.categories_report = 'ПР'
    } else {
      this.bscForm.value.categories_report = ''
    }
  }

  createForm() {
    this.bscForm = this.formBuilder.group({
      'AddOrCor': [null],
      'level': ['', Validators.required],
      'categories_report': ['', Validators.required],
      'responsible_report': ['', Validators.required],
      'problem': ['', Validators.required],
      'reason': ['', Validators.required],
      'effect_option': ['C Влиянием', Validators.required],
      'startTime': ['', Validators.required],
      'endTime': [''],
      'region': ['', Validators.required],
      'effect': ['', Validators.required],
      'informed': ['', Validators.required],
      'desc': ['', Validators.required],
      'sender': [''],
    })
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
            'endTime': [endTimeForUpdate],
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

  smsSendBody() {
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
          'Скачайте приложение Ucell: www.ucell.uz/lead'
      } else {
        this.SmsTextBody =
          this.bscForm.value.level.replace('P', 'П') + ' BSC ' + this.requestType + ':\n' +
          '(' + this.bscForm.value.AddOrCor + ')\n' +
          this.bscForm.value.problem + '\n' +
          'Причина: ' + this.bscForm.value.reason + '\n' +
          'Эффект: ' + this.bscForm.value.effect + '\n' +
          'Начало: ' + this.bscForm.value.startTime.replace("T", " ") + '\n' +
          'Оповещен: ' + this.bscForm.value.informed + '\n' +
          'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name + '\n ' +
          'Скачайте приложение Ucell: www.ucell.uz/lead'
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
          'Скачайте приложение Ucell: www.ucell.uz/lead'
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
          'Скачайте приложение Ucell: www.ucell.uz/lead'
      }
    }

    this.smsBody = {
      'source_addr': 'ncc-rn',
      'network': ['RN'],
      'criteria': [this.bscForm.value.level],
      'notification': ['BSC/RNC'],
      'sms_text': this.SmsTextBody
    }

    if (this.bscForm.value.region != (null || undefined)) {
      this.smsBody.region = [this.bscForm.value.region]
    }
  }

  updateData() {
    this.tableSendBody()

    this.authService.updateSms(this.route.snapshot.params.id, this.tableBody)
      .subscribe((res) => {
        console.log(res);
      })
  }

  createData() {
    this.tableSendBody()

    this.authService.postData(this.tableBody)
      .subscribe((res) => {
        console.log(res);
      })
  }

  onSubmitButtonProblem(smsType: string) {
    if (this.newForm == false) {
      this.updateData()
    } else {
      this.createData()
    }

    this.requestType = smsType
    this.smsSendBody()

    const dialogRef = this.dialog.open(areYouSure);

    dialogRef.afterClosed().subscribe(result => {
      this.authService.sendSms(this.smsBody)
        .subscribe(res => {
          console.log(res);
          this.snackBar.open('Сообщения отправлено', '', { duration: 10000 })
        }, error => {
          console.log(error);
          this.snackBar.open("Ошибка", '', { duration: 10000 })
        })
    })
  }

  forSmsTesting(smsType: string) {
    this.requestType = smsType
    this.smsSendBody()

    const dialogRef = this.dialog.open(areYouSure);

    dialogRef.afterClosed().subscribe(result => {
      this.authService.sendTestSMS(this.smsBody)
        .subscribe(res => {
          console.log(res);
          this.snackBar.open('Success', '', { duration: 10000 })
        }, error => {
          console.log(error);
          this.snackBar.open("Error", '', { duration: 10000 })
        })
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