import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AppService } from './app.service';
import { VaultState } from './vault-state.interface';
import { WordVault } from './word-vault.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  vault: Observable<WordVault>;
  vaultState: Observable<VaultState>;

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.vault = this.appService.getWordVault();
    this.vaultState = this.appService.vocabularyState;
  }

}
