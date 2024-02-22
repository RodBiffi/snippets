### Game
The **game** implementation is completely detached from the **view** one,
which means it can me hooked up to any UI strategy.

Internally it uses a reducer pattern to facilitate addition of requirements and testing

It exposes the following interface:
```typescript
interface game {
   getValue: (attribute: string) => any;
   setup: (numOfSets: number, setsSize: number) => void;
   reset: () => void;
   flipCard: (cardIndex: number) => void;
};
```
### View

Accesses a game implementation and create the UI bindings to its properties and actions

```typescript
import game from './game';

// configure the game rules, in this case, 3 sets of 2 equal cards.
// The maximum number of sets is 16.
game.setup(3, 2);
game.getValue('cards').forEach(card => {
    viewCards.push(createCard(card));
});
```

To flip a card, call `game.flipCard(cardIndex: number)` and read the game state `game.getValue: (attribute: string) => any;` to maintain the view. 
