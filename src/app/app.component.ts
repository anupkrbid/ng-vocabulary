import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { AppService } from './app.service';
import { VaultState } from './vault-state.interface';
import { Round, Question, WordVault } from './word-vault.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  vault$: Observable<WordVault>;
  vaultSubscription: Subscription;
  rounds: { [key: string]: Round };
  vaultState$: Observable<VaultState>;
  vaultStateData: VaultState;
  vaultStateSubscription: Subscription;
  @ViewChild('form') form: NgForm;

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.vault$ = this.appService.getWordVault();
    this.vault$.pipe(take(1)).subscribe(data => this.rounds = data.rounds);
    this.vaultState$ = this.appService.vocabularyState;
    this.vaultStateSubscription = this.vaultState$.subscribe(state => this.vaultStateData = state);
  }

  onSubmit(form: NgForm, question: Question, indexOfQuestionJustAnswered: number) {
    const answer = form.value.answer;
    const answers = question.answers;
    const correctAnswer = question.correctAnswer;

    if (answers[correctAnswer - 1] === answer) {
      alert('Correct answer!');
      let newState: VaultState;
      const noOfRounds = Object.keys(this.rounds).length;
      const noOfQuestionsInCurrentRound = this.rounds[this.vaultStateData.currentRound.toString()].questions.length;

      if (noOfQuestionsInCurrentRound > indexOfQuestionJustAnswered + 1) {
        newState = {
          currentQuestion: this.vaultStateData.currentQuestion + 1,
          currentRound: this.vaultStateData.currentRound
        };
      } else {
        newState = {
          currentQuestion: 1,
          currentRound: this.vaultStateData.currentRound + 1
        };
      }

      if (newState.currentRound > noOfRounds) {
        alert('Completed');
      } else {
        this.appService.vocabularyState.next(newState);
      }

    } else {
      alert('Try Again!');
      this.form.reset();
    }
  }

  ngOnDestroy() {
    this.vaultStateSubscription.unsubscribe();
  }

}
