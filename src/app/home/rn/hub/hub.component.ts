import { formatDate } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/storage.service';
import { AuthService } from 'src/app/auth.service';
import { Observable, range } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

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
  word: string = ' Узловой сайт '
  idAlarmReport: any
  filteredOptionsReason: Observable<string[]>;

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
    { value: 'Провайдер', viewValue: 'Провайдер' },
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

  periodicity: { value: string; viewValue: string }[] = [
    { value: '', viewValue: 'Оставить пустым' },
    { value: 'периодически', viewValue: 'Периодически' },
    { value: 'периодически и частично', viewValue: 'Периодически и частично' }
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

  regions = {
    'Андижан': 'Андижане',
    'Бухара': 'Бухаре',
    'Джизак': 'Джизаке',
    'Фергана': 'Фергане',
    'Сырдарья': 'Сырдарье',
    'Кашкадарья': 'Кашкадарье',
    'Наманган': 'Намангане',
    'Навои': 'Навои',
    'Каракалпакстан': 'Каракалпакстане',
    'Самарканд': 'Самарканде',
    'г.Ташкент': 'г.Ташкент',
    'Ташкент.обл': 'Ташкентской области',
    'Сурхандарья': 'Сурхандарье',
    'Хорезм': 'Хорезме',
    '': ''
  }

  district: { value: string; viewValue: string }[] = [
    { value: 'Аккурган', viewValue: 'Аккурган' },
    { value: 'Ахангаран', viewValue: 'Ахангаран' },
    { value: 'Бекабад', viewValue: 'Бекабад' },
    { value: 'Бустонлик', viewValue: 'Бустонлик' },
    { value: 'Бука', viewValue: 'Бука' },
    { value: 'Зангиота', viewValue: 'Зангиота' },
    { value: 'Кибрай', viewValue: 'Кибрай' },
    { value: 'Куйичирчик', viewValue: 'Куйичирчик' },
    { value: 'Паркент', viewValue: 'Паркент' },
    { value: 'Пскент', viewValue: 'Пскент' },
    { value: 'Ташкент', viewValue: 'Ташкент' },
    { value: 'Уртачирчик', viewValue: 'Уртачирчик' },
    { value: 'Чиназ', viewValue: 'Чиназ' },
    { value: 'Юкоричирчик', viewValue: 'Юкоричирчик' },
    { value: 'Янгиюль', viewValue: 'Янгиюль' },
    { value: 'Алмалык', viewValue: 'Алмалык' },
    { value: 'Чирчик', viewValue: 'Чирчик' },
    { value: 'Ангрен', viewValue: 'Ангрен' },
    { value: 'Нурафшон', viewValue: 'Нурафшон' },
    { value: 'Чимбай', viewValue: 'Чимбай' },

  ]

  dist = {
    'Аккурган': 'Аккурганском районе',
    'Ахангаран': 'Ахангаранском районе',
    'Бекабад': 'Бекабадском районе',
    'Бустонлик': 'Бустанликском районе',
    'Бука': 'Букинском районе',
    'Зангиота': 'Зангиотинском районе',
    'Кибрай': 'Кибрайском районе',
    'Куйичирчик': 'Куйичирчикском районе',
    'Паркент': 'Паркентском районе',
    'Пскент': 'Пскентском районе',
    'Ташкент': 'Ташкентском районе',
    'Уртачирчик': 'Уртачирчикском районе',
    'Чиназ': 'Чиназском районе',
    'Юкоричирчик': 'Юкоричирчикском районе',
    'Янгиюль': 'Янгиюльском районе',
    'Алмалык': 'Алмалыкском районе',
    'Чирчик': 'город Чирчик',
    'Ангрен': 'Ангренском районе',
    'Нурафшон': 'город Нурафшон',
    'Чимбай': 'Чимбайском районе',
    '': ''
  }


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
    { value: 'TI_FLM', viewValue: 'TI_FLM' },
    { value: 'TI_SAQ', viewValue: 'TI_SAQ' },
    { value: 'TI_SDH', viewValue: 'TI_SDH' },
    { value: 'Unplanned work', viewValue: 'Unplanned work' },
    { value: 'WB', viewValue: 'WB' },
    { value: 'Выясняется', viewValue: 'Выясняется ' },
  ];

  optionsReason: string[] = [
    'Нет питания ',
    'Проблема',
    'Выясняется',
    'В связи с плановыми работами',
    'Нет питания. Узловой сайт',
    'Нет питания. FG не завёлся. Узловой сайт',
  ];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog) {
    this.hubForm = this.formBuilder.group({
      'AddOrCor': [null],
      'level': ['', Validators.required],
      'categories_report': ['', Validators.required],
      'responsible_report': ['', Validators.required],
      'reason': ['', Validators.required],
      'startTime': ['', Validators.required],
      'endTime': ['', this.endTimeValidation],
      'region': ['', Validators.required],
      'hubSite': [''],
      'effectedSites': ['', Validators.required],
      'generator': [''],
      'desc': [''],
      'informed': ['', Validators.required],
      'category': ['', Validators.required],
      'powerOffTime': [''],
      'hubBlockTime': [''],
      'mw_link': [''],
      'mw_equipment': [''],
      'mw_vendor': [''],
      'bts_vendor': [''],
      'battery_life_time': [''],
      'lowBatteryTime': [''],
      'dg_start_time': [''],
      'district': [''],
      'twoG': [''],
      'threeG': [''],
      'fourG': [''],
      'fiveG': [''],
      'periodicity': ['',]
    })

    this.filteredOptionsReason = this.hubForm.controls.reason.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.optionsReason))
    )

  }

  private _filter(value: string, options: string[]): string[] {
    const filterValue = value.toLocaleLowerCase()
    return options.filter(option => option.toLocaleLowerCase().includes(filterValue))
  }

  setDefault() {
    if (this.hubForm.value.level == 'P1' || this.hubForm.value.level == 'P2' ||
      this.hubForm.value.level == 'P3' || this.hubForm.value.level == 'P4' || this.hubForm.value.level == 'P5') {
      this.hubForm.value.categories_report = 'ПР'
    }
  }

  endTimeValidation(control: any) {
    let endTime = new Date(control.value)
    const formGroup = control?.parent;
    if (formGroup) {
      const startTime = formGroup.get('startTime')
      const startTimeSelected = new Date(startTime.value)
      const difference = endTime.getTime() - startTimeSelected.getTime()
      if (difference < 0) {

        return { timeValid: true }
      } else {
        return null
      }
    }
    return null
  }

  putLevel() {
    let maxNumber: string

    maxNumber = this.hubForm.value.twoG

    if (this.hubForm.value.threeG >= maxNumber) {
      maxNumber = this.hubForm.value.threeG
    }

    if (this.hubForm.value.fiveG >= maxNumber) {
      maxNumber = this.hubForm.value.fiveG
    }

    if (this.hubForm.value.fourG >= maxNumber) {
      maxNumber = this.hubForm.value.fourG
    }


    if (this.hubForm.value.region == 'г.Ташкент' || this.hubForm.value.region == 'Ташкент.обл') {
      if (this.hubForm.value.categories_report == 'ПР') {
        if (parseInt(maxNumber) >= 4 && parseInt(maxNumber) <= 19) {
          this.hubForm.value.level = 'P4'
        } else if (parseInt(maxNumber) >= 20 && parseInt(maxNumber) <= 49) {
          console.log('A3');
          this.hubForm.value.level = 'P3'
        } else if (parseInt(maxNumber) >= 50) {
          console.log('A2');
          this.hubForm.value.level = 'P2'
        }
      } else {
        if (parseInt(maxNumber) >= 4 && parseInt(maxNumber) <= 19) {
          console.log('A4');
          this.hubForm.value.level = 'A4'
        } else if (parseInt(maxNumber) >= 20 && parseInt(maxNumber) <= 49) {
          console.log('A3');
          this.hubForm.value.level = 'A3'
        } else if (parseInt(maxNumber) >= 50) {
          console.log('A2');
          this.hubForm.value.level = 'A2'
        }
      }
    } else {
      if (this.hubForm.value.categories_report == 'ПР') {
        if (parseInt(maxNumber) > 2 && parseInt(maxNumber) < 10) {
          this.hubForm.value.level = 'P4'
        } else if (parseInt(maxNumber) >= 10 && parseInt(maxNumber) < 30) {
          this.hubForm.value.level = 'P3'
        } else if (parseInt(maxNumber) >= 30) {
          this.hubForm.value.level = 'P2'
        }
      } else {
        if (parseInt(maxNumber) > 2 && parseInt(maxNumber) < 10) {
          this.hubForm.value.level = 'A4'
        } else if (parseInt(maxNumber) >= 10 && parseInt(maxNumber) < 30) {
          this.hubForm.value.level = 'A3'
        } else if (parseInt(maxNumber) >= 30) {
          this.hubForm.value.level = 'A2'
        }
      }
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
      let power_off_time: any
      let block_time: any
      let effected_sites: any
      let district: any


      this.authService.getSms(this.route.snapshot.params.id)
        .subscribe(result => {

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
          if (result['sector_block_time'] == null) {
            block_time = (result['sector_block_time'], 'yyyy-MM-ddTHH:mm', '')
          } else {
            block_time = formatDate(result['sector_block_time'], 'yyyy-MM-ddTHH:mm', 'en')
          }
          if (result['power_off_time'] == null) {
            power_off_time = (result['power_off_time'], 'yyyy-MM-ddTHH:mm', '')
          } else {
            power_off_time = formatDate(result['power_off_time'], 'yyyy-MM-ddTHH:mm', 'en')
          }
          if (result['effected_sites'] == null) {
            effected_sites = ''
          } else {
            effected_sites = result['effected_sites']
          }
          if (result['district'] == null || result['district'] == undefined) {
            district = ''
          } else {
            district = result['district']
          }



          this.hubForm = this.formBuilder.group({
            'AddOrCor': [null],
            'level': [result['level'], Validators.required],
            'categories_report': [result['category'], Validators.required],
            'responsible_report': [result['responsible_area'], Validators.required],
            'reason': [result['hub_reason'], Validators.required],
            'startTime': [formatDate(result['start_time'], 'yyyy-MM-ddTHH:mm', 'en'), Validators.required],
            'endTime': [endTimeForUpdate, this.endTimeValidation],
            'region': [result['region'], Validators.required],
            'effectedSites': [result['effected_sites'], Validators.required],
            'hubSite': [result['hub_site']],
            'generator': [result['fg_avb']],
            'desc': [result['description']],
            'sender': [result['sender']],
            'informed': [result['informed']],
            'category': [result['category_for_hub']],
            'powerOffTime': [power_off_time],
            'hubBlockTime': [block_time],
            'district': [district],
            'twoG': [result['count_2G'], ],
            'threeG': [result['count_3G'], ],
            'fourG': [result['count_4G'], ],
            'fiveG': [result['count_5G'], ],
            'periodicity': [result['flapping_type'],],

            'mw_link': [result['mw_link']],
            'mw_equipment': [result['mw_equipment']],
            'mw_vendor': [result['mw_vendor']],
            'bts_vendor': [result['bts_vendor']],
            'battery_life_time': [result['battery_life_time']],
            'lowBatteryTime': [lowBatteryTime],
            'dg_start_time': [dg_start_time],

          })

        })
    }
  }

  tableSendBody() {
    let two: any, three, four, five: any

    if (this.hubForm.value.twoG == '') {
      two = ''
    }  else {
      two = this.hubForm.value.twoG + ' 2G '
    } 

    if (this.hubForm.value.threeG == '') {
      three = ''
    } else {
      three = this.hubForm.value.threeG + ' 3G '
    } 

    if (this.hubForm.value.fourG == '') {
      four = ''
    } else {
      four = this.hubForm.value.fourG + ' 4G '
    } 

    if (this.hubForm.value.fiveG == '') {
      five = ''
    } else {
      five = this.hubForm.value.fiveG + ' 5G '
    } 

   
    console.log(this.hubForm.value.twoG);
    console.log(two);
    console.log(this.hubForm.value.threeG);
    console.log(three);

    this.tableBody = {
      'type': 'HUB',
      'level': this.hubForm.value.level,
      'category': this.hubForm.value.categories_report,
      'responsible_area': this.hubForm.value.responsible_report,
      'problem': two + three + four + five + ' сайтов ' + this.hubForm.value.periodicity + ' не работают в регионе ' +
        this.regions[this.hubForm.value.region] + ' ' + this.dist[this.hubForm.value.district],
      'reason': this.hubForm.value.reason + ' ' + this.word + this.hubForm.value.hubSite + ' ' + this.hubForm.value.generator,
      'effect': 'С влиянием',
      'start_time': this.hubForm.value.startTime,
      'region': this.hubForm.value.region,
      'category_for_hub': this.hubForm.value.category,
      'description': this.hubForm.value.desc,
      'informed': this.hubForm.value.informed,
      'influence': 'Потеря покрытия и качество связи в ' + this.regions[this.hubForm.value.region],
      'sender': this.user?.username,
      'hub_site': this.hubForm.value.hubSite,
      'fg_avb': this.hubForm.value.generator,
      'district': this.hubForm.value.district,
      'hub_reason': this.hubForm.value.reason,
      'count_2G': this.hubForm.value.twoG,
      'count_3G': this.hubForm.value.threeG,
      'count_4G': this.hubForm.value.fourG,
      'count_5G': this.hubForm.value.fiveG,
      'flapping_type': this.hubForm.value.periodicity,


      'mw_link': this.hubForm.value.mw_link,
      'mw_equipment': this.hubForm.value.mw_equipment,
      'mw_vendor': this.hubForm.value.mw_vendor,
      'bts_vendor': this.hubForm.value.bts_vendor,
    }

    
    if (this.hubForm.value.effectedSites !== '') {
      if (Array.isArray(this.hubForm.value.effectedSites) == false) {
        let splited: string[] = []
        splited = this.hubForm.value.effectedSites.split((/\n|,/))
        this.tableBody.effected_sites = splited.filter((element) => element.trim() !== '')
      }
    }

    if (this.hubForm.value.endTime !== '') {
      this.tableBody.end_time = this.hubForm.value.endTime
    }

    if (this.hubForm.value.lowBatteryTime !== '') {
      this.tableBody.lowBatteryTime = this.hubForm.value.lowBatteryTime
    }

    if (this.hubForm.value.dg_start_time !== '') {
      this.tableBody.dg_start_time = this.hubForm.value.dg_start_time
    }

    if (this.hubForm.value.powerOffTime !== '') {
      this.tableBody.power_off_time = this.hubForm.value.powerOffTime
    }

    if (this.hubForm.value.hubBlockTime !== '') {
      this.tableBody.sector_block_time = this.hubForm.value.hubBlockTime
    }

    if ((this.hubForm.value.hubSite == '') || (this.hubForm.value.hubSite == undefined)) {
      this.word = ' '
    } else {
      this.word = ' Узловой сайт '
    }
  }

  smsSendBody(id?: number) {
    let twoG = '', threeG = '', fourG = '', fiveG = ''

    if (this.hubForm.value.twoG != '') {
      twoG = this.hubForm.value.twoG + ' 2G '
    }
    if (this.hubForm.value.threeG != '') {
      threeG = this.hubForm.value.threeG + ' 3G '
    }
    if (this.hubForm.value.fourG != '') {
      fourG = this.hubForm.value.fourG + ' 4G '
    }
    if (this.hubForm.value.fiveG != '') {
      fiveG = this.hubForm.value.fiveG + ' 5G '
    }

    let addWord = this.storageService.additionWord(this.hubForm.value.level)
    let power_off_time
    let block_time

    if (this.hubForm.value.powerOffTime == '') {
      power_off_time = 'Н/Д'
    } else {
      power_off_time = this.hubForm.value.powerOffTime.replace("T", " ")
    }
    if (this.hubForm.value.hubBlockTime == '') {
      block_time = 'Н/Д'
    } else {
      block_time = this.hubForm.value.hubBlockTime.replace("T", " ")
    }

    if ((this.hubForm.value.hubSite == '') || (this.hubForm.value.hubSite == undefined)) {
      this.word = ' '
    } else {
      this.word = ' Узловой сайт '
    }

    if (this.requestType == 'Проблема') {
      if (this.hubForm.value.AddOrCor == (undefined || null)) {
        this.SmsTextBody =
          this.hubForm.value.level.replace('P', 'П') + ' ' + this.requestType + ' на узловом сайте' + '\n' +
          twoG + threeG + fourG + fiveG + ' сайтов ' + this.hubForm.value.periodicity + ' не работают в регионе ' +
          this.regions[this.hubForm.value.region] + ' ' + this.dist[this.hubForm.value.district] + '\n' +
          'Эффект: Потеря покрытия и качество связи в ' + this.regions[this.hubForm.value.region] + '\n' +
          'Причина: ' + this.hubForm.value.reason + this.word + this.hubForm.value.hubSite + ' ' + this.hubForm.value.generator + '\n' +
          'Время отключения ЭП: ' + power_off_time + '\n' +
          'Время блокировки секторов: ' + block_time + '\n' +
          'Начало: ' + this.hubForm.value.startTime.replace("T", " ") + '\n' +
          'Информирован: ' + this.hubForm.value.informed + '\n' +
          'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name + '\n' +
          addWord
      } else {
        this.SmsTextBody =
          this.hubForm.value.level.replace('P', 'П') + ' ' + this.requestType + ' на узловом сайте' + '\n' +
          '(' + this.hubForm.value.AddOrCor + ')\n ' +
          twoG + threeG + fourG + fiveG + ' сайтов ' + this.hubForm.value.periodicity + ' не работают в регионе ' +
          this.regions[this.hubForm.value.region] + ' ' + this.dist[this.hubForm.value.district] + '\n' +
          'Эффект: Потеря покрытия и качество связи в ' + this.regions[this.hubForm.value.region] + '\n' +
          'Причина: ' + this.hubForm.value.reason + this.word + this.hubForm.value.hubSite + ' ' + this.hubForm.value.generator + '\n' +
          'Время отключения ЭП: ' + power_off_time + '\n' +
          'Время блокировки секторов: ' + block_time + '\n' +
          'Начало: ' + this.hubForm.value.startTime.replace("T", " ") + '\n' +
          'Информирован: ' + this.hubForm.value.informed + '\n' +
          'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name + '\n' +
          addWord
      }

    } else {
      if (this.hubForm.value.AddOrCor == (null || undefined)) {
        this.SmsTextBody =
          this.hubForm.value.level.replace('P', 'П') + ' ' + this.requestType + ' на узловом сайте' + '\n' +
          twoG + threeG + fourG + fiveG + ' сайтов ' + this.hubForm.value.periodicity + ' не работают в регионе ' +
          this.regions[this.hubForm.value.region] + ' ' + this.dist[this.hubForm.value.district] + '\n' +
          'Причина: ' + this.hubForm.value.reason + this.word + this.hubForm.value.hubSite + ' ' + this.hubForm.value.generator + '\n' +
          'Описание: ' + this.hubForm.value.desc + '\n' +
          'Время отключения ЭП: ' + power_off_time + '\n' +
          'Время блокировки секторов: ' + block_time + '\n' +
          'Начало: ' + this.hubForm.value.startTime.replace("T", " ") + '\n' +
          'Конец: ' + this.hubForm.value.endTime.replace("T", " ") + '\n' +
          'Информирован: ' + this.hubForm.value.informed + '\n' +
          'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name + '\n' +
          addWord
      } else {
        this.SmsTextBody =
          this.hubForm.value.level.replace('P', 'П') + ' ' + this.requestType + ' на узловом сайте' + '\n' +
          '(' + this.hubForm.value.AddOrCor + ')\n' +
          twoG + threeG + fourG + fiveG + ' сайтов ' + this.hubForm.value.periodicity + ' не работают в регионе ' +
          this.regions[this.hubForm.value.region] + ' ' + this.dist[this.hubForm.value.district] + '\n' +
          'Причина: ' + this.hubForm.value.reason + this.word + this.hubForm.value.hubSite + ' ' + this.hubForm.value.generator + '\n' +
          'Описание: ' + this.hubForm.value.desc + '\n' +
          'Время отключения ЭП: ' + power_off_time + '\n' +
          'Время блокировки секторов: ' + block_time + '\n' +
          'Начало: ' + this.hubForm.value.startTime.replace("T", " ") + '\n' +
          'Конец: ' + this.hubForm.value.endTime.replace("T", " ") + '\n' +
          'Информирован: ' + this.hubForm.value.informed + '\n' +
          'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name + '\n' +
          addWord
      }
    }

    let smsType
    if (this.hubForm.value.periodicity == '') {
      smsType = this.storageService.SmsType(this.requestType, this.hubForm.value.AddOrCor, false)
    } else {
      smsType = this.storageService.SmsType(this.requestType, this.hubForm.value.AddOrCor, true)
    }


    this.smsBody = {
      'source_addr': 'ncc-rn',
      'network': ['RN'],
      'criteria': [this.hubForm.value.level.replace('P', 'A')],
      'notification': ['Hub'],
      'sms_text': this.SmsTextBody,
      'region': [this.hubForm.value.region],
      'alarmreport_id': id,
      'sms_type': smsType
    }
  }


  updateData() {

    this.tableSendBody()

    this.authService.updateSms(this.route.snapshot.params.id, this.tableBody)
      .subscribe((result) => {
        console.log(result);
        this.snackBar.open('Обновлено', '', { duration: 10000 })
      }, error => {
        this.snackBar.open('Ошибка при обновлении', '', { duration: 10000 })
      })
  }

  createData() {
    this.tableSendBody()

    this.authService.postData(this.tableBody)
      .subscribe((res) => {
        console.log(res);
        this.snackBar.open('Добавлен в таблицу', '', { duration: 10000 })
      }, error => {
        console.log(error);
        this.snackBar.open("Ошибка", '', { duration: 10000 })
      })
  }

  sendButton() {
    this.authService.sendSms(this.smsBody)
      .subscribe(res => {
        console.log(res);
        this.snackBar.open('Сообщения отправлено', '', { duration: 10000 })
        this.router.navigate(['/home'])
      }, error => {
        console.log(error);
        this.snackBar.open("Ошибка", '', { duration: 10000 })
      })
  }

  onSubmitButtonProblem(smsType: string) {
    this.requestType = smsType
    console.log(this.hubForm.value.fiveG);


    const dialogRef = this.dialog.open(areYouSure);

    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {

        if (this.newForm == false) {
          this.tableSendBody()

          this.authService.updateSms(this.route.snapshot.params.id, this.tableBody)
            .subscribe((result) => {
              this.snackBar.open('Обновлено', '', { duration: 10000 })

              this.idAlarmReport = result
              this.smsSendBody(this.idAlarmReport.id)
              this.sendButton()
            }, error => {
              this.snackBar.open('Ошибка при обновлении', '', { duration: 10000 })
            })
        } else {
          this.tableSendBody()

          this.authService.postData(this.tableBody)
            .subscribe((res) => {
              this.snackBar.open('Добавлен в таблицу', '', { duration: 10000 })

              this.smsSendBody(res.id)
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
          .subscribe((res) => {
            this.snackBar.open('Добавлен в таблицу', '', { duration: 10000 })

            this.smsSendBody(res.id)
            this.sendButton()
          }, error => {
            console.log(error);
            this.snackBar.open("Ошибка", '', { duration: 10000 })
          })
      }
    })
  }

  forSmsTesting(smsType: string) {
    this.requestType = smsType
    this.smsSendBody()

    const dialogRef = this.dialog.open(fortesting, {
      data: { text: this.SmsTextBody }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {

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
    console.log(this.smsbody.text);

    let smsTXTBody = {
      'source_addr': 'ncc-rn',
      'sms_text': this.smsbody.text,
      'tel_number_list': tel_list,
    }

    this.authService.sendTestSMS(smsTXTBody)
      .subscribe(res => {
        console.log(res);
      })
    console.log(this.smsbody);

  }
}