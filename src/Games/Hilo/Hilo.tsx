import React, { Component } from "react";

import "./Hilo.scss";
import Tabs from "../../Components/Tabs/Tabs";
import { currencies } from "../../Utility/currencies";
import { backendBot, get } from "../../Utility/httpClient";
import { HiloState } from "./hiloConfig";
import { formatBetAmount, formatBetAmountHeader, getAmountInput } from "../wagerInput";
import HiloCanvas from "./HiloCanvas";
import {probHigherOrSame, probLowerOrSame} from './util';
import { playGameSound } from "../../Utility/gameSounds";

// Add this interface for animation state
interface HiloAnimationState {
  animatingCard?: any;
  newCard?: any;
  animationDirection: 'top-right' | 'top-left';
  isAnimating: boolean;
  showNewCard: boolean;
  showCardBack: boolean; // Missing prop
  isFlipping: boolean; // Missing prop
  historyCards: any;
  userChoices: any; // Add this line
  showIndicatorPopUp: boolean;
  isGameLost: boolean; // Add this new state
  // New: collecting animation during Start
  isCollectingHistory: boolean;
  pendingHistoryCards?: any;
}

// Update the HiloState interface to include animation state
// (or add it to the existing HiloState if you prefer)

class Hilo extends Component<any, HiloState & HiloAnimationState> {

  private autoInterval?: NodeJS.Timer;
  private inputReference: React.RefObject<HTMLInputElement> = React.createRef();

  constructor(props: any) {
    super(props);
    this.state = {
      startingCard: this.getRandomInt(0, 51), //0-51
      netProfit: 0,
      wagerAmount: props.currency == 'OSRS' ? 10000 : 0.25,
      // Add animation state
      animatingCard: null,
      newCard: null,
      animationDirection: 'top-right',
      isAnimating: false,
      showNewCard: true,
      showCardBack: false, // Missing initial state
      isFlipping: false, // Missing initial state
      historyCards: [],
      userChoices: [], // Add this line
      showIndicatorPopUp: false,
      isGameLost: false, // Add this
      betting: false,
      sessionId: undefined,
      // New
      isCollectingHistory: false,
      pendingHistoryCards: undefined
    }
    this.updateState = this.updateState.bind(this)
  }

  wager = async (amount: number, action: string, meta: string) => get(backendBot, `https://api.privatebet.uk/fiat/hilo?wager_amount=${amount}&wager_parameters=${action}:${meta}`)

  updateState(data: any) {
    this.setState(data, () => this.inputReference.current?.focus())
  }

  getBetButton() {
    return (<button onClick={() => {
      if (this.state.betting) return
      const startingNewSession = !this.state.sessionId;
      const hasHistory = this.state.historyCards && this.state.historyCards.length > 0;
      // Trigger collecting animation if starting a new session and there are cards on table
      this.setState({ betting: true, isCollectingHistory: startingNewSession && hasHistory }, () => {
        this.placeBet()
      })
    }}>{this.state.betting ? '...' : this.state.sessionId ? 'Cashout' : 'Start'}</button>)
  }


  setCardAnimation = (cards: any, state: string) => {
    if (this.state.isAnimating) return;

    const currentCard = this.getCardDisplay(this.state.startingCard);

    const newCardIndex: number = cards[cards.length - 1]
    const newCard = this.getCardDisplay(newCardIndex);

    this.setState({
      animatingCard: currentCard,
      isAnimating: true,
      showCardBack: true,
      showNewCard: false,
      isFlipping: false,
      newCard: null,
      historyCards: cards,
      userChoices: [...this.state.userChoices, state] // Add this line
    });

    // Step 2: After previous card animation, show STATIC card back (no animation)
    setTimeout(() => {
      this.setState({
        animatingCard: null,
        isAnimating: false,
        showCardBack: true,  // This shows static back-none.svg
        showNewCard: false,
        isFlipping: false,
        newCard: null
      });
    }, 500);

    // Step 3: After card back is shown, start flipping animation for NEW CARD
    setTimeout(() => {
      this.setState({
        showCardBack: false,
        showNewCard: false,   // This shows the new card
        isFlipping: true,    // This triggers the flipping animation
        newCard: newCard,
        startingCard: newCardIndex,
      }, () => playGameSound("/_hilo/flip.mp3"));
    }, 800); // Longer delay to see the static card back

    // Step 4: After flipping animation completes, show final new card
    setTimeout(() => {
      this.setState({
        startingCard: newCardIndex,
        newCard: null,
        showNewCard: true,
        isFlipping: false,   // Stop flipping animation
        animationDirection: this.state.animationDirection === 'top-right' ? 'top-left' : 'top-right'
      });
    }, 1200); // Total: 400ms + 400ms + 600ms = 1400ms

  }


