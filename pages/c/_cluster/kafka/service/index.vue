<script>
import Loading from '@/components/Loading';
import Tabbed from '@/components/Tabbed';
import Tab from '@/components/Tabbed/Tab';
import TypeDescription from '@/components/TypeDescription';

import ResourceTable from '@/components/ResourceTable';
import { MONITORING } from '@/config/types';
import { KAFKA } from '@/config/types';
import { allHash } from '@/utils/promise';
export default {
  components: {
    Loading, Tabbed, Tab, ResourceTable, TypeDescription
  },

  async fetch() {
    this.kafkaService = this.$store.getters['cluster/schemaFor'](KAFKA.SERVICE);
    this.kafkaTopic = this.$store.getters['cluster/schemaFor'](KAFKA.TOPIC);
    this.kafkaUser = this.$store.getters['cluster/schemaFor'](KAFKA.USERS);

    const hash = await allHash( {
      kafkaServices:     this.$store.dispatch('cluster/findAll', { type: KAFKA.SERVICE } ),
      kafkaTopics:   this.$store.dispatch('cluster/findAll', { type: KAFKA.TOPIC } ),
      kafkaUsers: this.$store.dispatch('cluster/findAll', { type: KAFKA.USERS } ),
    });

    this.kafkaServices = hash.kafkaServices;
    this.kafkaTopics = hash.kafkaTopics;
    this.kafkaUsers = hash.kafkaUsers
  },

  data() {
    const initTab = this.$route.query.resource || MONITORING.SPOOFED.PODMONITOR;

    return {
      kafkaServices: [], kafkaTopics: [], kafkaUsers: [],
      kafkaService: null, kafkaTopic: null, kafkaUser: null,
      initTab
    };
  },

  computed: {
    createRoute() {
      const activeResource = this.$refs?.tabs?.activeTabName || this.routeSchema.id;

      return {
        name:   'c-cluster-kafka-service-create',
        params: { cluster: this.$route.params.cluster },
        query:  { resource: activeResource }
      };
    },
  }
};
</script>

<template>
  <Loading v-if="$fetchState.pending" />
  <div v-else>
    <div class="row header mb-40">
      <h1>Kafka managment</h1>
      <div>
        <button class="btn btn-lg role-primary float right" @click="$router.push(createRoute)">
          {{ t('resourceList.head.createFromYaml') }}
        </button>
      </div>
    </div>
    <Tabbed ref="tabs" :default-tab="initTab">
      <Tab :name="kafkaService.id" :label="$store.getters['type-map/labelFor'](kafkaService, 2)">
        <TypeDescription :resource="kafkaService.id" />
        <ResourceTable :schema="kafkaService" :rows="kafkaServices" />
      </Tab>
      <Tab :name="kafkaTopic.id" :label="$store.getters['type-map/labelFor'](kafkaTopic, 2)">
        <TypeDescription :resource="kafkaTopic.id" />
        <ResourceTable :schema="kafkaTopic" :rows="kafkaTopics" />
      </Tab>
      <Tab :name="kafkaUser.id" :label="$store.getters['type-map/labelFor'](kafkaUser, 2)">
        <TypeDescription :resource="kafkaUser.id" />
        <ResourceTable :schema="kafkaUser" :rows="kafkaUsers" />
      </Tab>
    </Tabbed>
  </div>
</template>

<style lang='scss' scoped>
.header{
  display: flex;
  H1{
    flex: 1;
  }
}
</style>
