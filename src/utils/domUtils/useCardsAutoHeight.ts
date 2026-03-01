export function useCardsAutoHeight() {
  let slicedCards: HTMLElement[] = []
  let cardsContainer: HTMLElement | null = null

  const observe = new ResizeObserver(calculateCardsContainerHeight)

  function setCardsContainerHeight(
    cards: HTMLElement[],
    container: HTMLElement,
  ) {
    disconnectObserver()
    slicedCards = cards
    cardsContainer = container
    connectObserver()
    calculateCardsContainerHeight()
  }

  function calculateCardsContainerHeight() {
    if (!cardsContainer) return
    const sumTwoCardsHeight = slicedCards.reduce(
      (acc, card) => acc + card.offsetHeight,
      0,
    )
    cardsContainer.style.maxHeight = `${sumTwoCardsHeight}px`
    if (slicedCards.length === 0) return
  }

  function connectObserver() {
    if (slicedCards.length === 0) return
    for (const card of slicedCards) observe.observe(card)
  }

  function disconnectObserver() {
    observe.disconnect()
  }

  return { setCardsContainerHeight }
}
