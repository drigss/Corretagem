import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cdk-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent implements OnInit {
  @Input() iconOnly: boolean = false;

  public menus = [];

  constructor() {}

  ngOnInit() {
    this.menus = [
      {
        name: 'Dashboard',
        icon: 'dashboard',
        link: '/principal',
        open: false
      },
      {
        name: 'Lançamentos',
        icon: 'widgets',
        link: false,
        open: false,
        sub: [
          {
            name: 'Notas de Corretagem',
            link: '/notas',
            icon: 'money',
            chip: false
          }
        ]
      },
      {
        name: 'Cadastros',
        icon: 'settings_applications',
        link: false,
        open: false,
        sub: [
          {
            name: 'Corretoras',
            link: '/corretoras',
            icon: 'account_balance',
            chip: false
          },
          {
            name: 'Usuários',
            link: '/usuarios',
            icon: 'accessibility',
            chip: false
          }
        ]
      }
    ];
  }
}
