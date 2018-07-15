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

  initialState = {
    currentRound: 1,
    currentQuestion: 1,
    answerStatus: {
      '1': [false, false],
      '2': [false, false, false],
      '3': [false, false, false]
    }
  };
  appState$ = new BehaviorSubject<VocabularyState | null>(null);
  vocabularyState$ = new BehaviorSubject<VocabularyState>({ currentRound: 1, currentQuestion: 1 });
  indexOfQuestionJustAnswered$ = new Subject<number>();

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
