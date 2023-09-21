import { NgIf, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { StorageService } from 'src/app/storage.service';
import { WebSocketService } from 'src/web-socket.service';

@Component({
  selector: 'app-cn',
  templateUrl: './cn.component.html',
  styleUrls: ['./cn.component.css']
})
export class CnComponent implements OnInit {

  cnForm: FormGroup
  preview = false
  user: any
  newForm: boolean
  criteria_list: any
  criteria: any
  SmsTextBody: any
  time = new Date()
  requestType: any
  tableBody: any
  smsBody: any
  criteriaArray: any

  level: { value: string; viewValue: string }[] = [
    { value: 'A1', viewValue: 'A1' },
    { value: 'A2', viewValue: 'A2' },
    { value: 'A3', viewValue: 'A3' },
    { value: 'A4', viewValue: 'A4' },
    { value: 'A5', viewValue: 'A5' },
  ];
  categories_report: { value: string; viewValue: string }[] = [
    { value: 'Тех проблема', viewValue: 'Тех проблема' },
    { value: 'ЭС и Клим', viewValue: 'ЭС и Клим' },
    { value: 'Провайдер', viewValue: 'Провайдер' },
    { value: 'ПР', viewValue: 'ПР' },
    { value: 'Выясняется', viewValue: 'Выясняется' },
  ];
  category: { value: string; viewValue: string }[] = [
    { value: 'Core', viewValue: 'Core' },
    { value: 'GPRS', viewValue: 'GPRS' },
    { value: 'Roaming', viewValue: 'Roaming' },
    { value: 'Power', viewValue: 'Power' },
    { value: 'High Temp', viewValue: 'High Temp' },
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
    private snackBar: MatSnackBar,) {
    this.createForm()
  }

  createForm() {
    this.cnForm = this.formBuilder.group({
      'AddOrCor': [null],
      'level': ['', Validators.required],
      'categories_report': ['', Validators.required],
      'responsible_report': ['', Validators.required],
      'problem': ['', Validators.required],
      'reason': ['', Validators.required],
      'startTime': ['', Validators.required],
      'endTime': [''],
      'region': [''],
      'effect': ['', Validators.required],
      'effect_option': ['', Validators.required],
      'category': ['', Validators.required],
      'informed': ['', Validators.required],
      'desc': [''],
      'sender': ['']
    })
  }

  ngOnInit(): void {
    // get Current user
    this.authService.getUser()
      .subscribe(result => {
        this.user = result
      })
    //is it new request or update mode
    if (this.route.snapshot.params.id == null) {
      this.newForm = true
    } else {
      let isDisabled: any
      let endTimeForUpdate: any
      this.newForm = false
      this.isNewForm(this.newForm)

      this.authService.getSms(this.route.snapshot.params.id)
        .subscribe(result => {
          if (result['category_for_core'] == 'Core' || result['category_for_core'] == 'Roaming' || result['category_for_core'] == 'GPRS') {
            isDisabled = true
          } else {
            isDisabled = false
          }
          if (result['end_time'] == null) {
            endTimeForUpdate = (result['end_time'], 'yyyy-MM-ddTHH:mm', '')
          } else {
            endTimeForUpdate = formatDate(result['end_time'], 'yyyy-MM-ddTHH:mm', 'en')
          }
          this.cnForm = this.formBuilder.group({
            'AddOrCor': [null],
            'level': [result['level'], Validators.required],
            'categories_report': [result['category'], Validators.required],
            'responsible_report': [result['responsible_area'], Validators.required],
            'problem': [result['problem'], Validators.required],
            'reason': [result['reason'], Validators.required],
            'effect_option': [result['effect'], Validators.required],
            'startTime': [formatDate(result['start_time'], 'yyyy-MM-ddTHH:mm', 'en'), Validators.required],
            // 'endTime': [(result['end_time'], 'yyyy-MM-ddTHH:mm', '')],
            'endTime': [endTimeForUpdate],
            'region': [{ value: result['region'], disabled: isDisabled }, Validators.required],
            'effect': [result['influence']],
            'category': [result['category_for_core']],
            'informed': [result['informed']],
            'desc': [result['description']],
            'sender': [result['sender']]
          })
        })

    }
  }

  isNewForm(isNew: boolean) {
    this.newForm = isNew
    return this.newForm
  }

  tableSendBody() {
    this.tableBody = {
      'type': 'CORE',
      'level': this.cnForm.value.level,
      'category': this.cnForm.value.categories_report,
      'responsible_area': this.cnForm.value.responsible_report,
      'problem': this.cnForm.value.problem,
      'reason': this.cnForm.value.reason,
      'effect': this.cnForm.value.effect_option,
      'start_time': this.cnForm.value.startTime,
      // 'end_time': this.cnForm.value.endTime,
      // 'region': this.cnForm.value.region,
      'category_for_core': this.cnForm.value.category,
      'description': this.cnForm.value.desc,
      'informed': this.cnForm.value.informed,
      'influence': this.cnForm.value.effect,
      'sender': this.user?.first_name + ' ' + this.user?.last_name
    }

    if (this.cnForm.value.category == ('Power') || this.cnForm.value.category == ('High Temp')) {
      this.tableBody.region = this.cnForm.value.region
    } else {
      this.tableBody.region = ''
    }
    if (this.cnForm.value.endTime !== '') {
      this.tableBody.end_time = this.cnForm.value.endTime
    }
  }

  updateData() {

    this.tableSendBody()

    this.authService.updateSms(this.route.snapshot.params.id, this.tableBody)
      .subscribe((result) => {
        console.log(result);
        this.snackBar.open('Updated', '', { duration: 10000 })
      }, error => {
        console.log(error);

      })
  }

  smsSendBody() {

    if (this.requestType == 'Problem') {
      if (this.cnForm.value.categories_report == 'ПР') {
        if (this.cnForm.value.AddOrCor == (undefined || null)) {
          this.SmsTextBody =
            ' ' + this.cnForm.value.level.replace('A', 'П') + ' Проблема: ' + '\n' +
            ' ' + this.cnForm.value.problem + '\n ' +
            'Причина: ' + this.cnForm.value.reason + '\n ' +
            'Эффект: ' + this.cnForm.value.effect + '\n ' +
            'Оповещен: ' + this.cnForm.value.informed + '\n ' +
            'Начало: ' + this.cnForm.value.startTime.replace("T", " ") + '\n ' +
            'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name
        } else {
          this.SmsTextBody =
            ' ' + this.cnForm.value.level.replace('A', 'П') + ' Проблема: ' + '\n' +
            ' (' + this.cnForm.value.AddOrCor + ') ' + '\n' +
            ' ' + this.cnForm.value.problem + '\n ' +
            'Причина: ' + this.cnForm.value.reason + '\n ' +
            'Эффект: ' + this.cnForm.value.effect + '\n ' +
            'Оповещен: ' + this.cnForm.value.informed + '\n ' +
            'Начало: ' + this.cnForm.value.startTime.replace("T", " ") + '\n ' +
            'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name
        }
      } else {
        if (this.cnForm.value.AddOrCor == (undefined || null)) {
          this.SmsTextBody =
            ' ' + this.cnForm.value.level + ' Проблема: ' + '\n' +
            ' ' + this.cnForm.value.problem + '\n ' +
            'Причина: ' + this.cnForm.value.reason + '\n ' +
            'Эффект: ' + this.cnForm.value.effect + '\n ' +
            'Оповещен: ' + this.cnForm.value.informed + '\n ' +
            'Начало: ' + this.cnForm.value.startTime.replace("T", " ") + '\n ' +
            'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name
        } else {
          this.SmsTextBody =
            ' ' + this.cnForm.value.level + ' Проблема: ' + '\n' +
            ' (' + this.cnForm.value.AddOrCor + ') ' + '\n' +
            ' ' + this.cnForm.value.problem + '\n ' +
            'Причина: ' + this.cnForm.value.reason + '\n ' +
            'Эффект: ' + this.cnForm.value.effect + '\n ' +
            'Оповещен: ' + this.cnForm.value.informed + '\n ' +
            'Начало: ' + this.cnForm.value.startTime.replace("T", " ") + '\n ' +
            'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name
        }
      }
    } else {
      if (this.cnForm.value.categories_report == 'ПР') {
        if (this.cnForm.value.AddOrCor == (undefined || null)) {
          this.SmsTextBody =
            ' ' + this.cnForm.value.level.replace('A', 'П') + ' ' + this.requestType + ": " + '\n' +
            ' ' + this.cnForm.value.problem + '\n ' +
            'Причина: ' + this.cnForm.value.reason + '\n ' +
            'Эффект: ' + this.cnForm.value.effect + '\n ' +
            'Описание: ' + this.cnForm.value.desc + '\n ' +
            'Начало: ' + this.cnForm.value.startTime.replace("T", " ") + '\n ' +
            'Конец: ' + this.cnForm.value.endTime.replace("T", " ") + '\n ' +
            'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name
        } else {
          this.SmsTextBody =
            ' ' + this.cnForm.value.level.replace('A', 'П') + ' ' + this.requestType + '\n' +
            ' (' + this.cnForm.value.AddOrCor + ') ' + '\n' +
            ' ' + this.cnForm.value.problem + '\n ' +
            'Причина: ' + this.cnForm.value.reason + '\n ' +
            'Эффект: ' + this.cnForm.value.effect + '\n ' +
            'Описание: ' + this.cnForm.value.desc + '\n ' +
            'Начало: ' + this.cnForm.value.startTime.replace("T", " ") + '\n ' +
            'Конец: ' + this.cnForm.value.endTime.replace("T", " ") + '\n ' +
            'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name
        }
      } else {
        if (this.cnForm.value.AddOrCor == (null || undefined)) {
          this.SmsTextBody =
            ' ' + this.cnForm.value.level + ' ' + this.requestType + '\n' +
            ' ' + this.cnForm.value.problem + '\n ' +
            'Причина: ' + this.cnForm.value.reason + '\n ' +
            'Эффект: ' + this.cnForm.value.effect + '\n ' +
            'Описание: ' + this.cnForm.value.desc + '\n ' +
            'Начало: ' + this.cnForm.value.startTime.replace("T", " ") + '\n ' +
            'Конец: ' + this.cnForm.value.endTime.replace("T", " ") + '\n ' +
            'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name
        } else {
          this.SmsTextBody =
            ' ' + this.cnForm.value.level + ' ' + this.requestType + '\n' +
            ' (' + this.cnForm.value.AddOrCor + ') ' + '\n' +
            ' ' + this.cnForm.value.problem + '\n ' +
            'Причина: ' + this.cnForm.value.reason + '\n ' +
            'Эффект: ' + this.cnForm.value.effect + '\n ' +
            'Описание: ' + this.cnForm.value.desc + '\n ' +
            'Начало: ' + this.cnForm.value.startTime.replace("T", " ") + '\n ' +
            'Конец: ' + this.cnForm.value.endTime.replace("T", " ") + '\n ' +
            'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name
        }
      }
    }

    this.smsBody = {
      'source_addr': 'ncc-cn',
      'network': ['CN'],
      'criteria': [this.cnForm.value.level],
      'sms_text': this.SmsTextBody
      // 'region'
      // 'notification'
    }

    if (this.cnForm.value.category == ('Power') || this.cnForm.value.category == ('High Temp')) {
      this.smsBody.notification = ['Power/HighTemp']
      this.smsBody.region = [this.cnForm.value.region]
    }
    else {
      this.smsBody.notification = [this.cnForm.value.category]
    }

    // if(this.cnForm.value.region != '') {
    //   console.log('region not empty');

    //   this.smsBody.region = [this.cnForm.value.region]
    // } else if (this.cnForm.value.region == undefined) {
    //   console.log('region not undefined');
    // } else if (this.cnForm.value.region == null) {
    //   console.log('region not null');
    // }


  }

  onSubmit() {

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
      this.onSubmit()
    }

    this.requestType = smsType
    this.smsSendBody()

    this.authService.sendSms(this.smsBody)
      .subscribe(res => {
        console.log(res);
        this.snackBar.open('Success', '', { duration: 10000 })
      }, error => {
        console.log(error);
        this.snackBar.open(error, '', { duration: 10000 })
      })
  }


  forTestSms(smsType: string) {
    this.requestType = smsType
    this.smsSendBody()

    this.authService.sendTestSMS(this.smsBody)
      .subscribe(res => {
        console.log(res);
        this.snackBar.open('Success', '', { duration: 10000 })
      }, error => {
        console.log(error);
        this.snackBar.open(error, '', { duration: 10000 })
      })
  }
}
