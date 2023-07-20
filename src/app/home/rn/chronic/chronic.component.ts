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
      'effect': [null],
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
            'desc': [result['desc']],
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

  onSubmitButtonProblem(smsType: string) {
    // send SMS logic
    const body = {
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

      'chronic_site': this.chronicForm.value.siteName,
      'chronic_hours': this.chronicForm.value.time,
      'hub_site': this.chronicForm.value.hubSite,
      'category_for_hub': this.chronicForm.value.category,
      'description': this.chronicForm.value.desc,
      'sender': this.user?.username,
      'informed': this.chronicForm.value.informed,
    }

    this.criteria = this.storageService.getNotification(this.chronicForm.value.level)
    this.criteria_list = this.criteria?.concat(this.chronicForm.value.region)

    switch (smsType && this.chronicForm.value.AddOrCor) {
      case 'Problem' && null: {
        this.SmsTextBody =
          this.chronicForm.value.level + ' Hronicheskiy sayt: Problema: \n' +
          this.chronicForm.value.siteName + ' - sayt ne rabotaet v ' + this.chronicForm.value.region + ' bolee ' + this.chronicForm.value.time + ' chasov s ' + this.chronicForm.value.startTime.replace("T", " ") + '\n ' +
          'Prichina: ' + this.chronicForm.value.reason + '\n ' +
          'Opoveschen: ' + this.chronicForm.value.informed + '\n ' +
          'Otpravil: ' + this.user?.username
        break;
      }
      case 'Problem' && 'addition': {
        this.SmsTextBody =
          this.chronicForm.value.level + ' Hronicheskiy sayt: Problema: \n' +
          ' (Addition) ' +
          this.chronicForm.value.siteName + ' - sayt ne rabotaet v ' + this.chronicForm.value.region + ' bolee ' + this.chronicForm.value.time + ' chasov s ' + this.chronicForm.value.startTime.replace("T", " ") + '\n ' +
          'Prichina: ' + this.chronicForm.value.reason + '\n ' +
          'Opoveschen: ' + this.chronicForm.value.informed + '\n ' +
          'Otpravil: ' + this.user?.username
        break;
      }
      case 'Problem' && 'correction': {
        this.SmsTextBody =
          this.chronicForm.value.level + ' Hronicheskiy sayt: Problema: \n' +
          ' (Correction) ' +
          this.chronicForm.value.siteName + ' - sayt ne rabotaet v ' + this.chronicForm.value.region + ' bolee ' + this.chronicForm.value.time + ' chasov s ' + this.chronicForm.value.startTime.replace("T", " ") + '\n ' +
          'Prichina: ' + this.chronicForm.value.reason + '\n ' +
          'Opoveschen: ' + this.chronicForm.value.informed + '\n ' +
          'Otpravil: ' + this.user?.username
        break;
      }
      case 'Reshenie' && null: {
        this.SmsTextBody =
          this.chronicForm.value.level + ' Hronicheskiy sayt: Reshenie: \n' +
          this.chronicForm.value.siteName + ' - sayt ne rabotaet v ' + this.chronicForm.value.region + ' bolee ' + this.chronicForm.value.time + ' chasov s ' + this.chronicForm.value.startTime.replace("T", " ") + ' po ' + this.chronicForm.value.endTime.replace("T", " ") + '\n ' +
          'Prichina: ' + this.chronicForm.value.reason + '\n ' +
          'Opisaniya: ' + this.chronicForm.value.desc + '\n ' +
          'Opoveschen: ' + this.chronicForm.value.informed + '\n ' +
          'Otpravil: ' + this.user?.username
        break;
      }
      case 'Reshenie' && 'addition': {
        this.SmsTextBody =
          this.chronicForm.value.level + ' Hronicheskiy sayt: Reshenie: \n' +
          ' (Addition) ' +
          this.chronicForm.value.siteName + ' - sayt ne rabotaet v ' + this.chronicForm.value.region + ' bolee ' + this.chronicForm.value.time + ' chasov s ' + this.chronicForm.value.startTime.replace("T", " ") + ' po ' + this.chronicForm.value.endTime.replace("T", " ") + '\n ' +
          'Prichina: ' + this.chronicForm.value.reason + '\n ' +
          'Opisaniya: ' + this.chronicForm.value.desc + '\n ' +
          'Opoveschen: ' + this.chronicForm.value.informed + '\n ' +
          'Otpravil: ' + this.user?.username
        break;
      }
      case 'Reshenie' && 'correction': {
        this.SmsTextBody =
          this.chronicForm.value.level + ' Hronicheskiy sayt: Reshenie: \n' +
          ' (Correction) ' +
          this.chronicForm.value.siteName + ' - sayt ne rabotaet v ' + this.chronicForm.value.region + ' bolee ' + this.chronicForm.value.time + ' chasov s ' + this.chronicForm.value.startTime.replace("T", " ") + ' po ' + this.chronicForm.value.endTime.replace("T", " ") + '\n ' +
          'Prichina: ' + this.chronicForm.value.reason + '\n ' +
          'Opisaniya: ' + this.chronicForm.value.desc + '\n ' +
          'Opoveschen: ' + this.chronicForm.value.informed + '\n ' +
          'Otpravil: ' + this.user?.username
        break;
      }
      default: {
        console.log("Invalid choice");
        break;
      }

    }

    this.authService.postData(body)
      .subscribe((res) => {
        console.log(res);
      })

    const body2 = {
      'source_addr': 'ncc-rn',
      'network': 'RN',
      'criteria': this.criteria_list,
      'notification': 'Chronic',
      'sms_text': this.SmsTextBody
    }

    this.authService.sendSms(body2)
      .subscribe(result => {
        console.log(result);
        this.snackBar.open('Success', '', {duration: 10000})
      }, error => {
        this.snackBar.open(error, '', {duration: 10000})
      })

  }

  onSubmitButtonUpdate(smsType: string) {

    switch (smsType && this.chronicForm.value.AddOrCor) {
      case 'Problem' && null: {
        this.SmsTextBody =
          this.chronicForm.value.level + ' Hronicheskiy sayt: Problema: \n' +
          this.chronicForm.value.siteName + ' - sayt ne rabotaet v ' + this.chronicForm.value.region + ' bolee ' + this.chronicForm.value.time + ' chasov s ' + this.chronicForm.value.startTime + '\n ' +
          'Prichina: ' + this.chronicForm.value.reason + '\n ' +
          'Opoveschen: ' + this.chronicForm.value.informed + '\n ' +
          'Otpravil: ' + this.user?.username
        break;
      }
      case 'Problem' && 'addition': {
        this.SmsTextBody =
          this.chronicForm.value.level + ' Hronicheskiy sayt: Problema: \n' +
          ' (Addition) ' +
          this.chronicForm.value.siteName + ' - sayt ne rabotaet v ' + this.chronicForm.value.region + ' bolee ' + this.chronicForm.value.time + ' chasov s ' + this.chronicForm.value.startTime + '\n ' +
          'Prichina: ' + this.chronicForm.value.reason + '\n ' +
          'Opoveschen: ' + this.chronicForm.value.informed + '\n ' +
          'Otpravil: ' + this.user?.username
        break;
      }
      case 'Problem' && 'correction': {
        this.SmsTextBody =
          this.chronicForm.value.level + ' Hronicheskiy sayt: Problema: \n' +
          ' (Correction) ' +
          this.chronicForm.value.siteName + ' - sayt ne rabotaet v ' + this.chronicForm.value.region + ' bolee ' + this.chronicForm.value.time + ' chasov s ' + this.chronicForm.value.startTime + '\n ' +
          'Prichina: ' + this.chronicForm.value.reason + '\n ' +
          'Opoveschen: ' + this.chronicForm.value.informed + '\n ' +
          'Otpravil: ' + this.user?.username
        break;
      }
      case 'Reshenie' && null: {
        this.SmsTextBody =
          this.chronicForm.value.level + ' Hronicheskiy sayt: Reshenie: \n' +
          this.chronicForm.value.siteName + ' - sayt ne rabotaet v ' + this.chronicForm.value.region + ' bolee ' + this.chronicForm.value.time + ' chasov s ' + this.chronicForm.value.startTime + ' po ' + this.chronicForm.value.endTime + '\n ' +
          'Prichina: ' + this.chronicForm.value.reason + '\n ' +
          'Opisaniya: ' + this.chronicForm.value.desc + '\n ' +
          'Opoveschen: ' + this.chronicForm.value.informed + '\n ' +
          'Otpravil: ' + this.user?.username
        break;
      }
      case 'Reshenie' && 'addition': {
        this.SmsTextBody =
          this.chronicForm.value.level + ' Hronicheskiy sayt: Reshenie: \n' +
          ' (Addition) ' +
          this.chronicForm.value.siteName + ' - sayt ne rabotaet v ' + this.chronicForm.value.region + ' bolee ' + this.chronicForm.value.time + ' chasov s ' + this.chronicForm.value.startTime + ' po ' + this.chronicForm.value.endTime + '\n ' +
          'Prichina: ' + this.chronicForm.value.reason + '\n ' +
          'Opisaniya: ' + this.chronicForm.value.desc + '\n ' +
          'Opoveschen: ' + this.chronicForm.value.informed + '\n ' +
          'Otpravil: ' + this.user?.username
        break;
      }
      case 'Reshenie' && 'correction': {
        this.SmsTextBody =
          this.chronicForm.value.level + ' Hronicheskiy sayt: Reshenie: \n' +
          ' (Correction) ' +
          this.chronicForm.value.siteName + ' - sayt ne rabotaet v ' + this.chronicForm.value.region + ' bolee ' + this.chronicForm.value.time + ' chasov s ' + this.chronicForm.value.startTime + ' po ' + this.chronicForm.value.endTime + '\n ' +
          'Prichina: ' + this.chronicForm.value.reason + '\n ' +
          'Opisaniya: ' + this.chronicForm.value.desc + '\n ' +
          'Opoveschen: ' + this.chronicForm.value.informed + '\n ' +
          'Otpravil: ' + this.user?.username
        break;
      }
      default: {
        console.log("Invalid choice");
        break;
      }

    }

    this.criteria = this.storageService.getNotification(this.chronicForm.value.level)
    this.criteria_list = this.criteria?.concat(this.chronicForm.value.region)

    const body = {
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

      'chronic_site': this.chronicForm.value.siteName,
      'chronic_hours': this.chronicForm.value.time,
      'hub_site': this.chronicForm.value.hubSite,
      'category_for_hub': this.chronicForm.value.category,
      'description': this.chronicForm.value.desc,
      'sender': this.user?.username,
      'informed': this.chronicForm.value.informed,
    }

    this.authService.updateSms(this.route.snapshot.params.id, body)
      .subscribe((result) => {
        console.log(result);

      })


    const body2 = {
      'source_addr': 'ncc-rn',
      'network': 'RN',
      'criteria': this.criteria_list,
      'notification': 'Chronic',
      'sms_text': this.SmsTextBody
    }

    this.authService.sendSms(body2)
    .subscribe(result => {
      console.log(result);
      this.snackBar.open('Success', '', {duration: 10000})
    }, error => {
      this.snackBar.open(error, '', {duration: 10000})
    })
  }
}