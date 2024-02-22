# Schmemory starter kit

This starter kit includes babel, sass, webpack and webpack-dev-server to hopefully help with
reducing the time spent on boilerplate stuff. Please start by running

```bash
npm install
```

This will get these packages installed. When that's done, you can — at any time — do `npm start` to
run a development server.

If you are interested in using a simple server to produce images for your cards, you can look in the
sub-folder [example-image-server](./example-image-server).

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
