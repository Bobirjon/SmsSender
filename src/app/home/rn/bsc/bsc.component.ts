import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  preview = false;
  user: any
  newForm: boolean
  criteria_list: any
  criteria: any
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
    { value: 'ПР', viewValue: 'ПР' }
  ];
  categories_report: { value: string; viewValue: string }[] = [
    { value: 'Тех проблема', viewValue: 'Тех проблема' },
    { value: 'ЭС и Клим', viewValue: 'ЭС и Клим' },
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
    private snackBar: MatSnackBar) {
    this.createForm()
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

    if (this.route.snapshot.params.id == null) {
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
            // 'endTime': [formatDate(result['end_time'], 'yyyy-MM-ddTHH:mm', 'en'), Validators.required],
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
      if (this.bscForm.value.categories_report == 'ПР') {
        if (this.bscForm.value.AddOrCor == (undefined || null)) {
          this.SmsTextBody =
            ' ' + this.bscForm.value.level.replace('A', 'П') + ' BSC ' + this.requestType + '\n' +
            ' ' + this.bscForm.value.problem + '\n ' +
            'Причина: ' + this.bscForm.value.reason + '\n ' +
            'Эффект: ' + this.bscForm.value.effect + '\n ' +
            'Начало: ' + this.bscForm.value.startTime.replace("T", " ") + '\n ' +
            'Оповещен: ' + this.bscForm.value.informed + '\n ' +
            'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name
        } else {
          this.SmsTextBody =
            ' ' + this.bscForm.value.level.replace('A', 'П') + ' BSC ' + this.requestType + '\n' +
            ' ' + this.bscForm.value.AddOrCor + '\n ' +
            ' ' + this.bscForm.value.problem + '\n ' +
            'Причина: ' + this.bscForm.value.reason + '\n ' +
            'Эффект: ' + this.bscForm.value.effect + '\n ' +
            'Начало: ' + this.bscForm.value.startTime.replace("T", " ") + '\n ' +
            'Оповещен: ' + this.bscForm.value.informed + '\n ' +
            'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name
        }
      } else {
        if (this.bscForm.value.AddOrCor == (undefined || null)) {
          this.SmsTextBody =
            ' ' + this.bscForm.value.level + ' BSC ' + this.requestType + '\n' +
            ' ' + this.bscForm.value.problem + '\n ' +
            'Причина: ' + this.bscForm.value.reason + '\n ' +
            'Эффект: ' + this.bscForm.value.effect + '\n ' +
            'Начало: ' + this.bscForm.value.startTime.replace("T", " ") + '\n ' +
            'Оповещен: ' + this.bscForm.value.informed + '\n ' +
            'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name
        } else {
          this.SmsTextBody =
            ' ' + this.bscForm.value.level + ' BSC ' + this.requestType + '\n' +
            ' ' + this.bscForm.value.AddOrCor + '\n ' +
            ' ' + this.bscForm.value.problem + '\n ' +
            'Причина: ' + this.bscForm.value.reason + '\n ' +
            'Эффект: ' + this.bscForm.value.effect + '\n ' +
            'Начало: ' + this.bscForm.value.startTime.replace("T", " ") + '\n ' +
            'Оповещен: ' + this.bscForm.value.informed + '\n ' +
            'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name
        }
      }
    } else {
      if (this.bscForm.value.categories_report == 'ПР') {
        if (this.bscForm.value.AddOrCor == (undefined || null)) {
          this.SmsTextBody =
            ' ' + this.bscForm.value.level.replace('A', 'П') + ' BSC ' + this.requestType + '\n' +
            ' ' + this.bscForm.value.problem + '\n ' +
            'Причина: ' + this.bscForm.value.reason + '\n ' +
            'Эффект: ' + this.bscForm.value.effect + '\n ' +
            'Описание: ' + this.bscForm.value.desc + '\n ' +
            'Начало: ' + this.bscForm.value.startTime.replace("T", " ") + '\n ' +
            'Конец: ' + this.bscForm.value.endTime.replace("T", " ") + '\n ' +
            'Оповещен: ' + this.bscForm.value.informed + '\n ' +
            'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name
        } else {
          this.SmsTextBody =
            ' ' + this.bscForm.value.level.replace('A', 'П') + ' BSC ' + this.requestType + '\n' +
            ' (' + this.bscForm.value.AddOrCor + ') ' + '\n' +
            ' ' + this.bscForm.value.problem + '\n ' +
            'Причина: ' + this.bscForm.value.reason + '\n ' +
            'Эффект: ' + this.bscForm.value.effect + '\n ' +
            'Описание: ' + this.bscForm.value.desc + '\n ' +
            'Начало: ' + this.bscForm.value.startTime.replace("T", " ") + '\n ' +
            'Конец: ' + this.bscForm.value.endTime.replace("T", " ") + '\n ' +
            'Оповещен: ' + this.bscForm.value.informed + '\n ' +
            'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name
        }
      } else {
        if (this.bscForm.value.AddOrCor == (null || undefined)) {
          this.SmsTextBody =
            ' ' + this.bscForm.value.level + ' BSC ' + this.requestType + '\n' +
            ' ' + this.bscForm.value.problem + '\n ' +
            'Причина: ' + this.bscForm.value.reason + '\n ' +
            'Эффект: ' + this.bscForm.value.effect + '\n ' +
            'Описание: ' + this.bscForm.value.desc + '\n ' +
            'Начало: ' + this.bscForm.value.startTime.replace("T", " ") + '\n ' +
            'Конец: ' + this.bscForm.value.endTime.replace("T", " ") + '\n ' +
            'Оповещен: ' + this.bscForm.value.informed + '\n ' +
            'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name
        } else {
          this.SmsTextBody =
            ' ' + this.bscForm.value.level + ' BSC ' + this.requestType + '\n' +
            ' (' + this.bscForm.value.AddOrCor + ') ' + '\n' +
            ' ' + this.bscForm.value.problem + '\n ' +
            'Причина: ' + this.bscForm.value.reason + '\n ' +
            'Эффект: ' + this.bscForm.value.effect + '\n ' +
            'Описание: ' + this.bscForm.value.desc + '\n ' +
            'Начало: ' + this.bscForm.value.startTime.replace("T", " ") + '\n ' +
            'Конец: ' + this.bscForm.value.endTime.replace("T", " ") + '\n ' +
            'Оповещен: ' + this.bscForm.value.informed + '\n ' +
            'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name
        }
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
      .subscribe((result) => {
        console.log(result);
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

    this.authService.sendSms(this.smsBody)
      .subscribe(result => {
        console.log(result);
        this.snackBar.open('Success', '', { duration: 10000 })
      }, error => {
        console.log(error);
        this.snackBar.open(error, '', { duration: 10000 })
      })

  }

  forSmsTesting(smsType: string) {
    this.requestType = smsType
    this.smsSendBody()

    this.authService.sendTestSMS(this.smsBody)
      .subscribe(result => {
        console.log(result);
        this.snackBar.open('Success', '', { duration: 10000 })
      }, error => {
        console.log(error);
        this.snackBar.open(error, '', { duration: 10000 })
      })
  }
}