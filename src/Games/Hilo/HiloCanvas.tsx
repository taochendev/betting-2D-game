import React, { Component, createRef } from "react";
import { HiloState } from "./hiloConfig";
import "./HiloCanvas.scss";
import cardData from './mockdata/data.json';
import {probHigherOrSame, probLowerOrSame} from './util';


interface HiloCanvasProps {
  gameState: HiloState;
  onSkip: () => void;
  currency: string;
  balance: number;
  historyCards: any;
  // Add these props for animation
  animatingCard?: any;
  newCard?: any;
  animationDirection: 'top-right' | 'top-left';
  isAnimating: boolean;
  showNewCard: boolean;
  isFlipping: boolean;
  showCardBack: boolean;
  // Add mobile action handlers
  onHigher?: () => void;
  onLower?: () => void;
  userChoices: any; // Add this
  isGameLost: boolean; // Add this
  // New: collecting existing history into first position on Start
  isCollectingHistory?: boolean;
}

// Remove the HiloCanvasState interface since we're using props now
class HiloCanvas extends Component<HiloCanvasProps, {}> {
  private scrollContainerRef = createRef<HTMLDivElement>();

  // Add this method to scroll to the end
  scrollToEnd = () => {
    if (this.scrollContainerRef.current) {
      this.scrollContainerRef.current.scrollLeft = this.scrollContainerRef.current.scrollWidth;
    }
  };

  // Add this lifecycle method to scroll when cards change
  componentDidUpdate(prevProps: HiloCanvasProps) {
    // Scroll to end when new cards are added and we're showing the card back
    if (this.props.historyCards.length + 1 > prevProps.historyCards.length) {
      setTimeout(() => {
        this.scrollToEnd();
      }, 100); // Small delay to ensure DOM is updated
    }
  }

  getCardDisplay = (cardIndex: number) => {
    const card = cardData[cardIndex];
    return card;
  };

  // Update the handleSkip method to just call the parent's skip function
  handleSkip = () => {
    this.props.onSkip();
  };

  handleHigher = () => {
    // This will be passed as a prop from parent
    if (this.props.onHigher) {
      this.props.onHigher();
    }
  };

  handleLower = () => {
    // This will be passed as a prop from parent
    if (this.props.onLower) {
      this.props.onLower();
    }
  };

