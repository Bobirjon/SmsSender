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
    if (this.chronicForm.value.level == 'P1' || this.chronicForm.value.level == 'P2' ||
      this.chronicForm.value.level == 'P3' || this.chronicForm.value.level == 'P4' || this.chronicForm.value.level == 'P5') {
      this.chronicForm.value.categories_report = 'ПР'
    } else {
      this.chronicForm.value.categories_report = ''
    }
  }


  createForm() {
    this.chronicForm = this.formBuilder.group({
      'AddOrCor': [null],
      'level': ['', Validators.required],
      'categories_report': ['', Validators.required],
      'responsible_report': ['', Validators.required],
      'problem': ['', Validators.required],
      'reason': ['', Validators.required],
      'startTime': ['', Validators.required],
      'endTime': [''],
      'region': ['', Validators.required],
      'siteName': [''],
      'time': [''],
      'hubSite': [''],
      'informed': [''],
      'desc': [''],
      'category': [''],
      'sender': ['']
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
          console.log(result);

          if (result['end_time'] == null) {
            endTimeForUpdate = (result['end_time'], 'yyyy-MM-ddTHH:mm', '')
          } else {
            endTimeForUpdate = formatDate(result['end_time'], 'yyyy-MM-ddTHH:mm', 'en')
          }
          this.chronicForm = this.formBuilder.group({
            'AddOrCor': [null],
            'level': [result['level'], Validators.required],
            'categories_report': [result['category'], Validators.required],
            'responsible_report': [result['responsible_area'], Validators.required],
            'problem': [result['problem'], Validators.required],
            'reason': [result['reason'], Validators.required],
            'startTime': [formatDate(result['start_time'], 'yyyy-MM-ddTHH:mm', 'en'), Validators.required],
            'endTime': [endTimeForUpdate],
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

  tableSendBody() {
    this.tableBody = {
      'type': 'CHRONIC',
      'level': this.chronicForm.value.level,
      'category': this.chronicForm.value.categories_report,
      'responsible_area': this.chronicForm.value.responsible_report,
      'problem': this.chronicForm.value.siteName + ' - сайт не работает в ' + this.chronicForm.value.region.viewValue +
      ' более ' + this.chronicForm.value.time + '  часов с  ' + this.chronicForm.value.startTime.replace("T", " "),

      'reason': this.chronicForm.value.reason,
      'effect': 'С влиянием',
      'start_time': this.chronicForm.value.startTime,
      // 'end_time': this.chronicForm.value.endTime,
      'region': this.chronicForm.value.region,
      'chronic_hours': this.chronicForm.value.time,
      'hub_site': this.chronicForm.value.hubSite,
      'chronic_site': this.chronicForm.value.siteName,
      'category_for_hub': this.chronicForm.value.category,
      'description': this.chronicForm.value.desc,
      'informed': this.chronicForm.value.informed,
      'influence': this.chronicForm.value.effect,
      'sender': this.user?.username
    }

    if (this.chronicForm.value.endTime !== '') {
      this.tableBody.end_time = this.chronicForm.value.endTime
    }
  }

  smsSendBody() {

    if (this.requestType == 'Проблема') {
      if (this.chronicForm.value.AddOrCor == (undefined || null)) {
        this.SmsTextBody =
          this.chronicForm.value.level.replace('P', 'П') + ' ' + ' Хронический сайт Проблема: \n' +
          this.chronicForm.value.siteName + ' - сайт не работает в ' + this.chronicForm.value.region.viewValue +
          ' более ' + this.chronicForm.value.time + '  часов с  ' + this.chronicForm.value.startTime.replace("T", " ") + '\n' +
          'Причина: ' + this.chronicForm.value.reason + '\n' +
          'Оповещен: ' + this.chronicForm.value.informed + '\n' +
          'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name + '\n ' +
          'Скачайте приложение Ucell: www.ucell.uz/lead'
      } else {
        this.SmsTextBody =
          this.chronicForm.value.level.replace('P', 'П') + ' ' + ' Хронический сайт Проблема: \n' +
          '(' + this.chronicForm.value.AddOrCor + ') \n' +
          this.chronicForm.value.siteName + ' - сайт не работает в ' + this.chronicForm.value.region.viewValue +
          ' более ' + this.chronicForm.value.time + '  часов с  ' + this.chronicForm.value.startTime.replace("T", " ") + '\n' +
          'Причина: ' + this.chronicForm.value.reason + '\n' +
          'Оповещен: ' + this.chronicForm.value.informed + '\n' +
          'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name + '\n ' +
          'Скачайте приложение Ucell: www.ucell.uz/lead'
      }
    }
    else {
      if (this.chronicForm.value.AddOrCor == (null || undefined)) {
        this.SmsTextBody =
          this.chronicForm.value.level.replace('P', 'П') + ' Хронический сайт ' + this.requestType + '\n' +
          this.chronicForm.value.siteName + ' - сайт не работал в ' + this.chronicForm.value.region.viewValue +
          ' более ' + this.chronicForm.value.time + '  часов с  ' + this.chronicForm.value.startTime.replace("T", " ") + '\n' +
          'по' + this.chronicForm.value.endTime.replace("T", " ") + '\n' +
          'Причина: ' + this.chronicForm.value.reason + '\n' +
          'Описание: ' + this.chronicForm.value.desc + ' \n' +
          'Оповещен: ' + this.chronicForm.value.informed + '\n' +
          'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name + '\n ' +
          'Скачайте приложение Ucell: www.ucell.uz/lead'
      } else {
        this.SmsTextBody =
          this.chronicForm.value.level.replace('P', 'П') + ' Хронический сайт ' + this.requestType + '\n' +
          '(' + this.chronicForm.value.AddOrCor + ') \n' +
          this.chronicForm.value.siteName + ' - сайт не работал в ' + this.chronicForm.value.region.viewValue +
          ' более ' + this.chronicForm.value.time + '  часов с  ' + this.chronicForm.value.startTime.replace("T", " ") + '\n' +
          'по' + this.chronicForm.value.endTime.replace("T", " ") + '\n' +
          'Причина: ' + this.chronicForm.value.reason + '\n' +
          'Описание: ' + this.chronicForm.value.desc + ' \n' +
          'Оповещен: ' + this.chronicForm.value.informed + '\n' +
          'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name + '\n ' +
          'Скачайте приложение Ucell: www.ucell.uz/lead'
      }
    }

    this.smsBody = {
      'source_addr': 'ncc-rn',
      'network': ['RN'],
      'criteria': [this.chronicForm.value.level],
      'notification': ['Chronic'],
      'sms_text': this.SmsTextBody,
      'region': [this.chronicForm.value.region]
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