import { Component, inject, OnInit } from '@angular/core';
import { WidgetComponent } from '../../../pages/home/components/widget/widget.component';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [WidgetComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  isButtonVisible: boolean = false;

  router = inject(Router);

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkRoute();
      });
    this.checkRoute();
  }

  goHome(event: any) {
    event.preventDefault();
    this.router.navigate(['/home']);
  }

  checkRoute() {
    this.isButtonVisible = this.router.url === '/home';
  }
}
