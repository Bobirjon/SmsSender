import { formatDate } from '@angular/common';
import { Component, OnInit, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { StorageService } from 'src/app/storage.service';

@Component({
  selector: 'app-hub',
  templateUrl: './hub.component.html',
  styleUrls: ['./hub.component.css'],
})
export class HubComponent implements OnInit {

  hubForm: FormGroup
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
  generator: { value: string; viewValue: string }[] = [
    { value: 'FG', viewValue: 'FG' },
    { value: '', viewValue: 'Empty' }
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

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private snackBar: MatSnackBar) {
    this.createForm()
  }

  createForm() {
    this.hubForm = this.formBuilder.group({
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
      'hubSite': [null],
      'generator': [null],
      'desc': [null],
      'sender': [null],
      'informed': [null],
      'category': [null],
      'powerOffTime': [null],
      'hubBlockTime': [null],
      'mw_link': [null],
      'mw_equipment': [null],
      'mw_vendor': [null],
      'bts_vendor': [null],
      'battery_life_time': [null],
      'lowBatteryTime': [null],
      'dg_start_time': [null],
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
          this.hubForm = this.formBuilder.group({
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

            'hubSite': [result['hub_site']],
            'generator': [result['fg_avb']],
            'desc': [result['description']],
            'sender': [result['sender']],
            'informed': [result['informed']],
            'category': [result['category_for_hub']],
            'powerOffTime': [formatDate(result['power_off_time'], 'yyyy-MM-ddTHH:mm', 'en'), Validators.required],
            'hubBlockTime': [formatDate(result['sector_block_time'], 'yyyy-MM-ddTHH:mm', 'en'), Validators.required],

            'mw_link': [result['mw_link']],
            'mw_equipment': [result['mw_equipment']],
            'mw_vendor': [result['mw_vendor']],
            'bts_vendor': [result['bts_vendor']],
            // 'battery_life_time': [result['battery_life_time']],
            'lowBatteryTime': [[formatDate(result['power_off_time'], 'yyyy-MM-ddTHH:mm', 'en')]],
            'dg_start_time': [[formatDate(result['dg_start_time'], 'yyyy-MM-ddTHH:mm', 'en')]],

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
      'type': 'HUB',
      'level': this.hubForm.value.level,
      'category': this.hubForm.value.categories_report,
      'responsible_area': this.hubForm.value.responsible_report,
      'problem': this.hubForm.value.problem,
      'reason': this.hubForm.value.reason,
      'effect': this.hubForm.value.effect_option,
      'start_time': this.hubForm.value.startTime,
      'end_time': this.hubForm.value.endTime,
      'region': this.hubForm.value.region,
      'category_for_hub': this.hubForm.value.category,
      'description': this.hubForm.value.desc,
      'informed': this.hubForm.value.informed,
      'influence': this.hubForm.value.effect,
      'sender': this.user?.username,

      'mw_link': this.hubForm.value.mw_link,
      'mw_equipment': this.hubForm.value.mw_equipment,
      'mw_vendor': this.hubForm.value.mw_vendor,
      'bts_vendor': this.hubForm.value.bts_vendor,
      // 'battery_life_time': this.hubForm.value.battery_life_time,
      'lowBatteryTime': this.hubForm.value.lowBatteryTime,
      'dg_start_time': this.hubForm.value.dg_start_time,

    }
  }

  smsSendBody() {
    this.criteria = this.storageService.getNotification(this.hubForm.value.level)
    this.criteria_list = this.criteria?.concat(this.hubForm.value.region)

    if (this.requestType == 'Problem') {
      if (this.hubForm.value.categories_report == 'ПР') {
        if (this.hubForm.value.AddOrCor == (undefined || null)) {
          this.SmsTextBody =
            ' ' + this.hubForm.value.level.replace('A', 'П') + ' HUB sayt: \n' + this.requestType +
            ' ' + this.hubForm.value.problem + ' saytov ne rabotayut v ' + this.hubForm.value.region + '\n ' +
            'Prichina: ' + this.hubForm.value.reason + '\n ' +
            'Effekt: Poterya pokrytiya i kachestva svyazi v ' + this.hubForm.value.region + '\n ' +
            'Vremya otklyucheniya EP: ' + this.hubForm.value.powerOffTime.replace("T", " ") + '\n ' +
            'Vremya blokirovki sektorov: ' + this.hubForm.value.hubBlockTime.replace("T", " ") + '\n ' +
            'Nachalo: ' + this.hubForm.value.startTime.replace("T", " ") + '\n ' +
            'Informirovan: ' + this.hubForm.value.informed + '\n ' +
            'Otpravil: ' + this.user?.username;
        } else {
          this.SmsTextBody =
            ' ' + this.hubForm.value.level.replace('A', 'П') + ' HUB sayt: \n' + this.requestType +
            ' ' + this.hubForm.value.problem + ' saytov ne rabotayut v ' + this.hubForm.value.region + '\n ' +
            'Prichina: ' + this.hubForm.value.reason + '\n ' +
            'Effekt: Poterya pokrytiya i kachestva svyazi v ' + this.hubForm.value.region + '\n ' +
            'Vremya otklyucheniya EP: ' + this.hubForm.value.powerOffTime.replace("T", " ") + '\n ' +
            'Vremya blokirovki sektorov: ' + this.hubForm.value.hubBlockTime.replace("T", " ") + '\n ' +
            'Nachalo: ' + this.hubForm.value.startTime.replace("T", " ") + '\n ' +
            'Opoveschen: ' + this.hubForm.value.informed + '\n ' +
            'Otpravil: ' + this.user?.username;
        }
      } else {
        this.SmsTextBody =
          ' ' + this.hubForm.value.level.replace('A', 'П') + ' HUB sayt: \n' + this.requestType +
          ' ' + this.hubForm.value.problem + ' saytov ne rabotayut v ' + this.hubForm.value.region + '\n ' +
          'Prichina: ' + this.hubForm.value.reason + '\n ' +
          'Effekt: Poterya pokrytiya i kachestva svyazi v ' + this.hubForm.value.region + '\n ' +
          'Vremya otklyucheniya EP: ' + this.hubForm.value.powerOffTime.replace("T", " ") + '\n ' +
          'Vremya blokirovki sektorov: ' + this.hubForm.value.hubBlockTime.replace("T", " ") + '\n ' +
          'Nachalo: ' + this.hubForm.value.startTime.replace("T", " ") + '\n ' +
          'Opoveschen: ' + this.hubForm.value.informed + '\n ' +
          'Otpravil: ' + this.user?.username;
      }
    } else {
      if (this.hubForm.value.categories_report == 'ПР') {
        if (this.hubForm.value.AddOrCor == (undefined || null)) {
          this.SmsTextBody =
            ' ' + this.hubForm.value.level.replace('A', 'П') + ' HUB sayt: \n' + this.requestType +
            ' ' + this.hubForm.value.problem + ' saytov ne rabotayut v ' + this.hubForm.value.region + '\n ' +
            'Prichina: ' + this.hubForm.value.reason + '\n ' +
            'Effekt: Poterya pokrytiya i kachestva svyazi v ' + this.hubForm.value.region + '\n ' +
            'Vremya otklyucheniya EP: ' + this.hubForm.value.powerOffTime.replace("T", " ") + '\n ' +
            'Vremya blokirovki sektorov: ' + this.hubForm.value.hubBlockTime.replace("T", " ") + '\n ' +
            'Nachalo: ' + this.hubForm.value.startTime.replace("T", " ") + '\n ' +
            'Opoveschen: ' + this.hubForm.value.informed + '\n ' +
            'Otpravil: ' + this.user?.username;
        } else {
          this.SmsTextBody =
            ' ' + this.hubForm.value.level.replace('A', 'П') + ' HUB sayt: \n' + this.requestType +
            ' ' + this.hubForm.value.problem + ' saytov ne rabotayut v ' + this.hubForm.value.region + '\n ' +
            'Prichina: ' + this.hubForm.value.reason + '\n ' +
            'Effekt: Poterya pokrytiya i kachestva svyazi v ' + this.hubForm.value.region + '\n ' +
            'Vremya otklyucheniya EP: ' + this.hubForm.value.powerOffTime.replace("T", " ") + '\n ' +
            'Vremya blokirovki sektorov: ' + this.hubForm.value.hubBlockTime.replace("T", " ") + '\n ' +
            'Nachalo: ' + this.hubForm.value.startTime.replace("T", " ") + '\n ' +
            'Opoveschen: ' + this.hubForm.value.informed + '\n ' +
            'Otpravil: ' + this.user?.username;
        }
      } else {
        if (this.hubForm.value.AddOrCor == (null || undefined)) {
          this.SmsTextBody =
            ' ' + this.hubForm.value.level.replace('A', 'П') + ' HUB sayt: \n' + this.requestType +
            ' ' + this.hubForm.value.problem + ' saytov ne rabotayut v ' + this.hubForm.value.region + '\n ' +
            'Prichina: ' + this.hubForm.value.reason + '\n ' +
            'Effekt: Poterya pokrytiya i kachestva svyazi v ' + this.hubForm.value.region + '\n ' +
            'Vremya otklyucheniya EP: ' + this.hubForm.value.powerOffTime.replace("T", " ") + '\n ' +
            'Vremya blokirovki sektorov: ' + this.hubForm.value.hubBlockTime.replace("T", " ") + '\n ' +
            'Nachalo: ' + this.hubForm.value.startTime.replace("T", " ") + '\n ' +
            'Opoveschen: ' + this.hubForm.value.informed + '\n ' +
            'Otpravil: ' + this.user?.username;
        } else {
          this.SmsTextBody =
            ' ' + this.hubForm.value.level.replace('A', 'П') + ' HUB sayt: \n' + this.requestType +
            ' ' + this.hubForm.value.problem + ' saytov ne rabotayut v ' + this.hubForm.value.region + '\n ' +
            'Prichina: ' + this.hubForm.value.reason + '\n ' +
            'Effekt: Poterya pokrytiya i kachestva svyazi v ' + this.hubForm.value.region + '\n ' +
            'Vremya otklyucheniya EP: ' + this.hubForm.value.powerOffTime.replace("T", " ") + '\n ' +
            'Vremya blokirovki sektorov: ' + this.hubForm.value.hubBlockTime.replace("T", " ") + '\n ' +
            'Nachalo: ' + this.hubForm.value.startTime.replace("T", " ") + '\n ' +
            'Opoveschen: ' + this.hubForm.value.informed + '\n ' +
            'Otpravil: ' + this.user?.username;
        }
      }
    }

    this.smsBody = {
      'source_addr': 'ncc-rn',
      'network': ['RN'],
      'criteria': [this.hubForm.value.level],
      'notification': [this.hubForm.value.category],
      'sms_text': this.SmsTextBody
    }

    if (this.hubForm.value.region != (null || undefined)) {
      this.smsBody.region = [this.hubForm.value.region]
    }


  }


  updateData() {
    this.tableSendBody()

    this.authService.updateSms(this.route.snapshot.params.id, this.tableBody)
      .subscribe((res) => {
        alert('Updated')
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
    this.requestType = smsType

    // 2 Body
    this.smsSendBody()

    this.authService.sendSms(this.smsBody)
      .subscribe(result => {
        console.log(result);
        this.snackBar.open('SMS Sended Successfully', '', { duration: 10000 })
      }, error => {
        this.snackBar.open(error.message, '', { duration: 10000 })
      })
  }

  onSubmitButtonUpdate(smsType: string) {
    this.requestType = smsType

    this.smsSendBody()

    this.authService.sendSms(this.smsBody)
      .subscribe(result => {
        console.log(result);
        this.snackBar.open('SMS Sended Successfully', '', { duration: 10000 })
      }, error => {
        this.snackBar.open(error.message, '', { duration: 10000 })
      })
  }
}