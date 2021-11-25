import SteveModel from '@/plugins/steve/steve-class';

export const PROVIDERS = [
  {

    name:     'kafkatopic',
    labelKey: 'kafkatopics.kafka.strimzi.io.kafka',
    default:  { },
  },
];

export default class KafkaTopic extends SteveModel {
}
