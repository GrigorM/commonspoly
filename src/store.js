import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    players: [],
    singlePlayer: null,
    selectedPlayer: null,
    round: 1,
    gameId: null,
    role: '',
    code: null,
    revolutions: []
  },
  getters: {
    players: state => state.players
  },
  mutations: {
    ADD_PLAYER(state, newPlayer) {
      state.players.push(newPlayer)
    },
    LOAD_GAME_STATUS(state, data) {
      // state.players = data.players
      data.players.forEach(player => {
        state.players.push(player)
      })
      // Vue.set
      state.round = data.round
      state.gameId = data.gameId
      state.code = data.code
      data.revolutions.forEach(r => {
        state.revolutions.push(r)
      })
    },
    REFRESH(state, data) {
      // state.singlePlayer = state.players[playerIndex]
      Vue.set(state, 'players', [...data.players])
      state.singlePlayer = state.players[data.playerIndex]
    },
    SET_GAMEID(state, data) {
      state.gameId = data.gameId
      state.code = data.code
      state.role = 'master'
    },
    SET_ROLE(state, playerIndex) {
      // state.role = role
      state.singlePlayer = state.players[playerIndex]
      state.role = state.singlePlayer.name
    },
    UPDATE_PLAYER(state, newPlayerData){
      state.players[newPlayerData.playerIndex].WP = newPlayerData.playerData.WP
      state.players[newPlayerData.playerIndex].LP = newPlayerData.playerData.LP
      newPlayerData.playerData.global.forEach((gs, i) => {
        //state.players[newPlayerData.playerIndex].global[i].wp = gs.wp
        //state.players[newPlayerData.playerIndex].global[i].lp = gs.lp
        Vue.set(state.players[newPlayerData.playerIndex].global, i, gs)
      })
      newPlayerData.playerData.situations.forEach((situation, i) => {
        // state.players[newPlayerData.playerIndex].situations[i].wp = situation.wp
        // state.players[newPlayerData.playerIndex].situations[i].lp = situation.lp
        Vue.set(state.players[newPlayerData.playerIndex].situations, i, situation)
      })
      newPlayerData.playerData.goodsUnlocked.forEach((unlocks, i) => {
        // state.players[newPlayerData.playerIndex].goodsUnlocked[i] = unlocks
        Vue.set(state.players[newPlayerData.playerIndex].goodsUnlocked, i, unlocks)
      })
      newPlayerData.playerData.rewards.forEach((reward, i) => {
        // state.players[newPlayerData.playerIndex].rewards[i].wp = reward.wp
        // state.players[newPlayerData.playerIndex].rewards[i].lp = reward.lp
        Vue.set(state.players[newPlayerData.playerIndex].rewards, i, reward)
      })
      state.players[newPlayerData.playerIndex].h = newPlayerData.playerData.h
      state.players[newPlayerData.playerIndex].u = newPlayerData.playerData.u
      state.players[newPlayerData.playerIndex].i = newPlayerData.playerData.i
      state.players[newPlayerData.playerIndex].e = newPlayerData.playerData.e
      // state.players[newPlayerData.playerIndex].WP = newPlayerData.playerData.WP


      // state.players[newPlayerData.playerIndex] = newPlayerData.playerData
    },
    SELECT_PLAYER(state, index) {
      console.log(`index: ${index}`);
      console.log(state.players[index]);
      state.selectedPlayer = state.players[index]
    },
    DESELECT_PLAYER(state){
      state.selectedPlayer = null;
    },
    NEXT_ROUND(state) {
      // state.players[0].goodsUnlocked[0] = 'environmental'
      // Vue.set(state.players[0].goodsUnlocked, 0, 'intangible')
      state.round ++
    },
    STORE_REVOLUTION(state, data) {
      state.revolutions.push(data)
    }
  },
  actions: {
    addPlayer({ commit }, player) {
      commit("ADD_PLAYER", player)
    },
    loadGameStatus({ commit }, data) {
      commit("LOAD_GAME_STATUS", data)
    },
    setGame({ commit }, data) {
      commit("SET_GAMEID", data)
    },
    setRole({ commit, state }, role) {

      let isPlayer = function(player) {
        let playerName = role
        console.log(`${playerName} - ${player.name}`);
        return player.name == playerName
      }
      console.log(role);
      console.log(state.players);
      let playerIndex = state.players.findIndex(isPlayer)
      console.log(playerIndex);
      if (playerIndex !== -1) {
        commit("SET_ROLE", playerIndex)
        // return true
      } else if (role == state.code) {
        state.role = 'master'
        // return false
      } else {

      }
      return
    },
    updatePlayer({ commit }, newPlayerData) {
      commit("UPDATE_PLAYER", newPlayerData)
    },
    selectCharacter({ commit, state }, char) {
      console.log(`select ${char}`);
      let index = state.players.findIndex(p => p.character == char)
      commit('SELECT_PLAYER', index)
    },
    exitEditing({ commit }) {
      commit('DESELECT_PLAYER')
    },
    incrementRound({ commit }) {
      commit("NEXT_ROUND")
    },
    storeRevolution({ commit }, revolutionData) {
      commit("STORE_REVOLUTION", revolutionData)
    },
    refreshGame({ commit, state }, data) {
      let isPlayer = function(player) {
        let playerName = state.singlePlayer.name
        return player.name == playerName
      }
      let playerIndex = state.players.findIndex(isPlayer)
      commit('REFRESH', { ...data, playerIndex })
    }
  }
});
