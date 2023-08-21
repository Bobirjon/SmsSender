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
    private snackBar: MatSnackBar) {
    this.createForm()
  }

  createForm() {
    this.bscForm = this.formBuilder.group({
      'AddOrCor': [null],
      'level': [null, Validators.required],
      'categories_report': [null, Validators.required],
      'responsible_report': [null, Validators.required],
      'problem': [null, Validators.required],
      'reason': [null, Validators.required],
      'effect_option': ['C Влиянием', Validators.required],
      'startTime': [null, Validators.required],
      'endTime': [null],
      'region': [null, Validators.required],
      'effect': [null],
      'informed': [null],
      'desc': [null],
      'sender': [null],
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
      this.authService.getSms(this.route.snapshot.params.id)
        .subscribe(result => {
          this.bscForm = this.formBuilder.group({
            'AddOrCor': [null],
            'level': [result['level'], Validators.required],
            'categories_report': [result['category'], Validators.required],
            'responsible_report': [result['responsible_area'], Validators.required],
            'problem': [result['problem'], Validators.required],
            'reason': [result['reason'], Validators.required],
            'effect_option': [result['effect'], Validators.required],
            'startTime': [formatDate(result['start_time'], 'yyyy-MM-ddTHH:mm', 'en'), Validators.required],
            'endTime': [null, Validators.required],
            'region': [result['region'], Validators.required],
            'effect': [result['influence']],
            'informed': [result['informed']],
            'desc': [result['description']],
            'sender': [result['sender']],
          })
        })
    }
  }

  previewButton() {
    this.preview = !this.preview
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
      'end_time': this.bscForm.value.endTime,
      'region': this.bscForm.value.region,

      'informed': this.bscForm.value.informed,
      'description': this.bscForm.value.desc,
      'sender': this.user?.username
    }
  }

  smsSendBody() {
    this.criteria = this.storageService.getNotification(this.bscForm.value.level)
    this.criteria_list = this.criteria?.concat(this.bscForm.value.region)

    if (this.requestType == 'Problem') {
      if (this.bscForm.value.categories_report == 'ПР') {
        if (this.bscForm.value.AddOrCor == (undefined || null)) {
          this.SmsTextBody =
            ' ' + this.bscForm.value.level.replace('A', 'П') + ' BSC: ' + this.requestType + '\n' +
            ' ' + this.bscForm.value.problem + '\n ' +
            'Prichina: ' + this.bscForm.value.reason + '\n ' +
            'Effect: ' + this.bscForm.value.effect + '\n ' +
            'Nachalo: ' + this.bscForm.value.startTime.replace("T", " ") + '\n ' +
            'Informirovan: ' + this.bscForm.value.endTime.replace("T", " ") + '\n ' +
            'Otpravil: ' + this.user?.username
        } else {
          this.SmsTextBody =
            ' ' + this.bscForm.value.level.replace('A', 'П') + ' ' + this.requestType + '\n' +
            ' (' + this.bscForm.value.AddOrCor + ') ' +
            ' ' + this.bscForm.value.problem + '\n ' +
            'Prichina: ' + this.bscForm.value.reason + '\n ' +
            'Effect: ' + this.bscForm.value.effect + '\n ' +
            'Nachalo: ' + this.bscForm.value.startTime.replace("T", " ") + '\n ' +
            'Informirovan: ' + this.bscForm.value.informed + '\n ' +
            'Otpravil: ' + this.user?.username
        }
      } else {
        if (this.bscForm.value.AddOrCor == (undefined || null)) {
          this.SmsTextBody =
            ' ' + this.bscForm.value.level + ' ' + this.requestType + '\n' +
            ' ' + this.bscForm.value.problem + '\n ' +
            'Prichina: ' + this.bscForm.value.reason + '\n ' +
            'Effect: ' + this.bscForm.value.effect + '\n ' +
            'Nachalo: ' + this.bscForm.value.startTime.replace("T", " ") + '\n ' +
            'Informirovan: ' + this.bscForm.value.informed + '\n ' +
            'Otpravil: ' + this.user?.username
        } else {
          this.SmsTextBody =
            ' ' + this.bscForm.value.level.replace('A', 'П') + ' ' + this.requestType + '\n' +
            ' (' + this.bscForm.value.AddOrCor + ') ' +
            ' ' + this.bscForm.value.problem + '\n ' +
            'Prichina: ' + this.bscForm.value.reason + '\n ' +
            'Effect: ' + this.bscForm.value.effect + '\n ' +
            'Nachalo: ' + this.bscForm.value.startTime.replace("T", " ") + '\n ' +
            'Informirovan: ' + this.bscForm.value.informed + '\n ' +
            'Otpravil: ' + this.user?.username
        }
      }
    } else {
      if (this.bscForm.value.categories_report == 'ПР') {
        if (this.bscForm.value.AddOrCor == (undefined || null)) {
          this.SmsTextBody =
            ' ' + this.bscForm.value.level.replace('A', 'П') + ' ' + this.requestType + '\n' +
            ' ' + this.bscForm.value.problem + '\n ' +
            'Prichina: ' + this.bscForm.value.reason + '\n ' +
            'Effect: ' + this.bscForm.value.effect + '\n ' +
            'Opisaniya: ' + this.bscForm.value.desc + '\n ' +
            'Nachalo: ' + this.bscForm.value.startTime.replace("T", " ") + '\n ' +
            'Konec: ' + this.bscForm.value.endTime.replace("T", " ") + '\n ' +
            'Informirovan: ' + this.bscForm.value.informed + '\n ' +
            'Otpravil: ' + this.user?.username
        } else {
          this.SmsTextBody =
            ' ' + this.bscForm.value.level.replace('A', 'П') + ' ' + this.requestType + '\n' +
            ' (' + this.bscForm.value.AddOrCor + ') ' +
            ' ' + this.bscForm.value.problem + '\n ' +
            'Prichina: ' + this.bscForm.value.reason + '\n ' +
            'Effect: ' + this.bscForm.value.effect + '\n ' +
            'Opisaniya: ' + this.bscForm.value.desc + '\n ' +
            'Nachalo: ' + this.bscForm.value.startTime.replace("T", " ") + '\n ' +
            'Konec: ' + this.bscForm.value.endTime.replace("T", " ") + '\n ' +
            'Informirovan: ' + this.bscForm.value.informed + '\n ' +
            'Otpravil: ' + this.user?.username
        }
      } else {
        if (this.bscForm.value.AddOrCor == (null || undefined)) {
          this.SmsTextBody =
            ' ' + this.bscForm.value.level + ' ' + this.requestType + '\n' +
            ' ' + this.bscForm.value.problem + '\n ' +
            'Prichina: ' + this.bscForm.value.reason + '\n ' +
            'Effect: ' + this.bscForm.value.effect + '\n ' +
            'Opisaniya: ' + this.bscForm.value.desc + '\n ' +
            'Nachalo: ' + this.bscForm.value.startTime.replace("T", " ") + '\n ' +
            'Konec: ' + this.bscForm.value.endTime.replace("T", " ") + '\n ' +
            'Informirovan: ' + this.bscForm.value.informed + '\n ' +
            'Otpravil: ' + this.user?.username
        } else {
          this.SmsTextBody =
            ' ' + this.bscForm.value.level + ' ' + this.requestType + '\n' +
            ' (' + this.bscForm.value.AddOrCor + ') '
          ' ' + this.bscForm.value.problem + '\n ' +
            'Prichina: ' + this.bscForm.value.reason + '\n ' +
            'Effect: ' + this.bscForm.value.effect + '\n ' +
            'Opisaniya: ' + this.bscForm.value.desc + '\n ' +
            'Nachalo: ' + this.bscForm.value.startTime.replace("T", " ") + '\n ' +
            'Konec: ' + this.bscForm.value.endTime.replace("T", " ") + '\n ' +
            'Informirovan: ' + this.bscForm.value.informed + '\n ' +
            'Otpravil: ' + this.user?.username
        }
      }
    }

    this.smsBody = {
      'source_addr': 'ncc-rn',
      'network': 'RN',
      'criteria': this.criteria_list,
      'notification': 'BSC/RNC',
      'sms_text': this.SmsTextBody
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
    this.requestType = smsType
    // 2 Body
    this.smsSendBody()
    console.log(this.smsBody);


    this.authService.sendSms(this.smsBody)
      .subscribe(result => {
        console.log(result);
        this.snackBar.open('Success', '', { duration: 10000 })
      }, error => {
        console.log(error);
        this.snackBar.open(error, '', { duration: 10000 })
      })

  }

  onSubmitButtonUpdate(smsType: string) {

    this.smsSendBody()

    this.authService.sendSms(this.smsSendBody)
      .subscribe((result) => {
        console.log(result);
        this.snackBar.open('Success', '', { duration: 10000 })
      }, error => {
        this.snackBar.open(error, '', { duration: 10000 })
      })
  }
}