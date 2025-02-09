import ComponentPo from '@/cypress/integration/po/components/component.po';

export default class PasswordPo extends ComponentPo {
  /**
   * Type value in the input
   * @param value Value to be typed
   * @returns
   */
  set(value: string): Cypress.Chainable {
    return this.input()
      .focus()
      .type(value);
  }

  /**
   * Return the input HTML element from given container
   * @returns HTML Element
   */
  private input(): Cypress.Chainable {
    return this.self()
      .find('input');
  }
}