  // Update the skipCard method to implement proper flipping animation
  skipCard = () => {
    if (this.state.isAnimating) return;

    const currentCard = this.getCardDisplay(this.state.startingCard);

    if (this.state.sessionId) {
      this.wager(0.1, 'skip', `${this.state.sessionId}`).then((response) => {
        if (typeof response == 'string' || response.value == -1) {
          clearInterval(this.autoInterval);
          this.setState({ betting: false, netProfit: 0 })
          // this.props.warn('Bet failed! Make sure you have the funds to place this bet.')
          return;
        } else {
          if (response.result == -1) {
            this.props.warn("Bet failed!")
            return
          }
        }
        let gameData = response.secondValue.split(':')
        let sessionId = gameData[0]
        let action = gameData[1]
        let deck = gameData[2]
        let cards = deck.split(',').map((index: string) => Number(index))

        if (response.payoutTime) { // lose
          //deck is now fully revealed
          this.setState({ isGameLost: true })
        }

        this.setCardAnimation(cards, 'skip');
      })
    } else {
      const newCardIndex = this.getRandomInt(0, 51);
      const newCard = this.getCardDisplay(newCardIndex);
      // Step 1: Start animating the previous card away
      this.setState({
        animatingCard: currentCard,
        isAnimating: true,
        showCardBack: true,
        showNewCard: false,
        isFlipping: false,
        newCard: null,
        historyCards: [newCard]
      });

      // Step 2: After previous card animation, show STATIC card back (no animation)
      setTimeout(() => {
        this.setState({
          animatingCard: null,
          isAnimating: false,
          showCardBack: true,  // This shows static back-none.svg
          showNewCard: false,
          isFlipping: false,
          newCard: null
        });
      }, 400);

      // Step 3: After card back is shown, start flipping animation for NEW CARD
      setTimeout(() => {
        this.setState({
          showCardBack: false,
          showNewCard: false,   // This shows the new card
          isFlipping: true,    // This triggers the flipping animation
          newCard: newCard,
          startingCard: newCardIndex,
        }, () => playGameSound("/_hilo/flip.mp3"));
      }, 400); // Longer delay to see the static card back

      // Step 4: After flipping animation completes, show final new card
      setTimeout(() => {
        this.setState({
          startingCard: newCardIndex,
          newCard: null,
          showNewCard: true,
          isFlipping: false,   // Stop flipping animation
          animationDirection: this.state.animationDirection === 'top-right' ? 'top-left' : 'top-right'
        });
      }, 1200); // Total: 400ms + 400ms + 600ms = 1400ms
    }

  };


  // Add this method to get card display (same as in HiloCanvas)
  getCardDisplay = (cardIndex: number) => {
    const cardData = require('./mockdata/data.json');
    return cardData[cardIndex];
  };

  getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  render() {
    return (
      <div className="Hilo">
        <ul className="GameContent">
          <li className="Small">
            <div className="GameComponentMobileResizable RollDiceCanvas">
              {this.getBetButton()}
            </div>

            <div>
              {/*@ts-ignore*/}
              <div width="730" className="GameCanvas HiloForm">
                <div className="CanvasRow">
                  <div className="RowHeader">
                    <div className="Left">{formatBetAmountHeader(this.props.currency)}</div>
                    <div className="Right">{formatBetAmount(this.props.currency, this.state.wagerAmount)}
                    </div>

                  </div>
                  <div className="RowHeader">
                    <div className="CanvasField">
                      <div className="AmountField">
                        {getAmountInput(this.props.currency, this.state.wagerAmount, this.props.balance, this.updateState)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="CanvasRow mobile-hidden">
                  <div className="RowHeader">
                    <div className="CanvasField">
                      <div className="AmountField">
                        <div className="Value HiLoField" style={{ opacity: this.state.sessionId ? 1 : 0.5 }} onClick={this.handleHigher}>
                          <ul>
                            <li><p>Higher or Same</p></li>
                            <li><svg fill="rgb(255, 206, 0)" viewBox="0 0 64 64"> <path d="M32.274 17 9.204 40.071 16.131 47l16.145-16.145L48.42 47l6.93-6.929L32.278 17z" /></svg></li>
                            <li>{this.state.historyCards.length > 0 ? probHigherOrSame(this.state.historyCards[this.state.historyCards.length - 1]) : '0.00'} %</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="CanvasRow mobile-hidden">
                  <div className="RowHeader">
                    <div className="CanvasField">
                      <div className="AmountField">
                        <div className="Value HiLoField" style={{ opacity: this.state.sessionId ? 1 : 0.5 }} onClick={this.handleLower}>
                          <ul>
                            <li><p>Lower or Same</p></li>
                            <li><svg fill="rgb(127, 71, 253)" viewBox="0 0 64 64"><path d="M32.274 49.762 9.204 26.69l6.928-6.93 16.145 16.145L48.42 19.762l6.93 6.929-23.072 23.07z" /></svg></li>
                            <li>{this.state.historyCards.length > 0 ? probLowerOrSame(this.state.historyCards[this.state.historyCards.length - 1]) : '0.00'} %</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="CanvasRow mobile-hidden">
                  <div className="RowHeader">
                    <div className="CanvasField">
                      <div className="AmountField">
                        <div className="Value HiLoField" onClick={this.skipCard}>
                          <ul>
                            <li><p>Skip Card</p></li>
                            <li><svg fill="#ffffff" viewBox="0 0 64 64" className="svg-icon "><path d="M18.666 50.666c-.694 0-1.36-.267-1.894-.774a2.656 2.656 0 0 1 0-3.76L30.88 32.026 16.772 17.919a2.656 2.656 0 0 1 0-3.76 2.656 2.656 0 0 1 3.76 0l16 16a2.656 2.656 0 0 1 0 3.76l-16 16c-.533.533-1.2.773-1.893.773z" /><path d="M31.999 50.666a2.73 2.73 0 0 1-1.893-.774 2.656 2.656 0 0 1 0-3.76l14.106-14.106-14.106-14.107a2.656 2.656 0 0 1 0-3.76l16 16a2.656 2.656 0 0 1 0 3.76l-16 16c-.534.533-1.2.773-1.894.773z" /></svg></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="CanvasRow">
                  <div className="GameComponentDesktopResizable RollDiceCanvas">
                    {this.getBetButton()}
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li className="Large">
            <HiloCanvas
              gameState={this.state}
              onSkip={this.skipCard}
              currency={this.props.currency}
              balance={this.props.balance}
              historyCards={this.state.historyCards}
              // Pass animation state
              animatingCard={this.state.animatingCard}
              newCard={this.state.newCard}
              animationDirection={this.state.animationDirection}
              isAnimating={this.state.isAnimating}
              showNewCard={this.state.showNewCard}
              isFlipping={this.state.isFlipping}
              showCardBack={this.state.showCardBack}
              // Add mobile action handlers
              onHigher={this.handleHigher}
              onLower={this.handleLower}
              userChoices={this.state.userChoices} // Add this line
              isGameLost={this.state.isGameLost} // Add this line
              // New prop
              isCollectingHistory={this.state.isCollectingHistory}
            />
          </li>

        </ul>
        <div className="GameContentBar"></div>
      </div>);
  }

  action(action: any) {
    if (this.state.sessionId) {
      this.wager(0.1, 'action', `${this.state.sessionId}:${action}`).then((response) => {
        console.log(response)
        if (typeof response == 'string' || response.value == -1) {
          clearInterval(this.autoInterval);
          // this.setState({ betting: false, netProfit: 0, sessionId: undefined })
          console.log("failed")
          return;
        } else {
          if (response.result == -1) {
            // this.setState({ betting: false, netProfit: 0, sessionId: undefined })
            console.log("Bet failed!")
            return
          }
        }

        let gameData = response.secondValue.split(':')
        // console.log(response.secondValue)

        let sessionId = gameData[0]
        // let action = gameData[1]
        let deck = gameData[2]

        if (response.payoutTime) { // lose
          deck = gameData[3]
            let cards = deck.split(',').map((index: string) => Number(index)).slice(0, this.state.historyCards.length + 1)
            this.setCardAnimation(cards, action);
          // console.log('lose')
          this.setState({ betting: false, netProfit: 0, sessionId: undefined })
          this.setState({ isGameLost: true })
          return;
        } else {

          let cards = deck.split(',').map((index: string) => Number(index))

          this.setCardAnimation(cards, action);
          this.setState({ betting: false, historyCards: cards })
        }
      })
    }
  }

  placeBet() {
    if (this.state.sessionId) {
      this.wager(0.1, 'withdraw', `${this.state.sessionId}`).then((response) => {
        if (typeof response == 'string' || response.value == -1) {
          clearInterval(this.autoInterval);
          // this.setState({ betting: false, netProfit: 0 })
          // this.props.warn('Bet failed! Make sure you have the funds to place this bet.')
          return;
        } else {
          if (response.result == -1) {
            // this.props.warn("Bet failed!")
            return
          }
        }
        this.setState({ betting: false, sessionId: undefined })
      })
    } else {
      this.wager(0.1, 'start', `${this.state.startingCard}`).then((response) => {
        if (typeof response == 'string' || response.value == -1) {
          clearInterval(this.autoInterval);
          this.setState({ betting: false, netProfit: 0 })
          this.props.warn('Bet failed! Make sure you have the funds to place this bet.')
          return;
        } else {
          if (response.result == -1) {
            this.props.warn("Bet failed!")
            return
          }
          let gameData = response.secondValue.split(':')
          let sessionId = gameData[0]
          let action = gameData[1]
          let starterCard = gameData[2]
          let deck = gameData[3]

          this.setState({ sessionId: sessionId, isGameLost: false })
          this.setState({ betting: false, netProfit: 0 })

          if (response.payoutTime) { // lose
            //deck is now fully revealed
            this.setState({ betting: false, netProfit: 0, sessionId: undefined})
            // return
          } else {

            let cards = deck.split(',').map((index: string) => Number(index))

            if (this.state.isCollectingHistory && this.state.historyCards.length > 0) {
              // Defer updating the deck until collecting animation finishes
              this.setState({ pendingHistoryCards: cards });
              setTimeout(() => {
                this.setState({
                  historyCards: this.state.pendingHistoryCards || cards,
                  pendingHistoryCards: undefined,
                  isCollectingHistory: false,
                  userChoices: []
                });
              }, 800); // match collect animation duration
            } else {
              this.setState({ historyCards: cards, userChoices: [] }, () => playGameSound("/_hilo/mucked.mp3"));
            }
          }
        }
      });
    }
  }

  handleHigher = () => {
    if (!this.state.sessionId) return;
    this.action('higher');
  }

  handleLower = () => {
    if (!this.state.sessionId) return;
    this.action('lower');
  }

}

export default Hilo;
