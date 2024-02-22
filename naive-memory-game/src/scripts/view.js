import game from './game';

const getGameView = () => document.getElementById('game');
let viewCards = [];

const makeClickable = card => cardEl => {
    const el = cardEl;
    el.addEventListener('click', () => {
        el.classList.add('card-show');
        el.getElementsByClassName('card-back')[0].classList.add(`card-${card}`);
        const ix = viewCards.indexOf(cardEl);
        const cardsInPlay = [...game.getValue('cardsInPlay'), ix];
        game.flipCard(ix);
        const match = game.getValue('lastPlayMatched');
        if (match === false) {
            setTimeout(() => {
                cardsInPlay.forEach(cardIndex => {
                    const el = viewCards[cardIndex];
                    const card = game.getValue('cards')[cardIndex];
                    el.classList.remove('card-show');
                    setTimeout(() => {
                        el.getElementsByClassName('card-back')[0].classList.remove(`card-${card}`);
                        makeClickable(card)(viewCards[cardIndex]);
                    }, 700);
                });
            }, 1500);
        }
    }, { once: true });
    return el;
};

const createCard = (card) => {
    const cardEl = makeClickable(card)(document.createElement('div'));
    const cardInnerEl = document.createElement('div');
    cardInnerEl.classList.add('card-inner');
    const cardFrontEl = document.createElement('div');
    cardFrontEl.classList.add('card-front');
    const cardBackEl = document.createElement('div');
    cardBackEl.classList.add('card-back');
    cardInnerEl.append(cardFrontEl, cardBackEl);
    cardEl.classList.add('card');
    cardEl.append(cardInnerEl);
    getGameView().append(cardEl);
    return cardEl;
}
export default {
    start: () => {
        game.setup(3, 3);
        game.getValue('cards').forEach(card => {
            viewCards.push(createCard(card));
        });
    },
};

