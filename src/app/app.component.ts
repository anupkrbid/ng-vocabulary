import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { take, tap, filter, combineLatest, distinctUntilChanged } from 'rxjs/operators';

import { AppService } from './app.service';
import { Round, Question, WordVault } from './word-vault.interface';
import { VocabularyState } from './vocabulary-state.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  vault$: Observable<WordVault>;
  vocabularyState$: Observable<VocabularyState>;
  @ViewChild('form') form: NgForm;
  // vaultSubscription: Subscription;
  // rounds: { [key: string]: Round };
  // vaultStateData: VocabularyState;
  // vocabulaSubscription: Subscription;

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.vault$ = this.appService.getWordVault();
    this.vocabularyState$ = this.appService.vocabularyState$;
    this.observeVocabularyStateChange();
    // this.vault$.pipe(take(1)).subscribe(data => (this.rounds = data.rounds));
    // this.vaultStateSubscription = this.vocabularyState$.subscribe(
    //   state => (this.vaultStateData = state)
    // );
  }

  onSubmit(
    form: NgForm,
    question: Question,
    indexOfQuestionJustAnswered: number
  ) {
    const answer = form.value.answer;
    const answers = question.answers;
    const correctAnswer = question.correctAnswer;

    if (answers[correctAnswer - 1] === answer) {
      alert('Correct answer!');
      this.appService.changeVocabularyState$.next({
        indexOfQuestionJustAnswered
      });
    } else {
      alert('Try Again!');
      this.form.reset();
    }
  }

  observeVocabularyStateChange() {
    return this.appService.changeVocabularyState$
      .pipe(
        take(1),
        combineLatest(this.vault$, this.vocabularyState$),
        tap(([changeVocabularyState, vault, vocabularyState]) =>
          this.handleVocabularStateChange(
            vocabularyState,
            changeVocabularyState,
            vault
          )
        )
      )
      .subscribe(() => console.log('observed'));
  }

  handleVocabularStateChange(vocabularyState, changeVocabularyState, vault) {
    console.log(vocabularyState);
    let newState: VocabularyState;
    const noOfRounds = Object.keys(vault.rounds).length;
    const noOfQuestionsInCurrentRound = vault.rounds[
      vocabularyState.currentRound.toString()
    ].questions.length;
    const questionNoJustAnswered = changeVocabularyState.indexOfQuestionJustAnswered + 1;

    if (noOfQuestionsInCurrentRound > questionNoJustAnswered) {
      newState = {
        currentQuestion: vocabularyState.currentQuestion + 1,
        currentRound: vocabularyState.currentRound
      };
    } else {
      newState = {
        currentQuestion: 1,
        currentRound: vocabularyState.currentRound + 1
      };
    }

    if (newState.currentRound > noOfRounds) {
      alert('Completed');
    } else {
      this.appService.vocabularyState$.next(newState);
    }

  }

  ngOnDestroy() {
    // this.vaultStateSubscription.unsubscribe();
  }
}
