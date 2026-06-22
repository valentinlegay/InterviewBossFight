import { Component, computed, signal } from '@angular/core';

interface Question {
  prompt: string;
  options: string[];
  correct: number;
  explanation: string;
}

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly questions: Question[] = [
    {
      prompt: 'Which syntax binds a value from the component to the template?',
      options: ['[(ngModel)]', '[property]', '(click)'],
      correct: 1,
      explanation: '[property] binds data from the component to the template.'
    },
    {
      prompt: 'What is the main benefit of Signals?',
      options: [
        'They replace all forms completely',
        'They make reactive state easier to track',
        'They are only used for styling'
      ],
      correct: 1,
      explanation: 'Signals make reactivity explicit and easy to follow.'
    },
    {
      prompt: 'What does @Input() do in Angular?',
      options: [
        'It sends data from parent to child',
        'It removes a component',
        'It creates a new route'
      ],
      correct: 0,
      explanation: '@Input() passes data from a parent component to a child.'
    },
    {
      prompt: 'What is the main difference between Signals and RxJS?',
      options: [
        'RxJS is for async streams, Signals are for local reactive state',
        'Signals are heavier than RxJS',
        'RxJS works only for forms'
      ],
      correct: 0,
      explanation: 'Signals are for state, RxJS is for composing streams.'
    },
    {
      prompt: 'Which decorator marks a service for dependency injection?',
      options: ['@Component', '@Injectable', '@Directive'],
      correct: 1,
      explanation: '@Injectable lets Angular inject the service.'
    }
  ];

  protected readonly questionIndex = signal(0);
  protected readonly bossHealth = signal(100);
  protected readonly playerHealth = signal(100);
  protected readonly feedback = signal('The boss sends a new Angular question!');
  protected readonly gameOver = signal(false);
  protected readonly isResolving = signal(false);

  protected readonly currentQuestion = computed(() => this.questions[this.questionIndex()]);

  protected attack(optionIndex: number): void {
    if (this.gameOver() || this.isResolving()) {
      return;
    }

    const question = this.currentQuestion();
    this.isResolving.set(true);

    const isCorrect = optionIndex === question.correct;

    if (isCorrect) {
      this.bossHealth.update((value) => Math.max(0, value - 25));
      this.feedback.set(`Correct! ${question.explanation}`);
    } else {
      this.playerHealth.update((value) => Math.max(0, value - 20));
      this.feedback.set(`Wrong! ${question.explanation}`);
    }

    window.setTimeout(() => {
      this.isResolving.set(false);

      if (this.bossHealth() <= 0) {
        this.gameOver.set(true);
        this.feedback.set('You defeated the boss!');
        return;
      }

      if (this.playerHealth() <= 0) {
        this.gameOver.set(true);
        this.feedback.set('The boss defeated you...');
        return;
      }

      if (this.questionIndex() < this.questions.length - 1) {
        this.questionIndex.update((value) => value + 1);
        this.feedback.set('New question incoming!');
      } else {
        this.gameOver.set(true);
        this.feedback.set('You answered all questions!');
      }
    }, 900);
  }

  protected restart(): void {
    this.questionIndex.set(0);
    this.bossHealth.set(100);
    this.playerHealth.set(100);
    this.feedback.set('The boss sends a new Angular question!');
    this.gameOver.set(false);
    this.isResolving.set(false);
  }
}
