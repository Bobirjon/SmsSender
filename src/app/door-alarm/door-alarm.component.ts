import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-door-alarm',
  templateUrl: './door-alarm.component.html',
  styleUrls: ['./door-alarm.component.css']
})
export class DoorAlarmComponent implements OnInit {
  data: any[] = [
    { region: 'Tashkent',
      siteName: 'TS2020', 
      enterTime: '04.04.4044',
      exitTime: '04.04.4044', 
      responsibleEngineer: 'Xolmatov', 
      organization: 'Ucell',
      reasonToVisit: 'Maintance', 
      workType: 'Ucell',
      WB: '1234'
    },
    { region: 'Tashkent',
      siteName: 'TS2020', 
      enterTime: '04.04.4044',
      exitTime: '04.04.4044', 
      responsibleEngineer: 'Xolmatov', 
      organization: 'Ucell',
      reasonToVisit: 'Maintance', 
      workType: 'Ucell',
      WB: '1234'
    },
    { region: 'Tashkent',
      siteName: 'TS2020', 
      enterTime: '04.04.4044',
      exitTime: '04.04.4044', 
      responsibleEngineer: 'Xolmatov', 
      organization: 'Ucell',
      reasonToVisit: 'Maintance', 
      workType: 'Ucell',
      WB: '1234'
    },
    { region: 'Tashkent',
      siteName: 'TS2020', 
      enterTime: '04.04.4044',
      exitTime: '04.04.4044', 
      responsibleEngineer: 'Xolmatov', 
      organization: 'Ucell',
      reasonToVisit: 'Maintance', 
      workType: 'Ucell',
      WB: '1234'
    },
  ]

  constructor() {}

  ngOnInit(): void {
  }

}
