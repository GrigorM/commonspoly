import sharedb from 'sharedb/lib/client';
import { bus } from '@/main';

export default {
  sharedDoc: null,
  wsUrl: 'ws://commonspoly-backend.herokuapp.com/',
  initialize(players, code) {
    const sharedbConnection = new sharedb.Connection(new WebSocket(`${this.wsUrl}`)); //ws://commonspoly-backend.herokuapp.com/
    let gameId = Math.floor(Math.random()*1000000);
    this.sharedDoc = sharedbConnection.get(
      'commongame',
      `${gameId}` // `c${window.env.classroomId}`
    );
    this.sharedDoc.fetch((err) => {
      if (err) throw err;
      if (this.sharedDoc.type === null) {
        this.sharedDoc.create({ round: 1, players: players, code: code, revolutions: [] });
        bus.$emit('startGame', { gameId, code })
      } else {
        console.log(this.sharedDoc);
      }
    });
    this.sharedDoc.subscribe();
    this.sharedDoc.on('op', this.handleOperations);
  },
  load(gameId) {
    console.log(`load game ${gameId}`);
    const sharedbConnection = new sharedb.Connection(new WebSocket(`${this.wsUrl}`)); // ws://commonspoly-backend.herokuapp.com
    this.sharedDoc = sharedbConnection.get(
      'commongame',
      `${gameId}` // `c${window.env.classroomId}`
    );
    this.sharedDoc.fetch((err) => {
      if (err) throw err;
      if (this.sharedDoc.type === null) {
        // shouldn't be
        console.log('Epmty? how come');
        bus.$emit('wrongId')
      } else {
        // load the data into the store
        console.log(this.sharedDoc.data);
        bus.$emit('loadGame', {
          gameId,
          round: this.sharedDoc.data.round,
          players: this.sharedDoc.data.players,
          code: this.sharedDoc.data.code,
          revolutions: this.sharedDoc.data.revolutions
        })
      }
    });
    this.sharedDoc.subscribe();
    this.sharedDoc.on('op', this.handleOperations);
  },
  refresh(gameId) {
    console.log('refresh');
    const sharedbConnection = new sharedb.Connection(new WebSocket(`${this.wsUrl}`));
    this.sharedDoc = sharedbConnection.get(
      'commongame',
      `${gameId}` // `c${window.env.classroomId}`
    );
    this.sharedDoc.fetch((err) => {
      if (err) throw err;
      if (this.sharedDoc.type === null) {
        // shouldn't be
        console.log('Epmty? how come');
        bus.$emit('wrongId')
      } else {
        // load the data into the store
        console.log(this.sharedDoc.data);
        bus.$emit('refreshGame', {
          gameId,
          round: this.sharedDoc.data.round,
          players: this.sharedDoc.data.players,
          code: this.sharedDoc.data.code,
          revolutions: this.sharedDoc.data.revolutions
        })
      }
    });
  },
  handleOperations(op, source) {
    console.log(op);
    const operation = op[0];
    if (operation.p[0] == 'players') {
      bus.$emit('playerUpdate', { playerIndex: operation.p[1], playerData: operation.li });
    }
    else if (operation.p[0] == 'round') {
      bus.$emit('addRound')
      // this.$store.dispatch('incrementRound')
    }
    else if (operation.p[0] == 'revolutions') {
      bus.$emit('revolution', operation.li)
    }
  },
  submitOperation(op) {
    this.sharedDoc.submitOp(op)
  }
};
