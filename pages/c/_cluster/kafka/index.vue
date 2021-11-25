<script>
import isEmpty from 'lodash/isEmpty';

import InstallRedirect from '@/utils/install-redirect';
import AlertTable from '@/components/AlertTable';
import { NAME, CHART_NAME } from '@/config/product/kafka';
import { ENDPOINTS, MONITORING } from '@/config/types';
import { allHash } from '@/utils/promise';
import { findBy } from '@/utils/array';

import Banner from '@/components/Banner';
import LazyImage from '@/components/LazyImage';
import SimpleBox from '@/components/SimpleBox';
import { haveV1MonitoringWorkloads } from '@/utils/monitoring';

const CATTLE_MONITORING_NAMESPACE = 'cattle-monitoring-system';

export default {
  components: {
    Banner,
    LazyImage,
    SimpleBox,
    AlertTable
  },

  middleware: InstallRedirect(NAME, CHART_NAME),

  async fetch() {
    await this.fetchDeps();
  },

  data() {
    const kafkaSrc = require('~/assets/images/vendor/kafka_2.svg');
    const currentCluster = this.$store.getters['currentCluster'];

    return {
      availableLinks: {
        alertmanager: false,
        grafana:      false,
        prometheus:   false,
      },
      resources:     [MONITORING.ALERTMANAGER, MONITORING.PROMETHEUS],
      v1Installed:   false,
      externalLinks: [
        {
          enabled:     false,
          group:       'alertmanager',
          iconSrc:     kafkaSrc,
          label:       'monitoring.overview.linkedList.alertManager.label',
          description:
            'monitoring.overview.linkedList.alertManager.description',
          link: `/k8s/clusters/${ currentCluster.id }/api/v1/namespaces/cattle-monitoring-system/services/http:rancher-monitoring-alertmanager:9093/proxy`,
        },
      ]
    };
  },

  methods: {
    async fetchDeps() {
      const { $store, externalLinks } = this;

      this.v1Installed = await haveV1MonitoringWorkloads($store);

      const hash = await allHash({ endpoints: $store.dispatch('cluster/findAll', { type: ENDPOINTS }) });

      if (!isEmpty(hash.endpoints)) {
        const amMatch = findBy(externalLinks, 'group', 'alertmanager');
        const grafanaMatch = findBy(externalLinks, 'group', 'grafana');
        const promeMatch = externalLinks.filter(
          el => el.group === 'prometheus'
        );
        const alertmanager = findBy(
          hash.endpoints,
          'id',
          `${ CATTLE_MONITORING_NAMESPACE }/rancher-monitoring-alertmanager`
        );
        const grafana = findBy(
          hash.endpoints,
          'id',
          `${ CATTLE_MONITORING_NAMESPACE }/rancher-monitoring-grafana`
        );
        const prometheus = findBy(
          hash.endpoints,
          'id',
          `${ CATTLE_MONITORING_NAMESPACE }/rancher-monitoring-prometheus`
        );

        if (!isEmpty(alertmanager) && !isEmpty(alertmanager.subsets)) {
          amMatch.enabled = true;
        }
        if (!isEmpty(grafana) && !isEmpty(grafana.subsets)) {
          grafanaMatch.enabled = true;
        }
        if (!isEmpty(prometheus) && !isEmpty(prometheus.subsets)) {
          promeMatch.forEach((match) => {
            match.enabled = true;
          });
        }
      }
    },
  },
};
</script>

<template>
  <section>
    <header class="row">
      <div class="col span-12">
        <h1>
          Kafka dashboard
        </h1>
        <div>
          Powered by: Intel
        </div>
      </div>
    </header>
    <div>
      <Banner v-if="v1Installed" color="warning">
        <template #default>
          <t k="monitoring.v1Warning" :raw="true"/>
        </template>
      </Banner>
      <div class="create-resource-container">
        <div class="subtypes-container">
          <div class="subtype-content">
            <div class="title">
              <div class="subtype-logo round-image">
              </div>
              <h5>
                <span>Some label</span>
              </h5>
              <div class="flex-right">
                <i class="icon icon-external-link"/>
              </div>
            </div>
            <hr/>
            <div class="description">
              <span>
                Some description
              </span>
            </div>
          </div>
        </div>
      </div>

      <SimpleBox
        class="mt-30"
        title="Some usefull information"
      >
      </SimpleBox>
    </div>
  </section>
</template>
