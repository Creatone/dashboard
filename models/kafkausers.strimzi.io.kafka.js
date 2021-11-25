import SteveModel from '@/plugins/steve/steve-class';

export const PROVIDERS = [
  {

    name:     'kafkauser',
    labelKey: 'kafkausers.kafka.strimzi.io.kafka',
    default:  { },
  },
];

export default class KafkaUser extends SteveModel {
}
