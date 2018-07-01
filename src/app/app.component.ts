import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { tap, withLatestFrom } from 'rxjs/operators';

import { AppService } from './app.service';
import { Question, WordVault } from './word-vault.interface';
import { VocabularyState } from './vocabulary-state.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  vault$: Observable<WordVault>;
  vocabularyState$: Observable<VocabularyState>;
  vocabularySubscription: Subscription;
  @ViewChild('form') form: NgForm;

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.vault$ = this.appService.getWordVault();
    this.vocabularyState$ = this.appService.vocabularyState$;
    this.observeVocabularyStateChange();
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
      this.appService.indexOfQuestionJustAnswered$.next(
        indexOfQuestionJustAnswered
      );
    } else {
      alert('Try Again!');
      this.form.reset();
    }
  }

  observeVocabularyStateChange() {
    // this will capture all events when any questoin is answered correctly which will be a number
    this.vocabularySubscription = this.appService.indexOfQuestionJustAnswered$
      .pipe(
        // this will get the laatest values from the word vault
        withLatestFrom(this.vault$),
        // do something with the index of the answered question and the latest values form vault
        tap(([indexOfQuestionJustAnswered, vault]) => {
          // get the last updated value of the vocabulary state
          const vocabularyState = this.appService.vocabularyState$.getValue();
          // update the new vacabulary state dpending on the previous state
          this.handleVocabularStateChange(
            vocabularyState,
            indexOfQuestionJustAnswered,
            vault
          );
        })
      )
      .subscribe(() => console.log('observed'));
  }

  handleVocabularStateChange(
    vocabularyState,
    indexOfQuestionJustAnswered,
    vault
  ) {
    let newState: VocabularyState;
    const noOfRounds = Object.keys(vault.rounds).length;
    const questionNoJustAnswered = indexOfQuestionJustAnswered + 1;
    const noOfQuestionsInCurrentRound =
      vault.rounds[vocabularyState.currentRound.toString()].questions.length;

    if (noOfQuestionsInCurrentRound > questionNoJustAnswered) {
      newState = {
        currentQuestion: questionNoJustAnswered + 1,
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
      // emiting event to update the vocabulary state with updated state
      this.appService.vocabularyState$.next(newState);
    }
  }

  ngOnDestroy() {
    this.vocabularySubscription.unsubscribe();
  }
}
