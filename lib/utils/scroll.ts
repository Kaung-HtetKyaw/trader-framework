export function isAtBottom(el: HTMLElement, pad = 16): boolean {
  return el.scrollHeight - el.scrollTop - el.clientHeight <= pad;
}

export function isElementInView(container: HTMLElement, el: HTMLElement, pad = 16): boolean {
  const c = container.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  return r.bottom <= c.bottom - pad && r.top >= c.top + pad;
}

export function scrollToBottom(el: HTMLElement, behavior: ScrollBehavior = 'smooth'): void {
  el.scrollTo({ top: el.scrollHeight, behavior });
}