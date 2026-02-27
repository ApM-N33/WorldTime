export type TuseKeydown = {
  on(
    e: KeyboardEvent,
    timezonesItems: NodeListOf<HTMLElement>,
    searchInput: HTMLElement
  ): void
  reset(): void
}
