import { formatDate } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { FormsModule } from '@angular/forms';
import { StorageService } from 'src/app/storage.service';

@Component({
  selector: 'app-internet-template',
  templateUrl: './internet-template.component.html',
  styleUrls: ['./internet-template.component.css']
})
export class InternetTemplateComponent {
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
  idAlarmReport: any

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private storageService: StorageService,
    public dialog: MatDialog) {

    // form creation
    this.cnForm = this.formBuilder.group({
      'AddOrCor': [null],
      'startTime': ['', Validators.required],
      'desc': [''],
      'sender': ['']
    })
  }

  tableSendBody() {
    this.tableBody = {
      'type': 'INTERNET',
      'level': 'A5',
      'category': 'ЭС и Клим',
      'responsible_area': 'Эксплуатация',
      'start_time': this.cnForm.value.startTime,
      'description': this.cnForm.value.desc,
      'sender': this.user?.first_name + ' ' + this.user?.last_name,
      'effect': 'Без влияния',
      'problem': 'Core internet template',
      'reason': 'Core internet template',
      'end_time': this.cnForm.value.startTime,
    }

  }

  smsSendBody(id?: number) {

    let addWord = this.storageService.additionWord(this.cnForm.value.level)

      if (this.cnForm.value.AddOrCor == (null || undefined)) {
        this.SmsTextBody =
          this.requestType + '\n' +
          'Описание: ' + this.cnForm.value.desc + '\n' +
          'Начало: ' + this.cnForm.value.startTime.replace("T", " ") + '\n' +
          'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name + '\n' +
          addWord
      } else {
        this.SmsTextBody =
          this.requestType + '\n' +
          '(' + this.cnForm.value.AddOrCor + ') ' + '\n' +
          'Описание: ' + this.cnForm.value.desc + '\n' +
          'Начало: ' + this.cnForm.value.startTime.replace("T", " ") + '\n' +
          'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name + '\n' +
          addWord
      }


    this.smsBody = {
      'source_addr': 'ncc-cn',
      'network': ['CN'],
      'notification': ['GPRS'],
      'criteria': ['A3'],
      'sms_text': this.SmsTextBody,
      'alarmreport_id': id
    }
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
            'startTime': [formatDate(result['start_time'], 'yyyy-MM-ddTHH:mm', 'en'), Validators.required],
            'desc': [result['description']],
          })
        })

    }
  }

  updateData() {

    this.tableSendBody()

    this.storageService.updateData(this.route.snapshot.params.id, this.tableBody)

  }

  sendButton() {
    // api for send SMS
    this.storageService.sendSms(this.smsBody)


  }

  onSubmit() {
    this.tableSendBody()

    this.storageService.createToTable(this.tableBody)

  }

  onSubmitButtonProblem(smsType: string) {
    this.requestType = smsType

    const dialogRef = this.dialog.open(areYouSure);

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        if (this.newForm == false) {
          this.tableSendBody()

          this.authService.updateSms(this.route.snapshot.params.id, this.tableBody)
            .subscribe((result) => {
              this.idAlarmReport = result
              console.log(this.idAlarmReport.id);

              this.snackBar.open('Обновлено', '', { duration: 10000 })
              this.smsSendBody(this.idAlarmReport.id)
              this.sendButton()
            }, error => {
              console.log(error);
              this.snackBar.open('Ошибка при обновлении', '', { duration: 10000 })
            })


        } else {
          this.tableSendBody()

          this.authService.postData(this.tableBody)
            .subscribe((result) => {
              this.snackBar.open('Добавлен в таблицу', '', { duration: 10000 })
              this.smsSendBody(result.id)
              this.sendButton()
            }, error => {
              console.log(error);
              this.snackBar.open("Ошибка", '', { duration: 10000 })
            })
        }
      }
    })

  }

  onSubmitasNew(smsType: string) {
    this.requestType = smsType

    const dialogRef = this.dialog.open(areYouSure);

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.tableSendBody()

        this.authService.postData(this.tableBody)
          .subscribe((result) => {
            console.log(result);
            this.snackBar.open('Добавлен в таблицу', '', { duration: 10000 })
            this.smsSendBody(result.id)
            this.sendButton()
          }, error => {
            console.log(error);
            this.snackBar.open("Ошибка", '', { duration: 10000 })
          })
      }
    })
  }

  forTestSms(smsType: string) {
    this.requestType = smsType
    this.smsSendBody()

    const dialogRef = this.dialog.open(fortesting, {
      data: { text: this.SmsTextBody }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        // this.smsSendBody()
        // console.log(this.smsBody);

        // this.sendButton()
      }
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


@Component({
  selector: 'fortesting',
  templateUrl: 'fortesting.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, FormsModule],
})
export class fortesting {
  constructor(
    private authService: AuthService,
    public dialogRef: MatDialogRef<fortesting>,
    @Inject(MAT_DIALOG_DATA) public smsbody: any,
  ) { }

  onSubmit(form: NgForm) {
    let tel_list = form.value.field.split('\n')
    console.log(this.smsbody);

    let smsTXTBody = {
      'source_addr': 'ncc-cn',
      'sms_text': this.smsbody.text,
      'tel_number_list': tel_list,
    }

    this.authService.sendTestSMS(smsTXTBody)
      .subscribe(res => {
        console.log(res);
      })
  }
}
