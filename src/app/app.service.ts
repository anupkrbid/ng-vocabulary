import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { VaultState } from './vault-state.interface';
import { WordVault } from './word-vault.interface';


@Injectable({
  providedIn: 'root'
})
export class AppService {

  vocabularyState = new BehaviorSubject<VaultState>({ currentRound: 1, currentQuestion: 1 });

  constructor(private httpClient: HttpClient) {}

  getWordVault(): Observable<WordVault> {
    const apiUrl = '../assets/db/word-vault.json';
    return this.httpClient.get<WordVault>(apiUrl);
  }
}