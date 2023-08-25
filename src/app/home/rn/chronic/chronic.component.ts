import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { StorageService } from 'src/app/storage.service';

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
    { value: 'TI_SDH', viewValue: 'TI_SDH' },
    { value: 'Unplanned work', viewValue: 'Unplanned work' },
    { value: 'WB', viewValue: 'WB' },
    { value: 'Выясняется', viewValue: 'Выясняется ' },
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
    this.chronicForm = this.formBuilder.group({
      'AddOrCor': [null],
      'level': [null, Validators.required],
      'categories_report': [null, Validators.required],
      'responsible_report': [null, Validators.required],
      'problem': [null, Validators.required],
      'reason': [null, Validators.required],
      'effect_option': ['С влиянием', Validators.required],
      'startTime': [null, Validators.required],
      'endTime': [null],
      'region': [null, Validators.required],
      'siteName': [null],
      'time': [null],
      'hubSite': [null],
      'informed': [null],
      'desc': [null],
      'category': [null],
      'sender': [null]
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
          this.chronicForm = this.formBuilder.group({
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
            'siteName': [result['chronic_site']],
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

  previewButton() {
    this.preview = !this.preview
    this.previewResheniya = !this.previewResheniya
  }

  tableSendBody() {
    this.tableBody = {
      'type': 'CHRONIC',
      'level': this.chronicForm.value.level,
      'category': this.chronicForm.value.categories_report,
      'responsible_area': this.chronicForm.value.responsible_report,
      'problem': this.chronicForm.value.problem,
      'reason': this.chronicForm.value.reason,
      'effect': this.chronicForm.value.effect_option,
      'start_time': this.chronicForm.value.startTime,
      'end_time': this.chronicForm.value.endTime,
      'region': this.chronicForm.value.region,
      'category_for_hub': this.chronicForm.value.category,
      'description': this.chronicForm.value.desc,
      'informed': this.chronicForm.value.informed,
      'influence': this.chronicForm.value.effect,
      'sender': this.user?.username
    }
  }

  smsSendBody() {
    this.criteria = this.storageService.getNotification(this.chronicForm.value.level)
    this.criteria_list = this.criteria?.concat(this.chronicForm.value.region)

    if (this.requestType == 'Problem') {
      if (this.chronicForm.value.categories_report == 'ПР') {
        if (this.chronicForm.value.AddOrCor == (undefined || null)) {
          this.SmsTextBody =
            ' ' + this.chronicForm.value.level.replace('A', 'П') + ' ' + this.requestType + ' Hronicheskiy sayt: Problema: \n' +
            ' ' + this.chronicForm.value.siteName + ' - sayt ne rabotaet v ' + this.chronicForm.value.region +
            ' bolee ' + this.chronicForm.value.time + ' chasov s ' + this.chronicForm.value.startTime.replace("T", " ") + '\n ' +
            'Prichina: ' + this.chronicForm.value.reason + '\n ' +
            'Informirovan: ' + this.chronicForm.value.informed + '\n ' +
            'Otpravil: ' + this.user?.username
        } else {
          this.SmsTextBody =
            ' ' + this.chronicForm.value.level.replace('A', 'П') + ' ' + this.requestType + ' Hronicheskiy sayt: Problema: \n' +
            ' (' + this.chronicForm.value.AddOrCor + ') \n'
          ' ' + this.chronicForm.value.siteName + ' - sayt ne rabotaet v ' + this.chronicForm.value.region +
            ' bolee ' + this.chronicForm.value.time + ' chasov s ' + this.chronicForm.value.startTime.replace("T", " ") + '\n ' +
            'Prichina: ' + this.chronicForm.value.reason + '\n ' +
            'Informirovan: ' + this.chronicForm.value.informed + '\n ' +
            'Otpravil: ' + this.user?.username
        }
      } else {
        if (this.chronicForm.value.AddOrCor == (undefined || null)) {
          this.SmsTextBody =
            ' ' + this.chronicForm.value.level + ' ' + this.requestType + ' Hronicheskiy sayt: Problema: \n' +
            ' ' + this.chronicForm.value.siteName + ' - sayt ne rabotaet v ' + this.chronicForm.value.region +
            ' bolee ' + this.chronicForm.value.time + ' chasov s ' + this.chronicForm.value.startTime.replace("T", " ") + '\n ' +
            'Prichina: ' + this.chronicForm.value.reason + '\n ' +
            'Informirovan: ' + this.chronicForm.value.informed + '\n ' +
            'Otpravil: ' + this.user?.username
        } else {
          this.SmsTextBody =
            ' ' + this.chronicForm.value.level + ' ' + this.requestType + ' Hronicheskiy sayt: Problema: \n' +
            ' ' + this.chronicForm.value.siteName + ' - sayt ne rabotaet v ' + this.chronicForm.value.region +
            ' bolee ' + this.chronicForm.value.time + ' chasov s ' + this.chronicForm.value.startTime.replace("T", " ") + '\n ' +
            'Prichina: ' + this.chronicForm.value.reason + '\n ' +
            'Informirovan: ' + this.chronicForm.value.informed + '\n ' +
            'Otpravil: ' + this.user?.username
        }
      }
    } else {
      if (this.chronicForm.value.categories_report == 'ПР') {
        if (this.chronicForm.value.AddOrCor == (undefined || null)) {
          this.SmsTextBody =
            ' ' + this.chronicForm.value.level.replace('A', 'П') + ' ' + this.requestType + ' Hronicheskiy sayt: Problema: \n' +
            ' ' + this.chronicForm.value.siteName + ' - sayt ne rabotaet v ' + this.chronicForm.value.region +
            ' bolee ' + this.chronicForm.value.time + ' chasov s ' + this.chronicForm.value.startTime.replace("T", " ") +
            ' po ' + this.chronicForm.value.endTime.replace("T", " ") + '\n ' +
            'Prichina: ' + this.chronicForm.value.reason + '\n ' +
            'Opisaniya' + this.chronicForm.value.description + ' \n'
          'Informirovan: ' + this.chronicForm.value.informed + '\n ' +
            'Otpravil: ' + this.user?.username
        } else {
          this.SmsTextBody =
            ' ' + this.chronicForm.value.level.replace('A', 'П') + ' ' + this.requestType + ' Hronicheskiy sayt: Problema: \n' +
            ' ' + this.chronicForm.value.siteName + ' - sayt ne rabotaet v ' + this.chronicForm.value.region +
            ' bolee ' + this.chronicForm.value.time + ' chasov s ' + this.chronicForm.value.startTime.replace("T", " ") + '\n ' +
            ' po ' + this.chronicForm.value.endTime.replace("T", " ") + '\n ' +
            'Prichina: ' + this.chronicForm.value.reason + '\n ' +
            'Opisaniya' + this.chronicForm.value.description + ' \n'
          'Informirovan: ' + this.chronicForm.value.informed + '\n ' +
            'Otpravil: ' + this.user?.username
        }
      } else {
        if (this.chronicForm.value.AddOrCor == (null || undefined)) {
          this.SmsTextBody =
            ' ' + this.chronicForm.value.level + ' ' + this.requestType + ' Hronicheskiy sayt: Problema: \n' +
            ' ' + this.chronicForm.value.siteName + ' - sayt ne rabotaet v ' + this.chronicForm.value.region +
            ' bolee ' + this.chronicForm.value.time + ' chasov s ' + this.chronicForm.value.startTime.replace("T", " ") + '\n ' +
            ' po ' + this.chronicForm.value.endTime.replace("T", " ") + '\n ' +
            'Prichina: ' + this.chronicForm.value.reason + '\n ' +
            'Opisaniya' + this.chronicForm.value.description + ' \n'
          'Informirovan: ' + this.chronicForm.value.informed + '\n ' +
            'Otpravil: ' + this.user?.username
        } else {
          this.SmsTextBody =
            ' ' + this.chronicForm.value.level + ' ' + this.requestType + ' Hronicheskiy sayt: Problema: \n' +
            ' ' + this.chronicForm.value.siteName + ' - sayt ne rabotaet v ' + this.chronicForm.value.region +
            ' bolee ' + this.chronicForm.value.time + ' chasov s ' + this.chronicForm.value.startTime.replace("T", " ") + '\n ' +
            ' po ' + this.chronicForm.value.endTime.replace("T", " ") + '\n ' +
            'Prichina: ' + this.chronicForm.value.reason + '\n ' +
            'Opisaniya' + this.chronicForm.value.description + ' \n'
          'Informirovan: ' + this.chronicForm.value.informed + '\n ' +
            'Otpravil: ' + this.user?.username
        }
      }
    }

    this.smsBody = {
      'source_addr': 'ncc-cn',
      'network': 'CN',
      'criteria': this.criteria_list,
      'notification': this.chronicForm.value.category,
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
    console.log(this.tableBody);
    
    this.authService.postData(this.tableBody)
      .subscribe((res) => {
        console.log(res);
      })
  }


  onSubmitButtonProblem(smsType: string) {
    this.requestType = smsType
    // send SMS logic

    this.smsSendBody()

    this.authService.sendSms(this.smsBody)
      .subscribe(result => {
        console.log(result);
        this.snackBar.open('Success', '', { duration: 10000 })
      }, error => {
        this.snackBar.open(error, '', { duration: 10000 })
      })

  }

  onSubmitButtonUpdate(smsType: string) {
    this.requestType = smsType

    this.smsSendBody()

    this.authService.sendSms(this.smsBody)
      .subscribe(result => {
        console.log(result);
        this.snackBar.open('Success', '', { duration: 10000 })
      }, error => {
        this.snackBar.open(error, '', { duration: 10000 })
      })
  }
}