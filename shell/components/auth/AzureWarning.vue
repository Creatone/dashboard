<script>
// This component will become redundant in 2023, see https://docs.microsoft.com/en-us/graph/migrate-azure-ad-graph-overview
import { NORMAN, MANAGEMENT } from '@shell/config/types';
import { OLD_ENDPOINTS } from '@shell/edit/auth/azuread.vue';

export default {
  async fetch() {
    // Check for access to steve authConfigs because everyone can load the norman auth config schema
    if (this.$store.getters['isRancher'] && this.$store.getters['management/schemaFor'](MANAGEMENT.AUTH_CONFIG)) {
      this.authConfig = await this.$store.dispatch('rancher/find', {
        type: NORMAN.AUTH_CONFIG,
        id:   'azuread',
        opt:  { url: `/v3/${ NORMAN.AUTH_CONFIG }/azuread` }
      });
    }
  },

  data() {
    return {
      authConfig:      null,
      authConfigRoute: {
        name:   'c-cluster-auth-config-id',
        params: { id: 'azuread', cluster: '_' }
      }
    };
  },

  computed: {
    showWarning() {
      return this.authConfig?.graphEndpoint === OLD_ENDPOINTS.standard.graphEndpoint || this.authConfig?.graphEndpoint === OLD_ENDPOINTS.china.graphEndpoint;
    },

  }
};
</script>

<template>
  <div v-if="showWarning" id="azure-warn" class="banner">
    <p>
      {{ t("authConfig.azuread.updateEndpoint.banner.message") }} <n-link :to="authConfigRoute">
        {{ t('authConfig.azuread.updateEndpoint.banner.linkText') }}
      </n-link>
    </p>
  </div>
</template>

<style lang="scss" scoped>
#azure-warn {
    background-color: var(--warning);
    color: var(--warning-text);
    line-height: 2em;
    width: 100%;

    >p{
        text-align: center;
    }
}
</style>
