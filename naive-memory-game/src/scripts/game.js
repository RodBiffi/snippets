import _shuffle from 'lodash/shuffle';
import _times from 'lodash/times';
import _flatten from 'lodash/flatten';

let state = {
    numOfSets: 3,
    setsSize: 2,
    totalCards: 6,
    matches: [],
    cards: [],
    cardsInPlay: [],
    lastPlayMatched: undefined,
    finished: false,
};

const actionTypes = {
    SETUP: 'init',
    RESET: 'reset',
    FLIP_CARD: 'flip_card',
}

const actions = {
    setup: (numOfSets, setsSize) => ({
        type: actionTypes.SETUP,
        payload: {
            numOfSets,
            setsSize,
        },
    }),
    reset: () => ({
        type: actionTypes.RESET,
        payload: {},
    }),
    flipCard: (cardIndex) => ({
        type: actionTypes.FLIP_CARD,
        payload: {
            cardIndex,
        },
    }),
};

const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.SETUP: {
            const { numOfSets, setsSize } = action.payload;
            return {
                ...state,
                numOfSets,
                setsSize,
                totalCards: numOfSets * setsSize,
                matches: [],
                cards: shuffle(numOfSets, setsSize),
                cardsInPlay: [],
                lastPlayMatched: undefined,
                finished: false,
            };
        }
        case actionTypes.RESET: {
            return {
                ...state,
                matches: [],
                cards: shuffle(state.numOfSets, state.setsSize),
                cardsInPlay: [],
                lastPlayMatched: undefined,
                finished: false,
            };
        }
        case actionTypes.FLIP_CARD: {
            const { cardIndex } = action.payload;
            return {
                ...state,
                ...flipCard(cardIndex, state),
            };
        }
        default: {
            return { ...state };
        }
    }
};

const getValue = attribute => state[attribute];

const dispatch = action => {
    state = reducer(state, action);
};

export const shuffle = (numOfSets, setsSize) => {
    const cards = _flatten(_times(setsSize, () => Array.from(Array(numOfSets).keys())));
    return _shuffle(cards);
}

export const flipCard = (cardIndex, state) => {
    const { setsSize, totalCards, matches, cards, cardsInPlay } = state;
    let match;
    let finished = false;
    let inPlay = cardsInPlay;
    let currentMatches = matches;
    if (cardIndex > (totalCards - 1)) {
        throw new Error(`Card ${cardIndex} is not supposed to exist!`);
    }

    // begging for refactor, but the reducer contract can be easily tested for consistency
    if (inPlay.length === 0) {
        inPlay = [...inPlay, cardIndex];
    } else {
        if (cards[cardIndex] !== cards[inPlay[0]]) {
            inPlay = [];
            match = false;
        } else {
            inPlay = [...inPlay, cardIndex];
            if (inPlay.length === setsSize) {
                currentMatches = [...currentMatches, ...inPlay];
                inPlay = [];
                if (currentMatches.length === totalCards) {
                    finished = true;
                }
            }
            match = true;
        }
    }
    return {
        lastPlayMatched: match,
        matches: currentMatches,
        cardsInPlay: inPlay,
        finished,
    };
}

export default {
    getValue: (attribute) => getValue(attribute),
    setup: (numOfSets, setsSize) => dispatch(actions.setup(numOfSets, setsSize)),
    reset: () => dispatch(actions.reset()),
    flipCard: (cardIndex) => dispatch(actions.flipCard(cardIndex)),
};
