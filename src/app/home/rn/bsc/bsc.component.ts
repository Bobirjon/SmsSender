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
  previewResheniya = false
  user: any
  newForm: boolean
  criteria_list: any
  criteria: any
  SmsTextBody: any

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
    this.previewResheniya = !this.previewResheniya
  }

  updateData() {
    const body = {
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

    this.authService.updateSms(this.route.snapshot.params.id, body)
      .subscribe((result) => {
        console.log(result);
      })
  }

  onSubmitButtonProblem(smsType: string) {
    // 1 st body
    const body = {
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

    this.authService.postData(body)
      .subscribe((res) => {
        console.log(res);
      })

    // 2 Body
    this.criteria = this.storageService.getNotification(this.bscForm.value.level)
    this.criteria_list = this.criteria?.concat(this.bscForm.value.region)

    if (smsType == 'Problem' && this.bscForm.value.AddOrCor == (null || undefined)) {
      this.SmsTextBody =
        ' ' + this.bscForm.value.level + ' BSC: Problema: \n' +
        ' ' + this.bscForm.value.problem + '\n ' +
        'Prichina: ' + this.bscForm.value.reason + '\n ' +
        'Effect: ' + this.bscForm.value.effect + '\n ' +
        'Oposveschon: ' + this.bscForm.value.informed + '\n ' +
        'Nachalo: ' + this.bscForm.value.startTime.replace("T", " ") + '\n ' +
        'Otpravil: ' + this.user?.username
    } else if (smsType == 'Problem' && this.bscForm.value.AddOrCor == 'correction') {
      this.SmsTextBody =
      ' ' + this.bscForm.value.level + ' BSC: Problema: \n' +
        ' (Correction) ' +
        ' ' + this.bscForm.value.problem + '\n ' +
        'Prichina: ' + this.bscForm.value.reason + '\n ' +
        'Effect: ' + this.bscForm.value.effect + '\n ' +
        'Oposveschon: ' + this.bscForm.value.informed + '\n ' +
        'Nachalo: ' + this.bscForm.value.startTime.replace("T", " ") + '\n ' +
        'Otpravil: ' + this.user?.username
    } else if (smsType == 'Problem' && this.bscForm.value.AddOrCor == 'addition') {
      this.SmsTextBody =
      ' ' + this.bscForm.value.level + ' BSC: Problema: \n' +
        ' (Addition) ' +
        ' ' + this.bscForm.value.problem + '\n ' +
        'Prichina: ' + this.bscForm.value.reason + '\n ' +
        'Effect: ' + this.bscForm.value.effect + '\n ' +
        'Oposveschon: ' + this.bscForm.value.informed + '\n ' +
        'Nachalo: ' + this.bscForm.value.startTime.replace("T", " ") + '\n ' +
        'Otpravil: ' + this.user?.username
    } else if (smsType == 'Reshenie' && this.bscForm.value.AddOrCor == (null || undefined)) {
      this.SmsTextBody =
        ' ' + this.bscForm.value.level + ' BCS: Reshenie: \n' +
        ' ' + this.bscForm.value.problem + '\n ' +
        'Prichina: ' + this.bscForm.value.reason + '\n ' +
        'Effect: ' + this.bscForm.value.effect + '\n ' +
        'Opoveschen: ' + this.bscForm.value.informed + '\n ' +
        'Opisaniya: ' + this.bscForm.value.desc + '\n ' +
        'Nachalo: ' + this.bscForm.value.startTime.replace("T", " ") + '\n ' +
        'Konec: ' + this.bscForm.value.endTime.replace("T", " ") + '\n ' +
        'Otpravil: ' + this.user?.username
    } else if (smsType == 'Reshenie' && this.bscForm.value.AddOrCor == 'correction') {
      this.SmsTextBody =
        ' ' + this.bscForm.value.level + ' BCS: Reshenie: \n' +
        ' (Correction) ' +
        ' ' + this.bscForm.value.problem + '\n ' +
        'Prichina: ' + this.bscForm.value.reason + '\n ' +
        'Effect: ' + this.bscForm.value.effect + '\n ' +
        'Opoveschen: ' + this.bscForm.value.informed + '\n ' +
        'Opisaniya: ' + this.bscForm.value.desc + '\n ' +
        'Nachalo: ' + this.bscForm.value.startTime.replace("T", " ") + '\n ' +
        'Konec: ' + this.bscForm.value.endTime.replace("T", " ") + '\n ' +
        'Otpravil: ' + this.user?.username
    } else if (smsType == 'Reshenie' && this.bscForm.value.AddOrCor == 'addition') {
      this.SmsTextBody =
        ' ' + this.bscForm.value.level + ' BCS: Reshenie: \n' +
        ' (Addition) ' +
        ' ' + this.bscForm.value.problem + '\n ' +
        'Prichina: ' + this.bscForm.value.reason + '\n ' +
        'Effect: ' + this.bscForm.value.effect + '\n ' +
        'Opoveschen: ' + this.bscForm.value.informed + '\n ' +
        'Opisaniya: ' + this.bscForm.value.desc + '\n ' +
        'Nachalo: ' + this.bscForm.value.startTime.replace("T", " ") + '\n ' +
        'Konec: ' + this.bscForm.value.endTime.replace("T", " ") + '\n ' +
        'Otpravil: ' + this.user?.username
    }

    const body2 = {
      'source_addr': 'ncc-rn',
      'network': 'RN',
      'criteria': this.criteria_list,
      'notification': 'BSC/RNC',
      'sms_text': this.SmsTextBody
    }

    this.authService.sendSms(body2)
      .subscribe(result => {
        console.log(result);
        this.snackBar.open('Success', '', { duration: 10000 })
      }, error => {
        console.log(error);
        this.snackBar.open(error, '', { duration: 10000 })
      })

  }

  onSubmitButtonUpdate(smsType: string) {

    this.criteria = this.storageService.getNotification(this.bscForm.value.level)
    this.criteria_list = this.criteria?.concat(this.bscForm.value.region)

    if (smsType == 'Problem' && this.bscForm.value.AddOrCor == (null || undefined)) {
      this.SmsTextBody =
        ' ' + this.bscForm.value.level + ' BSC: Problema: \n' +
        ' ' + this.bscForm.value.problem + '\n ' +
        'Prichina: ' + this.bscForm.value.reason + '\n ' +
        'Effect: ' + this.bscForm.value.effect + '\n ' +
        'Oposveschon: ' + this.bscForm.value.informed + '\n ' +
        'Nachalo: ' + this.bscForm.value.startTime.replace("T", " ") + '\n ' +
        'Otpravil: ' + this.user?.username
    } else if (smsType == 'Problem' && this.bscForm.value.AddOrCor == 'correction') {
      this.SmsTextBody =
      ' ' + this.bscForm.value.level + ' BSC: Problema: \n' +
        ' (Correction) ' +
        ' ' + this.bscForm.value.problem + '\n ' +
        'Prichina: ' + this.bscForm.value.reason + '\n ' +
        'Effect: ' + this.bscForm.value.effect + '\n ' +
        'Oposveschon: ' + this.bscForm.value.informed + '\n ' +
        'Nachalo: ' + this.bscForm.value.startTime.replace("T", " ") + '\n ' +
        'Otpravil: ' + this.user?.username
    } else if (smsType == 'Problem' && this.bscForm.value.AddOrCor == 'addition') {
      this.SmsTextBody =
      ' ' + this.bscForm.value.level + ' BSC: Problema: \n' +
        ' (Addition) ' +
        ' ' + this.bscForm.value.problem + '\n ' +
        'Prichina: ' + this.bscForm.value.reason + '\n ' +
        'Effect: ' + this.bscForm.value.effect + '\n ' +
        'Oposveschon: ' + this.bscForm.value.informed + '\n ' +
        'Nachalo: ' + this.bscForm.value.startTime.replace("T", " ") + '\n ' +
        'Otpravil: ' + this.user?.username
    } else if (smsType == 'Reshenie' && this.bscForm.value.AddOrCor == (null || undefined)) {
      this.SmsTextBody =
        ' ' + this.bscForm.value.level + ' BCS: Reshenie: \n' +
        ' ' + this.bscForm.value.problem + '\n ' +
        'Prichina: ' + this.bscForm.value.reason + '\n ' +
        'Effect: ' + this.bscForm.value.effect + '\n ' +
        'Opoveschen: ' + this.bscForm.value.informed + '\n ' +
        'Opisaniya: ' + this.bscForm.value.desc + '\n ' +
        'Nachalo: ' + this.bscForm.value.startTime.replace("T", " ") + '\n ' +
        'Konec: ' + this.bscForm.value.endTime.replace("T", " ") + '\n ' +
        'Otpravil: ' + this.user?.username
    } else if (smsType == 'Reshenie' && this.bscForm.value.AddOrCor == 'correction') {
      this.SmsTextBody =
        ' ' + this.bscForm.value.level + ' BCS: Reshenie: \n' +
        ' (Correction) ' +
        ' ' + this.bscForm.value.problem + '\n ' +
        'Prichina: ' + this.bscForm.value.reason + '\n ' +
        'Effect: ' + this.bscForm.value.effect + '\n ' +
        'Opoveschen: ' + this.bscForm.value.informed + '\n ' +
        'Opisaniya: ' + this.bscForm.value.desc + '\n ' +
        'Nachalo: ' + this.bscForm.value.startTime.replace("T", " ") + '\n ' +
        'Konec: ' + this.bscForm.value.endTime.replace("T", " ") + '\n ' +
        'Otpravil: ' + this.user?.username
    } else if (smsType == 'Reshenie' && this.bscForm.value.AddOrCor == 'addition') {
      this.SmsTextBody =
        ' ' + this.bscForm.value.level + ' BCS: Reshenie: \n' +
        ' (Addition) ' +
        ' ' + this.bscForm.value.problem + '\n ' +
        'Prichina: ' + this.bscForm.value.reason + '\n ' +
        'Effect: ' + this.bscForm.value.effect + '\n ' +
        'Opoveschen: ' + this.bscForm.value.informed + '\n ' +
        'Opisaniya: ' + this.bscForm.value.desc + '\n ' +
        'Nachalo: ' + this.bscForm.value.startTime.replace("T", " ") + '\n ' +
        'Konec: ' + this.bscForm.value.endTime.replace("T", " ") + '\n ' +
        'Otpravil: ' + this.user?.username
    }

    const body2 = {
      'source_addr': 'ncc-rn',
      'network': 'RN',
      'criteria': this.criteria_list,
      'notification': 'BSC/RNC',
      'sms_text': this.SmsTextBody
    }

    this.authService.sendSms(body2)
      .subscribe((result) => {
        console.log(result);
        this.snackBar.open('Success', '', { duration: 10000 })
      }, error => {
        this.snackBar.open(error, '', { duration: 10000 })
      })
  }
}