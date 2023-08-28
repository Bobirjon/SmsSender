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
    { value: 'A2', viewValue: 'A2' },
    { value: 'A3', viewValue: 'A3' },
    { value: 'A4', viewValue: 'A4' },
    { value: 'A5', viewValue: 'A5' },
  ];
  categories_report: { value: string; viewValue: string }[] = [
    { value: 'Тех проблема', viewValue: 'Тех проблема' },
    { value: 'ЭС и Клим', viewValue: 'ЭС и Клим' },
    { value: 'ПР', viewValue: 'ПР' },
    { value: 'Выясняется', viewValue: 'Выясняется' },
  ];
  category: { value: string; viewValue: string }[] = [
    { value: 'Core', viewValue: 'Core' },
    { value: 'GPRS', viewValue: 'GPRS' },
    { value: 'Roaming', viewValue: 'Roaming' },
    { value: 'Power/HighTemp', viewValue: 'Power/HighTemp' },
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
    { value: 'Andijan', viewValue: 'Andijan' },
    { value: 'Bukhara', viewValue: 'Bukhara' },
    { value: 'Djizzakh', viewValue: 'Djizzakh' },
    { value: 'Fergana', viewValue: 'Fergana' },
    { value: 'Sirdarya', viewValue: 'Sirdarya' },
    { value: 'Kashkadarya', viewValue: 'Kashkadarya' },
    { value: 'Namangan', viewValue: 'Namangan' },
    { value: 'Navoi', viewValue: 'Navoi' },
    { value: 'Karakalpakstan', viewValue: 'Karakalpakstan' },
    { value: 'Samarkand', viewValue: 'Samarkand' },
    { value: 'Tashkent', viewValue: 'Tashkent' },
    { value: 'Surkhandarya', viewValue: 'Surkhandarya' },
    { value: 'Khorezm', viewValue: 'Khorezm' },
  ];


  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private snackBar: MatSnackBar,
    private webSocketService: WebSocketService) {
    this.createForm()
  }

  createForm() {
    this.cnForm = this.formBuilder.group({
      'AddOrCor': [null],
      'level': [null, Validators.required],
      'categories_report': [null, Validators.required],
      'responsible_report': [null, Validators.required],
      'problem': [null, Validators.required],
      'reason': [null, Validators.required],
      'effect_option': ['С влиянием', Validators.required],
      'startTime': [null, Validators.required],
      'endTime': [null],
      'region': [null],
      'effect': [null],
      'category': [null],
      'informed': [null],
      'desc': [null],
      'sender': [null]
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
      this.newForm = false
      this.authService.getSms(this.route.snapshot.params.id)
        .subscribe(result => {
          this.cnForm = this.formBuilder.group({
            'AddOrCor': [null],
            'level': [result['level'], Validators.required],
            'categories_report': [result['category'], Validators.required],
            'responsible_report': [result['responsible_area'], Validators.required],
            'problem': [result['problem'], Validators.required],
            'reason': [result['reason'], Validators.required],
            'effect_option': [result['effect'], Validators.required],
            'startTime': [formatDate(result['start_time'], 'yyyy-MM-ddTHH:mm', 'en'), Validators.required],
            'endTime': [result['end_time'], Validators.required],
            'region': [result['region'], Validators.required],
            'effect': [result['influence']],
            'category': [result['category_for_core']],
            'informed': [result['informed']],
            'desc': [result['description']],
            'sender': [result['sender']]
          })
        })
    }
  }

  previewButton() {
    this.preview = !this.preview
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
      'end_time': this.cnForm.value.endTime,
      'region': this.cnForm.value.region,
      'category_for_core': this.cnForm.value.category,
      'description': this.cnForm.value.desc,
      'informed': this.cnForm.value.informed,
      'influence': this.cnForm.value.effect,
      'sender': this.user?.username
    }
  }

  updateData() {
    this.tableSendBody()

    this.authService.updateSms(this.route.snapshot.params.id, this.tableBody)
      .subscribe((result) => {
        console.log(result);
        this.snackBar.open('Updated', '', { duration: 10000 })
      })
  }

  smsSendBody() {
    this.criteria = this.storageService.getNotification(this.cnForm.value.level)
    this.criteria_list = this.criteria?.concat(this.cnForm.value.region)

    if(this.requestType == 'Problem') {
      if(this.cnForm.value.categories_report == 'ПР') {
        if(this.cnForm.value.AddOrCor == (undefined || null)) {
          this.SmsTextBody =
          ' ' + this.cnForm.value.level.replace('A', 'П') + ' ' + this.requestType + ': ' + '\n' +
          ' ' + this.cnForm.value.problem + '\n ' +
          'Prichina: ' + this.cnForm.value.reason + '\n ' +
          'Effect: ' + this.cnForm.value.effect + '\n ' +
          'Opoveschen: ' + this.cnForm.value.informed + '\n ' +
          'Nachalo: ' + this.cnForm.value.startTime.replace("T", " ") + '\n ' +
          'Otpravil: ' + this.user?.username
        } else {
          this.SmsTextBody =
          ' ' + this.cnForm.value.level.replace('A', 'П') + ' ' +this.requestType + ': ' + '\n' +
          ' (' + this.cnForm.value.AddOrCor + ') ' +
          ' ' + this.cnForm.value.problem + '\n ' +
          'Prichina: ' + this.cnForm.value.reason + '\n ' +
          'Effect: ' + this.cnForm.value.effect + '\n ' +
          'Opoveschen: ' + this.cnForm.value.informed + '\n ' +
          'Nachalo: ' + this.cnForm.value.startTime.replace("T", " ") + '\n ' +
          'Otpravil: ' + this.user?.username
        }
      } else {
        if(this.cnForm.value.AddOrCor == (undefined || null)) {
          this.SmsTextBody =
          ' ' + this.cnForm.value.level + ' ' +this.requestType + ': ' + '\n' +
          ' ' + this.cnForm.value.problem + '\n ' +
          'Prichina: ' + this.cnForm.value.reason + '\n ' +
          'Effect: ' + this.cnForm.value.effect + '\n ' +
          'Opoveschen: ' + this.cnForm.value.informed + '\n ' +
          'Nachalo: ' + this.cnForm.value.startTime.replace("T", " ") + '\n ' +
          'Otpravil: ' + this.user?.username
        } else {
          this.SmsTextBody =
          ' ' + this.cnForm.value.level + ' ' +this.requestType + ': ' + '\n' +
          ' (' + this.cnForm.value.AddOrCor + ') ' +
          ' ' + this.cnForm.value.problem + '\n ' +
          'Prichina: ' + this.cnForm.value.reason + '\n ' +
          'Effect: ' + this.cnForm.value.effect + '\n ' +
          'Opoveschen: ' + this.cnForm.value.informed + '\n ' +
          'Nachalo: ' + this.cnForm.value.startTime.replace("T", " ") + '\n ' +
          'Otpravil: ' + this.user?.username
        }
      }
    } else {
      if(this.cnForm.value.categories_report == 'ПР') {
        if(this.cnForm.value.AddOrCor == (undefined || null)) {
          this.SmsTextBody =
          ' ' + this.cnForm.value.level.replace('A', 'П') + ' ' +this.requestType + '\n' +
          ' ' + this.cnForm.value.problem + '\n ' +
          'Prichina: ' + this.cnForm.value.reason + '\n ' +
          'Effect: ' + this.cnForm.value.effect + '\n ' +
          'Opisaniya: ' + this.cnForm.value.desc + '\n ' +
          'Nachalo: ' + this.cnForm.value.startTime.replace("T", " ") + '\n ' +
          'Konec: ' + this.cnForm.value.endTime.replace("T", " ") + '\n ' +
          'Otpravil: ' + this.user?.username
        } else {
          this.SmsTextBody =
          ' ' + this.cnForm.value.level.replace('A', 'П') + ' ' +this.requestType + '\n' +
          ' (' + this.cnForm.value.AddOrCor + ') ' +
          ' ' + this.cnForm.value.problem + '\n ' +
          'Prichina: ' + this.cnForm.value.reason + '\n ' +
          'Effect: ' + this.cnForm.value.effect + '\n ' +
          'Opisaniya: ' + this.cnForm.value.desc + '\n ' +
          'Nachalo: ' + this.cnForm.value.startTime.replace("T", " ") + '\n ' +
          'Konec: ' + this.cnForm.value.endTime.replace("T", " ") + '\n ' +
          'Otpravil: ' + this.user?.username
        }
      } else {
        if(this.cnForm.value.AddOrCor == (null || undefined)) {
          this.SmsTextBody =
          ' ' + this.cnForm.value.level + ' ' +this.requestType + '\n' +
          ' ' + this.cnForm.value.problem + '\n ' +
          'Prichina: ' + this.cnForm.value.reason + '\n ' +
          'Effect: ' + this.cnForm.value.effect + '\n ' +
          'Opisaniya: ' + this.cnForm.value.desc + '\n ' +
          'Nachalo: ' + this.cnForm.value.startTime.replace("T", " ") + '\n ' +
          'Konec: ' + this.cnForm.value.endTime.replace("T", " ") + '\n ' +
          'Otpravil: ' + this.user?.username
        } else {
          this.SmsTextBody =
          ' ' + this.cnForm.value.level + ' ' +this.requestType + '\n' +
          ' (' + this.cnForm.value.AddOrCor + ') '
          ' ' + this.cnForm.value.problem + '\n ' +
          'Prichina: ' + this.cnForm.value.reason + '\n ' +
          'Effect: ' + this.cnForm.value.effect + '\n ' +
          'Opisaniya: ' + this.cnForm.value.desc + '\n ' +
          'Nachalo: ' + this.cnForm.value.startTime.replace("T", " ") + '\n ' +
          'Konec: ' + this.cnForm.value.endTime.replace("T", " ") + '\n ' +
          'Otpravil: ' + this.user?.username
        }
      }
    }

    this.smsBody = {
      'source_addr': 'ncc-cn',
      'network': ['CN'],
      'criteria': [this.cnForm.value.level],
      'notification': [this.cnForm.value.category],
      'sms_text': this.SmsTextBody
    }

    if(this.cnForm.value.region != (null || undefined)) {
      this.smsBody.region = [this.cnForm.value.region]
    }
  }

  createData() {
    this.tableSendBody()

    this.authService.postData(this.tableBody)
      .subscribe((res) => {
        console.log(res);
      })
  }

  onSubmitButtonProblem(smsType: string) {
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

  onSubmitButtonUpdate(smsType: string) {
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
}
