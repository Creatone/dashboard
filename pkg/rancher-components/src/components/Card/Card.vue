<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name:  'Card',
  props: {
    /**
     * The card's title.
     */
    title: {
      type:    String,
      default: ''
    },
    /**
     * The text content for the card's body.
     */
    content: {
      type:    String,
      default: ''
    },
    /**
     * The function to invoke when the default action button is clicked.
     */
    buttonAction: {
      type:    Function,
      default: (): void => { }
    },
    /**
     * The text for the default action button.
     */
    buttonText: {
      type:    String,
      default: 'go'
    },
    /**
     * Toggles the card's highlight-border class.
     */
    showHighlightBorder: {
      type:    Boolean,
      default: true
    },
    /**
     * Toggles the card's Actions section.
     */
    showActions: {
      type:    Boolean,
      default: true
    }
  }
});
</script>

<template>
  <div class="card-container" :class="{'highlight-border': showHighlightBorder}">
    <div class="card-wrap">
      <div class="card-title">
        <slot name="title">
          {{ title }}
        </slot>
      </div>
      <hr />
      <div class="card-body">
        <slot name="body">
          {{ content }}
        </slot>
      </div>
      <div v-if="showActions" class="card-actions">
        <slot name="actions">
          <button class="btn role-primary" @click="buttonAction">
            {{ buttonText }}
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>

<style lang='scss'>
 .card-container {
  &.highlight-border {
    border-left: 5px solid var(--primary);
  }
  border-radius: var(--border-radius);
  display: flex;
  flex-basis: 40%;
  margin: 10px;
  min-height: 100px;
  padding: 10px;
  box-shadow: 0 0 20px var(--shadow);
  &:not(.top) {
    align-items: top;
    flex-direction: row;
    justify-content: start;
  }
  .card-wrap {
    width: 100%;
  }
   & .card-body {
    color: var(--input-label);
    display: flex;
    flex-direction: column;
    justify-content: center;
   }
   & .card-actions {
     align-self: end;
     display: flex;
     padding-top: 20px;
   }
   & .card-title {
    align-items: center;
    display: flex;
    width: 100%;
     h5 {
       margin: 0;
     }
    .flex-right {
      margin-left: auto;
    }
   }
 }
</style>
