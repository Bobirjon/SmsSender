import { formatDate } from '@angular/common';
import { Component, OnInit, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
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
    { value: 'Выясняется', viewValue: 'Выясняется' },
  ];
  responsible_report: { value: string; viewValue: string }[] = [
    { value: 'Другие ЗО', viewValue: 'Другие ЗО' },
    { value: 'Эксплуатация', viewValue: 'Эксплуатация' },
    { value: 'Выясняется', viewValue: 'Выясняется' },
  ];
  generator: { value: string; viewValue: string }[] = [
    { value: 'FG', viewValue: 'FG' },
    { value: '', viewValue: 'Empty' }
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
    private snackBar: MatSnackBar,
    public dialog: MatDialog) {
    this.createForm()
  }

  createForm() {
    this.hubForm = this.formBuilder.group({
      'AddOrCor': [null],
      'level': ['', Validators.required],
      'categories_report': ['', Validators.required],
      'responsible_report': ['', Validators.required],
      'problem': ['', Validators.required],
      'reason': ['', Validators.required],
      'startTime': ['', Validators.required],
      'endTime': [''],
      'region': ['', Validators.required],
      'hubSite': ['', Validators.required],
      'effectedSites': [''],
      'generator': [''],
      'desc': ['', Validators.required],
      'informed': ['', Validators.required],
      'category': ['', Validators.required],
      'powerOffTime': ['', Validators.required],
      'hubBlockTime': ['', Validators.required],
      'mw_link': [''],
      'mw_equipment': [''],
      'mw_vendor': [''],
      'bts_vendor': [''],
      'battery_life_time': [''],
      'lowBatteryTime': [''],
      'dg_start_time': [''],
    })
  }

  setDefault() {
    if(this.hubForm.value.level == 'P1' || this.hubForm.value.level == 'P2' || 
      this.hubForm.value.level == 'P3' || this.hubForm.value.level == 'P4' || this.hubForm.value.level == 'P5') {
      this.hubForm.value.categories_report = 'ПР'
    } else {
      this.hubForm.value.categories_report = ''
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
      let endTimeForUpdate: any
      let lowBatteryTime: any
      let dg_start_time: any

      this.authService.getSms(this.route.snapshot.params.id)
        .subscribe(result => {
          console.log(result);
          if (result['end_time'] == null) {
            endTimeForUpdate = (result['end_time'], 'yyyy-MM-ddTHH:mm', '')
          } else {
            endTimeForUpdate = formatDate(result['end_time'], 'yyyy-MM-ddTHH:mm', 'en')
          }
          if (result['lowBatteryTime'] == null) {
            lowBatteryTime = (result['lowBatteryTime'], 'yyyy-MM-ddTHH:mm', '')
          } else {
            lowBatteryTime = formatDate(result['lowBatteryTime'], 'yyyy-MM-ddTHH:mm', 'en')
          }
          if (result['dg_start_time'] == null) {
            dg_start_time = (result['dg_start_time'], 'yyyy-MM-ddTHH:mm', '')
          } else {
            dg_start_time = formatDate(result['dg_start_time'], 'yyyy-MM-ddTHH:mm', 'en')
          }
          this.hubForm = this.formBuilder.group({
            'AddOrCor': [null],
            'level': [result['level'], Validators.required],
            'categories_report': [result['category'], Validators.required],
            'responsible_report': [result['responsible_area'], Validators.required],
            'problem': [result['problem'], Validators.required],
            'reason': [result['reason'], Validators.required],
            'startTime': [formatDate(result['start_time'], 'yyyy-MM-ddTHH:mm', 'en'), Validators.required],
            // 'endTime': [result['end_time'], Validators.required],
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
            'battery_life_time': [result['battery_life_time']],
            // 'lowBatteryTime': [[formatDate(result['lowBatteryTime'], 'yyyy-MM-ddTHH:mm', 'en')]],
            // 'dg_start_time': [[formatDate(result['dg_start_time'], 'yyyy-MM-ddTHH:mm', 'en')]],

          })

        })
    }
  }

  tableSendBody() {
    if (this.hubForm.value.endTime !== '') {
      this.tableBody.end_time = this.hubForm.value.endTime
    }

    if (this.hubForm.value.lowBatteryTime !== '') {
      this.tableBody.lowBatteryTime = this.hubForm.value.lowBatteryTime
    }

    if (this.hubForm.value.dg_start_time !== '') {
      this.tableBody.dg_start_time = this.hubForm.value.dg_start_time
    }

    this.tableBody = {
      'type': 'HUB',
      'level': this.hubForm.value.level,
      'category': this.hubForm.value.categories_report,
      'responsible_area': this.hubForm.value.responsible_report,
      'problem': this.hubForm.value.problem,
      'reason': this.hubForm.value.reason,
      'effect': 'С влиянием',
      'start_time': this.hubForm.value.startTime,
      'region': this.hubForm.value.region,
      'category_for_hub': this.hubForm.value.category,
      'description': this.hubForm.value.desc,
      'informed': this.hubForm.value.informed,
      'influence': this.hubForm.value.effect,
      'sender': this.user?.username,
      'effected_sites': this.hubForm.value.effectedSites.split('\n'),
      'hub_site' : this.hubForm.value.effectedSites.hubSite,
      'generetor': this.hubForm.value.generator,
      'power_off_time': this.hubForm.value.powerOffTime,
      'sector_block_time': this.hubForm.value.hubBlockTime,

      'mw_link': this.hubForm.value.mw_link,
      'mw_equipment': this.hubForm.value.mw_equipment,
      'mw_vendor': this.hubForm.value.mw_vendor,
      'bts_vendor': this.hubForm.value.bts_vendor,
      // 'battery_life_time': this.hubForm.value.battery_life_time,
      // 'lowBatteryTime': this.hubForm.value.lowBatteryTime,
      // 'dg_start_time': this.hubForm.value.dg_start_time,
    }
  }

  smsSendBody() {

    if (this.requestType == 'Проблема') {
      if (this.hubForm.value.AddOrCor == (undefined || null)) {
        this.SmsTextBody =
          this.hubForm.value.level + ' Хаб сайт ' + this.requestType + '\n' +
          this.hubForm.value.problem + ' сайтов не работают в ' + this.hubForm.value.region.viewValue + '\n ' +
          'Эффект: Потеря покрытия и качество связи в ' + this.hubForm.value.region + '\n ' +
          'Причина: ' + this.hubForm.value.reason + ' ' + this.hubForm.value.hubSite + ' ' + this.hubForm.value.generator + '\n ' +
          'Время отключения ЭП: ' + this.hubForm.value.powerOffTime.replace("T", " ") + '\n ' +
          'Время блокировки секторов: ' + this.hubForm.value.hubBlockTime.replace("T", " ") + '\n ' +
          'Начало: ' + this.hubForm.value.startTime.replace("T", " ") + '\n ' +
          'Информирован: ' + this.hubForm.value.informed + '\n ' +
          'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name + '\n ' +
          'Скачайте приложение Ucell: www.ucell.uz/lead'
      } else {
        this.SmsTextBody =
          this.hubForm.value.level + ' Хаб сайт ' + this.requestType + '\n ' +
          this.hubForm.value.AddOrCor + '\n ' +
          this.hubForm.value.problem + ' сайтов не работают в ' + this.hubForm.value.region.viewValue + '\n ' +
          'Эффект: Потеря покрытия и качество связи в ' + this.hubForm.value.region + '\n ' +
          'Причина: ' + this.hubForm.value.reason + ' ' + this.hubForm.value.hubSite + ' ' + this.hubForm.value.generator + '\n ' +
          'Время отключения ЭП: ' + this.hubForm.value.powerOffTime.replace("T", " ") + '\n ' +
          'Время блокировки секторов: ' + this.hubForm.value.hubBlockTime.replace("T", " ") + '\n ' +
          'Начало: ' + this.hubForm.value.startTime.replace("T", " ") + '\n ' +
          'Информирован: ' + this.hubForm.value.informed + '\n ' +
          'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name + '\n ' +
          'Скачайте приложение Ucell: www.ucell.uz/lead'
      }

    } else {
      if (this.hubForm.value.AddOrCor == (null || undefined)) {
        this.SmsTextBody =
          this.hubForm.value.level + ' Хаб сайт ' + this.requestType + '\n ' +
          this.hubForm.value.problem + ' сайтов не работают в ' + this.hubForm.value.region.viewValue + '\n ' +
          'Причина: ' + this.hubForm.value.reason + ' ' + this.hubForm.value.hubSite + ' ' + this.hubForm.value.generator + '\n ' +
          'Описание: ' + this.hubForm.value.desc + '\n ' +
          'Время отключения ЭП: ' + this.hubForm.value.powerOffTime.replace("T", " ") + '\n ' +
          'Время блокировки секторов: ' + this.hubForm.value.hubBlockTime.replace("T", " ") + '\n ' +
          'Начало: ' + this.hubForm.value.startTime.replace("T", " ") + '\n ' +
          'Конец: ' + this.hubForm.value.endTime.replace("T", " ") + '\n ' +
          'Информирован: ' + this.hubForm.value.informed + '\n ' +
          'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name+ '\n ' +
          'Скачайте приложение Ucell: www.ucell.uz/lead'
      } else {
        this.SmsTextBody =
          this.hubForm.value.level + ' Хаб сайт ' + this.requestType + '\n ' +
          this.hubForm.value.AddOrCor + '\n ' +
          this.hubForm.value.problem + ' сайтов не работают в ' + this.hubForm.value.region.viewValue + '\n ' +
          'Причина: ' + this.hubForm.value.reason + ' ' + this.hubForm.value.hubSite + ' ' + this.hubForm.value.generator + '\n ' +
          'Описание: ' + this.hubForm.value.desc + '\n ' +
          'Время отключения ЭП: ' + this.hubForm.value.powerOffTime.replace("T", " ") + '\n ' +
          'Время блокировки секторов: ' + this.hubForm.value.hubBlockTime.replace("T", " ") + '\n ' +
          'Начало: ' + this.hubForm.value.startTime.replace("T", " ") + '\n ' +
          'Конец: ' + this.hubForm.value.endTime.replace("T", " ") + '\n ' +
          'Информирован: ' + this.hubForm.value.informed + '\n ' +
          'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name+ '\n ' +
          'Скачайте приложение Ucell: www.ucell.uz/lead'
      }
    }

    this.smsBody = {
      'source_addr': 'ncc-rn',
      'network': ['RN'],
      'criteria': [this.hubForm.value.level],
      'notification': ['Hub'],
      'sms_text': this.SmsTextBody,
      'region': [this.hubForm.value.region]
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
    let aray = this.hubForm.value.effectedSites.split('\n')

    console.log(aray);
    
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
export class areYouSure {}