  render() {
    const { gameState, currency, historyCards, animatingCard, newCard, animationDirection, isAnimating, showNewCard, isFlipping, showCardBack, userChoices, isGameLost, isCollectingHistory } = this.props;
    // console.log(historyCards, userChoices)
    const currentCard = this.getCardDisplay(historyCards.length > 1 ? historyCards[historyCards.length - 1] : gameState.startingCard);

    // Mock data - replace with actual game data
    const higherMultiplier = 1.43;
    const lowerMultiplier = 2.57;
    const totalMultiplier = 1.00;

    // Calculate the exact position based on card width, gaps, and choice indicators
    const cardWidth = 120; // width of each card
    const cardGap = 10; // gap between cards
    // const choiceIndicatorWidth = 50; // 40px width + 5px margin on each side
    const endCardPosition = historyCards ?
      (historyCards.length - 1) * (cardWidth + cardGap) : 0;

    const getChoiceIndicator = (choice: any) => {
      switch (choice) {
        case 'higher':
          return '/_hilo/high.svg';
        case 'lower':
          return '/_hilo/low.svg';
        case 'skip':
          return '/_hilo/arrow-double.svg';
        case 'higher-same':
          return '/_hilo/higher-same.svg';
        case 'lower-same':
          return '/_hilo/lower-same.svg';
        default:
          return '';
      }
    };

    return (
      <div className="hilo-game-container">
        {/* Top Section - Card Legends and Current Card */}
        <div className="card-legend-section">
          <div className="legend-card">
            <img src="/_hilo/bg-hi.svg" className="bg-hi-desktop" style={{ fill: "white", width: "120px", height: "170px" }} />
            <img src="/_hilo/bg-hi-stacked.svg" className="bg-hi-mobile" style={{ fill: "white", width: "30px", height: "170px" }} />
          </div>

          <div className="current-card-container">
            {/* New card (appears first) */}
            <div className="current-card" style={{ position: "absolute", marginTop: "0px", marginLeft: "0px" }}>
              <img src={`/_hilo/${'back-none'}.png`} className="current-card-back-img" />
              <div className="card-overlap1"></div>
              <div className="card-overlap2"></div>
              <div className="card-overlap3"></div>
              <div className="card-overlap4"></div>

              {/* Skip button - mobile version (top-left) */}
              <div className="next-card-btn">
                <button onClick={this.handleSkip} disabled={isAnimating}>
                  <img src="/_hilo/arrow-double.svg" style={{ fill: "white", width: "30px", height: "20px" }} />
                </button>
              </div>
            </div>

            {/* Animating card (previous card disappearing) */}
            {animatingCard && isAnimating && (
              <div className={`current-card animating-card ${animationDirection}`} style={{ position: "relative" }}>
                <div className="card-value" style={{ color: animatingCard.type !== "club" && animatingCard.type !== "spade" ? "#e9113c" : "#131526" }}>
                  {animatingCard.number}
                </div>
                <div className="card-suit">
                  <img src={`/_hilo/${animatingCard.type}.svg`} style={{ fill: "#e9113c", width: "50px", height: "50px" }} />
                </div>
              </div>
            )}

            {/* Current card (only show if not animating and no new card) */}
            {isFlipping && newCard && (
              <div className={`current-card ${isFlipping ? 'flipping' : ''}`} style={{ position: "relative", marginTop: "0px", marginLeft: "0px" }}>
                <div className="card-value" style={{ color: currentCard.type !== "club" && currentCard.type !== "spade" ? "#e9113c" : "#131526" }}>
                  {currentCard.number}
                </div>
                <div className="card-suit">
                  <img src={`/_hilo/${currentCard.type}.svg`} style={{ fill: "#e9113c", width: "50px", height: "50px" }} />
                </div>
                <div className="card-overlap1"></div>
                <div className="card-overlap2"></div>
                <div className="card-overlap3"></div>
                <div className="card-overlap4"></div>
              </div>
            )}

            {!isFlipping && showNewCard && (
              <div className="current-card" style={{ position: "absolute", marginTop: "0px", marginLeft: "0px" }}>
                <div>
                  <div className="card-value" style={{ color: currentCard.type !== "club" && currentCard.type !== "spade" ? "#e9113c" : "#131526" }}>
                    {currentCard.number}
                  </div>
                  <div className="card-suit">
                    <img src={`/_hilo/${currentCard.type}.svg`} style={{ fill: "#e9113c", width: "50px", height: "50px" }} />
                  </div>
                </div>
                {isGameLost && !gameState.betting && (<div className="game-lost"></div>)}
                <div className="card-overlap1"></div>
                <div className="card-overlap2"></div>
                <div className="card-overlap3"></div>
                <div className="card-overlap4"></div>
              </div>
            )}
          </div>

          <div className="guess-btn-container bg-hi-mobile">
            <div onClick={this.handleHigher} >
              <img src="/_hilo/button-hi.svg" className="bg-hi-mobile" style={{ fill: "white", width: "120px", height: "170px" }} />
              <div className="centered">Higher or Same {historyCards.length > 0 ? probHigherOrSame(historyCards[historyCards.length - 1]) : '0.00'}%</div>
            </div>
            <div onClick={this.handleLower}>
              <img src="/_hilo/button-lo.svg" className="bg-lo-mobile" style={{ fill: "white", width: "120px", height: "170px" }} />
              <div className="centered" style={{color: "white", top: "70%"}}>Lower or Same {historyCards.length > 0 ? probLowerOrSame(historyCards[historyCards.length - 1]) : '0.00'}%</div>
            </div>
          </div>

          <div className="legend-card">
            <img src="/_hilo/bg-lo.svg" className="bg-lo-desktop" style={{ fill: "white", width: "120px", height: "170px" }} />
            <img src="/_hilo/bg-lo-stacked.svg" className="bg-lo-mobile" style={{ fill: "white", width: "30px", height: "170px" }} />
          </div>
        </div>

        {/* Middle Section - Betting Options */}
        <div className="betting-section">
          <div className="bet-option higher-option">
            <div className="bet-header">
              <span className="bet-title">Net Gain Higher ({higherMultiplier}x)</span>
            </div>
            <div className="bet-content">
              <div className="bet-input">
                <img src="/_hilo/arrow-up.svg" className="arrow-img" />
                <div className="bet-amount">0.00</div>
              </div>
              <div className="bet-currency">G</div>
            </div>
          </div>

          <div className="bet-option lower-option">
            <div className="bet-header">
              <span className="bet-title">Net Gain Lower ({lowerMultiplier}x)</span>
            </div>
            <div className="bet-content">
              <div className="bet-input">
                <img src="/_hilo/arrow-down.svg" className="arrow-img" />
                <div className="bet-amount">0.00</div>
              </div>
              <div className="bet-currency">G</div>
            </div>
          </div>

          <div className="bet-option total-option">
            <div className="bet-header">
              <span className="bet-title">Total Net Gain ({totalMultiplier}x)</span>
            </div>
            <div className="bet-content">
              <div className="bet-input">
                <div className="bet-amount">0.00</div>
              </div>
              <div className="bet-currency">G</div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Card History */}
        <div className="game-history-section">
          <div className="current-card-container">
            {/* Show multiple cards when historyCards.length > 1 */}
            {historyCards && historyCards.length > 1 ? (
              <div
                className={`card-history-row ${isCollectingHistory ? 'collecting' : ''}`}
                ref={this.scrollContainerRef}  // Add this ref
              >
                {historyCards.map((cardIndex: number, index: number) => {
                  const card = this.getCardDisplay(cardIndex);
                  // console.log(historyCards)
                  // console.log(userChoices)
                  const userChoice = userChoices[index];
                  const skipEffect = index > 0 ? userChoices[index - 1] : '';

                  // Calculate position for the indicator
                  const cardWidth = 120;
                  const cardGap = 10;
                  const indicatorPosition = (index * (cardWidth + cardGap)) + cardWidth - 25; // Position to overlap next card

                  const collectOffset = index * (cardWidth + cardGap);

                  return (
                    <React.Fragment key={index}>
                      {/* Card */}
                      {index < historyCards.length - 1 && (
                        <div className={`current-card current-card-small history-card ${skipEffect === "skip" ? 'card-skip' : ''}`} style={{ position: 'relative', ['--collect-offset' as any]: `${collectOffset}px` }}>
                          <div className="card-value" style={{ color: card.type !== "club" && card.type !== "spade" ? "#e9113c" : "#131526" }}>
                            {card.number}
                          </div>
                          <div className="card-suit">
                            <img src={`/_hilo/${card.type}.svg`} style={{ fill: "#e9113c", width: "50px", height: "50px" }} />
                          </div>
                          <div className="card-multiplier">start card</div>
                        </div>
                      )}

                      {/* Choice indicator - positioned absolutely within the container */}
                      {userChoice && index < historyCards.length - 1 && (
                        <div
                          className="choice-indicator"
                          data-choice={userChoice}
                          style={{ left: `${indicatorPosition}px`, ['--collect-offset' as any]: `${collectOffset + 60}px` }}
                        >
                          <img
                            src={getChoiceIndicator(userChoice)}
                            alt={userChoice}
                            className="choice-icon"
                            style={{ fill: isGameLost ? "#e81344" : "green" }}
                          />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}

                {showCardBack && (
                  <div
                    className={`current-card new-card-bottom ${userChoices[userChoices.length - 1] === 'skip' ? 'card-skip' : ''}`}
                    style={{
                      '--card-position': `${endCardPosition}px`,
                      '--slide-distance': '800px',
                      position: 'relative' // Add this for proper indicator positioning
                    } as React.CSSProperties}
                  >
                    <img src={`/_hilo/${'back-none'}.png`} className="current-card-back-img" />
                    {/* <div className="card-multiplier" style={{ width: '100%', marginLeft: "0px", marginTop: "-8px" }}>start card</div> */}
                  </div>
                )}

                {/* Animating card (previous card disappearing) - Bottom section */}
                {isFlipping && newCard && (
                  <div className={`current-card ${isFlipping ? 'flipping' : ''} ${userChoices[userChoices.length - 1] === 'skip' ? 'card-skip' : ''}`}>
                    <div className="card-value" style={{ color: currentCard.type !== "club" && currentCard.type !== "spade" ? "#e9113c" : "#131526" }}>
                      {currentCard.number}
                    </div>
                    <div className="card-suit">
                      <img src={`/_hilo/${currentCard.type}.svg`} style={{ fill: "#e9113c", width: "50px", height: "50px" }} />
                    </div>
                    <div className="card-multiplier">start card</div>
                  </div>
                )}

                {/* Current card (only show if not animating and no new card) - Bottom section */}
                {!isFlipping && showNewCard && !showCardBack && (
                  <div className={`current-card current-card-small history-card ${userChoices[userChoices.length - 1] === 'skip' ? 'card-skip' : ''}`} style={{ ['--collect-offset' as any]: `${endCardPosition}px` }}>
                    <div className="card-value" style={{ color: currentCard.type !== "club" && currentCard.type !== "spade" ? "#e9113c" : "#131526" }}>
                      {currentCard.number}
                    </div>
                    <div className="card-suit">
                      <img src={`/_hilo/${currentCard.type}.svg`} style={{ fill: "#e9113c", width: "50px", height: "50px" }} />
                    </div>
                    <div className={`card-multiplier ${isGameLost ? 'game-lost-multiplier' : ''}`}>start card</div>
                  </div>
                )}
              </div>
            ) : (
              /* Show single card when historyCards.length <= 1 (current behavior) */
              <>
                {/* New card (appears first) - Bottom section */}
                <div className="current-card new-card-bottom">
                  <img src={`/_hilo/${'back-none'}.png`} className="current-card-back-img" />
                </div>

                {/* Animating card (previous card disappearing) - Bottom section */}
                {isFlipping && newCard && (
                  <div className={`current-card ${isFlipping ? 'flipping' : ''}`}>
                    <div className="card-value" style={{ color: currentCard.type !== "club" && currentCard.type !== "spade" ? "#e9113c" : "#131526" }}>
                      {currentCard.number}
                    </div>
                    <div className="card-suit">
                      <img src={`/_hilo/${currentCard.type}.svg`} style={{ fill: "#e9113c", width: "50px", height: "50px" }} />
                    </div>
                    <div className="card-multiplier">start card</div>
                  </div>
                )}

                {/* Current card (only show if not animating and no new card) - Bottom section */}
                {!isFlipping && showNewCard && (
                  <div className="current-card current-card-small">
                    <div className="card-value" style={{ color: currentCard.type !== "club" && currentCard.type !== "spade" ? "#e9113c" : "#131526" }}>
                      {currentCard.number}
                    </div>
                    <div className="card-suit">
                      <img src={`/_hilo/${currentCard.type}.svg`} style={{ fill: "#e9113c", width: "50px", height: "50px" }} />
                    </div>
                    <div className="card-multiplier">start card</div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default HiloCanvas;