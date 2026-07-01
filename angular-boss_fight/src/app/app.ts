import { Component, computed, signal } from '@angular/core';

interface Question {
  prompt: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface MailtoParams {
  to: string;
  subject?: string;
  body?: string;
  cc?: string;
  bcc?: string;
}

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  
  protected readonly textRecruter: string = 'Valentin : Souhaitez-vous me recruter ?';
  protected readonly questions: Question[] = [
    {
      prompt: 'Valentin : Pensez-vous que je suis capable de créer des applications web dynamiques et performantes en Angular et en TypeScript ?',
      options: ['OUI', 'NON'],
      correct: 0,
      explanation: 'J\'ai pu apprendre Angular lors de mon master et l\'appliquer professionnellement sur un projet de fraude à l\'assurance.'
    },
    {
      prompt: 'Valentin : Pensez-vous que je suis capable de créer des back-ends Java performants et sécurisés, en utilisant des frameworks tels que Spring Boot ?',
      options: ['OUI', 'NON'],
      correct: 0,
      explanation: 'J\'ai commencé à apprendre Java en autodidacte lors de ma licence en mathématiques et suis ainsi tombé amoureux du métier de développeur. J\'ai donc décidé de me réorienter vers ce métier en suivant un DUT Informatique puis un Master Informatique MIAGE.'
    },
    {
      prompt: 'Valentin : Pensez-vous que je suis capable de comprendre et d\'utiliser les concepts de base des bases de données relationnelles et NoSQL ?',
      options: ['OUI', 'NON'],
      correct: 0,
      explanation: 'J\'ai pu apprendre le fonctionnement des bases de données relationnelles et NoSQL lors de mon master, puis les mettre en pratique lors d\'une refactorisation du contexte client d\'un CRM chez MMA.'
    },
    {
      prompt: 'Valentin : Pensez-vous que je suis capable de maîtriser les outils de travail collaboratif et de gestion de projet, tels que Git, Jira, Confluence, Jenkins, Windows 365, etc. ?',
      options: ['OUI', 'NON'],
      correct: 0,
      explanation: 'J\'ai appris à les utiliser durant mon master, lors de mes expériences professionnelles à EDF et chez MMA, ainsi que dans mes projets personnels. J\'ai donc une connaissance approfondie de ces outils.'
    },
    {
      prompt: this.textRecruter,
      options: ['OUI', 'NON'],
      correct: 0,
      explanation: 'Contactez-moi pour en savoir plus sur mes compétences et mon expérience, et pour discuter de la manière dont je peux contribuer à votre équipe de développement.'
    }
  ];

  protected readonly questionIndex = signal(0);
  protected readonly bossHealth = signal(100);
  protected readonly playerHealth = signal(100);
  protected readonly feedback = signal('Valentin vous envoie une question!');
  protected readonly gameOver = signal(false);
  protected readonly explanationVisible = signal(false);
  protected readonly contact = signal(false);

  protected readonly emailBody = `Bonjour valentin,

J’espère que vous allez bien.

Je me permets de vous contacter car votre parcours et votre expérience ont particulièrement retenu mon attention. Votre profil correspond à des compétences et des qualités que nous apprécions fortement dans notre organisation.

Dans ce cadre, je serais ravi d’échanger avec vous afin de mieux vous connaître, comprendre votre parcours et vous présenter une opportunité de collaboration qui pourrait, je pense, correspondre à vos aspirations.

L’objectif de ce message est avant tout d’ouvrir un échange simple et informel, sans engagement, pour voir si une rencontre pourrait être pertinente.

Seriez-vous disponible dans les prochains jours pour un court entretien (téléphonique ou en visio) ?

Je reste bien entendu à votre disposition et serais très heureux de pouvoir rester en contact, même si ce n’est pas le bon moment pour vous aujourd’hui.

Dans l’attente de votre retour, je vous souhaite une excellente journée.

Bien cordialement,
[Votre nom]
[Votre poste]
[Votre entreprise]
[Coordonnées]`;

  protected readonly currentQuestion = computed(() => this.questions[this.questionIndex()]);
  protected readonly answerState = signal<'none' | 'correct' | 'wrong'>('none');

  protected attack(optionIndex: number): void {
    if (this.currentQuestion().prompt === this.textRecruter && optionIndex === 0) {
      this.bossHealth.set(0);
      this.contact.set(true);
    }
    if (this.currentQuestion().prompt === this.textRecruter && optionIndex === 1) {
      this.playerHealth.set(0);
      this.contact.set(true);
    }

    if (this.gameOver() || this.explanationVisible()) {
      return;
    }

    const question = this.currentQuestion();
    const isCorrect = optionIndex === question.correct;
    const state = isCorrect ? 'correct' : 'wrong';

    this.answerState.set(state);
    window.setTimeout(() => this.answerState.set('none'), 600);

    if (isCorrect) {
      this.bossHealth.update((value) => Math.max(0, value - 20));
      this.feedback.set(`Correct! ${question.explanation}`);
    } else {
      this.playerHealth.update((value) => Math.max(0, value - 20));
      this.feedback.set(`Wrong! ${question.explanation}`);
    }

    if (this.bossHealth() <= 0) {
      this.gameOver.set(true);
      this.feedback.set('Vous avez gagné ! Contactez-moi pour en savoir plus !');
      this.explanationVisible.set(false);
      return;
    }

    if (this.playerHealth() <= 0) {
      this.gameOver.set(true);
      this.feedback.set('J\'ai gagné ! Vous devriez me contacter pour avoir une chance de me battre !.');
      this.explanationVisible.set(false);
      return;
    }

    this.explanationVisible.set(true);
  }

  protected nextQuestion(): void {
    if (this.gameOver() || !this.explanationVisible()) {
      return;
    }

    if (this.questionIndex() < this.questions.length - 1) {
      this.questionIndex.update((value) => value + 1);
      this.explanationVisible.set(false);
      this.answerState.set('none');
      this.feedback.set('New question incoming!');
      return;
    }

    this.gameOver.set(true);
    this.explanationVisible.set(false);
    this.feedback.set('You answered all questions!');
  }

  protected restart(): void {
    this.questionIndex.set(0);
    this.bossHealth.set(100);
    this.playerHealth.set(100);
    this.feedback.set('The boss sends a new Angular question!');
    this.gameOver.set(false);
    this.explanationVisible.set(false);
    this.answerState.set('none');
  }

  protected sendContactMail(): void {
    this.openMailClient({
      to: 'valent.legay@gmail.com',
      subject: 'Échange autour d’une opportunité professionnelle',
      body: this.emailBody
    });
  }

  protected openMailClient(params: MailtoParams): void {
    const { to, subject, body, cc, bcc } = params;

    let mailtoLink = `mailto:${encodeURIComponent(to)}`;
    const queryParams: string[] = [];

    if (subject) queryParams.push(`subject=${encodeURIComponent(subject)}`);
    if (body) queryParams.push(`body=${encodeURIComponent(body)}`);
    if (cc) queryParams.push(`cc=${encodeURIComponent(cc)}`);
    if (bcc) queryParams.push(`bcc=${encodeURIComponent(bcc)}`);

    if (queryParams.length > 0) {
      mailtoLink += `?${queryParams.join('&')}`;
    }
    
    // Try to open mail client by creating and clicking an anchor (better compatibility)
    try {
      const a = document.createElement('a');
      a.href = mailtoLink;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      // Fallback: attempt to open in a new window/tab
      window.open(mailtoLink, '_blank');
    }
  }

  protected test(): void {
    console.log('Test button clicked');
  }
}
