import { BehaviorSubject, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { VocabularyState } from './vocabulary-state.interface';
import { WordVault } from './word-vault.interface';


@Injectable({
  providedIn: 'root'
})
export class AppService {

  appState$ = new BehaviorSubject<any>(null);
  animationState$ = new BehaviorSubject<any>(null);
  vocabularyState$ = new BehaviorSubject<VocabularyState>({ currentRound: 1, currentQuestion: 1 });
  indexOfQuestionAnswered$ = new Subject<number>();

  constructor(private httpClient: HttpClient) {}

  getWordVault(): Observable<WordVault> {
    const apiUrl = '../assets/db/word-vault.json';
    return this.httpClient.get<WordVault>(apiUrl);
  }

  getWordVaultHelp(): Observable<WordVault> {
    const apiUrl = '../assets/db/word-vault-help.json';
    return this.httpClient.get<any>(apiUrl);
  }
}
